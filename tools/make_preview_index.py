#!/usr/bin/env python3
"""
make_preview_index.py — 为仓库内的 preview/ 生成一个总目录页

用法:
    python3 tools/make_preview_index.py preview/All-Finished-Articles.html \
        content/Run-Your-First-5K/article.json content/Repot-a-Houseplant/article.json ...

和下载用的合集包目录页共用同一套卡片与样式（复用 package_bundle._landing_page），
区别只在链接去向：合集包里每篇是独立文件夹，仓库里每篇是 preview/<slug>.html，
图片直接引用 content/<slug>/images/，不复制一份。

这样「仓库预览页」不再是手工拼出来、改一次就要重拼的一次性产物。
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import package_bundle  # noqa: E402


def build_index(article_jsons, output):
    """用成稿 JSON 渲染目录页；任何一篇缺图都直接拒绝，避免预览页粉饰进度。"""
    output = Path(output)
    entries = []
    for path in article_jsons:
        doc = json.loads(Path(path).read_text(encoding="utf-8"))
        pending = doc.get("publishing", {}).get("imagePending", 0)
        if pending:
            raise ValueError(f"{doc['slug']} 还缺 {pending} 张配图，不能放进成稿目录页")
        entries.append(doc)

    slugs = [doc["slug"] for doc in entries]
    if len(set(slugs)) != len(slugs):
        raise ValueError("同一篇文章重复传入")

    html = package_bundle._landing_page(entries)
    # 合集包里是 <slug>/index.html 与 <slug>/Images/...；仓库里换成平铺的预览页和原图目录。
    for slug in slugs:
        html = html.replace(f'href="{slug}/index.html"', f'href="{slug}.html"')
        html = html.replace(f'src="{slug}/Images/', f'src="../content/{slug}/images/')
        # srcset carries the same bundle-relative paths and must be rewritten with it.
        html = html.replace(f'{slug}/Images/', f'../content/{slug}/images/')
    html = html.replace(
        "本页仅为方便查看，不需要上传到服务器。",
        "本页只在仓库内查看用，图片直接引用 content/ 下的原图，不随下载包分发。",
    )

    leftovers = re.findall(
        r'(?:src|srcset|href)="([^"]*/(?:index\.html|Images/)[^"]*)"', html
    )
    if leftovers:
        raise ValueError(f"目录页仍有未改写的合集包路径: {leftovers[:3]}")

    output.parent.mkdir(parents=True, exist_ok=True)
    tmp = output.with_suffix(output.suffix + ".tmp")
    tmp.write_text(html, encoding="utf-8")
    tmp.replace(output)
    return output, entries


def main():
    parser = argparse.ArgumentParser(description="生成仓库内的成稿预览目录页")
    parser.add_argument("output", help="输出的 HTML 路径，例如 preview/All-Finished-Articles.html")
    parser.add_argument("articles", nargs="+", help="各篇 article.json")
    args = parser.parse_args()

    output, entries = build_index(args.articles, args.output)
    steps = sum(len(p["steps"]) for doc in entries for p in doc["parts"])
    print(f"预览目录页 -> {output}")
    print(f"  {len(entries)} 篇，共 {steps} 个步骤，{steps + len(entries)} 张图")


if __name__ == "__main__":
    main()
