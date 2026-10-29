# API 发布说明（56juqingba）

## 当前状态（2026-10-29）

- 用户从自己的 Mac 使用 Bearer 密钥完成了只读授权探测：`GET /api/v1/articles`、`/media`、`/categories` 均返回 200。`OPTIONS /articles` 与 `/media` 的允许方法包含 POST；这说明服务器声明了对应方法，**并不证明请求字段**。
- 已有文章通过 slug 回读，结构包括 `methods[].steps[]`、图片对象、`tips[].kind`、`faqs`、`references`；列表中观察到状态 `PUBLISHED`。冬季目标在本次 19 条列表中未发现、按 slug 读取为 404，但仍不能排除分页或草稿被隐藏。
- `/posts`、`/guides`、`/contents`、`/uploads`、`/images`、`/assets` 的 GET 返回 404；`/openapi.json`、`/docs`、`/schema` 也未发现文档。`/media/upload` 和 `/upload` 的 OPTIONS 返回 404。
- 图片上传和文章创建的请求字段、幂等性仍未验证。`build_payload()` 仍只是实验性草案，不能作为实际站点格式；目前既未创建文章，也未上传图片。
- 冬季样稿和 13 张新风格图片已备齐；健康内容仍需真人专业审校，`reviewer` 保持空值，不虚构审核者。
- GitHub Actions 没有生成运行记录，包括一个无密钥的最小工作流；原因不明。沙盒只能访问白名单主机，不能直接连接站点 API，因此暂用可联网的电脑探测。

为防误写，通用发布器 `tools/api/publish.py` 当前锁定真实上传、创建和更新：命令行和工作流里的 `images-only`、`publish`、`update` 都会在任何 API 写入之前停止。`--probe` 和 `--dry-run` 仍可使用；不得通过简单修改开关绕过，应先实现并测试真实接口契约和可靠查重。下面的独立脚本是经用户确认后执行的**单张封面上传测试**，不会创建或修改文章。

## 受控上传一张封面

在刚才的 Mac 终端执行：

```bash
cd ~/52runoob-publish
git pull --ff-only
bash tools/upload_hero.sh --confirm
```

**此命令会真实向 `/api/v1/media` 上传冬季文章的 1600 宽封面，不是只读探测。**它先检查已知 slug 读取方式、目标文章、媒体列表中的同名同 alt 图片，以及服务器声明的方法；然后只发送一次 `POST /media`，使用 multipart 的 `file` 和 `alt` 字段，回读媒体列表检查 alt，不发送文章创建或更新请求。列表可能分页，不能保证完全查重。是否接受该上传格式仍待实测。输入密钥时不回显，不将密钥写入文件或命令历史。

每次 POST 前，脚本会在本机、已被 Git 忽略的 `content/Keep-Running-Through-Winter/.publish-state-local.json` 写入待确认状态；成功后只保存媒体 ID 和图片 SHA-256，不保存密钥或完整响应。并发锁及本地状态用于阻止重复上传。若超时、失败或返回格式异常，图片**可能已上传**：不要删除状态文件或盲目重试，把脱敏输出发给代理，先通过媒体库核实。相同封面已有成功记录时，再次执行只会回读，不会再次 POST。

## 已克隆仓库后的只读检查

在刚才运行过基础探测的 Mac 终端中执行：

```bash
cd ~/52runoob-publish
git pull --ff-only
bash tools/probe_site.sh --details
```

脚本会在本机终端隐藏输入网站 API 密钥，仅传入进程环境，不写入文件或 shell 命令历史。若已通过安全方式设置 `SITE_API_TOKEN`，则直接使用它。不要把密钥发到聊天中。

详细检查仅发出 `GET` 和 `OPTIONS`：读取文章与媒体结构、测试样本详情和目标 slug、检查分类，输出 HTTP 状态、允许的方法名、JSON **字段名和类型**、白名单中的文章状态枚举及查重摘要；不输出文章正文、图片路径或密钥。`OPTIONS` 返回的方法列表可能包含 POST，但脚本不会发送 POST。列表可能分页或不包含草稿，目标 slug 未出现在本次结果中**不能证明不存在**。完成后可以把输出发给代理；若网站另有 API 文档，也可提供请求字段和响应格式，切勿包含密钥。

保留基础探测：

```bash
bash tools/probe_site.sh
```

客户端拒绝跨站点或跨协议的 API 重定向，避免将 Bearer 密钥传给其他来源。此前密钥曾出现在对话里，应在网站后台轮换并更新 GitHub Secret，后续不要在聊天、命令行参数、代码或日志里粘贴密钥。

## 本地演练

不需要密钥、不连接网站：

```bash
python3 tools/check_article.py content/Keep-Running-Through-Winter/article.json
python3 tools/api/publish.py content/Keep-Running-Through-Winter --dry-run
```

演练中的 payload 是待验证草案，并不是可直接导入的真实站点格式。

## 工作流及密钥配置

如之后 GitHub Actions 能正常启动，仓库 Secret 名称为 `SITE_API_TOKEN`；它只应包含站点 Bearer 密钥。工作流在分支 `arena/f9a79f56-52runoob`，可通过单个 `content/<slug>/PUBLISH` 标记指定 `probe`、`dry-run`、`images-only`、`publish` 或 `update`；无效内容和同次多个标记会失败关闭。**当前写操作仍被脚本锁定**。只有默认分支含工作流时，GitHub 才会提供手动 `workflow_dispatch`。

当前 GitHub App 的 Actions 权限为 `actions: read`，不能通过 API 手动 dispatch 或读取仓库 Secrets；不要反复推送相同探测标记来替代本机检查。

## 发布前必须完成

1. 获取或验证图片上传、文章创建与回读的正式接口契约，包括请求字段、`alt`、响应 URL、分类和状态；不能仅依据 GET 列表推测 POST。
2. 完善发布器和测试：按真实字段映射 3 个 Part、12 个步骤、每步图片、FAQ、参考资料、SEO 和分类；验证图片 URL 与 `alt` 不丢失。
3. 可靠查询目标 slug，包括草稿和分页；发现已有文章时停止创建。上传断点状态如包含 URL 或其他服务端数据，应核查是否带有签名或凭证，不能未经检查提交。
4. 真人核查健康内容、插图、来源和作者信息。不要把 `reviewer` 空值填成不存在的审核者。
5. 在可连接网站的环境中执行一次受控发布。若写入超时或返回异常，**先通过读取确认站点状态，不要盲目重复 POST**。
6. 回读接口并检查公开页：标题、分类、12 个步骤、hero 加 12 张步骤图、图片 alt、参考资料、FAQ 和页面状态。

## 图片规格

- 每篇 **hero 1 张 + 每步 1 张**；冬季跑步为 13 张，`Run-Your-First-5K` 的 13 张新风格图片尚未制作。
- 冬季样稿的 WebP 图片有 1600×900 和 960×540 两种尺寸，并在 `article.json` 为每张图片填写了 alt。实际上传的尺寸、alt 字段和图片 URL 需以真实接口为准。
- `media.stylePending` 列出待替换的旧风格图片；未完成时体检及真实写入应被拦截。`--dry-run` 可继续用于检查。
