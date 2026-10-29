#!/usr/bin/env python3
"""Upload the winter article's 12 step illustrations; never create an article.

The previously uploaded cover must be present in the same local state. Each
POST is recorded as pending before transmission; a failure stops the batch and
an uncertain item cannot be automatically retried. Successful items are reused
on reruns after their media IDs, alt text and size variants are read back.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import client  # noqa: E402
import inspect_site  # noqa: E402
import upload_hero as shared  # noqa: E402


class BatchStop(shared.StopUpload):
    pass


def webp_dimensions(blob):
    """Read dimensions from VP8, VP8L or VP8X WebP headers without Pillow."""
    if len(blob) < 20 or blob[:4] != b"RIFF" or blob[8:12] != b"WEBP":
        return None
    if int.from_bytes(blob[4:8], "little") + 8 != len(blob):
        return None
    offset = 12
    while offset + 8 <= len(blob):
        name = blob[offset:offset + 4]
        size = int.from_bytes(blob[offset + 4:offset + 8], "little")
        end = offset + 8 + size
        if end > len(blob):
            return None
        chunk = blob[offset + 8:end]
        if name == b"VP8X" and len(chunk) >= 10:
            if chunk[0] & 0x02:  # Animated images are not suitable here.
                return None
            return (int.from_bytes(chunk[4:7], "little") + 1,
                    int.from_bytes(chunk[7:10], "little") + 1)
        if name == b"VP8 " and len(chunk) >= 10 and chunk[3:6] == b"\x9d\x01\x2a":
            return (int.from_bytes(chunk[6:8], "little") & 0x3fff,
                    int.from_bytes(chunk[8:10], "little") & 0x3fff)
        if name == b"VP8L" and len(chunk) >= 5 and chunk[0] == 0x2f:
            bits = int.from_bytes(chunk[1:5], "little")
            return ((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1)
        offset = end + (size & 1)
    return None


def image_item(article_dir, base, alt):
    if not inspect_site.safe_identifier(base) or not isinstance(alt, str) or not alt.strip():
        raise BatchStop("图片 base 或 alt 无效；未开始上传。")
    if len(alt) > 500 or any(ord(char) < 32 for char in alt):
        raise BatchStop(f"图片 {base} 的 alt 格式无效；未开始上传。")
    filename = f"{base}-1600.webp"
    path = article_dir / "images" / filename
    if path.is_symlink():
        raise BatchStop(f"图片 {base} 是符号链接；未开始上传。")
    try:
        blob = path.read_bytes()
    except OSError:
        raise BatchStop(f"找不到图片 {base}；未开始上传。") from None
    if len(blob) > shared.MAX_IMAGE_BYTES or webp_dimensions(blob) != (1600, 900):
        raise BatchStop(f"图片 {base} 不是合规的 1600×900 WebP；未开始上传。")
    return {"base": base, "alt": alt, "filename": filename, "blob": blob,
            "sha256": hashlib.sha256(blob).hexdigest()}


def build_manifest(article_dir):
    doc, _, _, _ = shared.local_article(article_dir)
    parts = doc.get("parts")
    if not isinstance(parts, list) or len(parts) != 3:
        raise BatchStop("冬季样稿不是预期的 3 个部分；未开始上传。")
    try:
        steps = [step for part in parts for step in part["steps"]]
        hero = doc["media"]["hero"]
        specifications = [(hero["base"], hero["alt"])] + [
            (step["image"]["base"], step["image"]["alt"]) for step in steps
        ]
    except (KeyError, TypeError):
        raise BatchStop("部分步骤缺少图片或 alt；未开始上传。") from None
    if len(steps) != 12 or len(specifications) != 13:
        raise BatchStop("冬季样稿必须有 12 个步骤、每步一张图；未开始上传。")
    bases = [base for base, _ in specifications]
    if not all(inspect_site.safe_identifier(base) for base in bases):
        raise BatchStop("图片文件名不安全；未开始上传。")
    if len(set(bases)) != 13 or bases[0] != "00-hero":
        raise BatchStop("封面和步骤图片的 base 必须各不相同；未开始上传。")
    items = [image_item(article_dir, base, alt) for base, alt in specifications]
    if len({item["sha256"] for item in items}) != 13:
        raise BatchStop("图片内容重复；未开始上传。")
    return doc, items


def validate_saved(state, items):
    images = state["images"]
    for name, entry in images.items():
        if not isinstance(entry, dict) or entry.get("status") not in ("uploaded", "pending"):
            raise BatchStop("本地上传状态存在未知记录；未开始上传。")
        if entry["status"] == "pending":
            raise BatchStop("此前有上传结果未确认；禁止自动重试，先检查媒体库并反馈。")
    uploaded, used_ids = {}, set()
    for item in items:
        previous = images.get(item["base"])
        if previous is None:
            continue
        media_id = previous.get("mediaId")
        if (previous.get("sha256") != item["sha256"]
                or previous.get("filename") != item["filename"]
                or not inspect_site.safe_identifier(media_id)
                or client._redact(media_id) != media_id):
            raise BatchStop(f"{item['base']} 与本地上传记录不一致；禁止重复上传。")
        if media_id in used_ids:
            raise BatchStop("不同图片共用同一媒体 ID；未开始上传。")
        used_ids.add(media_id)
        uploaded[item["base"]] = previous
    if "00-hero" not in uploaded:
        raise BatchStop("没有找到已上传的封面记录；请先核实封面，不上传步骤图。")
    return uploaded, used_ids


def media_list():
    status, _, text = shared.request_read("GET", "/media")
    if not 200 <= status < 300:
        raise BatchStop("媒体列表读取失败；已停止。")
    data = shared.parse_json(text, "媒体列表响应")
    items = inspect_site.list_items(data, "media")
    if items is None:
        raise BatchStop("媒体列表结构无法识别；已停止。")
    return items


def verify_item(records, item, media_id):
    matches = [record for record in records
               if isinstance(record, dict) and record.get("id") == media_id]
    if len(matches) != 1:
        raise BatchStop(f"{item['base']} 的媒体 ID 无法在当前列表唯一回读（可能分页）；已停止。")
    record = matches[0]
    if record.get("alt") != item["alt"]:
        raise BatchStop(f"{item['base']} 的 alt 不匹配；已停止，不重复上传。")
    if record.get("width") != 1600 or record.get("height") != 900:
        raise BatchStop(f"{item['base']} 的媒体尺寸不是 1600×900；已停止，不重复上传。")
    variants = record.get("variants")
    if (not isinstance(variants, dict) or not all(isinstance(variants.get(width), str) and variants[width]
                                                for width in ("960", "1600"))):
        raise BatchStop(f"{item['base']} 未回读到 960 和 1600 两种变体；已停止，不重复上传。")


def inspect_draft_filter(doc, out):
    """Read-only extra duplicate check; an empty response never proves absence."""
    try:
        status, _, text = client.request("GET", "/articles?status=DRAFT")
        data = json.loads(text) if 200 <= status < 300 else None
    except (client.ApiError, OSError, TimeoutError, ValueError):
        out("草稿筛选无法验证；列表可能分页或隐藏草稿。")
        return
    items = inspect_site.list_items(data, "articles")
    if items is None:
        out("草稿筛选结构未知；列表可能分页或隐藏草稿。")
        return
    if any(isinstance(item, dict) and isinstance(item.get("slug"), str)
           and item["slug"].strip().casefold() == doc["slug"].casefold() for item in items):
        raise BatchStop("草稿筛选结果中已有目标 slug；未上传步骤图。")
    states = sorted({item["status"] for item in items if isinstance(item, dict)
                     and isinstance(item.get("status"), str)
                     and item["status"].lower() in inspect_site.KNOWN_STATUSES})
    summary = ", ".join(states) if states else "无已识别状态"
    out(client._redact(f"草稿筛选本次返回 {len(items)} 条（{summary}）；结果可能分页或忽略筛选。"))


def check_category(doc, out):
    status, _, text = shared.request_read("GET", "/categories")
    if not 200 <= status < 300:
        raise BatchStop("分类列表读取失败；未开始上传。")
    categories = inspect_site.list_items(shared.parse_json(text, "分类列表响应"), "categories")
    if categories is None:
        raise BatchStop("分类列表结构无法识别；未开始上传。")
    name = doc.get("category")
    if not isinstance(name, str) or not name.strip():
        raise BatchStop("目标分类无效；未开始上传。")
    target = name.strip().casefold()
    matches = [category for category in categories if isinstance(category, dict)
               and isinstance(category.get("name"), str) and category["name"].strip().casefold() == target
               and inspect_site.safe_identifier(category.get("id"))]
    if len(matches) != 1:
        raise BatchStop("未能唯一匹配目标分类；未开始上传。")
    out("目标分类已匹配；分类 ID 不输出。")


def upload_one(item, state, state_path, used_ids, out):
    base = item["base"]
    state["images"][base] = {"status": "pending", "sha256": item["sha256"],
                              "filename": item["filename"]}
    shared.save_state(state_path, state)
    body, ctype = client.multipart({"alt": item["alt"]}, {"file": (item["filename"], item["blob"])})
    try:
        status, _, text = client.request("POST", "/media", raw_body=body,
                                         content_type=ctype, timeout=120)
    except client.ApiError as error:
        out(f"{base}: POST /media -> {error.status if error.status else '网络错误'}")
        shared.safe_error_details(error.body, out)
        raise BatchStop(f"{base} 的上传结果未确认；禁止自动重试。") from None
    except Exception:
        raise BatchStop(f"{base} 上传出现网络或其他异常；结果未确认，禁止自动重试。") from None
    if not 200 <= status < 300:
        out(f"{base}: POST /media -> {status}")
        shared.safe_error_details(text, out)
        raise BatchStop(f"{base} 的上传结果未确认；禁止自动重试。")
    try:
        data = json.loads(text)
    except ValueError:
        raise BatchStop(f"{base} 的上传响应不是 JSON；结果未确认，禁止自动重试。") from None
    media_id = shared.response_media_id(data)
    if not media_id or media_id in used_ids:
        raise BatchStop(f"{base} 的响应缺少新的有效媒体 ID；结果未确认，禁止自动重试。")
    state["images"][base] = {"status": "uploaded", "sha256": item["sha256"],
                              "filename": item["filename"], "mediaId": media_id}
    shared.save_state(state_path, state)
    used_ids.add(media_id)
    # The ID is persisted before the readback, so a transient GET failure never
    # causes a repeated POST on the next run.
    records = media_list()
    verify_item(records, item, media_id)
    return status, records


def run_batch(article_dir=shared.ARTICLE_DIR, out=print):
    article_dir = Path(article_dir)
    if client.base() != client.DEFAULT_BASE:
        out("真实上传仅允许默认站点 API，已停止。")
        return 1
    client.token()
    try:
        doc, items = build_manifest(article_dir)
        with shared.state_lock(article_dir):
            state_path = article_dir / shared.STATE_NAME
            state = shared.load_state(state_path, doc["slug"])
            uploaded, used_ids = validate_saved(state, items)
            remaining = [item for item in items[1:] if item["base"] not in uploaded]
            if remaining:
                records = shared.preflight(doc, remaining[0]["filename"], remaining[0]["alt"], out)
                inspect_draft_filter(doc, out)
                check_category(doc, out)
            else:
                records = media_list()
            for item in items:
                if item["base"] in uploaded:
                    verify_item(records, item, uploaded[item["base"]]["mediaId"])
            for item in remaining:
                if any(isinstance(record, dict) and record.get("originalName") == item["filename"]
                       and record.get("alt") == item["alt"] for record in records):
                    raise BatchStop(f"媒体列表已有与 {item['base']} 同名同 alt 的图片；未重复上传。")
            out(f"封面已复用并核对；已有 {12 - len(remaining)}/12 张步骤图，待上传 {len(remaining)} 张。")
            for index, item in enumerate(items[1:], 1):
                if item["base"] in uploaded:
                    continue
                if any(isinstance(record, dict) and record.get("originalName") == item["filename"]
                       and record.get("alt") == item["alt"] for record in records):
                    raise BatchStop(f"媒体列表新增了与 {item['base']} 同名同 alt 的图片；未重复上传。")
                status, records = upload_one(item, state, state_path, used_ids, out)
                out(f"步骤图 {index}/12：{item['base']} 已上传（HTTP {status}）并核对 alt、尺寸和变体。")
            # Re-read all records, including the cover, before reporting completion.
            final_records = media_list()
            for item in items:
                verify_item(final_records, item, state["images"][item["base"]]["mediaId"])
            out("13 张图片均已记录并通过媒体回读；本次没有创建或发布文章。")
            return 0
    except shared.StopUpload as error:
        out(client._redact(str(error)))
        out("此前成功上传的图片记录已保留；请反馈结果，不要盲目重试。")
        return 1


def main():
    parser = argparse.ArgumentParser(description="仅上传冬季文章步骤图；不创建文章")
    parser.add_argument("--confirm", action="store_true", help="确认会真实上传最多 12 张图片")
    args = parser.parse_args()
    if not args.confirm:
        parser.error("真实上传需要 --confirm")
    return run_batch()


if __name__ == "__main__":
    sys.exit(main())
