# 52runoob — 56juqingba.com 内容与配图生产仓库

给英文 how-to 站 **56juqingba.com（Howly 版式）** 生产文章与配图的可复用流水线。
内容以 JSON 为单一源，脚本负责渲染成 Markdown、CMS 导入包和本地预览页，并在发布前做质量体检。

## 目录

```
content/
  _template/article.json            空白模板（复制它开新稿）
  content-plan.csv                  25 条选题池（priority / slug / 关键词 / 内链）
  Keep-Running-Through-Winter/      已交付样板：12 步指南 + 10 张配图
    article.json                    单一内容源
    article.md                      审稿用 Markdown（自动生成）
    import-payload.json             CMS 导入用（自动生成）
    images/                         960w + 1600w WebP
docs/
  内容增长方案.md                    诊断 + 架构 + 选题 + SOP + 排期
  image-prompt-template.md          配图 prompt 模板与风格锁
tools/
  render_article.py                 JSON -> MD / payload / 预览页
  check_article.py                  发布前体检（12 项规则）
  make_images.sh                    PNG -> 双尺寸 WebP
preview/                            渲染出的本地预览页
```

## 常用命令

```bash
# 1. 渲染
python3 tools/render_article.py content/Keep-Running-Through-Winter/article.json

# 2. 体检（0 error 才能发）
python3 tools/check_article.py content/Keep-Running-Through-Winter/article.json

# 3. 新配图转码（原图放 images/raw/*.png）
bash tools/make_images.sh content/Keep-Running-Through-Winter/images
```

## 写一篇新稿

1. `cp -r content/_template content/Your-Article-Slug`，把 `article.json` 填满（12 步 / 3 Part）；
2. 按 `docs/image-prompt-template.md` 生成 1 张 hero + 每步 1 张，放进 `images/raw/`；
3. 跑 `make_images.sh` → `render_article.py` → `check_article.py`；
4. 用 `article.md` 或 `import-payload.json` 发布，按 `docs/内容增长方案.md` 第 8 节 checklist 过一遍。
