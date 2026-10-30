#!/usr/bin/env python3
"""打一个增量素材包：只装新增的几篇，但总目录页按"服务器上最终会有的全部篇目"生成。

适用场景：之前已经上传过一批文章，这次只想传新增的几篇，又希望根目录的
index.html 能列出全部篇目，而不是停留在上一批的数量。

用法:
    python3 tools/package_increment.py downloads/Add-On.zip \
        --new content/Care-for-Dry-Hands/article.json \
        --index-all content/Run-Your-First-5K/article.json content/Care-for-Dry-Hands/article.json

说明:
  - --new 列出的文章会被真正打包进去，每篇目录与其单篇素材包逐字节一致；
  - --index-all 列出的文章决定 index.html 上的卡片（通常是"旧的 + 新的"全集）；
  - 卡片指向 <slug>/index.html，所以 --index-all 里那些没被打包的篇目，
    必须已经存在于服务器的同一目录下，否则点开会 404；
  - 每篇仍然照常跑体检，任何一篇不合格就整体失败、不落盘。
"""
import argparse
import json
import sys
import tempfile
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

sys.path.insert(0, str(Path(__file__).resolve().parent))
import package_article  # noqa: E402
import package_bundle  # noqa: E402


def _readme(new_entries, all_entries):
    """中文说明：讲清楚这是增量包，以及它和整包的关系。"""
    new_slugs = [doc["slug"] for doc in new_entries]
    old_slugs = [doc["slug"] for doc in all_entries if doc["slug"] not in new_slugs]
    lines = [
        "英文文章素材 · 增量包",
        "",
        f"本包只包含 {len(new_entries)} 篇新增文章，供已经上传过前一批的情况使用。",
        "",
        "包含的新增文章：",
    ]
    for doc in new_entries:
        steps = sum(len(part["steps"]) for part in doc["parts"])
        lines.append(f"  • {doc['title']}（{doc['category']}）：{steps} 步，{steps + 1} 张插画")
    lines += [
        "",
        "每篇一个文件夹，里面是：",
        "• index.html：英文图文网页（每步一图，另有封面）",
        "• Article-English.txt：纯文本英文稿，首行标明仍需真人审校",
        "• README-中文.txt：该篇的单独说明，含所属类目与审校提示",
        "• Images/：每张图两档，-1600.webp 与 -960.webp，网页按屏幕宽度自动选择",
        "",
        "关于根目录的 index.html：",
        f"它是本地总目录页，列出了全部 {len(all_entries)} 篇（新增 {len(new_entries)} 篇 + 之前已上传的 {len(old_slugs)} 篇）。",
        "把它覆盖到和各篇文件夹同级的位置，目录页就能一次列全。",
        "下面这些篇目的卡片指向服务器上已有的文件夹，本包内没有重复携带：",
    ]
    for slug in old_slugs:
        lines.append(f"  - {slug}/")
    lines += [
        "",
        "上传提示：",
        "解压后把各篇文件夹整体放进服务器的静态目录，保持文件夹内 index.html 与 Images 同级。",
        "这是独立静态网页素材，不是经过验证的 CMS 导入包，不会自动进入网站原有的文章数据库和分类。",
        "",
        "审校提示：",
        "所有稿件均未经真人专业审校，正文与网页上都带有提示。",
        "医疗、用药、财务、食品安全、汽车、宠物健康、皮肤健康等内容务必先由对口专业人士核校。",
        "不要虚填作者或专家信息。各篇具体需要核查的内容见该篇的 README-中文.txt。",
    ]
    return "\n".join(lines) + "\n"


def build_increment(new_jsons, index_jsons, output):
    new_entries = [json.loads(Path(p).read_text(encoding="utf-8")) for p in new_jsons]
    index_entries = [json.loads(Path(p).read_text(encoding="utf-8")) for p in index_jsons]

    index_slugs = {doc["slug"] for doc in index_entries}
    for doc in new_entries:
        if doc["slug"] not in index_slugs:
            raise SystemExit(f"无法打包: {doc['slug']} 不在 --index-all 列表里，目录页会漏掉它")

    output = Path(output)
    with tempfile.TemporaryDirectory() as tmp:
        parts = []
        for path, doc in zip(new_jsons, new_entries):
            single = Path(tmp) / f"{doc['slug']}.zip"
            package_article.build_package(Path(path), single)  # 体检在这里执行
            parts.append((doc["slug"], single))

        output.parent.mkdir(parents=True, exist_ok=True)
        with ZipFile(output, "w", ZIP_DEFLATED) as archive:
            for slug, single in parts:
                with ZipFile(single) as src:
                    for name in src.namelist():
                        archive.writestr(name, src.read(name))
            archive.writestr("index.html", package_bundle._landing_page(index_entries))
            archive.writestr("README-中文.txt", _readme(new_entries, index_entries))

    print(f"增量素材包 -> {output.resolve()}")
    print(f"  打包 {len(new_entries)} 篇，目录页列出 {len(index_entries)} 篇")
    return output


def main():
    parser = argparse.ArgumentParser(description="只打新增篇目，但目录页列出全部篇目")
    parser.add_argument("output")
    parser.add_argument("--new", nargs="+", required=True, help="要真正打包的 article.json")
    parser.add_argument("--index-all", nargs="+", required=True, help="目录页要列出的全部 article.json")
    args = parser.parse_args()
    build_increment(args.new, args.index_all, args.output)


if __name__ == "__main__":
    main()
