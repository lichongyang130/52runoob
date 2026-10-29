#!/usr/bin/env python3
"""
check_article.py — 发布前自动体检（每条规则对应一个真实排名/体验风险）

用法:
    python3 tools/check_article.py content/Keep-Running-Through-Winter/article.json

退出码 0 = 全部通过（可能有 warning），1 = 有 error，必须修。
"""
import hashlib
import json
import os
import re
import sys
from urllib.parse import urlsplit

WORD_MIN, WORD_MAX = 900, 1600          # 正文词数区间
STEP_MIN, STEP_MAX = 9, 14              # 步骤数区间
PARA_MIN, PARA_MAX = 45, 110            # 单步正文词数
TITLE_MAX = 60                          # title tag
DESC_MIN, DESC_MAX = 120, 160           # meta description
SENT_MAX = 32                           # 句子平均词数上限

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def sentences(text):
    return [s for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s]


def main(path):
    errors.clear()
    warnings.clear()
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    article_dir = os.path.dirname(os.path.abspath(path))
    slug = d.get("slug", "")
    parts = d.get("parts", [])
    steps = [s for p in parts for s in p["steps"]]
    requirements = d.get("requirements", {})
    if not isinstance(requirements, dict):
        err("requirements 必须是对象")
        requirements = {}
    step_min = requirements.get("stepMin", STEP_MIN)
    step_max = requirements.get("stepMax", STEP_MAX)
    if (isinstance(step_min, bool) or isinstance(step_max, bool)
            or not isinstance(step_min, int) or not isinstance(step_max, int)
            or not 1 <= step_min <= step_max <= 30):
        err("requirements.stepMin/stepMax 必须是有效的步骤区间")
        step_min, step_max = STEP_MIN, STEP_MAX
    expanded = step_min >= 15

    # --- 结构。旧稿继续按其 9-14 步标准检查；新稿可指定 15-20 步。
    if not step_min <= len(steps) <= step_max:
        err(f"步骤数 {len(steps)}，应在 {step_min}-{step_max}")
    if not 2 <= len(parts) <= 4:
        err(f"分部数 {len(parts)}，应为 2-4")
    if expanded and not d.get("title", "").startswith("How to "):
        err("新稿标题必须以 How to 开头")

    # --- 词数
    blobs = [d.get("intro", ""), d.get("deck", "")]
    for s in steps:
        blobs += [s["title"], s["body"], s.get("tip", "")]
    blobs += d.get("tips", []) + d.get("warnings", [])
    for q in d.get("faq", []):
        blobs += [q["q"], q["a"]]
    words = len(" ".join(blobs).split())
    word_max = 2300 if expanded else WORD_MAX
    if not WORD_MIN <= words <= word_max:
        warn(f"正文 {words} 词，理想区间 {WORD_MIN}-{word_max}")

    # --- 单步长度与句子长度
    for i, s in enumerate(steps, 1):
        w = len(s["body"].split())
        if not PARA_MIN <= w <= PARA_MAX:
            warn(f"Step {i}「{s['title']}」正文 {w} 词，建议 {PARA_MIN}-{PARA_MAX}")
        sents = sentences(s["body"])
        if sents:
            avg = sum(len(x.split()) for x in sents) / len(sents)
            if avg > SENT_MAX:
                warn(f"Step {i} 句子偏长（均 {avg:.0f} 词），移动端难读")
        if not s.get("tip"):
            warn(f"Step {i} 缺少 Tip，版式会塌一格")

    # --- 标题/描述
    tag = d.get("seo", {}).get("titleTag", "")
    if len(tag) > TITLE_MAX:
        err(f"title tag {len(tag)} 字符 > {TITLE_MAX}，SERP 会被截断: {tag}")
    desc = d.get("seo", {}).get("metaDescription", "")
    if not DESC_MIN <= len(desc) <= DESC_MAX:
        err(f"meta description {len(desc)} 字符，应在 {DESC_MIN}-{DESC_MAX}")
    if d.get("seo", {}).get("primaryKeyword", "").lower() not in d.get("title", "").lower():
        warn("主关键词没有出现在 H1 里")

    # --- 图片：新稿每步和封面必须有文件、替代文字，且文章内不可复用同一张图。
    pending = 0
    media = d.get("media", {})
    hero = media.get("hero", {})
    images = [("封面", hero)] + [(f"Step {i}", s.get("image")) for i, s in enumerate(steps, 1)]
    bases = []
    hashes = []
    for label, image in images:
        if not isinstance(image, dict) or not image.get("base"):
            pending += 1
            (err if expanded else warn)(f"{label} 无配图（上线前需补齐）")
            continue
        base = image["base"]
        if not isinstance(base, str) or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]*", base):
            err(f"{label} 的图片名称无效")
            continue
        if not isinstance(image.get("alt"), str) or not image["alt"].strip():
            err(f"{label} 缺少图片 alt 描述")
        bases.append(base)
        for width in ("960", "1600"):
            image_path = os.path.join(article_dir, "images", f"{base}-{width}.webp")
            if not os.path.isfile(image_path):
                err(f"缺图片文件: images/{base}-{width}.webp")
            elif width == "1600" and requirements.get("uniqueImagesWithinArticle"):
                with open(image_path, "rb") as image_file:
                    hashes.append(hashlib.sha256(image_file.read()).hexdigest())
    if pending:
        warn(f"共 {pending} 张配图待生成")
    if requirements.get("uniqueImagesWithinArticle"):
        if len(bases) != len(set(bases)) or len(hashes) != len(set(hashes)):
            err("封面和步骤图在同一篇文章内必须互不相同")

    # 新风格尚未替换的图片不能因为旧文件存在而被误判为可发布。
    style_pending = d.get("media", {}).get("stylePending", [])
    if not isinstance(style_pending, list) or any(not isinstance(b, str) for b in style_pending):
        err("media.stylePending 必须是待替换图片 base 的数组")
    elif style_pending:
        err(f"新风格配图仍待替换 {len(style_pending)} 张: {', '.join(style_pending)}")

    # --- 内链 / 外链 / E-E-A-T
    links = d.get("internalLinks", [])
    if len(links) < 3:
        err(f"内链 {len(links)} 条，至少 3 条")
    for link in links:
        if link["url"].startswith("/") and link["url"].strip("/").lower() == slug.lower():
            err(f"内链指向自己: {link['url']}")
    references = d.get("references", [])
    if len(references) < 3:
        err("参考文献少于 3 条，YMYL 类目（健康/运动/财务）必须有依据")
    if expanded and any(not isinstance(ref, str) or "https://" not in ref for ref in references):
        err("新稿的每条参考文献应包含 HTTPS 来源网址；可访问性仍需另行核查")
    external_links = d.get("externalLinks", [])
    external_min = requirements.get("externalLinksMin", 0)
    if isinstance(external_min, bool) or not isinstance(external_min, int) or external_min < 0:
        err("requirements.externalLinksMin 必须是非负整数")
        external_min = 0
    if not isinstance(external_links, list):
        err("externalLinks 必须是数组")
        external_links = []
    if len(external_links) < external_min:
        err(f"出站链接 {len(external_links)} 条，至少 {external_min} 条")
    for link in external_links:
        if not isinstance(link, dict):
            err("出站链接格式无效")
            continue
        try:
            parsed = urlsplit(link.get("url", ""))
            is_external = parsed.scheme == "https" and parsed.hostname and parsed.hostname.lower() not in (
                "56juqingba.com", "www.56juqingba.com") and not parsed.username and not parsed.password
        except (ValueError, TypeError):
            is_external = False
        if not link.get("label") or not is_external:
            err("出站链接必须有标签和站外 HTTPS 地址")
    if len(d.get("faq", [])) < 4:
        warn("FAQ 少于 4 条，会少一大块长尾流量")
    if len(d.get("warnings", [])) < 3 and d.get("category") in (
        "Sports and Fitness", "Health", "Cars and Other Vehicles"):
        err("安全类目必须 ≥3 条 Warnings")

    # --- 重复检测（同站已发文章与本文标题词重叠）
    known = d.get("_knownSlugs", [])
    for k in known:
        a = set(slug.lower().split("-"))
        b = set(k.lower().split("-"))
        overlap = len(a & b) / max(1, len(a | b))
        if overlap > 0.5:
            warn(f"与已有文章 {k} 标题重合度 {overlap:.0%}，注意关键词自食")

    # --- 输出
    print(f"文章: {d.get('title')}  ({os.path.basename(os.path.dirname(path))})")
    print(f"步骤: {len(steps)}  分部: {len(parts)}  词数: {words}  内链: {len(links)}  "
          f"参考文献: {len(d.get('references', []))}  FAQ: {len(d.get('faq', []))}")
    print(f"title tag: {len(tag)} 字符 | meta description: {len(desc)} 字符\n")
    for w in warnings:
        print(f"  WARN  {w}")
    for e in errors:
        print(f"  ERROR {e}")
    if not errors and not warnings:
        print("  全部通过 ✅")
    print(f"\n结果: {len(errors)} error / {len(warnings)} warning")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
