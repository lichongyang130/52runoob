import contextlib
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "api"))
import client  # noqa: E402
import inspect_site  # noqa: E402
import publish  # noqa: E402


class ReadOnlyInspectionTests(unittest.TestCase):
    def setUp(self):
        self.env = mock.patch.dict(os.environ, {"SITE_API_TOKEN": "fake-site-secret"})
        self.env.start()

    def tearDown(self):
        self.env.stop()

    def test_nested_and_json_encoded_structure_contains_no_values(self):
        private_value = "never-display-this-article-text"
        data = {"article": {"content": json.dumps({"parts": [{"steps": [
            {"title": private_value, "body": private_value, "image": {"url": private_value}}
        ]}]})}}
        shape = json.dumps(inspect_site.json_structure(data), ensure_ascii=False)
        self.assertIn('"parts"', shape)
        self.assertIn('"steps"', shape)
        self.assertIn('"image"', shape)
        self.assertNotIn(private_value, shape)
        self.assertEqual(inspect_site.json_structure("not JSON [secret]"), "str")

    def test_secret_in_json_key_is_redacted_before_escaping(self):
        secret = 'fake"secret\\segment'
        with mock.patch.dict(os.environ, {"SITE_API_TOKEN": secret}):
            result = inspect_site.json_structure({secret: "private"})
            self.assertEqual(result, {"<token>": "str"})
            self.assertEqual(client.json_shape({secret: "private"}), {"<token>": "str"})
            escaped = json.dumps({"detail": secret})
            self.assertEqual(json.loads(client._redact(escaped)), {"detail": "<token>"})

    def test_full_probe_only_reads_and_does_not_print_values_or_headers(self):
        private_value = "private-article-title-value"
        article_doc = {"article": {"title": private_value,
                                  "content": '{"parts":[{"steps":[{"body":"hidden"}]}]}'}}
        articles = {"articles": [
            {"id": "reference-id", "slug": inspect_site.REFERENCE_SLUG,
             "title": private_value, "status": "published"},
            {"id": "draft-id", "slug": "Keep-Running-Through-Winter",
             "title": "private fake-site-secret title", "status": "draft"},
        ], "pagination": {"hasMore": False}}
        media = {"media": [{"id": "media-id", "path": "private-path.webp", "alt": private_value}]}
        categories = {"categories": [{"id": "cat-id", "name": "Sports and Fitness"}]}
        calls = []

        def request(method, path):
            calls.append((method, path))
            if method == "OPTIONS":
                return 204, {"Allow": "GET, POST, DELETE, OPTIONS, fake-site-secret",
                             "Accept-Post": "multipart/form-data; charset=utf-8, fake-site-secret",
                             "Set-Cookie": "fake-site-secret"}, ""
            bodies = {
                "/articles": articles,
                "/articles/" + inspect_site.REFERENCE_SLUG: article_doc,
                "/articles/reference-id": article_doc,
                "/articles/Keep-Running-Through-Winter": article_doc,
                "/media": media,
                "/media/media-id": {"media": media["media"][0]},
                "/categories": categories,
            }
            if path not in bodies:
                return 404, {}, "private-error fake-site-secret"
            return 200, {}, json.dumps(bodies[path])

        output = []
        with mock.patch.object(client, "request", side_effect=request):
            self.assertEqual(inspect_site.inspect(out=output.append), 0)
        joined = "\n".join(output)
        self.assertTrue(calls)
        self.assertEqual({method for method, _ in calls}, {"GET", "OPTIONS"})
        self.assertIn("目标 slug 在本次列表中存在", joined)
        self.assertIn("目标状态（本次列表）: draft", joined)
        self.assertIn("列表可能分页或不含草稿", joined)
        self.assertIn('"steps"', joined)
        self.assertIn("声明的写入内容类型: multipart/form-data", joined)
        self.assertIn("目标分类在本次列表中的匹配数量: 1", joined)
        self.assertNotIn(private_value, joined)
        self.assertNotIn("private-path.webp", joined)
        self.assertNotIn("fake-site-secret", joined)
        self.assertNotIn("private-error", joined)
        self.assertNotIn("draft-id", joined)
        self.assertNotIn("Set-Cookie", joined)

    def test_missing_target_and_404_do_not_claim_definitive_absence(self):
        def request(method, path):
            if method == "GET" and path == "/articles":
                return 200, {}, '{"articles":[]}'
            return 404, {}, "secret error response fake-site-secret"
        lines = []
        with mock.patch.object(client, "request", side_effect=request):
            self.assertEqual(inspect_site.inspect(out=lines.append), 0)
        output = "\n".join(lines)
        self.assertIn("本次列表中未发现", output)
        self.assertIn("未发现不等于站内不存在", output)
        self.assertIn("不能单凭此结果判定不存在", output)
        self.assertNotIn("secret error", output)
        self.assertNotIn("fake-site-secret", output)

    def test_auth_failure_stops_without_printing_error_body(self):
        def request(method, path):
            if method == "OPTIONS":
                return 204, {}, ""
            raise client.ApiError(method, "https://example.invalid", 401,
                                  "private fake-site-secret error body")
        lines = []
        with mock.patch.object(client, "request", side_effect=request):
            self.assertEqual(inspect_site.inspect(out=lines.append), 1)
        output = "\n".join(lines)
        self.assertIn("无法读取文章列表", output)
        self.assertNotIn("fake-site-secret", output)
        self.assertNotIn("private", output)

    def test_invalid_slug_is_rejected_before_requests(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "article.json"
            path.write_text('{"slug":"../../private"}', encoding="utf-8")
            with mock.patch.object(client, "request") as request:
                with self.assertRaises(SystemExit):
                    inspect_site.inspect(out=lambda _: None, target_file=path)
                request.assert_not_called()

    def test_inspection_rejects_any_mutating_method(self):
        with mock.patch.object(client, "request") as request:
            with self.assertRaises(ValueError):
                inspect_site.read_request("POST", "/articles", "label", lambda _: None)
            request.assert_not_called()


class PublicationHoldTests(unittest.TestCase):
    def test_unverified_upload_create_and_update_never_call_api(self):
        article = ROOT / "content/Keep-Running-Through-Winter"
        for flags in ([], ["--only-images"], ["--update"]):
            with self.subTest(flags=flags):
                output = io.StringIO()
                argv = ["publish.py", str(article), *flags]
                with mock.patch.object(sys, "argv", argv), \
                     mock.patch.object(publish, "API_WRITES_VERIFIED", False), \
                     mock.patch.object(client, "request") as request, \
                     contextlib.redirect_stdout(output):
                    with self.assertRaisesRegex(SystemExit, "接口写入格式与查重规则尚未验证"):
                        publish.main()
                    request.assert_not_called()

    def test_dry_run_remains_available(self):
        article = ROOT / "content/Keep-Running-Through-Winter"
        argv = ["publish.py", str(article), "--dry-run"]
        with mock.patch.object(sys, "argv", argv), \
             mock.patch.object(publish, "API_WRITES_VERIFIED", False), \
             mock.patch.object(client, "request") as request, \
             contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(publish.main(), 0)
            request.assert_not_called()


if __name__ == "__main__":
    unittest.main()
