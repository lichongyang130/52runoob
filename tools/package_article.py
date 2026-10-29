#!/usr/bin/env python3
"""Build a self-contained, manually uploadable article ZIP; never publish to the CMS."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import tempfile
from zipfile import ZIP_DEFLATED, ZipFile

import check_article
import render_article

SITE = "https://www.56juqingba.com"


def build_package(article_json, output):
    article_json = Path(article_json).resolve()
    output = Path(output).resolve()
    doc = json.loads(article_json.read_text(encoding="utf-8"))
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9-]*", doc.get("slug", "")):
        raise ValueError("文章 slug 只能包含字母、数字和连字符")
    steps = [step for part in doc["parts"] for step in part["steps"]]
    # A packaged new article must satisfy the user's current standard even when
    # an old or incomplete JSON file omits the production requirements block.
    requirements = doc.get("requirements", {})
    if (not isinstance(requirements, dict)
            or requirements.get("stepMin") != 15 or requirements.get("stepMax") != 20
            or requirements.get("externalLinksMin", 0) < 2
            or requirements.get("uniqueImagesWithinArticle") is not True):
        raise ValueError("新文章必须明确声明 15–20 步、至少 2 条出站链接及文章内图片唯一")
    if not 15 <= len(steps) <= 20:
        raise ValueError("新文章必须有 15–20 个步骤")
    if check_article.main(str(article_json)):
        raise ValueError("文章体检未通过；缺图或缺链接的草稿不能打包")
    if doc.get("publishing", {}).get("imagePending") != 0:
        raise ValueError("publishing.imagePending 必须为 0")

    images = [doc["media"]["hero"]] + [step["image"] for step in steps]
    paths = [article_json.parent / "images" / (image["base"] + "-1600.webp") for image in images]
    hashes = [hashlib.sha256(path.read_bytes()).digest() for path in paths]
    if len(set(hashes)) != len(hashes):
        raise ValueError("封面和步骤图必须在文章内互不相同")

    esc = render_article.esc
    body = render_article.render_html_body(doc, "Images/", responsive=False, site_base=SITE)
    hero = doc["media"]["hero"]
    # An explicit review notice avoids presenting a health draft as an endorsed publication.
    notice = ('<p class="style-draft"><strong>Editorial draft:</strong> '
              'Fact and subject-matter review are still required before publication.</p>')
    document = f'''<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(doc['seo']['titleTag'])}</title>
<meta name="description" content="{esc(doc['seo']['metaDescription'])}">
<style>{render_article.CSS}\n.refs li,.related li{{overflow-wrap:anywhere}}</style></head>
<body>
<header class="topbar"><div class="topbar-in"><a class="logo" href="{SITE}/">Howly<span>.</span></a></div></header>
<main class="wrap"><article class="page"><div class="page-head">
{notice}<h1>{esc(doc['h1'])}</h1><p class="dek">{esc(doc['deck'])}</p>
<div class="meta"><span>{len(doc['parts'])} parts · {len(steps)} steps</span><span>Updated {esc(doc['publishing']['dateModified'])}</span></div>
</div>
<img class="hero" src="Images/{esc(hero['base'])}-1600.webp" alt="{esc(hero['alt'])}" width="1600" height="900">
{body}
</article></main></body></html>'''
    # Plain text remains useful for manual CMS editing, while the image names
    # point to the exact 1600px files shipped in the package.
    text = render_article.render_markdown(doc)
    text = re.sub(r"\]\(images/([^)]*)-960\.webp\)", r"](Images/\1-1600.webp)", text)
    text = text.replace("](images/", "](Images/")
    text = "EDITORIAL DRAFT — SUBJECT-MATTER REVIEW REQUIRED BEFORE PUBLICATION\n\n" + text

    reused = doc.get("media", {}).get("reusedFrom", {})
    reuse_note = (f"其中 {len(reused)} 张使用此前制作的相关插画，封面和各步骤在本文内均不重复。"
                  if reused else "封面与每个步骤均使用不同的插画。")
    readme = f'''{doc['title']}｜英文文章素材包

包内包含：
• index.html：英文图文网页（{len(steps)} 个步骤，每步一图，另有一张封面）。
• Images：{len(images)} 张 1600×900 WebP 图片。
• Article-English.txt：英文正文、图片文件名、站内外链接和参考资料，适合人工复制。

配图说明：{reuse_note}

使用方式：下载后解压；如作为独立网页，请把整个文件夹放在服务器上可被网站访问的静态目录，保持 index.html 和 Images 同级。能否通过网址访问取决于服务器配置；上传压缩包本身不会自动发布。

本包不是已验证的文章系统导入包，不会自动进入原网站首页、分类、搜索或数据库。站内链接指向 www.56juqingba.com 的现有页面；网页尚未发布。英文文章涉及运动健康，公开前须由合适的真人进行事实与安全审校；不要虚填作者或专家信息。
'''
    output.parent.mkdir(parents=True, exist_ok=True)
    # Create next to the destination and replace only after a successful CRC check.
    with tempfile.NamedTemporaryFile(prefix=".article-", suffix=".zip", dir=output.parent, delete=False) as tmp:
        temp_path = Path(tmp.name)
    try:
        root = doc["slug"] + "/"
        with ZipFile(temp_path, "w", ZIP_DEFLATED, compresslevel=6) as archive:
            archive.writestr(root + "index.html", document)
            archive.writestr(root + "Article-English.txt", text)
            archive.writestr(root + "README-中文.txt", readme)
            for path in paths:
                archive.write(path, root + "Images/" + path.name)
        with ZipFile(temp_path) as archive:
            if archive.testzip() is not None:
                raise ValueError("生成的压缩包校验失败")
        temp_path.replace(output)
    finally:
        temp_path.unlink(missing_ok=True)
    print(f"独立网页素材包 -> {output} ({len(steps)} 步，{len(images)} 张图)")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("article_json")
    parser.add_argument("output")
    args = parser.parse_args()
    try:
        build_package(args.article_json, args.output)
    except (KeyError, TypeError, OSError, ValueError) as exc:
        print(f"无法打包: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
