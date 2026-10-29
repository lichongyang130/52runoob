#!/usr/bin/env python3
"""Upload ONLY the real winter article's cover as a controlled API test.

This performs one POST /media; it never creates or updates an article. A local,
ignored attempt record is written *before* the POST. An ambiguous result blocks
further uploads until reconciled, and an acknowledged media ID is never uploaded
again. No API key or server response body is persisted in the attempt record.
"""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from urllib.parse import quote

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import client  # noqa: E402
import inspect_site  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
ARTICLE_DIR = ROOT / "content/Keep-Running-Through-Winter"
STATE_NAME = ".publish-state-local.json"
LOCK_NAME = ".publish-state-local.lock"
STATE_SCHEMA = "howly-local-upload/v1"
MAX_IMAGE_BYTES = 200_000


class StopUpload(Exception):
    pass


@contextmanager
def state_lock(article_dir):
    path = article_dir / LOCK_NAME
    flags = os.O_CREAT | os.O_RDWR | getattr(os, "O_NOFOLLOW", 0)
    try:
        fd = os.open(path, flags, 0o600)
    except OSError:
        raise StopUpload("无法创建本地上传锁，已停止。") from None
    with os.fdopen(fd, "a+", encoding="utf-8") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError:
            raise StopUpload("另一个上传任务正在运行，已停止。") from None
        try:
            yield
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)


def save_state(path, state):
    """Atomically persist only non-secret metadata, before/after the one POST."""
    text = json.dumps(state, ensure_ascii=False, indent=2) + "\n"
    if client._redact(text) != text:
        raise StopUpload("本地状态似乎包含密钥，已拒绝保存。")
    name = None
    try:
        fd, name = tempfile.mkstemp(prefix=".publish-state-local-", suffix=".tmp", dir=path.parent)
        with os.fdopen(fd, "w", encoding="utf-8") as file:
            file.write(text)
            file.flush()
            os.fsync(file.fileno())
        os.replace(name, path)
    except OSError:
        raise StopUpload("无法安全保存本地上传状态，已停止，切勿盲目重试。") from None
    finally:
        if name and os.path.exists(name):
            os.unlink(name)


def load_state(path, slug):
    if not path.exists():
        return {"schema": STATE_SCHEMA, "articleSlug": slug, "images": {}}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        raise StopUpload("本地上传状态无法读取；为避免重复上传，已停止。") from None
    if (not isinstance(data, dict) or data.get("schema") != STATE_SCHEMA
            or data.get("articleSlug") != slug or not isinstance(data.get("images"), dict)):
        raise StopUpload("本地上传状态格式不符；为避免重复上传，已停止。")
    return data


def local_article(article_dir):
    try:
        doc = json.loads((article_dir / "article.json").read_text(encoding="utf-8"))
        hero = doc["media"]["hero"]
        slug, base, alt = doc["slug"], hero["base"], hero["alt"]
    except (OSError, ValueError, KeyError, TypeError):
        raise StopUpload("无法读取本地文章和封面信息。") from None
    if slug != "Keep-Running-Through-Winter" or base != "00-hero":
        raise StopUpload("本次测试仅允许上传冬季文章指定的封面。")
    if doc.get("media", {}).get("stylePending") != []:
        raise StopUpload("配图尚未完成，禁止上传。")
    if (not isinstance(alt, str) or not alt.strip() or len(alt) > 500
            or any(ord(character) < 32 for character in alt)):
        raise StopUpload("封面 alt 格式无效。")
    path = article_dir / "images" / "00-hero-1600.webp"
    try:
        blob = path.read_bytes()
    except OSError:
        raise StopUpload("找不到本地 1600 宽封面图。") from None
    if (not 12 <= len(blob) <= MAX_IMAGE_BYTES or blob[:4] != b"RIFF"
            or blob[8:12] != b"WEBP"):
        raise StopUpload("封面不是合规大小的 WebP 文件。")
    return doc, path.name, blob, alt


def request_read(method, path):
    try:
        return client.request(method, path)
    except client.ApiError as error:
        raise StopUpload(f"只读预检 {method} {path} 失败（HTTP {error.status}），未上传。") from None
    except (OSError, TimeoutError):
        raise StopUpload("只读预检遇到网络错误，未上传。") from None


def parse_json(text, description):
    try:
        return json.loads(text)
    except (ValueError, TypeError):
        raise StopUpload(f"{description}不是有效 JSON，已停止。") from None


