import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "api"))
from workflow_input import resolve  # noqa: E402


class WorkflowInputTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def marker(self, slug, action):
        directory = self.root / "content" / slug
        directory.mkdir(parents=True, exist_ok=True)
        (directory / "PUBLISH").write_text(action, encoding="utf-8")
        return f"content/{slug}/PUBLISH"

    def push(self, commits):
        return resolve("push", "", "", "", "arena/f9a79f56-52runoob", json.dumps(commits), self.root)

    def test_probe_marker_is_not_mistaken_for_publish(self):
        marker = self.marker("Example", "probe\n")
        result = self.push([{"added": [marker]}])
        self.assertEqual(result["action"], "probe")
        self.assertEqual(result["dir"], "content/Example")
        self.assertEqual(result["cleanup"], "true")

    def test_unknown_marker_action_fails_closed(self):
        marker = self.marker("Example", "publsih")
        with self.assertRaises(ValueError):
            self.push([{"modified": [marker]}])

    def test_multiple_markers_fail_instead_of_silently_skipping_one(self):
        first = self.marker("First", "publish")
        second = self.marker("Second", "publish")
        with self.assertRaises(ValueError):
            self.push([{"added": [first, second]}])

    def test_deleted_markers_do_not_trigger_publish(self):
        marker = self.marker("Example", "publish")
        self.assertEqual(self.push([{"removed": [marker]}]), {"skip": "true"})

    def test_manual_input_validates_directory_and_action(self):
        args = ("workflow_dispatch", "content/Good-Slug", "dry-run", "arena/example", "arena/example", "[]")
        self.assertEqual(resolve(*args, root=self.root)["action"], "dry-run")
        with self.assertRaises(ValueError):
            resolve("workflow_dispatch", "content/../bad", "publish", "arena/example", "arena/example", "[]", self.root)
        with self.assertRaises(ValueError):
            resolve("workflow_dispatch", "content/Good-Slug", "typo", "arena/example", "arena/example", "[]", self.root)


if __name__ == "__main__":
    unittest.main()
