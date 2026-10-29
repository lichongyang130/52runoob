from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import subprocess
import threading
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ApiHandler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_OPTIONS(self):
        self.server.requests.append(("OPTIONS", self.path, self.headers.get("Authorization")))
        self.send_response(204)
        self.send_header("Allow", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self):
        self.server.requests.append(("GET", self.path, self.headers.get("Authorization")))
        article = {"article": {"title": "private sample text",
                              "parts": [{"steps": [{"body": "private sample body"}]}]}}
        bodies = {
            "/api/v1/articles": {"articles": [{"id": "sample-id", "title": "private sample text",
                                                 "slug": "Start-Running-When-You-Hate-Running",
                                                 "status": "published"}]},
            "/api/v1/articles/Start-Running-When-You-Hate-Running": article,
            "/api/v1/articles/sample-id": article,
            "/api/v1/media": {"media": [{"id": "media-id", "path": "private-image.webp"}]},
            "/api/v1/media/media-id": {"media": {"id": "media-id", "path": "private-image.webp"}},
            "/api/v1/categories": {"categories": [{"name": "Sports and Fitness", "id": "cat-id"}]},
        }
        if self.path not in bodies:
            self.send_response(404)
            self.end_headers()
            return
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(bodies[self.path]).encode())

    def do_POST(self):
        self.server.requests.append(("POST", self.path, self.headers.get("Authorization")))
        self.send_response(500)
        self.end_headers()


class LocalInspectionIntegrationTests(unittest.TestCase):
    def test_shell_wrapper_reads_mock_site_without_writing_or_leaking_data(self):
        server = ThreadingHTTPServer(("127.0.0.1", 0), ApiHandler)
        server.requests = []
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            env = dict(os.environ, SITE_API_TOKEN="fake-bearer-secret",
                       SITE_API_BASE=f"http://127.0.0.1:{server.server_port}/api/v1")
            result = subprocess.run(["bash", "tools/probe_site.sh", "--details"], cwd=ROOT,
                                    stdin=subprocess.DEVNULL, capture_output=True, text=True,
                                    env=env, timeout=15)
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertTrue(server.requests)
        self.assertEqual({method for method, _, _ in server.requests}, {"GET", "OPTIONS"})
        self.assertTrue(all(auth == "Bearer fake-bearer-secret" for _, _, auth in server.requests))
        self.assertIn('"steps"', result.stdout)
        self.assertIn("本次列表中未发现", result.stdout)
        for text in ("fake-bearer-secret", "private sample text", "private sample body", "private-image.webp"):
            self.assertNotIn(text, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
