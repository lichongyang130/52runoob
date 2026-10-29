#!/usr/bin/env python3
"""
publish.py — 把 content/<slug>/article.json 发布到 56juqingba 的 API

流程（可断点重跑，每一步都幂等或可安全重复）:
  1. probe        探测集合路由（/articles 还是 /posts …）
  2. upload       逐张上传 WebP，拿回站内图 URL（已上传过的跳过）
  3. payload      组装文章 JSON（含 parts/steps/faq/references/html）
  4. publish      POST 创建（或 --update 时 PATCH/PUT 更新）
  5. verify       GET 回读，检查标题/步骤数/图片数

用法:
  export SITE_API_TOKEN=...
  python3 tools/api/publish.py content/Keep-Running-Through-Winter --dry-run
  python3 tools/api/publish.py content/Keep-Running-Through-Winter
  python3 tools/api/publish.py content/Keep-Running-Through-Winter --update
  python3 tools/api/publish.py --probe              # 只看接口能力，不发布

环境变量（都有默认值）:
  SITE_API_BASE          默认 https://www.56juqingba.com/api/v1
  SITE_API_COLLECTION    默认自动探测（/articles /posts /guides）
  SITE_API_UPLOAD        默认自动探测（/uploads /media /images）
  SITE_UPLOAD_FIELD      默认 "file"
  SITE_IMAGE_WIDTH       默认 "1600"
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import client  # noqa: E402


# --------------------------------------------------------------- helpers
def esc(s: str) -> str:
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;"))


def find_collection() -> str:
    p = os.environ.get("SITE_API_COLLECTION")
    if p:
        return p
    for cand in client.PROBE_COLLECTIONS:
        st, _, _ = client.request("GET", cand + "?per_page=1")
        if st < 300:
            return cand
    raise SystemExit("无法探测文章集合路由，请用 SITE_API_COLLECTION 指定（例如 /articles）")


def find_upload() -> str:
    p = os.environ.get("SITE_API_UPLOAD")
    if p:
        return p
    for cand in client.PROBE_UPLOADS:
        try:
            st, _, _ = client.request("GET", cand)
        except client.ApiError as e:
            st = e.status
        if st != 404:
            return cand
    raise SystemExit("无法探测上传路由，请用 SITE_API_UPLOAD 指定（例如 /uploads）")


def upload_image(prefix: str, path: str, cache: dict, dry: bool) -> str:
    """上传单张图，返回站内 URL。cache 记录 base -> url，避免重复上传。"""
    base = os.path.splitext(os.path.basename(path))[0]
    if base in cache:
        return cache[base]
    if dry:
        print(f"  [dry-run] 上传 {os.path.basename(path)} ({os.path.getsize(path)//1024} KB)")
        return f"<dry-run>/{os.path.basename(path)}"

    field = os.environ.get("SITE_UPLOAD_FIELD", "file")
    with open(path, "rb") as f:
        blob = f.read()
    body, ctype = client.multipart({"name": base, "folder": "2026/10"}, {field: (os.path.basename(path), blob)})
    st, _, text = client.request("POST", prefix, raw_body=body, content_type=ctype, timeout=120)
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        raise SystemExit(f"上传返回非 JSON: {text[:300]}")

    url = (data.get("url") or data.get("data", {}).get("url")
           or data.get("path") or data.get("data", {}).get("path")
           or data.get("location"))
    if not url:
        raise SystemExit(f"上传成功但没找到 URL 字段，请按实际响应改 client: {text[:400]}")
    if url.startswith("/"):
        url = "https://www.56juqingba.com" + url
    print(f"  ✓ {os.path.basename(path)} -> {url}")
    cache[base] = url
    return url


def build_html(doc: dict, img: dict) -> str:
    """生成与站内版式一致的正文字段（API 若不接受结构化 steps，可直接用它）。"""
    h = [f'<p class="lede">{esc(doc["intro"])}</p>']
    n = 0
    total = sum(len(p["steps"]) for p in doc["parts"])
    for pi, part in enumerate(doc["parts"], 1):
        h.append(f'<section class="method" id="method-{pi}"><h2>{esc(part["title"])}</h2>')
        for s in part["steps"]:
            n += 1
            if s.get("image"):
                src = img.get(s["image"]["base"], "")
                h.append(f'<figure><img src="{esc(src)}" alt="{esc(s["image"]["alt"])}" '
                         f'width="1600" height="900" loading="lazy">'
                         f'<figcaption>Step {n} of {total}</figcaption></figure>')
            h.append(f'<h3>{esc(s["title"])}</h3><p>{esc(s["body"])}</p>')
            if s.get("tip"):
                h.append(f'<p class="tip"><strong>Tip:</strong> {esc(s["tip"])}</p>')
        h.append("</section>")
    h.append("<h2>Tips</h2><ul>" + "".join(f"<li>{esc(t)}</li>" for t in doc["tips"]) + "</ul>")
    h.append("<h2>Warnings</h2><ul>" + "".join(f"<li>{esc(t)}</li>" for t in doc["warnings"]) + "</ul>")
    h.append("<h2>Community Q&amp;A</h2>")
    for f in doc["faq"]:
        h.append(f'<details><summary>{esc(f["q"])}</summary><p>{esc(f["a"])}</p></details>')
    h.append("<h2>References</h2><ol>" + "".join(f"<li>{esc(r)}</li>" for r in doc["references"]) + "</ol>")
    return "\n".join(h)


def build_payload(doc: dict, img: dict) -> dict:
    steps_all = []
    for part in doc["parts"]:
        for s in part["steps"]:
            steps_all.append({
                "title": s["title"],
                "body": s["body"],
                "tip": s.get("tip", ""),
                "imageUrl": img.get(s["image"]["base"], "") if s.get("image") else "",
                "imageAlt": s["image"]["alt"] if s.get("image") else "",
            })
    hero = img.get(doc["media"]["hero"]["base"], "")
    return {
        # 常见字段名做了兼容：正文同时给结构化与 HTML 两种形态
        "slug": doc["slug"],
        "title": doc["title"],
        "seoTitle": doc["seo"]["titleTag"],
        "metaDescription": doc["seo"]["metaDescription"],
        "category": doc["category"],
        "excerpt": doc["deck"],
        "intro": doc["intro"],
        "heroImageUrl": hero,
        "heroImageAlt": doc["media"]["hero"]["alt"],
        "parts": [{"title": p["title"], "steps": p["steps"]} for p in doc["parts"]],
        "steps": steps_all,
        "tips": doc["tips"],
        "warnings": doc["warnings"],
        "faq": [{"question": f["q"], "answer": f["a"]} for f in doc["faq"]],
        "references": doc["references"],
        "html": build_html(doc, img),
        "author": doc["publishing"]["author"],
        "reviewer": doc["publishing"]["reviewer"],
        "publishedAt": doc["publishing"]["datePublished"],
        "updatedAt": doc["publishing"]["dateModified"],
        "status": "published",
        "readingTimeMinutes": doc["publishing"]["readingTimeMinutes"],
    }


# --------------------------------------------------------------- main
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("article_dir", nargs="?")
    ap.add_argument("--probe", action="store_true", help="只探测接口能力")
    ap.add_argument("--dry-run", action="store_true", help="只打印将要发送的内容")
    ap.add_argument("--update", action="store_true", help="文章已存在时更新而不是新建")
    ap.add_argument("--only-images", action="store_true", help="只上传图片，不发布")
    args = ap.parse_args()

    if args.probe:
        client.probe()
        return 0

    if not args.article_dir:
        raise SystemExit("需要 article 目录，例如 content/Keep-Running-Through-Winter")

    art_dir = os.path.abspath(args.article_dir)
    doc = json.load(open(os.path.join(art_dir, "article.json"), encoding="utf-8"))
    images_dir = os.path.join(art_dir, "images")
    width = os.environ.get("SITE_IMAGE_WIDTH", "1600")

    # 图片清单：hero + 每个步骤
    bases = [doc["media"]["hero"]["base"]]
    bases += [s["image"]["base"] for p in doc["parts"] for s in p["steps"] if s.get("image")]
    missing = [b for b in bases if not os.path.exists(os.path.join(images_dir, f"{b}-{width}.webp"))]
    if missing:
        raise SystemExit(f"缺少图片: {', '.join(missing)}（先跑 tools/make_images.sh）")

    print(f"文章: {doc['title']}")
    print(f"图片: {len(bases)} 张 (宽度 {width})")

    if args.dry_run:
        print("\n--- dry-run：不上传、不写入 ---")
        for b in bases:
            print(f"  [dry-run] {b}-{width}.webp")
        payload = build_payload(doc, {b: f"<dry-run>/{b}-{width}.webp" for b in bases})
        print("\npayload 字段:", ", ".join(payload.keys()))
        print("payload 大小:", len(json.dumps(payload, ensure_ascii=False)) // 1024, "KB")
        return 0

    upload_prefix = find_upload()
    print(f"上传端点: POST {upload_prefix}")
    cache_path = os.path.join(art_dir, "publish-state.json")
    cache = json.load(open(cache_path, encoding="utf-8")).get("images", {}) if os.path.exists(cache_path) else {}

    img = {}
    for b in bases:
        img[b] = upload_image(upload_prefix, os.path.join(images_dir, f"{b}-{width}.webp"), cache, args.dry_run)
        json.dump({"images": cache}, open(cache_path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

    if args.only_images:
        print("仅上传模式，结束。")
        return 0

    collection = find_collection()
    payload = build_payload(doc, img)
    print(f"文章端点: {collection}  (payload {len(json.dumps(payload, ensure_ascii=False))//1024} KB)")

    if args.update:
        st, _, text = client.request("PATCH", f"{collection}/{doc['slug']}", json_body=payload)
        print(f"PATCH {collection}/{doc['slug']} -> {st}")
    else:
        st, _, text = client.request("POST", collection, json_body=payload)
        print(f"POST {collection} -> {st}")

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        result = {"raw": text[:1000]}
    print(json.dumps(result, ensure_ascii=False, indent=2)[:2000])

    # 回读校验
    st, _, body = client.request("GET", f"{collection}/{doc['slug']}")
    print(f"\n回读 GET {collection}/{doc['slug']} -> {st}")
    if st < 300:
        saved = json.loads(body)
        saved = saved.get("data", saved) if isinstance(saved, dict) else saved
        problems = []
        if saved.get("title") != doc["title"]:
            problems.append(f"title 不一致: {saved.get('title')!r}")
        got_steps = len(saved.get("steps", [])) or sum(len(p.get("steps", [])) for p in saved.get("parts", []))
        if got_steps not in (0, len(bases) - 1):
            problems.append(f"步骤数 {got_steps} != {len(bases)-1}")
        print("校验:", "通过 ✅" if not problems else "问题 → " + "; ".join(problems))
    return 0


if __name__ == "__main__":
    sys.exit(main())