def preflight(doc, filename, alt, out):
    slug = doc["slug"]
    status, headers, _ = request_read("OPTIONS", "/media")
    allow = next((str(value) for name, value in headers.items() if name.lower() == "allow"), "")
    if not 200 <= status < 300 or "POST" not in {item.strip().upper() for item in allow.split(",")}:
        raise StopUpload("媒体接口未确认支持 POST，未上传。")

    status, _, text = request_read("GET", "/articles/" + quote(inspect_site.REFERENCE_SLUG, safe=""))
    if not 200 <= status < 300:
        raise StopUpload("无法验证按 slug 读取文章，未上传。")
    sample = parse_json(text, "样本文章响应")
    article = sample.get("article", {}) if isinstance(sample, dict) else {}
    if not isinstance(article, dict) or article.get("slug") != inspect_site.REFERENCE_SLUG:
        raise StopUpload("样本文章的 slug 回读不符，未上传。")
    tips = article.get("tips", [])
    tips = tips if isinstance(tips, list) else []
    allowed_kinds = {"tip", "warning", "note"}
    kinds = sorted({tip["kind"] for tip in tips if isinstance(tip, dict)
                    and isinstance(tip.get("kind"), str) and tip["kind"].lower() in allowed_kinds})
    if kinds:
        out("样本文章提示类别: " + client._redact(", ".join(kinds)))

    status, _, _ = request_read("GET", "/articles/" + quote(slug, safe=""))
    if status != 404:
        if 200 <= status < 300:
            raise StopUpload("目标 slug 已存在；为避免重复，未上传。")
        raise StopUpload("目标 slug 查询异常，未上传。")

    status, _, text = request_read("GET", "/articles")
    if not 200 <= status < 300:
        raise StopUpload("文章列表读取失败，未上传。")
    items = inspect_site.list_items(parse_json(text, "文章列表响应"), "articles")
    if items is None:
        raise StopUpload("文章列表结构无法识别，未上传。")
    if any(isinstance(item, dict) and isinstance(item.get("slug"), str)
           and item["slug"].strip().casefold() == slug.casefold() for item in items):
        raise StopUpload("目标 slug 已在列表中；为避免重复，未上传。")
    out("预检：目标详情为 404，当前列表未发现目标；列表可能分页或不含草稿。")

    status, _, text = request_read("GET", "/media")
    if not 200 <= status < 300:
        raise StopUpload("媒体列表读取失败，未上传。")
    media = inspect_site.list_items(parse_json(text, "媒体列表响应"), "media")
    if media is None:
        raise StopUpload("媒体列表结构无法识别，未上传。")
    if any(isinstance(item, dict) and item.get("originalName") == filename and item.get("alt") == alt
           for item in media):
        raise StopUpload("当前媒体列表已有同名且 alt 相同的图片；未重复上传，请先人工核实。")
    out("媒体列表未发现同名同 alt 图片；列表可能分页，不能保证完全查重。")


def safe_error_details(body, out):
    """Display only redacted server error messages, never a full response body."""
    try:
        data = json.loads(body)
    except (ValueError, TypeError):
        return
    messages, fields = [], set()

    def visit(value, depth=0, field_map=False):
        if depth > 5 or len(messages) >= 4:
            return
        if isinstance(value, str):
            messages.append(value)
        elif isinstance(value, list):
            for item in value[:4]:
                visit(item, depth + 1)
        elif isinstance(value, dict):
            for key, item in list(value.items())[:30]:
                if key in ("error", "message", "detail", "errors", "issues", "fieldErrors"):
                    visit(item, depth + 1, key in ("errors", "fieldErrors"))
                elif field_map and re.fullmatch(r"[A-Za-z0-9_.-]{1,100}", str(key)):
                    fields.add(client._redact(str(key)))
                    if isinstance(item, (str, dict, list)):
                        visit(item, depth + 1)

    visit(data)
    if fields:
        out("  报错字段: " + ", ".join(sorted(fields))[:400])
    for message in messages:
        sanitized = " ".join("".join(ch for ch in client._redact(message) if ch.isprintable()).split())
        if sanitized:
            out("  接口提示: " + sanitized[:400])


def response_media_id(payload):
    if not isinstance(payload, dict):
        return None
    candidates = []
    for key in ("media", "file", "data"):
        value = payload.get(key)
        if isinstance(value, dict):
            candidates.append(value)
            for inner in ("media", "file"):
                if isinstance(value.get(inner), dict):
                    candidates.append(value[inner])
    candidates.append(payload)
    for candidate in candidates:
        for key in ("id", "mediaId"):
            media_id = candidate.get(key)
            if inspect_site.safe_identifier(media_id) and client._redact(media_id) == media_id:
                return media_id
    return None


