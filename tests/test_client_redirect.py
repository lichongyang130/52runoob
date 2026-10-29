from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import sys
import threading
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "api"))
import client  # noqa: E402


class QuietHandler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path == "/same":
            self.send_response(302)
            self.send_header("Location", "/success")
            self.end_headers()
        elif self.path == "/cross":
            self.send_response(302)
            self.send_header("Location", self.server.other_origin + "/capture")
            self.end_headers()
        else:
            self.server.received.append((self.path, self.headers.get("Authorization")))
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"ok": true}')


class RedirectSafetyTests(unittest.TestCase):
    def setUp(self):
        self.first = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        self.second = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        self.first.received = []
        self.second.received = []
        self.first.other_origin = f"http://127.0.0.1:{self.second.server_port}"
        self.second.other_origin = f"http://127.0.0.1:{self.first.server_port}"
        self.threads = []
        for server in (self.first, self.second):
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            self.threads.append(thread)
        self.base = f"http://127.0.0.1:{self.first.server_port}"
        self.env = mock.patch.dict(os.environ, {"SITE_API_TOKEN": "example-secret"})
        self.env.start()

    def tearDown(self):
        self.env.stop()
        for server in (self.first, self.second):
            server.shutdown()
            server.server_close()
        for thread in self.threads:
            thread.join(timeout=2)

    def test_same_origin_redirect_preserves_normal_behavior(self):
        status, _, body = client.request("GET", "/same", base_override=self.base)
        self.assertEqual(status, 200)
        self.assertIn('"ok"', body)
        self.assertEqual(self.first.received, [("/success", "Bearer example-secret")])

    def test_cross_origin_redirect_never_receives_token(self):
        with self.assertRaises(client.ApiError) as raised:
            client.request("GET", "/cross", base_override=self.base)
        self.assertIn("拒绝跨站点", str(raised.exception))
        self.assertNotIn("example-secret", str(raised.exception))
        self.assertEqual(self.second.received, [])

    def test_origin_normalizes_default_ports_and_rejects_invalid_urls(self):
        self.assertEqual(client._origin("https://EXAMPLE.com/path"),
                         client._origin("https://example.com:443/another"))
        self.assertNotEqual(client._origin("http://example.com"),
                            client._origin("https://example.com"))
        self.assertIsNone(client._origin("https://example.com:bad/path"))
        self.assertIsNone(client._origin("file:///private"))


if __name__ == "__main__":
    unittest.main()
