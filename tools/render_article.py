#!/usr/bin/env python3
"""
render_article.py — 单一内容源 JSON -> Markdown + 可预览 HTML

用法:
    python3 tools/render_article.py content/Keep-Running-Through-Winter/article.json
    python3 tools/render_article.py content/Keep-Running-Through-Winter/article.json --out-preview preview

产出:
    <article_dir>/article.md                 给人工/Slack/邮件审稿用
    <article_dir>/import-payload.json        给 CMS 导入接口用（含 html 正文）
    <out-preview>/<slug>.html                本地预览页（仿站内版式）
"""
import argparse
import html
import json
import os
import re
import sys

IMG_WIDTHS = ("960", "1600")


# ---------------------------------------------------------------- helpers
def esc(text):
    return html.escape(text or "", quote=True)


def is_pending(step):
    return not step.get("image")


def img_path(article_dir, base, width):
    return os.path.join(article_dir, "images", f"{base}-{width}.webp")


def picture(rel_prefix, base, alt, cls=""):
    """Responsive <picture> with the two webp widths the site uses."""
    src960 = f"{rel_prefix}{base}-960.webp"
    src1600 = f"{rel_prefix}{base}-1600.webp"
    return (
        f'<img class="{cls}" src="{esc(src960)}" '
        f'srcset="{esc(src960)} 960w, {esc(src1600)} 1600w" '
        f'sizes="(min-width: 900px) 760px, 100vw" '
        f'alt="{esc(alt)}" width="960" height="540" loading="lazy" decoding="async">'
    )


def pending_placeholder(step_no):
    return (
        '<div class="img-pending" role="img" aria-label="Image pending">'
        f"<span>Step {step_no} image pending<br><small>generate in next batch &rarr; "
        f"images/raw/{step_no:02d}-*.png</small></span></div>"
    )


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


# ---------------------------------------------------------------- markdown
def render_markdown(doc):
    L = []
    L.append(f"# {doc['title']}\n")
    L.append(f"*{doc['deck']}*\n")
    L.append(f"**Category:** {doc['category']}  ")
    L.append(f"**Slug:** `{doc['url']}`  ")
    L.append(f"**Primary keyword:** {doc['seo']['primaryKeyword']}  ")
    L.append(f"**Meta description:** {doc['seo']['metaDescription']}\n")
    L.append("---\n")
    L.append("## Intro\n")
    L.append(f"{doc['intro']}\n")
    L.append(f"![{doc['media']['hero']['alt']}](images/{doc['media']['hero']['base']}-1600.webp)\n")

    n = 0
    for pi, part in enumerate(doc["parts"], start=1):
        L.append(f"## Part {pi} of {len(doc['parts'])} — {part['title']}\n")
        for step in part["steps"]:
            n += 1
            L.append(f"### Step {n} — {step['title']}\n")
            if is_pending(step):
                L.append(f"> IMAGE PENDING for step {n}\n")
            else:
                L.append(f"![{step['image']['alt']}](images/{step['image']['base']}-960.webp)\n")
            L.append(f"{step['body']}\n")
            if step.get("tip"):
                L.append(f"**Tip:** {step['tip']}\n")

    L.append("## Tips\n")
    L.extend(f"- {t}" for t in doc["tips"])
    L.append("")
    L.append("## Warnings\n")
    L.extend(f"- {w}" for w in doc["warnings"])
    L.append("")
    L.append("## Community Q&A\n")
    for item in doc["faq"]:
        L.append(f"**{item['q']}**\n")
        L.append(f"{item['a']}\n")
    L.append("## References\n")
    for i, ref in enumerate(doc["references"], start=1):
        L.append(f"{i}. {ref}")
    L.append("")
    L.append("## Internal links\n")
    for link in doc["internalLinks"]:
        L.append(f"- [{link['label']}](https://www.56juqingba.com{link['url']})")
    L.append("")
    return "\n".join(L)


# ---------------------------------------------------------------- html body
def render_html_body(doc, rel_prefix):
    H = []
    H.append('<div class="article-body">')
    H.append(f'<p class="lede">{esc(doc["intro"])}</p>')

    n = 0
    for pi, part in enumerate(doc["parts"], start=1):
        H.append(f'<section class="method" id="method-{pi}">')
        H.append(
            f'<p class="method-kicker">Part {pi} of {len(doc["parts"])}</p>'
            f'<h2 class="method-title">{esc(part["title"])}</h2>'
        )
        for step in part["steps"]:
            n += 1
            H.append(f'<article class="step" id="step-{n}">')
            if is_pending(step):
                H.append(pending_placeholder(n))
            else:
                H.append(picture(rel_prefix, step["image"]["base"], step["image"]["alt"], "step-img"))
            H.append(f'<p class="step-count">Step {n} of {sum(len(p["steps"]) for p in doc["parts"])}</p>')
            H.append(f'<h3>{esc(step["title"])}</h3>')
            H.append(f"<p>{esc(step['body'])}</p>")
            if step.get("tip"):
                H.append(f'<p class="tip"><strong>Tip:</strong> {esc(step["tip"])}</p>')
            H.append("</article>")
        H.append("</section>")

    for title, key, cls in (("Tips", "tips", "tips"), ("Warnings", "warnings", "warnings")):
        H.append(f'<section class="box {cls}"><h2>{title}</h2><ul>')
        H.extend(f"<li>{esc(x)}</li>" for x in doc[key])
        H.append("</ul></section>")

    H.append('<section class="faq"><h2>Community Q&amp;A</h2>')
    for item in doc["faq"]:
        H.append(
            f"<details><summary>{esc(item['q'])}<span>+</span></summary>"
            f"<p>{esc(item['a'])}</p></details>"
        )
    H.append("</section>")

    H.append('<section class="refs"><h2>References</h2><ol>')
    H.extend(f"<li>{esc(x)}</li>" for x in doc["references"])
    H.append("</ol></section>")

    H.append('<section class="related"><h2>Related on Howly</h2><ul>')
    for link in doc["internalLinks"]:
        H.append(f'<li><a href="{esc(link["url"])}">{esc(link["label"])}</a></li>')
    H.append("</ul></section>")
    H.append("</div>")
    return "\n".join(H)


