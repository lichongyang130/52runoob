import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "api"))
import client  # noqa: E402
import inspect_site  # noqa: E402
import upload_hero  # noqa: E402


class ControlledHeroUploadTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.directory = Path(self.tmp.name)
        (self.directory / "images").mkdir()
        doc = json.loads((ROOT / "content/Keep-Running-Through-Winter/article.json").read_text())
        self.alt = doc["media"]["hero"]["alt"]
        (self.directory / "article.json").write_text(json.dumps(doc), encoding="utf-8")
        self.image = self.directory / "images/00-hero-1600.webp"
        self.image.write_bytes(b"RIFF\x14\x00\x00\x00WEBPfake image bytes")
        self.env = mock.patch.dict(os.environ, {"SITE_API_TOKEN": "example-secret",
                                               "SITE_API_BASE": client.DEFAULT_BASE})
        self.env.start()
        self.calls = []
        self.responses = {"mode": "success", "alt": self.alt}

    def tearDown(self):
        self.env.stop()
        self.tmp.cleanup()

    def fake_api(self, method, path, **kwargs):
        self.calls.append((method, path, kwargs))
        if method == "OPTIONS" and path == "/media":
            return 204, {"Allow": "GET, HEAD, OPTIONS, POST"}, ""
        if method == "GET" and path == "/articles/" + inspect_site.REFERENCE_SLUG:
            return 200, {}, json.dumps({"article": {"slug": inspect_site.REFERENCE_SLUG,
                                                     "tips": [{"kind": "TIP"}, {"kind": "WARNING"}]}})
        if method == "GET" and path == "/articles/Keep-Running-Through-Winter":
            return (200, {}, '{"article": {}}') if self.responses["mode"] == "duplicate" else (404, {}, "")
        if method == "GET" and path == "/articles":
            return 200, {}, '{"articles": [{"slug": "Other-Article"}]}'
        if method == "POST" and path == "/media":
            state = json.loads((self.directory / upload_hero.STATE_NAME).read_text())
            self.assertEqual(state["images"]["00-hero"]["status"], "pending")
            self.assertNotIn("example-secret", json.dumps(state))
            if self.responses["mode"] == "error":
                raise client.ApiError("POST", "https://example.invalid/media", 400,
                                      '{"error":"Missing file for example-secret"}')
            if self.responses["mode"] == "timeout":
                raise TimeoutError("private error text")
            if self.responses["mode"] == "unknown":
                return 201, {}, '{"success": true}'
            if self.responses["mode"] == "secret-id":
                return 201, {}, '{"media": {"id":"example-secret"}}'
            return 201, {}, json.dumps({"media": {"id": "media-id", "alt": self.alt,
                                                  "path": "private-path.webp"}})
        if method == "GET" and path == "/media":
            record = {"id": "media-id", "alt": self.responses["alt"],
                      "width": 1600, "height": 900, "variants": {"480": "private", "960": "private"}}
            if self.responses["mode"] == "existing-media":
                record["originalName"] = "00-hero-1600.webp"
            return 200, {}, json.dumps({"media": [record]})
        self.fail(f"unexpected request: {method} {path}")

    def run_helper(self):
        lines = []
        with mock.patch.object(client, "request", side_effect=self.fake_api):
            code = upload_hero.run_upload(self.directory, out=lines.append)
        return code, "\n".join(lines)

    def test_uploads_actual_hero_once_and_verifies_alt(self):
        code, output = self.run_helper()
        self.assertEqual(code, 0, output)
        posts = [(method, path, kwargs) for method, path, kwargs in self.calls if method == "POST"]
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0][1], "/media")
        body = posts[0][2]["raw_body"]
        self.assertIn(b'name="file"; filename="00-hero-1600.webp"', body)
        self.assertIn(b"Content-Type: image/webp", body)
        self.assertIn(b'name="alt"', body)
        self.assertIn(self.alt.encode(), body)
        self.assertIn(self.image.read_bytes(), body)
        self.assertIn("multipart/form-data", posts[0][2]["content_type"])
        state = json.loads((self.directory / upload_hero.STATE_NAME).read_text())
        self.assertEqual(state["images"]["00-hero"]["status"], "uploaded")
        self.assertEqual(state["images"]["00-hero"]["mediaId"], "media-id")
        self.assertEqual((self.directory / upload_hero.STATE_NAME).stat().st_mode & 0o777, 0o600)
        self.assertIn("封面 alt 匹配", output)
        self.assertIn("1600 × 900", output)
        self.assertIn("480, 960", output)
        for private in ("example-secret", "media-id", "private-path.webp", self.alt):
            self.assertNotIn(private, output)
        for private in ("example-secret", "private-path.webp", self.alt):
            self.assertNotIn(private, json.dumps(state))

        self.calls.clear()
        code, second_output = self.run_helper()
        self.assertEqual(code, 0, second_output)
        self.assertIn("跳过 POST", second_output)
        self.assertEqual([(m, p) for m, p, _ in self.calls], [("GET", "/media")])

    def test_webp_mime_does_not_depend_on_host_mime_database(self):
        with mock.patch.object(client.mimetypes, "guess_type", return_value=(None, None)):
            body, _ = client.multipart({}, {"file": ("hero.webp", b"fake")})
        self.assertIn(b"Content-Type: image/webp", body)

    def test_nested_validation_errors_expose_fields_but_not_token(self):
        lines = []
        error = json.dumps({"errors": {"fieldErrors": {"file": ["required"],
                                                           "alt": ["bad example-secret"]}}})
        upload_hero.safe_error_details(error, lines.append)
        output = "\n".join(lines)
        self.assertIn("报错字段: alt, file", output)
        self.assertIn("required", output)
        self.assertNotIn("example-secret", output)

    def test_http_error_is_redacted_and_blocks_automatic_retry(self):
        self.responses["mode"] = "error"
        code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("POST /media -> 400", output)
        self.assertIn("Missing file", output)
        self.assertNotIn("example-secret", output)
        self.assertEqual(json.loads((self.directory / upload_hero.STATE_NAME).read_text())["images"]["00-hero"]["status"], "pending")
        self.calls.clear()
        code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("禁止自动重试", output)
        self.assertEqual(self.calls, [])

    def test_timeout_or_unknown_success_is_never_retried(self):
        for mode in ("timeout", "unknown", "secret-id"):
            with self.subTest(mode=mode), tempfile.TemporaryDirectory() as temp:
                old_directory = self.directory
                try:
                    self.directory = Path(temp)
                    (self.directory / "images").mkdir()
                    (self.directory / "article.json").write_bytes((old_directory / "article.json").read_bytes())
                    (self.directory / "images/00-hero-1600.webp").write_bytes(self.image.read_bytes())
                    self.responses["mode"] = mode
                    self.calls.clear()
                    code, output = self.run_helper()
                    self.assertNotEqual(code, 0)
                    self.assertNotIn("example-secret", output)
                    self.assertEqual(json.loads((self.directory / upload_hero.STATE_NAME).read_text())["images"]["00-hero"]["status"], "pending")
                    self.calls.clear()
                    code, output = self.run_helper()
                    self.assertNotEqual(code, 0)
                    self.assertEqual(self.calls, [])
                finally:
                    self.directory = old_directory

    def test_existing_article_prevents_post(self):
        self.responses["mode"] = "duplicate"
        code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("目标 slug 已存在", output)
        self.assertFalse(any(method == "POST" for method, _, _ in self.calls))
        self.assertFalse((self.directory / upload_hero.STATE_NAME).exists())

    def test_existing_same_name_and_alt_prevents_post(self):
        self.responses["mode"] = "existing-media"
        code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("同名且 alt 相同", output)
        self.assertFalse(any(method == "POST" for method, _, _ in self.calls))
        self.assertFalse((self.directory / upload_hero.STATE_NAME).exists())

    def test_unsupported_media_endpoint_prevents_post(self):
        def unsupported(method, path, **kwargs):
            self.calls.append((method, path, kwargs))
            return 204, {"Allow": "GET, HEAD, OPTIONS"}, ""
        lines = []
        with mock.patch.object(client, "request", side_effect=unsupported):
            code = upload_hero.run_upload(self.directory, out=lines.append)
        self.assertNotEqual(code, 0)
        self.assertIn("未确认支持 POST", "\n".join(lines))
        self.assertEqual([(method, path) for method, path, _ in self.calls], [("OPTIONS", "/media")])
        self.assertFalse((self.directory / upload_hero.STATE_NAME).exists())

    def test_unsupported_base_is_rejected_before_any_request(self):
        with mock.patch.dict(os.environ, {"SITE_API_BASE": "https://different.example/api/v1"}):
            code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("默认站点", output)
        self.assertEqual(self.calls, [])

    def test_alt_mismatch_does_not_trigger_another_upload(self):
        self.responses["alt"] = "wrong alt"
        code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("alt 缺失或不匹配", output)
        self.assertEqual(sum(m == "POST" for m, _, _ in self.calls), 1)
        self.calls.clear()
        code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertFalse(any(m == "POST" for m, _, _ in self.calls))

    def test_changed_image_or_active_lock_blocks_upload(self):
        code, _ = self.run_helper()
        self.assertEqual(code, 0)
        self.calls.clear()
        self.image.write_bytes(b"RIFF\x14\x00\x00\x00WEBPdifferent image")
        code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("不一致", output)
        self.assertEqual(self.calls, [])
        with upload_hero.state_lock(self.directory):
            code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("另一个上传任务", output)
        self.assertEqual(self.calls, [])

    def test_state_save_failure_happens_before_any_post(self):
        with mock.patch.object(upload_hero, "save_state", side_effect=upload_hero.StopUpload("cannot save")):
            code, output = self.run_helper()
        self.assertNotEqual(code, 0)
        self.assertIn("cannot save", output)
        self.assertFalse(any(method == "POST" for method, _, _ in self.calls))


