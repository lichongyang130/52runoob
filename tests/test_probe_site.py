import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "probe_site.sh"


class InteractiveProbeTests(unittest.TestCase):
    def test_missing_key_fails_safely_in_noninteractive_shell(self):
        env = dict(os.environ)
        env.pop("SITE_API_TOKEN", None)
        result = subprocess.run(["bash", str(SCRIPT)], stdin=subprocess.DEVNULL,
                                capture_output=True, text=True, env=env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("可交互的终端", result.stderr)

    def test_existing_key_is_passed_to_probe_without_being_printed(self):
        with tempfile.TemporaryDirectory() as tmp:
            stub = Path(tmp) / "python3"
            stub.write_text('#!/bin/sh\n[ "$1" = tools/api/publish.py ] && [ "$2" = --probe ] && [ -n "$SITE_API_TOKEN" ]\n')
            stub.chmod(0o755)
            fake_key = "test-credential-not-real"
            env = dict(os.environ, SITE_API_TOKEN=fake_key, PATH=tmp + os.pathsep + os.environ["PATH"])
            result = subprocess.run(["bash", str(SCRIPT)], stdin=subprocess.DEVNULL,
                                    capture_output=True, text=True, env=env)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertNotIn(fake_key, result.stdout + result.stderr)

    def test_details_mode_passes_key_to_read_only_inspection(self):
        with tempfile.TemporaryDirectory() as tmp:
            stub = Path(tmp) / "python3"
            stub.write_text('#!/bin/sh\n[ "$1" = tools/api/inspect_site.py ] && [ -n "$SITE_API_TOKEN" ]\n')
            stub.chmod(0o755)
            fake_key = "test-credential-not-real"
            env = dict(os.environ, SITE_API_TOKEN=fake_key, PATH=tmp + os.pathsep + os.environ["PATH"])
            result = subprocess.run(["bash", str(SCRIPT), "--details"], stdin=subprocess.DEVNULL,
                                    capture_output=True, text=True, env=env)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertNotIn(fake_key, result.stdout + result.stderr)

    def test_unknown_mode_fails_before_prompting(self):
        env = dict(os.environ)
        env.pop("SITE_API_TOKEN", None)
        result = subprocess.run(["bash", str(SCRIPT), "--publish"], stdin=subprocess.DEVNULL,
                                capture_output=True, text=True, env=env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("用法", result.stderr)
        self.assertNotIn("请输入网站 API 密钥", result.stderr)


if __name__ == "__main__":
    unittest.main()