CSS = """
:root{--ink:#101418;--muted:#5b6470;--line:#e3e6ea;--bg:#fff;--soft:#f7f8f7;--accent:#2f6f5e;}
*{box-sizing:border-box}
body{margin:0;background:var(--soft);color:var(--ink);
 font:17px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Georgia,"Times New Roman",serif}
a{color:var(--accent)}
.topbar{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
.topbar-in{max-width:1080px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:18px}
.logo{font:700 26px/1 Georgia,serif;letter-spacing:-.5px;color:#1d4d43;text-decoration:none}
.logo span{color:#e0873a}
.search{margin-left:auto;display:flex;gap:8px;align-items:center;color:var(--muted);font-size:14px}
.search input{width:230px;padding:9px 12px;border:1px solid var(--line);border-radius:999px;font:inherit;font-size:14px}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.crumbs{font-size:13px;color:var(--muted);padding:18px 0 0}
.crumbs a{color:var(--muted);text-decoration:none}
article.page{background:#fff;border:1px solid var(--line);border-radius:6px;margin:14px 0 40px;overflow:hidden}
.page-head{padding:30px 44px 0}
h1{font:700 40px/1.15 Georgia,"Times New Roman",serif;margin:0 0 14px;letter-spacing:-.6px}
.dek{font-size:19px;color:#39414b;margin:0 0 22px}
.meta{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--muted);border-top:1px solid var(--line);padding:14px 0}
.hero{display:block;width:100%;height:auto}
.hero-cap{font-size:12.5px;color:var(--muted);padding:8px 44px 0;font-style:italic}
.article-body{padding:8px 44px 40px;max-width:800px}
.lede{font-size:19.5px;line-height:1.6;color:#232a32}
.method{margin:46px 0 0;padding-top:8px;border-top:2px solid var(--ink)}
.method-kicker{font:600 12px/1 -apple-system,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin:16px 0 6px}
.method-title{font:700 27px/1.25 Georgia,serif;margin:0 0 8px}
.step{margin:34px 0 0}
.step-img,.img-pending{width:100%;height:auto;border-radius:4px;display:block;background:#eceeed}
.img-pending{aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;
 border:1.5px dashed #c3c9ce;color:#8b949c;text-align:center;font:14px/1.5 -apple-system,sans-serif}
.step-count{font:600 11.5px/1 -apple-system,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:16px 0 4px}
.step h3{font:700 22px/1.3 Georgia,serif;margin:0 0 8px}
.tip{background:#f2f7f4;border-left:3px solid var(--accent);padding:12px 16px;border-radius:0 4px 4px 0;font-size:16px}
.box{margin:40px 0 0;padding:20px 24px;border-radius:6px;background:#fafafa;border:1px solid var(--line)}
.box h2{font:700 18px/1.3 -apple-system,sans-serif;margin:0 0 10px;letter-spacing:-.2px}
.box ul{margin:0;padding-left:20px}.box li{margin:7px 0}
.box.warnings{background:#fdf6f3;border-color:#f0dcd2}
.faq{margin:44px 0 0}
.faq h2,.refs h2,.related h2{font:700 22px/1.3 Georgia,serif;margin:0 0 10px}
details{border-bottom:1px solid var(--line);padding:12px 0}
summary{cursor:pointer;font-weight:600;font-family:-apple-system,sans-serif;font-size:16px;
 display:flex;justify-content:space-between;gap:12px;list-style:none}
summary::-webkit-details-marker{display:none}
summary span{color:var(--muted)}
details p{margin:10px 0 2px;color:#3b434c}
.refs ol{font-size:15px;color:#3b434c;padding-left:20px}
.refs li{margin:7px 0}
.related ul{font-family:-apple-system,sans-serif;font-size:16px}
.authorbox{display:flex;gap:14px;align-items:center;border-top:1px solid var(--line);padding:22px 44px;background:#fcfcfb}
.avatar{width:44px;height:44px;border-radius:50%;background:#dbe6e1;color:#2f6f5e;display:grid;place-items:center;font-weight:700}
.authorbox p{margin:0;font-size:14px;color:var(--muted);font-family:-apple-system,sans-serif}
.authorbox strong{color:var(--ink)}
.note{font-size:12.5px;color:var(--muted);padding:0 44px 18px;font-family:-apple-system,sans-serif}
@media(max-width:720px){.page-head,.article-body,.authorbox,.note,.hero-cap{padding-left:20px;padding-right:20px}
 h1{font-size:29px}.search input{width:120px}}
"""


