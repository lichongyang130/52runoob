from email import policy
from email.parser import BytesParser
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/Keep-Running-Through-Winter"
sys.path.insert(0, str(ROOT / "tools" / "api"))
import client  # noqa: E402
import inspect_site  # noqa: E402
import upload_hero as shared  # noqa: E402
import upload_steps  # noqa: E402


def riff(chunk_name, payload):
    chunk = chunk_name + len(payload).to_bytes(4, "little") + payload + (b"\0" if len(payload) % 2 else b"")
    content = b"WEBP" + chunk
    return b"RIFF" + len(content).to_bytes(4, "little") + content


class WebpDimensionsTests(unittest.TestCase):
    def test_real_winter_images_are_1600_by_900(self):
        for path in (SOURCE / "images").glob("*-1600.webp"):
            with self.subTest(image=path.name):
                self.assertEqual(upload_steps.webp_dimensions(path.read_bytes()), (1600, 900))

    def test_vp8_vp8l_vp8x_and_corruption(self):
        width, height = 1600, 900
        vp8 = riff(b"VP8 ", b"\0\0\0\x9d\x01\x2a" + width.to_bytes(2, "little") + height.to_bytes(2, "little"))
        vp8l = riff(b"VP8L", b"\x2f" + ((width - 1) | ((height - 1) << 14)).to_bytes(4, "little"))
        vp8x_data = b"\0\0\0\0" + (width - 1).to_bytes(3, "little") + (height - 1).to_bytes(3, "little")
        vp8x = riff(b"VP8X", vp8x_data)
        for blob in (vp8, vp8l, vp8x):
            self.assertEqual(upload_steps.webp_dimensions(blob), (width, height))
        self.assertIsNone(upload_steps.webp_dimensions(vp8[:-1]))
        self.assertIsNone(upload_steps.webp_dimensions(riff(b"VP8X", b"\x02" + vp8x_data[1:])))
        self.assertIsNone(upload_steps.webp_dimensions(b"not an image"))


class BatchApi:
    def __init__(self, doc):
        self.doc = doc
        self.calls = []
        self.posts = 0
        self.fail_post = None
        self.fail_after_commit = False
        self.hide_latest = False
        self.bad_alt_at = None
        self.duplicate_id_at = None
        self.add_external_after_first = False
        self.duplicate_target = False
        self.drafts = []
        self.categories = [{"id": "category-id", "name": doc["category"]}]
        self.records = [self.record("hero-id", "00-hero-1600.webp", doc["media"]["hero"]["alt"])]

    @staticmethod
    def record(media_id, filename, alt):
        return {"id": media_id, "originalName": filename, "alt": alt,
                "width": 1600, "height": 900, "variants": {"480": "v480", "960": "v960", "1600": "v1600"}}

    def __call__(self, method, path, **kwargs):
        self.calls.append((method, path, kwargs))
        if method == "OPTIONS" and path == "/media":
            return 204, {"Allow": "GET, HEAD, OPTIONS, POST"}, ""
        if method == "GET" and path == "/articles/" + inspect_site.REFERENCE_SLUG:
            return 200, {}, json.dumps({"article": {"slug": inspect_site.REFERENCE_SLUG,
                                                     "tips": [{"kind": "TIP"}, {"kind": "WARNING"}]}})
        if method == "GET" and path == "/articles/Keep-Running-Through-Winter":
            return (200, {}, '{"article": {}}') if self.duplicate_target else (404, {}, "")
        if method == "GET" and path == "/articles":
            return 200, {}, '{"articles": []}'
        if method == "GET" and path == "/articles?status=DRAFT":
            return 200, {}, json.dumps({"articles": self.drafts})
        if method == "GET" and path == "/categories":
            return 200, {}, json.dumps({"categories": self.categories})
        if method == "GET" and path == "/media":
            records = self.records[:-1] if self.hide_latest and self.posts else self.records
            return 200, {}, json.dumps({"media": records})
        if method == "POST" and path == "/media":
            self.posts += 1
            body = kwargs["raw_body"]
            header = ("Content-Type: " + kwargs["content_type"] + "\r\nMIME-Version: 1.0\r\n\r\n").encode()
            parsed = BytesParser(policy=policy.default).parsebytes(header + body)
            parts = {part.get_param("name", header="content-disposition"): part for part in parsed.iter_parts()}
            filename = parts["file"].get_filename()
            alt = parts["alt"].get_payload(decode=True).decode()
            record = self.record(f"media-{self.posts}", filename, alt)
            if self.bad_alt_at == self.posts:
                record["alt"] = "incorrect alt"
            if self.duplicate_id_at == self.posts:
                record["id"] = "hero-id"
            if self.fail_post == self.posts:
                if self.fail_after_commit:
                    self.records.append(record)
                    raise TimeoutError("response lost")
                raise client.ApiError("POST", "https://example.invalid/media", 400,
                                      '{"error":"bad file; example-secret"}')
            self.records.append(record)
            if self.posts == 1 and self.add_external_after_first:
                other = self.doc["parts"][0]["steps"][1]["image"]
                self.records.append(self.record("external-id", other["base"] + "-1600.webp", other["alt"]))
            return 201, {}, json.dumps({"media": record})
        raise AssertionError(f"unexpected {method} {path}")


class BatchUploadTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.directory = Path(self.tmp.name)
        (self.directory / "images").mkdir()
        self.doc = json.loads((SOURCE / "article.json").read_text())
        (self.directory / "article.json").write_text(json.dumps(self.doc), encoding="utf-8")
        for path in (SOURCE / "images").glob("*-1600.webp"):
            shutil.copyfile(path, self.directory / "images" / path.name)
        hero = (self.directory / "images/00-hero-1600.webp").read_bytes()
        state = {"schema": shared.STATE_SCHEMA, "articleSlug": self.doc["slug"], "images": {
            "00-hero": {"status": "uploaded", "filename": "00-hero-1600.webp",
                        "sha256": hashlib.sha256(hero).hexdigest(), "mediaId": "hero-id"}}}
        (self.directory / shared.STATE_NAME).write_text(json.dumps(state), encoding="utf-8")
        self.env = mock.patch.dict(os.environ, {"SITE_API_TOKEN": "example-secret", "SITE_API_BASE": client.DEFAULT_BASE})
        self.env.start()
        self.api = BatchApi(self.doc)

    def tearDown(self):
        self.env.stop()
        self.tmp.cleanup()

    def run_batch(self):
        lines = []
        with mock.patch.object(client, "request", side_effect=self.api):
            code = upload_steps.run_batch(self.directory, out=lines.append)
        return code, "\n".join(lines)

    def get_state(self):
        return json.loads((self.directory / shared.STATE_NAME).read_text())

    def test_uploads_12_once_in_article_order_and_reuses_hero(self):
        code, output = self.run_batch()
        self.assertEqual(code, 0, output)
        self.assertEqual(self.api.posts, 12)
        self.assertEqual({path for method, path, _ in self.api.calls if method == "POST"}, {"/media"})
        filenames = [record["originalName"] for record in self.api.records[1:]]
        expected = [f'{step["image"]["base"]}-1600.webp'
                    for part in self.doc["parts"] for step in part["steps"]]
        self.assertEqual(filenames, expected)
        expected_alts = [step["image"]["alt"] for part in self.doc["parts"] for step in part["steps"]]
        self.assertEqual([record["alt"] for record in self.api.records[1:]], expected_alts)
        self.assertEqual(len(self.get_state()["images"]), 13)
        self.assertIn("13 张图片均已记录", output)
        self.assertIn("没有创建或发布文章", output)
        self.assertNotIn("example-secret", output)
        self.assertNotIn("example-secret", json.dumps(self.get_state()))
        self.assertNotIn("hero-id", output)
        self.assertNotIn("media-1", output)
        self.api.calls.clear()
        code, output = self.run_batch()
        self.assertEqual(code, 0, output)
        self.assertEqual(self.api.posts, 12)
        self.assertFalse(any(method == "POST" for method, _, _ in self.api.calls))

    def test_ambiguous_fifth_post_leaves_pending_and_never_retries(self):
        self.api.fail_post = 5
        self.api.fail_after_commit = True
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertEqual(self.api.posts, 5)
        self.assertIn("禁止自动重试", output)
        images = self.get_state()["images"]
        self.assertEqual(sum(entry["status"] == "uploaded" for entry in images.values()), 5)  # hero + 4
        self.assertEqual(sum(entry["status"] == "pending" for entry in images.values()), 1)
        self.api.calls.clear()
        self.api.fail_post = None
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("禁止自动重试", output)
        self.assertEqual(self.api.calls, [])
        self.assertEqual(self.api.posts, 5)

    def test_readback_failure_after_success_never_reposts_that_image(self):
        self.api.hide_latest = True
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertEqual(self.api.posts, 1)
        self.assertEqual(self.get_state()["images"]["01-footing"]["status"], "uploaded")
        self.api.hide_latest = False
        code, output = self.run_batch()
        self.assertEqual(code, 0, output)
        self.assertEqual(self.api.posts, 12)
        self.assertEqual(sum(record["originalName"] == "01-footing-1600.webp" for record in self.api.records), 1)

    def test_bad_alt_after_post_is_saved_and_never_reuploaded(self):
        self.api.bad_alt_at = 3
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("03-warmup 的 alt 不匹配", output)
        self.assertEqual(self.api.posts, 3)
        self.assertEqual(self.get_state()["images"]["03-warmup"]["status"], "uploaded")
        expected = self.doc["parts"][0]["steps"][2]["image"]["alt"]
        self.api.records[-1]["alt"] = expected
        self.api.bad_alt_at = None
        code, output = self.run_batch()
        self.assertEqual(code, 0, output)
        self.assertEqual(self.api.posts, 12)
        self.assertEqual(sum(record["originalName"] == "03-warmup-1600.webp" for record in self.api.records), 1)

    def test_duplicate_media_id_is_left_pending_and_not_retried(self):
        self.api.duplicate_id_at = 2
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("缺少新的有效媒体 ID", output)
        self.assertEqual(self.get_state()["images"]["02-layers"]["status"], "pending")
        self.api.calls.clear()
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertEqual(self.api.calls, [])
        self.assertEqual(self.api.posts, 2)

    def test_missing_hero_pending_state_and_changed_local_file_stop_before_network(self):
        state = self.get_state()
        del state["images"]["00-hero"]
        (self.directory / shared.STATE_NAME).write_text(json.dumps(state))
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("没有找到已上传的封面", output)
        self.assertEqual(self.api.calls, [])

        state["images"]["00-hero"] = {"status": "pending"}
        (self.directory / shared.STATE_NAME).write_text(json.dumps(state))
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("禁止自动重试", output)
        self.assertEqual(self.api.calls, [])

    def test_missing_image_or_bad_dimensions_stop_before_network(self):
        path = self.directory / "images/01-footing-1600.webp"
        path.write_bytes(b"RIFF\x04\x00\x00\x00WEBP")
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("不是合规", output)
        self.assertEqual(self.api.calls, [])

    def test_alt_or_variant_mismatch_stops_before_post(self):
        self.api.records[0]["alt"] = "wrong"
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("alt 不匹配", output)
        self.assertEqual(self.api.posts, 0)
        self.api.records[0]["alt"] = self.doc["media"]["hero"]["alt"]
        del self.api.records[0]["variants"]["960"]
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("未回读到 960 和 1600", output)
        self.assertEqual(self.api.posts, 0)

    def test_existing_same_name_and_alt_stops_entire_batch(self):
        step = self.doc["parts"][1]["steps"][1]  # Not the first pending image.
        self.api.records.append(self.api.record("existing-id", step["image"]["base"] + "-1600.webp", step["image"]["alt"]))
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("同名同 alt", output)
        self.assertEqual(self.api.posts, 0)

    def test_new_concurrent_matching_image_stops_before_its_post(self):
        self.api.add_external_after_first = True
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("媒体列表新增", output)
        self.assertEqual(self.api.posts, 1)
        self.assertEqual(self.get_state()["images"]["01-footing"]["status"], "uploaded")
        self.assertNotIn("02-layers", self.get_state()["images"])

    def test_duplicate_article_or_category_problem_stops_before_post(self):
        self.api.duplicate_target = True
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("目标 slug 已存在", output)
        self.assertEqual(self.api.posts, 0)
        self.api.duplicate_target = False
        self.api.categories = []
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("未能唯一匹配目标分类", output)
        self.assertEqual(self.api.posts, 0)

    def test_draft_filter_finding_target_prevents_upload(self):
        self.api.drafts = [{"slug": self.doc["slug"], "status": "DRAFT"}]
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("草稿筛选结果中已有目标 slug", output)
        self.assertEqual(self.api.posts, 0)

    def test_http_error_output_redacts_token_and_stops(self):
        self.api.fail_post = 1
        code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("400", output)
        self.assertIn("bad file", output)
        self.assertNotIn("example-secret", output)
        self.assertEqual(self.api.posts, 1)
        self.assertEqual(self.get_state()["images"]["01-footing"]["status"], "pending")

    def test_custom_site_base_is_rejected(self):
        with mock.patch.dict(os.environ, {"SITE_API_BASE": "https://other.example/api/v1"}):
            code, output = self.run_batch()
        self.assertNotEqual(code, 0)
        self.assertIn("默认站点", output)
        self.assertEqual(self.api.calls, [])


class BatchShellTests(unittest.TestCase):
    def test_confirmation_required_before_token_prompt(self):
        env = dict(os.environ)
        env.pop("SITE_API_TOKEN", None)
        result = subprocess.run(["bash", "tools/upload_steps.sh"], cwd=ROOT, stdin=subprocess.DEVNULL,
                                text=True, capture_output=True, env=env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("真实上传", result.stderr)
        self.assertNotIn("请输入网站 API 密钥", result.stderr)

    def test_key_is_passed_to_confirmed_helper_without_output(self):
        with tempfile.TemporaryDirectory() as temp:
            stub = Path(temp) / "python3"
            stub.write_text('#!/bin/sh\n[ "$1" = tools/api/upload_steps.py ] && [ "$2" = --confirm ] && [ -n "$SITE_API_TOKEN" ]\n')
            stub.chmod(0o755)
            env = dict(os.environ, SITE_API_TOKEN="example-secret", PATH=temp + os.pathsep + os.environ["PATH"])
            result = subprocess.run(["bash", "tools/upload_steps.sh", "--confirm"], cwd=ROOT,
                                    stdin=subprocess.DEVNULL, text=True, capture_output=True, env=env)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("真实上传", result.stdout)
            self.assertNotIn("example-secret", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