def verify_uploaded(entry, alt, out):
    """Verify through GET /media without re-uploading, even after a prior run."""
    try:
        status, _, text = client.request("GET", "/media")
        data = json.loads(text) if 200 <= status < 300 else None
    except (client.ApiError, OSError, TimeoutError, ValueError):
        out("媒体回读失败；封面可能已上传，不会重复上传。")
        return None
    items = inspect_site.list_items(data, "media")
    if items is None:
        out("媒体列表结构无法识别；不会重复上传。")
        return None
    matches = [item for item in items if isinstance(item, dict) and item.get("id") == entry["mediaId"]]
    if len(matches) != 1:
        out("当前媒体列表未唯一匹配该图片（可能分页）；不会重复上传。")
        return None
    record = matches[0]
    alt_match = record.get("alt") == alt
    out("媒体列表已回读；封面 alt " + ("匹配。" if alt_match else "缺失或不匹配。"))
    width, height = record.get("width"), record.get("height")
    if type(width) is int and type(height) is int and 0 < width <= 10000 and 0 < height <= 10000:
        out(f"媒体尺寸: {width} × {height}")
    variants = record.get("variants")
    if isinstance(variants, dict):
        sizes = sorted((key for key in variants if isinstance(key, str) and key.isdigit() and len(key) <= 5), key=int)
        if sizes:
            out("站点生成的变体宽度: " + ", ".join(sizes))
    return alt_match


def run_upload(article_dir=ARTICLE_DIR, out=print):
    article_dir = Path(article_dir)
    if client.base() != client.DEFAULT_BASE:
        out("真实上传仅允许配置中的默认站点 API，已停止。")
        return 1
    client.token()  # Fail before touching any API or state if no token is present.
    try:
        doc, filename, blob, alt = local_article(article_dir)
        digest = hashlib.sha256(blob).hexdigest()
        with state_lock(article_dir):
            state_path = article_dir / STATE_NAME
            state = load_state(state_path, doc["slug"])
            previous = state["images"].get("00-hero")
            if previous is not None:
                if not isinstance(previous, dict) or previous.get("sha256") != digest:
                    raise StopUpload("封面与已有上传状态不一致；未重复上传，请先人工核实。")
                if previous.get("status") != "uploaded" or not inspect_site.safe_identifier(previous.get("mediaId")):
                    raise StopUpload("上次上传结果未确认；禁止自动重试，请先检查媒体库并反馈输出。")
                out("本地记录显示封面已上传；跳过 POST，仅重新回读。")
                verified = verify_uploaded(previous, alt, out)
                return 0 if verified is True else 1

            preflight(doc, filename, alt, out)
            # Record an ambiguous pending attempt before making the only POST.
            state["images"]["00-hero"] = {"status": "pending", "sha256": digest, "filename": filename}
            save_state(state_path, state)
            body, ctype = client.multipart({"alt": alt}, {"file": (filename, blob)})
            out("即将上传 1 张真实封面；不会创建或修改文章。")
            try:
                status, _, text = client.request("POST", "/media", raw_body=body,
                                                 content_type=ctype, timeout=120)
            except client.ApiError as error:
                out(f"POST /media -> {error.status if error.status else '网络错误'}")
                safe_error_details(error.body, out)
                out("结果尚未确认；本地已阻止重复上传，请把输出发回。")
                return 1
            except Exception:
                out("POST /media 遇到网络或其他异常；结果未确认，禁止自动重试。")
                return 1
            out(f"POST /media -> {status}")
            if not 200 <= status < 300:
                safe_error_details(text, out)
                out("结果尚未确认；本地已阻止重复上传，请把输出发回。")
                return 1
            try:
                payload = json.loads(text)
            except ValueError:
                out("上传响应不是 JSON；结果未确认，禁止自动重试。")
                return 1
            inspect_site.show_structure(payload, out)
            media_id = response_media_id(payload)
            if not media_id:
                out("响应未包含可安全识别的媒体 ID；结果未确认，禁止自动重试。")
                return 1
            state["images"]["00-hero"] = {"status": "uploaded", "sha256": digest,
                                          "filename": filename, "mediaId": media_id}
            save_state(state_path, state)
            out("已记录媒体 ID（不输出、不提交仓库）；接下来只做读取校验。")
            verified = verify_uploaded(state["images"]["00-hero"], alt, out)
            out("本次仅处理封面；文章尚未创建或发布。")
            return 0 if verified is True else 1
    except StopUpload as error:
        out(client._redact(str(error)))
        return 1


def main():
    parser = argparse.ArgumentParser(description="仅上传一张真实封面；不会创建文章")
    parser.add_argument("--confirm", action="store_true", help="确认会真实上传一张封面")
    args = parser.parse_args()
    if not args.confirm:
        parser.error("真实上传需要 --confirm")
    return run_upload()


if __name__ == "__main__":
    sys.exit(main())