def render_preview(doc, body_html, hero_rel):
    steps = sum(len(p["steps"]) for p in doc["parts"])
    imgs = 1 + sum(1 for p in doc["parts"] for s in p["steps"] if s.get("image"))
    pending = sum(1 for p in doc["parts"] for s in p["steps"] if not s.get("image"))
    cap = f"{len(doc['parts'])} methods &middot; {steps} steps &middot; {imgs} illustrations"
    if pending:
        cap += f" ({pending} pending)"
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(doc['seo']['titleTag'])}</title>
<meta name="description" content="{esc(doc['seo']['metaDescription'])}">
<style>{CSS}</style>
</head>
<body>
<header class="topbar"><div class="topbar-in">
  <a class="logo" href="/">Howly<span>.</span></a>
  <div class="search"><input placeholder="Search guides" aria-label="Search guides"><span>Search</span></div>
</div></header>
<div class="wrap"><div class="crumbs">
  <a href="/">Howly</a> &rsaquo; <a href="{esc(doc['categoryUrl'])}">{esc(doc['category'])}</a> &rsaquo; {esc(doc['title'])}
</div></div>
<main class="wrap"><article class="page">
  <div class="page-head">
    <h1>{esc(doc['h1'])}</h1>
    <p class="dek">{esc(doc['deck'])}</p>
    <div class="meta">
      <span><strong>How to</strong></span>
      <span>{cap}</span>
      <span>Updated {esc(doc['publishing']['dateModified'])}</span>
      <span>{doc['publishing']['readingTimeMinutes']} min read</span>
    </div>
  </div>
  <img class="hero" src="{esc(hero_rel)}-1600.webp" alt="{esc(doc['media']['hero']['alt'])}" width="1600" height="900">
  <p class="hero-cap">{esc(doc['media']['hero']['alt'])}</p>
  {body_html}
  <div class="authorbox">
    <div class="avatar">SA</div>
    <p><strong>Written by {esc(doc['publishing']['author'])}</strong><br>
    A subject-matter reviewer checked the steps before publication. Last updated {esc(doc['publishing']['dateModified'])}.</p>
  </div>
  <p class="note">Preview built from article.json &mdash; do not edit this file by hand.</p>
</article></main>
</body></html>"""


# ---------------------------------------------------------------- payload
def render_payload(doc, body_html):
    return {
        "schema": doc["schema"],
        "slug": doc["slug"],
        "title": doc["title"],
        "htmlTitle": doc["seo"]["titleTag"],
        "metaDescription": doc["seo"]["metaDescription"],
        "category": doc["category"],
        "excerpt": doc["deck"],
        "heroImage": f"/uploads/{{yyyy}}/{{mm}}/{doc['media']['hero']['base']}-1600.webp",
        "bodyHtml": body_html,
        "tips": doc["tips"],
        "warnings": doc["warnings"],
        "faq": doc["faq"],
        "references": doc["references"],
        "author": doc["publishing"]["author"],
        "datePublished": doc["publishing"]["datePublished"],
        "dateModified": doc["publishing"]["dateModified"],
        "status": "draft",
    }


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json_file")
    ap.add_argument("--out-preview", default="preview")
    args = ap.parse_args()

    path = os.path.abspath(args.json_file)
    article_dir = os.path.dirname(path)
    with open(path, encoding="utf-8") as f:
        doc = json.load(f)

    # word count over everything a reader sees
    text_blobs = [doc["intro"], doc["deck"]]
    for p in doc["parts"]:
        for s in p["steps"]:
            text_blobs += [s["title"], s["body"], s.get("tip", "")]
    text_blobs += doc["tips"] + doc["warnings"]
    for f_ in doc["faq"]:
        text_blobs += [f_["q"], f_["a"]]
    words = len(" ".join(text_blobs).split())

    md = render_markdown(doc)
    with open(os.path.join(article_dir, "article.md"), "w", encoding="utf-8") as f:
        f.write(md)

    body_html = render_html_body(doc, "../content/" + doc["slug"] + "/images/")
    payload = render_payload(doc, body_html)
    with open(os.path.join(article_dir, "import-payload.json"), "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    os.makedirs(args.out_preview, exist_ok=True)
    prev_path = os.path.join(args.out_preview, f"{doc['slug']}.html")
    hero_rel = "../content/" + doc["slug"] + "/images/" + doc["media"]["hero"]["base"]
    with open(prev_path, "w", encoding="utf-8") as f:
        f.write(render_preview(doc, body_html, hero_rel))

    print(f"article.md         -> {article_dir}/article.md")
    print(f"import-payload.json-> {article_dir}/import-payload.json")
    print(f"preview            -> {prev_path}")
    print(f"word count         -> {words}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
