"""
client.py — 最小可用的站点 REST 客户端（无第三方依赖）

设计前提：接口的具体形状未知，因此：
  1. 所有路径都可通过环境变量覆盖（SITE_API_*_PATH），或在自动探测里加候选；
  2. Token 只从环境变量读取，绝不打印、绝不落盘；
  3. 任何错误都保留服务端原文，便于反推接口约定。
"""
from __future__ import annotations

import json
import mimetypes
import os
import urllib.error
import urllib.parse
import urllib.request
import uuid

DEFAULT_BASE = "https://www.56juqingba.com/api/v1"
TOKEN_ENV = "SITE_API_TOKEN"
UA = "howly-content-pipeline/1.0"


class ApiError(RuntimeError):
    def __init__(self, method, url, status, body):
        self.status = status
        self.body = _redact(str(body))
        super().__init__(f"{_redact(str(method))} {_redact(str(url))} -> HTTP {status}: {self.body[:600]}")


def token() -> str:
    t = os.environ.get(TOKEN_ENV, "").strip()
    if not t:
        raise SystemExit(
            f"缺少环境变量 {TOKEN_ENV}。本地运行时:\n"
            f"  export {TOKEN_ENV}=<你的密钥>\n"
            "CI 中由 GitHub Actions secrets 注入。"
        )
    return t


def base() -> str:
    return os.environ.get("SITE_API_BASE", DEFAULT_BASE).rstrip("/")


def _redact(text: str) -> str:
    t = os.environ.get(TOKEN_ENV, "").strip()
    if t:
        # Error bodies can JSON- or URL-escape a token before echoing it.
        variants = {t, json.dumps(t, ensure_ascii=False)[1:-1],
                    json.dumps(t, ensure_ascii=True)[1:-1],
                    urllib.parse.quote(t, safe=""), urllib.parse.quote_plus(t, safe="")}
        for value in sorted(variants, key=len, reverse=True):
            text = text.replace(value, "<token>")
    return text


def _origin(url: str):
    """Normalize an HTTP(S) origin so redirects cannot send the token elsewhere."""
    try:
        parsed = urllib.parse.urlsplit(url)
        scheme = parsed.scheme.lower()
        if scheme not in ("http", "https") or not parsed.hostname:
            return None
        return scheme, parsed.hostname.lower(), parsed.port or (443 if scheme == "https" else 80)
    except ValueError:
        return None


class SameOriginRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        source, destination = _origin(req.full_url), _origin(newurl)
        if not source or source != destination:
            raise ApiError(req.get_method(), req.full_url, code,
                           "拒绝跨站点或跨协议重定向，以保护 Bearer 密钥。")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


OPENER = urllib.request.build_opener(SameOriginRedirect())


def request(method: str, path: str, *, json_body=None, raw_body=None,
            content_type=None, timeout=60, base_override=None):
    """返回 (status, headers, text)。2xx 之外抛 ApiError（除 404，由调用方探测）。"""
    base_url = (base_override or base()).rstrip("/")
    url = base_url + (path if path.startswith("/") else "/" + path)

    data = None
    headers = {
        "Authorization": f"Bearer {token()}",
        "Accept": "application/json",
        "User-Agent": UA,
    }
    if json_body is not None:
        data = json.dumps(json_body, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json; charset=utf-8"
    elif raw_body is not None:
        data = raw_body
        if content_type:
            headers["Content-Type"] = content_type

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with OPENER.open(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", "replace")
            return resp.status, dict(resp.headers), body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        if e.code == 404:
            return 404, dict(e.headers or {}), body
        raise ApiError(method, url, e.code, _redact(body)) from None
    except urllib.error.URLError as e:
        raise ApiError(method, url, 0, f"网络错误: {_redact(str(e.reason))}") from None


def multipart(fields: dict, files: dict):
    """files: {字段名: (文件名, bytes)} -> (body, content_type)"""
    boundary = "----howly" + uuid.uuid4().hex
    out = []
    for k, v in fields.items():
        out.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())
    for field, (filename, blob) in files.items():
        ctype = mimetypes.guess_type(filename)[0] or "application/octet-stream"
        out.append(
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"{field}\"; "
            f"filename=\"{filename}\"\r\nContent-Type: {ctype}\r\n\r\n".encode()
            + blob + b"\r\n"
        )
    out.append(f"--{boundary}--\r\n".encode())
    return b"".join(out), f"multipart/form-data; boundary={boundary}"


# ------------------------------------------------------------------ 探测
PROBE_COLLECTIONS = ["/articles", "/posts", "/guides", "/contents"]
PROBE_UPLOADS = ["/uploads", "/media", "/images", "/assets"]
PROBE_DOCS = ["/openapi.json", "/docs", "/schema"]


def json_shape(value, depth=0):
    """只报告结构和类型，不输出文章正文或数据值。"""
    if depth >= 5:
        return type(value).__name__
    if isinstance(value, dict):
        return {_redact(str(k)): json_shape(v, depth + 1) for k, v in list(value.items())[:50]}
    if isinstance(value, list):
        return [json_shape(value[0], depth + 1)] if value else []
    if value is None:
        return "null"
    return type(value).__name__


def probe(status_out=print):
    """打印接口能力快照。返回 dict：{'collection': path|None, 'upload': path|None,...}"""
    found = {"collection": None, "upload": None, "docs": {}}

    status_out(f"base = {_redact(base())}")
    for p in PROBE_COLLECTIONS:
        try:
            st, _, body = request("GET", p + "?per_page=1")
        except ApiError as e:
            if e.status in (0, 401, 403):
                raise
            st, body = e.status, e.body
        # Do not print raw response values: lists can include private drafts.
        status_out(f"  GET {p:12} -> {st}")
        if st < 300 and not found["collection"]:
            found["collection"] = p
            try:
                shape = json_shape(json.loads(body))
                status_out("  JSON 结构: " + _redact(json.dumps(shape, ensure_ascii=False))[:4000])
            except (ValueError, TypeError):
                status_out("  集合返回非 JSON。")

    for p in PROBE_UPLOADS:
        # GET 探活：405/400 也说明路由存在
        try:
            st, _, body = request("GET", p)
        except ApiError as e:
            st, body = e.status, e.body
        status_out(f"  GET {p:12} -> {st}")
        if st in (400, 405, 422, 200, 201) and not found["upload"]:
            found["upload"] = p

    for p in PROBE_DOCS:
        try:
            st, _, body = request("GET", p)
        except ApiError as e:
            if e.status in (0, 401, 403):
                raise
            st, body = e.status, e.body
        status_out(f"  GET {p:12} -> {st}")
        if st < 300:
            found["docs"][p] = body

    return found
