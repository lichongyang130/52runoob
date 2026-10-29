# API 发布说明（56juqingba）

## 为什么要经 GitHub Actions 发布

内容沙盒的出网白名单只放行 github.com / npm / PyPI，**无法直连 `www.56juqingba.com`**（API 本身是通的，已确认 `/api/v1/articles` 在无 token 时返回 `{"error":"Token 无效。"}`）。
因此发布放在 GitHub Actions 里跑：runner 能出网，密钥只从仓库 Secrets 读取，不写进代码、不写进本文件。

## 一次性配置

1. **添加密钥**（仓库 → Settings → Secrets and variables → Actions → New repository secret）

   | Name | Value |
   |---|---|
   | `SITE_API_TOKEN` | 你的 Bearer 密钥 |

   > ⚠️ 你已经在对话里贴过这串密钥，建议用完后到后台**重置一次**，然后更新这个 Secret。

2. （可选）**接口路径覆盖**，若自动探测不准，用 Variables 指定：

   | Name | 示例 | 说明 |
   |---|---|---|
   | `SITE_API_BASE` | `https://www.56juqingba.com/api/v1` | 默认值，一般不用改 |
   | `SITE_API_COLLECTION` | `/articles` | 文章集合路由 |
   | `SITE_API_UPLOAD` | `/uploads` | 图片上传路由 |

3. **允许本地分支跑工作流**（可选）：仓库规模小、分类页少时可选。需要的话在 Settings → Actions → General 里打开 *Allow all actions and reusable workflows*。

## 用法

仓库 → Actions → **Publish to 56juqingba** → Run workflow：

| 输入 | 作用 |
|---|---|
| `action = probe` | 只探测接口能力，打印每条路由的返回码，**先跑这个** |
| `action = dry-run` | 本地演练：列出会传的图片和 payload 字段，不写任何数据 |
| `action = images-only` | 只上传图片，不创建文章 |
| `action = publish` | 上传图片 + 创建文章 + 回读校验 |
| `action = update` | 文章已存在时 PATCH 更新 |
| `article_dir` | `content/Keep-Running-Through-Winter` |
| `branch` | `arena/f9a79f56-52runoob` |

命令行等价：

```bash
export SITE_API_TOKEN=...        # 只存在于当前 shell
python3 tools/api/publish.py --probe
python3 tools/api/publish.py content/Keep-Running-Through-Winter --dry-run
python3 tools/api/publish.py content/Keep-Running-Through-Winter
```

## 脚本做了什么

1. **探测集合路由**：依次试 `GET /articles`、`/posts`、`/guides`，用第一个不是 404 的；
2. **上传图片**：`POST /uploads`（multipart，字段 `file`），把返回的 `url` / `data.url` / `path` 记进 `content/<slug>/publish-state.json`，断点重跑不会重复上传；
3. **组装 payload**：同时给三种常见形态，兼容未知的接口约定
   - 结构化：`parts[].steps[]`（含 `imageUrl` / `imageAlt` / `tip`）
   - 扁平：`steps[]`
   - 富文本：`html`（与站内版式一致的完整正文）
4. **发布**：`POST /articles`（或探测到的集合路由），默认 `status: published`；
5. **回读校验**：`GET /articles/<slug>`，比对 title 与步骤数。

## 如果接口报字段错误

服务端会回原始错误文本，脚本会原样打印（自动隐藏 token）。常见处理：

| 报错 | 处理 |
|---|---|
| `未知字段 xxx` | 在 `tools/api/publish.py` 的 `build_payload()` 里删掉该字段 |
| `缺少必填字段 xxx` | 同上，把该字段补上（值从 `article.json` 取） |
| `上传缺少字段` | 改环境变量 `SITE_UPLOAD_FIELD`（默认 `file`） |
| 路由 404 | 用 Variables 显式指定 `SITE_API_COLLECTION` / `SITE_API_UPLOAD` |

把报错原文发我，我直接改脚本或改 payload 字段名。

## 图片规格（已按“每步一张”生产）

- 每篇 **hero 1 张 + 每步 1 张**：
  - 冬季跑步：12 步 → 13 张
  - Run Your First 5K：12 步 → 13 张
  - Fix Knee Pain From Running：11 步 → 12 张
  - Repot a Houseplant：10 步 → 11 张
- 上传用 1600×900 WebP（站上现有图片也是 1600 宽），960 宽版本留在仓库备用；
- alt 全部在 `article.json` 里逐张填写，脚本随图上传。

## 安全约定

- 密钥只存在于 GitHub Secrets 与本地 shell 环境变量；
- 脚本对输出统一做 token 脱敏；
- `content/*/publish-state.json` 只存图片 URL，不含任何凭证，可安全提交。
