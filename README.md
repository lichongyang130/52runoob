# 52runoob — 56juqingba.com 内容与配图生产仓库

为英文 how-to 网站制作图文指南。文章以 JSON 为内容源，另生成可人工阅读的英文稿和独立网页素材包。素材包不是已验证的 CMS 导入包，也不会自动发布或进入网站原有分类。

## 当前任务与进度

新要求：**19 个现有分类各新增至少 5 篇**，每篇标题以 “How to” 开头、15–20 步、每步一张图另配封面，并有站内链接、出站链接和参考资料。详见 `docs/批量内容生产计划.md` 和 `content/expanded-plan.csv`。

每轮最多生成 10 张插画，而每篇需要 16 张（封面 + 15 步），所以一轮做不完整篇；配图是当前进度瓶颈。

- `content/Run-Your-First-5K/`：15 步图文稿、16 张不同的图片（新制 10 张，6 张沿用相关冬季跑步插画）、4 条站内链接、3 条站外资源和 4 条参考资料。2026-10-29 复查该文已在站点可访问并显示 15 步 15 图；发布不是由本仓库执行的。运动健康内容仍需真人审校。
- `downloads/First-5K-Upload.zip`：上述稿件的独立网页和人工上传素材包；页面上有待审校提示。
- `content/Repot-a-Houseplant/`：15 步英文稿，已有 6/16 张图（全部为新图），缺 10 张。
- `content/Plan-a-Run-Walk-Workout/`：15 步英文稿，已有 4/16 张图（全部为新图），缺 12 张。
- `content/Back-Up-Your-Photos/`：15 步英文稿，16 张图全部待生成。
- 上述三篇缺图稿件均无法通过质量检查，因此不打包、不算完成；缺图清单见各自 `article.json` 的 `imageStatus.stepImagesPending`。
- 其余 91 篇为选题，尚未完成正文与配图。`expanded-plan.csv` 是进度记录，不要将选题当成成品。
- `content/Keep-Running-Through-Winter/`：此前制作的旧版 12 步样稿及 13 张插画；其原素材包为 `downloads/Winter-Running-Upload.zip`。公开网站的分类和详情页现已显示该稿，但旧稿不计入本批 15–20 步的新稿目标。

## 生产规范

1. 新稿 `requirements` 设置 `stepMin: 15`、`stepMax: 20`、`externalLinksMin: 2`、`uniqueImagesWithinArticle: true`。每一步与封面都要有不同的图片和准确 alt；使用旧图须记录来源。手绘画风参考本地参考图，不复制其人物或背景。
2. 至少 3 条有关的站内链接、2 条可点击的站外资源、3 条带网址的参考资料；优先使用已验证可访问的权威来源。发布前再次核对链接和时效。
3. 生成 1600×900 和 960×540 WebP 两种尺寸。医学、运动、财务、宠物、汽车等内容须由合适的真人进行事实和安全审校；不虚填作者或专家审校信息。
4. 缺图、缺链接或未通过体检的文章只能作为草稿，不得声称制作完成。独立网页包在服务器静态目录解压后才可能获得网址；不会自动进入原网站文章数据库。

## 开发与校验

```bash
# 生成可读稿、预览与未经 CMS 契约验证的 payload 草案
python3 tools/render_article.py content/Run-Your-First-5K/article.json
# 新稿严格校验 15–20 步、逐步配图、出站链接等
python3 tools/check_article.py content/Run-Your-First-5K/article.json
# 仅在正文、配图和链接检查通过后生成独立网页素材包
python3 tools/package_article.py content/Run-Your-First-5K/article.json downloads/First-5K-Upload.zip
# 回归测试
python3 -m unittest discover -s tests -v
```

旧文章没有新 `requirements` 时沿用旧的 9–14 步检查范围，不代表旧稿符合新要求。`docs/API发布说明.md` 中的 API 探测和封面上传是历史技术记录；通用发布器的真实写入仍被锁定，用户当前选择人工下载素材，不需要运行 API 工具。
