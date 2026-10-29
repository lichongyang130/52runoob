#!/usr/bin/env python3
"""把多篇已完成的文章合并成一个压缩包，外加一个本地可用的总目录页。

用法:
    python3 tools/package_bundle.py downloads/All-Articles.zip \
        content/Run-Your-First-5K/article.json content/Repot-a-Houseplant/article.json

每篇文章仍然各自调用 package_article.build_package 生成，因此：
  - 体检、步骤数、图片唯一性等全部检查照常执行，任何一篇不合格就整体失败；
  - 合集里每个文章目录与单篇素材包逐字节一致。
"""
import argparse
import html
import json
import sys
import tempfile
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

sys.path.insert(0, str(Path(__file__).resolve().parent))
import package_article  # noqa: E402
import render_article  # noqa: E402

SITE = "https://www.56juqingba.com"


def _landing_page(entries):
    """A plain local index so the folders can be opened without a server."""
    cards = []
    for doc in entries:
        slug = doc["slug"]
        steps = sum(len(part["steps"]) for part in doc["parts"])
        hero = doc["media"]["hero"]
        cards.append(
            f'<li><a class="card" href="{html.escape(slug)}/index.html">'
            f'<img src="{html.escape(slug)}/Images/{html.escape(hero["base"])}-960.webp" '
            f'srcset="{html.escape(slug)}/Images/{html.escape(hero["base"])}-960.webp 960w, '
            f'{html.escape(slug)}/Images/{html.escape(hero["base"])}-1600.webp 1600w" '
            f'sizes="(min-width: 980px) 320px, 100vw" '
            f'alt="{html.escape(hero["alt"])}" width="960" height="540" loading="lazy">'
            f'<div class="t"><h2>{html.escape(doc["title"])}</h2>'
            f'<p class="c">{html.escape(doc["category"])}</p>'
            f'<p class="m">{steps} steps · {steps + 1} illustrations</p></div></a></li>'
        )
    return f'''<!doctype html>
<html lang="zh">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>英文文章素材包目录</title>
<style>{render_article.CSS}
.bundle{{list-style:none;padding:0;margin:0;display:grid;gap:22px;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}}
.card{{display:block;text-decoration:none;color:inherit;border:1px solid #e3e3e3;
  border-radius:10px;overflow:hidden;background:#fff;height:100%}}
.card img{{display:block;width:100%;height:auto}}
.card .t{{padding:14px 16px 18px}}
.card h2{{font-size:1.05rem;margin:0 0 6px;line-height:1.35}}
.card .c{{margin:0 0 4px;font-size:.85rem;color:#666}}
.card .m{{margin:0;font-size:.82rem;color:#888}}
</style></head>
<body>
<header class="topbar"><div class="topbar-in"><a class="logo" href="{SITE}/">Howly<span>.</span></a></div></header>
<main class="wrap"><article class="page"><div class="page-head">
<p class="style-draft"><strong>Editorial drafts:</strong> fact and subject-matter review are still
required before any of these are published.</p>
<h1>英文文章素材包</h1>
<p class="dek">共 {len(entries)} 篇。点开任意一篇可在本地直接预览；本页仅为方便查看，不需要上传到服务器。</p>
</div>
<ul class="bundle">
{chr(10).join(cards)}
</ul>
</article></main></body></html>'''


def _readme(entries):
    lines = [f"英文文章素材包合集（共 {len(entries)} 篇）", ""]
    lines.append("包内每个文件夹是一篇独立文章，内容与单篇素材包完全一致：")
    lines.append("• index.html：英文图文网页（每步一图，另有封面）")
    lines.append("• Images：每张插画两档 WebP（1600×900 与 960×540），网页按屏幕宽度自动选用")
    lines.append("• Article-English.txt：英文正文与链接，适合人工复制")
    lines.append("• README-中文.txt：该篇的单独说明，含所属类目与审校提示")
    lines.append("")
    lines.append("篇目：")
    for doc in entries:
        steps = sum(len(part["steps"]) for part in doc["parts"])
        lines.append(f"• {doc['slug']}/　{doc['title']}")
        lines.append(f"　　类目 {doc['category']}｜{steps} 个步骤｜{steps + 1} 张图")
    lines += [
        "",
        "本目录下的 index.html 是一个总目录页，双击即可在浏览器里逐篇预览，",
        "它只为本地查看方便，不必上传服务器。",
        "",
        "使用方式：解压后，把需要的文章文件夹整个放到服务器上可被网站访问的静态目录，",
        "保持该文件夹内 index.html 与 Images 同级。能否通过网址访问取决于服务器配置。",
        "",
        "重要：本包不是已验证的文章系统导入包。上传压缩包本身不会发布文章，",
        "也不会让文章自动出现在 www.56juqingba.com 的首页、分类页、搜索或数据库中。",
        "文中站内链接指向该站现有页面；这些文章本身尚未发布。",
        "",
        "全部文章均为编辑草稿，公开前须由合适的真人进行事实与安全审校；",
        "不要虚填作者或专家信息。各篇具体需要核查的内容见该篇的 README-中文.txt。",
    ]
    return "\n".join(lines) + "\n"


def build_bundle(article_jsons, output):
    output = Path(output).resolve()
    paths = [Path(p).resolve() for p in article_jsons]
    if not paths:
        raise ValueError("至少要指定一篇文章")

    entries = [json.loads(p.read_text(encoding="utf-8")) for p in paths]
    slugs = [doc["slug"] for doc in entries]
    if len(set(slugs)) != len(slugs):
        raise ValueError("同一篇文章不能重复打包")

    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        # Each article goes through the normal single-article packaging, so every
        # check it enforces applies here too and the folders stay identical.
        parts = []
        for path, slug in zip(paths, slugs):
            single = tmpdir / f"{slug}.zip"
            package_article.build_package(path, single)
            parts.append(single)

        staged = tmpdir / "bundle.zip"
        with ZipFile(staged, "w", ZIP_DEFLATED, compresslevel=6) as archive:
            archive.writestr("index.html", _landing_page(entries))
            archive.writestr("README-中文.txt", _readme(entries))
            for single in parts:
                with ZipFile(single) as source:
                    for info in source.infolist():
                        archive.writestr(info.filename, source.read(info.filename))
        with ZipFile(staged) as archive:
            if archive.testzip() is not None:
                raise ValueError("生成的压缩包校验失败")
        staged.replace(output)

    total_steps = sum(sum(len(part["steps"]) for part in doc["parts"]) for doc in entries)
    print(f"合集素材包 -> {output}")
    print(f"  {len(entries)} 篇，共 {total_steps} 个步骤，{total_steps + len(entries)} 张图")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output")
    parser.add_argument("article_json", nargs="+")
    args = parser.parse_args()
    try:
        build_bundle(args.article_json, args.output)
    except (KeyError, TypeError, OSError, ValueError) as exc:
        print(f"无法打包: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
