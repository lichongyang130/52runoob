#!/usr/bin/env python3
"""Read-only inspection of the site's article and media API.

Only GET and OPTIONS requests are made. Output contains HTTP statuses, method
names, JSON field names/types, recognized article status enums, and a limited
duplicate-check summary. It never prints article text, other response values,
error bodies, or the bearer token. GET shapes do not establish the write contract.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
import re
import sys
from urllib.parse import quote

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import client  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
TARGET_FILE = ROOT / "content/Keep-Running-Through-Winter/article.json"
REFERENCE_SLUG = "Start-Running-When-You-Hate-Running"
IDENTIFIER = re.compile(r"[A-Za-z0-9_-]{1,200}\Z")
METHODS = {"GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"}
KNOWN_STATUSES = {"published", "draft", "unpublished", "archived", "scheduled", "pending", "review"}


def json_structure(value, depth=0):
    """Show field names and types, including JSON stored inside strings, not values."""
    if depth >= 12:
        return type(value).__name__
    if isinstance(value, dict):
        # Redact before JSON encoding: a token containing quotes or backslashes
        # would otherwise be escaped and no longer match the raw token.
        return {client._redact(str(k)): json_structure(v, depth + 1)
                for k, v in list(value.items())[:50]}
    if isinstance(value, list):
        return [json_structure(value[0], depth + 1)] if value else []
    if isinstance(value, str):
        text = value.strip()
        if len(text) <= 1_000_000 and text.startswith(("{", "[")):
            try:
                decoded = json.loads(text)
            except (ValueError, RecursionError):
                pass
            else:
                if isinstance(decoded, (dict, list)):
                    return {"JSON 字符串": json_structure(decoded, depth + 1)}
        return "str"
    if value is None:
        return "null"
    return type(value).__name__


def list_items(data, name):
    if isinstance(data, list):
        return data
    if not isinstance(data, dict):
        return None
    candidates = (data.get(name), data.get("data"))
    for value in candidates:
        if isinstance(value, list):
            return value
        if isinstance(value, dict) and isinstance(value.get(name), list):
            return value[name]
    return None


def safe_identifier(value):
    return isinstance(value, str) and IDENTIFIER.fullmatch(value) is not None


def show_structure(data, out):
    if data is None:
        out("  响应不是 JSON 或为空，不输出原文。")
        return
    # Redact before truncating so a token cannot be partially exposed at the cutoff.
    rendered = client._redact(json.dumps(json_structure(data), ensure_ascii=False))
    out("  JSON 字段与类型: " + rendered[:16000])
    if len(rendered) > 16000:
        out("  （字段结构已截断）")


def read_request(method, path, label, out):
    """Return (status, headers, parsed JSON), without showing server response values."""
    if method not in ("GET", "OPTIONS"):
        raise ValueError("只允许 GET 和 OPTIONS。")
    try:
        status, headers, body = client.request(method, path)
    except client.ApiError as exc:
        # The error body and URL can contain private information; never print either.
        status, headers, body = exc.status, {}, ""
    out(f"  {label} -> {status if status else '网络错误'}")
    if 300 <= status < 400:
        out("  重定向未完成；客户端不会向其他来源发送密钥。")
    data = None
    if 200 <= status < 300 and body:
        try:
            data = json.loads(body)
        except (ValueError, RecursionError):
            pass
    return status, headers, data


def show_allowed(headers, out):
    # Only expose standard methods/media types, never arbitrary header values.
    safe_types = {"application/json", "application/octet-stream", "multipart/form-data",
                  "image/webp", "image/jpeg", "image/png"}
    for name, value in headers.items():
        header = name.lower()
        if header in ("allow", "access-control-allow-methods"):
            names = [part.strip().upper() for part in str(value).split(",")]
            names = [method for method in names if method in METHODS]
            if names:
                out("  允许的方法（若服务器提供）: " + ", ".join(names))
        elif header in ("accept-post", "accept-patch"):
            types = [part.split(";", 1)[0].strip().lower() for part in str(value).split(",")]
            types = [media_type for media_type in types if media_type in safe_types]
            if types:
                out("  声明的写入内容类型: " + ", ".join(types))


def inspect(out=print, target_file=TARGET_FILE):
    doc = json.loads(Path(target_file).read_text(encoding="utf-8"))
    target = doc.get("slug")
    if not safe_identifier(target):
        raise SystemExit("本地稿件 slug 格式无效，已停止探测。")
    category = str(doc.get("category", "")).strip().casefold()
    out("只读检查（GET / OPTIONS）；不会上传图片、创建或修改文章。")

    # OPTIONS is read-only; a 200/204 with Allow may identify a write route,
    # but never establishes its required fields or authorizes a POST.
    for path in ("/articles", "/media", "/media/upload", "/upload"):
        _, headers, _ = read_request("OPTIONS", path, f"OPTIONS {path}", out)
        show_allowed(headers, out)

    status, _, articles = read_request("GET", "/articles", "GET /articles", out)
    if not 200 <= status < 300:
        out("无法读取文章列表；请检查连接或密钥权限。未执行写入。")
        return 1
    show_structure(articles, out)
    items = list_items(articles, "articles")
    sample_id = None
    if items is None:
        out("  无法识别文章列表；不能据此查重。")
    else:
        entries = [item for item in items if isinstance(item, dict)]
        found = [item for item in entries if isinstance(item.get("slug"), str)
                 and item["slug"].strip().casefold() == target.casefold()]
        out(f"  本次返回条目: {len(items)}；目标 slug 在本次列表中{'存在' if found else '未发现'}。")
        out("  列表可能分页或不含草稿；未发现不等于站内不存在。")
        statuses = sorted({item["status"] for item in entries
                           if isinstance(item.get("status"), str)
                           and item["status"].lower() in KNOWN_STATUSES})
        if statuses:
            out("  已识别的状态枚举: " + client._redact(", ".join(statuses)))
        target_statuses = sorted({item["status"] for item in found
                                  if isinstance(item.get("status"), str)
                                  and item["status"].lower() in KNOWN_STATUSES})
        if target_statuses:
            out("  目标状态（本次列表）: " + client._redact(", ".join(target_statuses)))
        # Prefer a known public sample; otherwise use a published entry, then any
        # entry. Only its schema is printed, even when the list contains drafts.
        reference = next((item for item in entries if item.get("slug") == REFERENCE_SLUG), None)
        if reference is None:
            reference = next((item for item in entries
                              if str(item.get("status", "")).lower() == "published"), None)
        if reference is None and entries:
            reference = entries[0]
        if reference is not None and safe_identifier(reference.get("id")):
            sample_id = reference["id"]

    reference_status, _, reference = read_request(
        "GET", "/articles/" + quote(REFERENCE_SLUG, safe=""),
        "GET /articles/<公开样本 slug>", out)
    if 200 <= reference_status < 300:
        show_structure(reference, out)
    if sample_id:
        sample_path = "/articles/" + quote(sample_id, safe="")
        _, headers, _ = read_request("OPTIONS", sample_path, "OPTIONS /articles/<样本 id>", out)
        show_allowed(headers, out)
        status, _, detail = read_request("GET", sample_path, "GET /articles/<样本 id>", out)
        if 200 <= status < 300:
            show_structure(detail, out)
    else:
        out("  列表未提供可用样本 id，跳过按 id 读取。")

    target_status, _, target_data = read_request(
        "GET", "/articles/" + quote(target, safe=""), "GET /articles/<目标 slug>", out)
    if 200 <= target_status < 300:
        out("  目标路径返回成功；创建前必须核实是否已有文章。")
        show_structure(target_data, out)
    elif target_status == 404:
        out("  目标路径返回 404；该接口可能只接受 id，不能单凭此结果判定不存在。")

    status, _, media = read_request("GET", "/media", "GET /media", out)
    if 200 <= status < 300:
        show_structure(media, out)
        media_items = list_items(media, "media")
        first = next((item for item in (media_items or [])
                      if isinstance(item, dict) and safe_identifier(item.get("id"))), None)
        if first:
            status, _, detail = read_request("GET", "/media/" + quote(first["id"], safe=""),
                                             "GET /media/<样本 id>", out)
            if 200 <= status < 300:
                show_structure(detail, out)

    status, _, categories = read_request("GET", "/categories", "GET /categories", out)
    if 200 <= status < 300:
        show_structure(categories, out)
        category_items = list_items(categories, "categories")
        if category_items is not None:
            matches = [item for item in category_items if isinstance(item, dict)
                       and isinstance(item.get("name"), str)
                       and item["name"].strip().casefold() == category]
            out(f"  目标分类在本次列表中的匹配数量: {len(matches)}（列表可能分页）。")

    out("检查完成。读取成功不代表图片上传或文章创建的请求格式已确认。")
    return 0


if __name__ == "__main__":
    sys.exit(inspect())
