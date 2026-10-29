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
    if t and t in text:
        text = text.replace(t, "<token>")
    return text


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
        with urllib.request.urlopen(req, timeout=timeout) as resp:
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


def probe(status_out=print):
    """打印接口能力快照。返回 dict：{'collection': path|None, 'upload': path|None,...}"""
    found = {"collection": None, "upload": None, "docs": {}}

    status_out(f"base = {_redact(base())}")
    for p in PROBE_COLLECTIONS:
        st, _, body = request("GET", p + "?per_page=1")
        kind = "OK" if st < 300 else ("存在" if st == 404 and "Token" in body else st)
        status_out(f"  GET {p:12} -> {st}  {_redact(body)[:120]}")
        if st < 300 and not found["collection"]:
            found["collection"] = p

    for p in PROBE_UPLOADS:
        # GET 探活：405/400 也说明路由存在
        try:
            st, _, body = request("GET", p)
        except ApiError as e:
            st, body = e.status, e.body
        status_out(f"  GET {p:12} -> {st}  {_redact(body)[:120]}")
        if st in (400, 405, 422, 200, 201) and not found["upload"]:
            found["upload"] = p

    for p in PROBE_DOCS:
        st, _, body = request("GET", p)
        status_out(f"  GET {p:12} -> {st}")
        if st < 300:
            found["docs"][p] = body

    return found
