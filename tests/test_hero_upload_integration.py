from email import policy
from email.parser import BytesParser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "api"))
import client  # noqa: E402
import inspect_site  # noqa: E402
import upload_hero  # noqa: E402


class MockApi(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def record(self):
        self.server.calls.append((self.command, self.path, self.headers.get("Authorization")))

    def json_response(self, status, value):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(value).encode())

    def do_OPTIONS(self):
        self.record()
        self.send_response(204)
        self.send_header("Allow", "GET, HEAD, OPTIONS, POST")
        self.end_headers()

    def do_GET(self):
        self.record()
        reference = "/api/v1/articles/" + inspect_site.REFERENCE_SLUG
        if self.path == reference:
            self.json_response(200, {"article": {"slug": inspect_site.REFERENCE_SLUG, "tips": []}})
        elif self.path == "/api/v1/articles/Keep-Running-Through-Winter":
            self.json_response(404, {"error": "not found"})
        elif self.path == "/api/v1/articles":
            self.json_response(200, {"articles": []})
        elif self.path == "/api/v1/media":
            self.json_response(200, {"media": self.server.media})
        else:
            self.json_response(404, {"error": "unknown"})

    def do_POST(self):
        self.record()
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        header = ("Content-Type: " + self.headers.get("Content-Type", "") + "\r\nMIME-Version: 1.0\r\n\r\n").encode()
        parsed = BytesParser(policy=policy.default).parsebytes(header + body)
        self.server.parts = {part.get_param("name", header="content-disposition"):
                             (part.get_filename(), part.get_content_type(), part.get_payload(decode=True))
                             for part in parsed.iter_parts()}
        alt = self.server.parts["alt"][2].decode()
        media = {"id": "realistic-id-1", "alt": alt, "width": 1600, "height": 900,
                 "variants": {"480": "x", "960": "y"}}
        self.server.media.append(media)
        self.json_response(201, {"media": media})


class HeroUploadIntegrationTests(unittest.TestCase):
    def test_real_http_multipart_one_upload_and_safe_readback(self):
        server = ThreadingHTTPServer(("127.0.0.1", 0), MockApi)
        server.calls = []
        server.media = []
        server.parts = {}
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with tempfile.TemporaryDirectory() as temp:
                directory = Path(temp)
                (directory / "images").mkdir()
                doc = json.loads((ROOT / "content/Keep-Running-Through-Winter/article.json").read_text())
                (directory / "article.json").write_text(json.dumps(doc), encoding="utf-8")
                image = b"RIFF\x14\x00\x00\x00WEBPfake image bytes"
                (directory / "images/00-hero-1600.webp").write_bytes(image)
                base = f"http://127.0.0.1:{server.server_port}/api/v1"
                actual_request = client.request

                def use_mock_server(method, path, **kwargs):
                    return actual_request(method, path, base_override=base, **kwargs)

                lines = []
                with mock.patch.dict(os.environ, {"SITE_API_TOKEN": "integration-secret",
                                                "SITE_API_BASE": client.DEFAULT_BASE}), \
                     mock.patch.object(client, "request", side_effect=use_mock_server):
                    self.assertEqual(upload_hero.run_upload(directory, out=lines.append), 0)
                    self.assertEqual(upload_hero.run_upload(directory, out=lines.append), 0)
                self.assertEqual(sum(method == "POST" for method, _, _ in server.calls), 1)
                self.assertEqual([path for method, path, _ in server.calls if method == "POST"], ["/api/v1/media"])
                self.assertTrue(all(auth == "Bearer integration-secret" for _, _, auth in server.calls))
                self.assertEqual(server.parts["file"], ("00-hero-1600.webp", "image/webp", image))
                self.assertEqual(server.parts["alt"][2].decode(), doc["media"]["hero"]["alt"])
                output = "\n".join(lines)
                self.assertNotIn("integration-secret", output)
                self.assertNotIn("realistic-id-1", output)
                self.assertIn("跳过 POST", output)
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