class HeroShellWrapperTests(unittest.TestCase):
    def test_confirmation_required_before_token_prompt(self):
        env = dict(os.environ)
        env.pop("SITE_API_TOKEN", None)
        result = subprocess.run(["bash", "tools/upload_hero.sh"], cwd=ROOT,
                                stdin=subprocess.DEVNULL, capture_output=True, text=True, env=env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("真实上传", result.stderr)
        self.assertNotIn("请输入网站 API 密钥", result.stderr)

    def test_key_is_passed_to_confirmed_helper_without_printing(self):
        with tempfile.TemporaryDirectory() as temp:
            stub = Path(temp) / "python3"
            stub.write_text('#!/bin/sh\n[ "$1" = tools/api/upload_hero.py ] && [ "$2" = --confirm ] && [ -n "$SITE_API_TOKEN" ]\n')
            stub.chmod(0o755)
            env = dict(os.environ, SITE_API_TOKEN="example-secret",
                       PATH=temp + os.pathsep + os.environ["PATH"])
            result = subprocess.run(["bash", "tools/upload_hero.sh", "--confirm"], cwd=ROOT,
                                    stdin=subprocess.DEVNULL, capture_output=True, text=True, env=env)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("真实上传", result.stdout)
            self.assertNotIn("example-secret", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
