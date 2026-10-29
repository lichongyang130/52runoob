#!/usr/bin/env python3
"""Regression tests for illustration previews, publication holds, and image caching."""
import contextlib
import hashlib
import io
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
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tools" / "api"))
import client  # noqa: E402
import publish  # noqa: E402
from tools import render_article  # noqa: E402


class StyleTransitionTests(unittest.TestCase):
    def setUp(self):
        self.doc = json.loads((ROOT / "content/Keep-Running-Through-Winter/article.json").read_text())
        self.tmp = tempfile.TemporaryDirectory()
        self.article_dir = Path(self.tmp.name)
        (self.article_dir / "images").mkdir()
        self.doc["media"]["stylePending"] = [self.doc["parts"][0]["steps"][0]["image"]["base"]]
        self.article_file = self.article_dir / "article.json"
        self._write_doc()
        bases = [self.doc["media"]["hero"]["base"]] + [
            step["image"]["base"] for part in self.doc["parts"] for step in part["steps"]
        ]
        for base in bases:
            for width in (960, 1600):
                (self.article_dir / "images" / f"{base}-{width}.webp").touch()

    def tearDown(self):
        self.tmp.cleanup()

    def _write_doc(self):
        self.article_file.write_text(json.dumps(self.doc), encoding="utf-8")

    def _run(self, *args):
        return subprocess.run([sys.executable, *map(str, args)], cwd=ROOT,
                              capture_output=True, text=True, env={**os.environ, "SITE_API_TOKEN": ""})

    def test_preview_marks_old_images_but_import_body_does_not(self):
        exported = render_article.render_html_body(self.doc, "../images/")
        preview = render_article.render_html_body(self.doc, "../images/", show_style_pending=True)
        self.assertNotIn("Previous image style", exported)
        self.assertEqual(preview.count("Previous image style"), 1)
        full_preview = render_article.render_preview(self.doc, preview, "../images/00-hero")
        self.assertIn("Illustration draft:", full_preview)
        self.assertIn("Subject-matter review pending", full_preview)

    def test_checker_blocks_transition_even_when_old_files_exist(self):
        checked = self._run(ROOT / "tools/check_article.py", self.article_file)
        self.assertNotEqual(checked.returncode, 0)
        self.assertIn("新风格配图仍待替换 1 张", checked.stdout)
        self.doc["media"]["stylePending"] = []
        self._write_doc()
        checked = self._run(ROOT / "tools/check_article.py", self.article_file)
        self.assertEqual(checked.returncode, 0, checked.stdout + checked.stderr)

    def test_publish_and_image_upload_are_blocked_but_dry_run_is_allowed(self):
        script = ROOT / "tools/api/publish.py"
        for flag in ([], ["--only-images"], ["--update"]):
            result = self._run(script, self.article_dir, *flag)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("禁止上传或发布", result.stderr)
        result = self._run(script, self.article_dir, "--dry-run")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("仅允许 dry-run", result.stdout)

    def test_payload_has_uploaded_images_and_related_links(self):
        bases = [self.doc["media"]["hero"]["base"]] + [
            step["image"]["base"] for part in self.doc["parts"] for step in part["steps"]
        ]
        images = {base: f"/uploads/{base}.webp" for base in bases}
        payload = publish.build_payload(self.doc, images)
        first_step = payload["parts"][0]["steps"][0]
        self.assertEqual(first_step["imageUrl"], images[first_step["image"]["base"]])
        self.assertEqual(first_step["imageAlt"], first_step["image"]["alt"])
        for link in self.doc["internalLinks"]:
            self.assertIn(link["url"], payload["html"])
        self.assertEqual(payload["html"].count("<figure>"), len(bases) - 1)

    def test_invalid_style_pending_is_rejected(self):
        self.doc["media"]["stylePending"] = "not a list"
        self._write_doc()
        result = self._run(ROOT / "tools/api/publish.py", self.article_dir, "--dry-run")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("必须是", result.stderr)


class UploadCacheTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.image = Path(self.tmp.name) / "01-step-1600.webp"
        self.image.write_bytes(b"first image")
        self.env = mock.patch.dict(os.environ, {"SITE_API_TOKEN": "test-secret-123"})
        self.env.start()

    def tearDown(self):
        self.env.stop()
        self.tmp.cleanup()

    def test_cache_reuses_identical_bytes_but_not_replaced_image(self):
        cache = {}
        responses = [(201, {}, '{"url":"/uploads/first.webp"}'),
                     (201, {}, '{"url":"/uploads/second.webp"}')]
        with mock.patch.object(client, "request", side_effect=responses) as request:
            first = publish.upload_image("/uploads", str(self.image), cache, False)
            again = publish.upload_image("/uploads", str(self.image), cache, False)
            self.assertEqual(first, again)
            self.assertEqual(request.call_count, 1)
            self.image.write_bytes(b"replacement image")
            second = publish.upload_image("/uploads", str(self.image), cache, False)
        self.assertNotEqual(first, second)
        self.assertEqual(request.call_count, 2)
        self.assertEqual(cache["01-step-1600"]["sha256"], hashlib.sha256(b"replacement image").hexdigest())

    def test_legacy_string_cache_is_not_trusted(self):
        cache = {"01-step-1600": "https://example.org/old.webp"}
        with mock.patch.object(client, "request", return_value=(201, {}, '{"url":"/uploads/new.webp"}')) as request:
            result = publish.upload_image("/uploads", str(self.image), cache, False)
        self.assertTrue(result.endswith("/new.webp"))
        self.assertEqual(request.call_count, 1)
        self.assertIsInstance(cache["01-step-1600"], dict)

    def test_url_with_secret_is_never_printed_or_cached(self):
        cache = {}
        output = io.StringIO()
        with mock.patch.object(client, "request", return_value=(201, {}, '{"url":"/x?key=test-secret-123"}')):
            with contextlib.redirect_stdout(output), self.assertRaises(SystemExit):
                publish.upload_image("/uploads", str(self.image), cache, False)
        self.assertNotIn("test-secret-123", output.getvalue())
        self.assertEqual(cache, {})

    def test_json_shape_reports_fields_not_values(self):
        sample = {"data": [{"title": "private example", "steps": [{"text": "body"}]}]}
        shape = client.json_shape(sample)
        rendered = json.dumps(shape)
        self.assertIn('"title": "str"', rendered)
        self.assertNotIn("private example", rendered)
        self.assertNotIn('"body"', rendered)

    def test_token_with_surrounding_whitespace_is_still_redacted(self):
        with mock.patch.dict(os.environ, {"SITE_API_TOKEN": "  test-secret-123  "}):
            self.assertEqual(client._redact("bearer test-secret-123"), "bearer <token>")
            with self.assertRaises(SystemExit):
                publish.safe_image_url("/uploads?key=test-secret-123")

    def test_probe_redacts_response_before_truncation(self):
        lines = []
        secret_response = "x" * 110 + "test-secret-123" + "x" * 10
        with mock.patch.object(client, "request", return_value=(200, {}, secret_response)):
            client.probe(status_out=lines.append)
        self.assertNotIn("test-secret-123", "\n".join(lines))
        self.assertNotIn("test-secret-", "\n".join(lines))


@unittest.skipUnless(shutil.which("convert") and shutil.which("identify"), "ImageMagick not installed")
class ImageSizingTests(unittest.TestCase):
    def test_square_portrait_and_landscape_are_exact_16_by_9(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp)
            raw = directory / "raw"
            raw.mkdir()
            for name, dims in (("square", "64x64"), ("portrait", "64x96"), ("landscape", "128x64")):
                subprocess.run(["convert", "-size", dims, "gradient:#c3cbb4-#f5e7c2", str(raw / f"{name}.png")], check=True)
            subprocess.run(["bash", str(ROOT / "tools/make_images.sh"), str(directory)],
                           cwd=ROOT, check=True, capture_output=True, text=True)
            for name in ("square", "portrait", "landscape"):
                for width, expected in ((1600, "1600x900"), (960, "960x540")):
                    output = subprocess.check_output(["identify", "-format", "%wx%h", str(directory / f"{name}-{width}.webp")], text=True)
                    self.assertEqual(output, expected)


if __name__ == "__main__":
    unittest.main()
