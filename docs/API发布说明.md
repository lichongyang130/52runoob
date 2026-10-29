# API 发布说明（56juqingba）

## 为什么要经 GitHub Actions 发布

内容沙盒的出网白名单只放行 github.com / npm / PyPI，**无法直连 `www.56juqingba.com`**（API 本身是通的，已确认 `/api/v1/articles` 在无 token 时返回 `{"error":"Token 无效。"}`）。
因此计划在 GitHub Actions runner 里调用，密钥只从仓库 Secrets 读取，不写进代码、不写进本文件。**真实授权调用、上传路由、请求字段和创建文章的幂等性尚未验证**；先做只读 probe，遇到发布或回读错误时先查站点是否已创建文章，不要盲目重复 POST。

## 2026-10-29 探测记录

- 冬季跑步样板已完成 13 张插画并通过本地体检；请求发布后先推送了 `probe` 标记。
- 用户确认检查过 Actions 设置和 GitHub 连接后，已再次推送 `probe`；即使移除路径过滤条件，Actions API 仍返回零次运行。沙盒无法直接访问站点 API。
- 当前 `arena-ai-coding-agent` 安装权限显示 `actions: read`，手动 dispatch 返回 403；仓库 Actions 设置和 Secret 内容无法读取。不能判断未触发的具体原因。
- **尚未发出授权 API 请求，也未发布文章。** 可由仓库所有者在 GitHub 网页编辑同一分支的 `content/Keep-Running-Through-Winter/PUBLISH`，在 `probe` 前加一个空格并提交；脚本会移除首尾空格，仍只做只读探测。随后查看 Actions 运行结果并提供脱敏错误，不要把密钥贴到聊天里。

## 一次性配置

1. **添加密钥**（仓库 → Settings → Secrets and variables → Actions → New repository secret）

   | Name | Value |
   |---|---|
   | `SITE_API_TOKEN` | 你的 Bearer 密钥 |

   > ⚠️ 凭证曾出现在对话里。请先在站点后台**轮换该密钥**，再把新密钥放入 Secret；不要在聊天、仓库或日志中再次粘贴。

2. （可选）**接口路径覆盖**，若自动探测不准，用 Variables 指定：

   | Name | 示例 | 说明 |
   |---|---|---|
   | `SITE_API_BASE` | `https://www.56juqingba.com/api/v1` | 默认值，一般不用改 |
   | `SITE_API_COLLECTION` | `/articles` | 文章集合路由 |
   | `SITE_API_UPLOAD` | `/uploads` | 图片上传路由 |

3. **允许本地分支跑工作流**（可选）：仓库规模小、分类页少时可选。需要的话在 Settings → Actions → General 里打开 *Allow all actions and reusable workflows*。

## 用法

工作流目前仅在 `arena/f9a79f56-52runoob` 分支上。先配置 Secret，然后一次只推送一个标记文件来触发（以无写入的探测为例）：

```bash
printf 'probe\n' > content/Keep-Running-Through-Winter/PUBLISH
git add content/Keep-Running-Through-Winter/PUBLISH
git commit -m "chore: probe site API"
git push origin arena/f9a79f56-52runoob
```

成功后工作流会提交删除该标记；下次推送前同步远端。标记可写 `probe`、`dry-run`、`images-only`、`publish` 或 `update`；无效内容和同次提交多个标记均会报错，不会默认发布。`publish`/`images-only` 还会被未完成的 `media.stylePending` 拦截。

只有当默认分支也包含此工作流时，GitHub 才会在 Actions 页面提供 **Run workflow**。手动触发时的输入如下：

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
2. **上传图片**：上传路由和 multipart 字段仍待实测；成功后把返回 URL 与文件 SHA-256 记进 `content/<slug>/publish-state.json`。只有同名且内容哈希相同时才复用，替换插画后会重新上传；旧版仅存 URL 的缓存无法验证，将重新上传；
3. **组装 payload**：同时给三种常见形态，兼容未知的接口约定
   - 分部结构：`parts[].steps[]`（含原始图片信息和已上传的 `imageUrl` / `imageAlt`）
   - 扁平步骤：`steps[]`（含 `imageUrl` / `imageAlt` / `tip`）
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
- alt 全部在 `article.json` 里逐张填写，须与实际图片一致，脚本随图上传；
- 风格过渡时 `media.stylePending` 列出待替换图片，体检与真实上传/发布会拒绝未完成稿件；`--dry-run` 仍可用于检查。冬季跑步样板的 13 张新风格图已齐，5K 草稿的 13 张新风格图片尚未完成。

## 安全约定

- 密钥只存在于 GitHub Secrets 与本地 shell 环境变量；
- 脚本对输出统一做 token 脱敏；
- `content/*/publish-state.json` 只存图片 URL，不含任何凭证，可安全提交。
