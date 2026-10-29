from email import policy
from email.parser import BytesParser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import hashlib
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
import threading
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/Keep-Running-Through-Winter"
sys.path.insert(0, str(ROOT / "tools" / "api"))
import client  # noqa: E402
import inspect_site  # noqa: E402
import upload_hero as shared  # noqa: E402
import upload_steps  # noqa: E402


class MockSite(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def record(self):
        self.server.calls.append((self.command, self.path, self.headers.get("Authorization")))

    def reply(self, status, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.record()
        self.send_response(204)
        self.send_header("Allow", "GET, HEAD, OPTIONS, POST")
        self.end_headers()

    def do_GET(self):
        self.record()
        if self.path == "/api/v1/articles/" + inspect_site.REFERENCE_SLUG:
            self.reply(200, {"article": {"slug": inspect_site.REFERENCE_SLUG, "tips": []}})
        elif self.path == "/api/v1/articles/Keep-Running-Through-Winter":
            self.reply(404, {"error": "not found"})
        elif self.path in ("/api/v1/articles", "/api/v1/articles?status=DRAFT"):
            self.reply(200, {"articles": []})
        elif self.path == "/api/v1/categories":
            self.reply(200, {"categories": [{"id": "category-id", "name": "Sports and Fitness"}]})
        elif self.path == "/api/v1/media":
            self.reply(200, {"media": self.server.media})
        else:
            self.reply(404, {"error": "unknown"})

    def do_POST(self):
        self.record()
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        header = ("Content-Type: " + self.headers.get("Content-Type", "") + "\r\nMIME-Version: 1.0\r\n\r\n").encode()
        parsed = BytesParser(policy=policy.default).parsebytes(header + body)
        parts = {part.get_param("name", header="content-disposition"): part for part in parsed.iter_parts()}
        filename = parts["file"].get_filename()
        alt = parts["alt"].get_payload(decode=True).decode()
        self.server.files.append((filename, parts["file"].get_content_type(), alt))
        record = {"id": f"step-{len(self.server.files)}", "originalName": filename, "alt": alt,
                  "width": 1600, "height": 900, "variants": {"480": "a", "960": "b", "1600": "c"}}
        self.server.media.append(record)
        self.reply(201, {"media": record})


class StepUploadHttpIntegrationTests(unittest.TestCase):
    def test_twelve_real_http_posts_use_verified_contract_and_resume_without_writes(self):
        server = ThreadingHTTPServer(("127.0.0.1", 0), MockSite)
        server.calls = []
        server.files = []
        doc = json.loads((SOURCE / "article.json").read_text())
        server.media = [{"id": "hero-id", "originalName": "00-hero-1600.webp",
                         "alt": doc["media"]["hero"]["alt"], "width": 1600, "height": 900,
                         "variants": {"480": "a", "960": "b", "1600": "c"}}]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with tempfile.TemporaryDirectory() as temp:
                directory = Path(temp)
                (directory / "images").mkdir()
                (directory / "article.json").write_text(json.dumps(doc), encoding="utf-8")
                for path in (SOURCE / "images").glob("*-1600.webp"):
                    shutil.copyfile(path, directory / "images" / path.name)
                hero = (directory / "images/00-hero-1600.webp").read_bytes()
                state = {"schema": shared.STATE_SCHEMA, "articleSlug": doc["slug"], "images": {
                    "00-hero": {"status": "uploaded", "filename": "00-hero-1600.webp",
                                "sha256": hashlib.sha256(hero).hexdigest(), "mediaId": "hero-id"}}}
                (directory / shared.STATE_NAME).write_text(json.dumps(state), encoding="utf-8")
                mock_base = f"http://127.0.0.1:{server.server_port}/api/v1"
                original_request = client.request

                def request_mock(method, path, **kwargs):
                    return original_request(method, path, base_override=mock_base, **kwargs)

                lines = []
                with mock.patch.dict(os.environ, {"SITE_API_TOKEN": "integration-secret",
                                                "SITE_API_BASE": client.DEFAULT_BASE}), \
                     mock.patch.object(client, "request", side_effect=request_mock):
                    self.assertEqual(upload_steps.run_batch(directory, out=lines.append), 0, "\n".join(lines))
                    self.assertEqual(upload_steps.run_batch(directory, out=lines.append), 0, "\n".join(lines))
                posts = [path for method, path, _ in server.calls if method == "POST"]
                self.assertEqual(posts, ["/api/v1/media"] * 12)
                self.assertTrue(all(auth == "Bearer integration-secret" for _, _, auth in server.calls))
                self.assertTrue(all(mime == "image/webp" for _, mime, _ in server.files))
                expected = [(step["image"]["base"] + "-1600.webp", step["image"]["alt"])
                            for part in doc["parts"] for step in part["steps"]]
                self.assertEqual([(filename, alt) for filename, _, alt in server.files], expected)
                self.assertNotIn("integration-secret", "\n".join(lines))
                self.assertNotIn("hero-id", "\n".join(lines))
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
