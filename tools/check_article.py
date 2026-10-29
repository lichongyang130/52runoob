#!/usr/bin/env python3
"""
check_article.py — 发布前自动体检（每条规则对应一个真实排名/体验风险）

用法:
    python3 tools/check_article.py content/Keep-Running-Through-Winter/article.json

退出码 0 = 全部通过（可能有 warning），1 = 有 error，必须修。
"""
import json
import os
import re
import sys

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
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    article_dir = os.path.dirname(os.path.abspath(path))
    slug = d.get("slug", "")
    parts = d.get("parts", [])
    steps = [s for p in parts for s in p["steps"]]

    # --- 结构
    if not 9 <= len(steps) <= 14:
        err(f"步骤数 {len(steps)}，应在 {STEP_MIN}-{STEP_MAX}（Howly 版式经验值 12）")
    if not 2 <= len(parts) <= 4:
        err(f"分部数 {len(parts)}，应为 2-4")

    # --- 词数
    blobs = [d.get("intro", ""), d.get("deck", "")]
    for s in steps:
        blobs += [s["title"], s["body"], s.get("tip", "")]
    blobs += d.get("tips", []) + d.get("warnings", [])
    for q in d.get("faq", []):
        blobs += [q["q"], q["a"]]
    words = len(" ".join(blobs).split())
    if not WORD_MIN <= words <= WORD_MAX:
        warn(f"正文 {words} 词，理想区间 {WORD_MIN}-{WORD_MAX}")

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

    # --- 图片
    pending = 0
    hero_base = d.get("media", {}).get("hero", {}).get("base")
    for base in [hero_base] + [s["image"]["base"] for s in steps if s.get("image")]:
        if not base:
            continue
        for w in ("960", "1600"):
            p = os.path.join(article_dir, "images", f"{base}-{w}.webp")
            if not os.path.exists(p):
                err(f"缺图片文件: images/{base}-{w}.webp")
    for s in steps:
        if not s.get("image"):
            pending += 1
            if not s.get("imageTodo"):
                warn(f"Step「{s['title']}」无配图（上线前需补齐）")
    if pending:
        warn(f"共 {pending} 张配图待生成")

    # --- 内链 / 外链 / E-E-A-T
    links = d.get("internalLinks", [])
    if len(links) < 3:
        err(f"内链 {len(links)} 条，至少 3 条")
    for link in links:
        if link["url"].startswith("/") and link["url"].strip("/").lower() == slug.lower():
            err(f"内链指向自己: {link['url']}")
    if len(d.get("references", [])) < 3:
        err("参考文献少于 3 条，YMYL 类目（健康/运动/财务）必须有依据")
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
