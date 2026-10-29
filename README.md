# 52runoob — 56juqingba.com 内容与配图生产仓库

给英文 how-to 站 **56juqingba.com（Howly 版式）** 生产文章与配图的可复用流水线。
内容以 JSON 为单一源，脚本负责渲染成 Markdown、CMS 导入包和本地预览页，并在发布前做质量体检。

## 目录

```
content/
  _template/article.json            空白模板（复制它开新稿）
  content-plan.csv                  25 条选题池（priority / slug / 关键词 / 内链）
  Keep-Running-Through-Winter/      样板：12 步 + 13 张手绘风插图，待 API 发布验证
    article.json                    单一内容源；media.stylePending 列出待替换图片
    article.md                      审稿用 Markdown（自动生成）
    import-payload.json             CMS 导入用（自动生成）
    images/                         960w + 1600w WebP
  Run-Your-First-5K/                12 步草稿，13 张新风格图待生成
docs/
  内容增长方案.md                    诊断 + 架构 + 选题 + SOP + 排期
  image-prompt-template.md          参考图风格、场景多样性与 prompt 模板
tools/
  render_article.py                 JSON -> MD / payload / 预览页
  check_article.py                  发布前体检（12 项规则）
  make_images.sh                    PNG -> 双尺寸 WebP
  probe_site.sh                     本机隐藏输入密钥并执行只读探测
  upload_hero.sh                    经确认后只上传一张封面，不创建文章
  upload_steps.sh                   复用封面状态并安全上传 12 张步骤图
  api/                              API 客户端、检查、受控上传及待验证发布器
preview/                            渲染出的本地预览页
```

## 常用命令

```bash
# 1. 渲染
python3 tools/render_article.py content/Keep-Running-Through-Winter/article.json

# 2. 体检（0 error 才能发；新风格配图未完成时会报错）
python3 tools/check_article.py content/Keep-Running-Through-Winter/article.json

# 3. 新配图转码（原图放 images/raw/*.png）
bash tools/make_images.sh content/Keep-Running-Through-Winter/images

# 4. 在可访问站点的电脑上只读探测（隐藏输入密钥，不写 shell 历史）
bash tools/probe_site.sh --details
# 通用发布器的创建 / 更新仍被锁定；封面上传已验证。
# 确认后可上传余下步骤图（真实写入媒体库，不创建文章）：
# bash tools/upload_steps.sh --confirm
# 详见 docs/API发布说明.md
```

## 写一篇新稿

1. `cp -r content/_template content/Your-Article-Slug`，把 `article.json` 填满（12 步 / 3 Part）；
2. 按 `docs/image-prompt-template.md` 生成 1 张 hero + 每步 1 张；参考画风但根据步骤变换背景，原图放进 `images/raw/`（该目录不提交 Git）；
3. 跑 `make_images.sh` → `render_article.py` → `check_article.py`；若有旧风格占位图，在 `media.stylePending` 中列出，全部替换后清空；
4. 由真人核查安全内容、图片与参考文献；已验证文章与媒体读取及单张封面上传，文章创建接口仍待确认。通用发布器的写入被锁定，图片可经确认分步上传。详见 `docs/API发布说明.md`。
