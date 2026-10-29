#!/usr/bin/env python3
"""Resolve one GitHub Actions publish marker, failing closed on ambiguous input."""
import json
import os
from pathlib import Path
import re
import sys

ACTIONS = {"probe", "dry-run", "images-only", "publish", "update"}
DIR_PATTERN = re.compile(r"content/[A-Za-z0-9_-]+")
MARKER_PATTERN = re.compile(r"content/[A-Za-z0-9_-]+/PUBLISH")


def resolve(event_name, directory, action, branch, ref_name, commits_json, root=Path(".")):
    if event_name == "workflow_dispatch":
        if not DIR_PATTERN.fullmatch(directory):
            raise ValueError("article_dir 必须是 content/<slug>。")
        if action not in ACTIONS:
            raise ValueError("未知操作；已拒绝执行。")
        if not branch:
            raise ValueError("缺少目标分支。")
        return {"dir": directory, "action": action, "branch": branch, "cleanup": "false"}

    if event_name != "push":
        raise ValueError("不支持该触发方式。")
    commits = json.loads(commits_json or "[]")
    if not isinstance(commits, list):
        raise ValueError("无效的提交列表。")
    paths = sorted({
        path for commit in commits if isinstance(commit, dict)
        for key in ("added", "modified") for path in commit.get(key, [])
        if isinstance(path, str) and MARKER_PATTERN.fullmatch(path)
    })
    existing = [path for path in paths if (root / path).is_file()]
    if len(existing) > 1:
        raise ValueError("一次只处理一个 PUBLISH 文件，请分别提交；已拒绝执行。")
    if not existing:
        return {"skip": "true"}

    marker = existing[0]
    text = (root / marker).read_text(encoding="utf-8").strip()
    if text not in ACTIONS:
        raise ValueError("PUBLISH 内容必须是 probe、dry-run、images-only、publish 或 update。")
    if not ref_name:
        raise ValueError("缺少目标分支。")
    return {"dir": str(Path(marker).parent), "action": text, "branch": ref_name,
            "cleanup": "true", "pubfile": marker}


def main():
    try:
        values = resolve(
            os.environ.get("GITHUB_EVENT_NAME", ""), os.environ.get("GH_DIR", ""),
            os.environ.get("GH_ACTION", ""), os.environ.get("GH_BRANCH", ""),
            os.environ.get("GITHUB_REF_NAME", ""), os.environ.get("COMMITS_JSON", "[]"),
        )
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as out:
            for key, value in values.items():
                out.write(f"{key}={value}\n")
    except (KeyError, ValueError, OSError, json.JSONDecodeError) as error:
        print(f"::error::{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
