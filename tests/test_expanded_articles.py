#!/usr/bin/env python3
"""Regression coverage for the 15–20-step production profile and static ZIP."""
import contextlib
import copy
import csv
import io
import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import sys
import tempfile
import unittest
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
import check_article  # noqa: E402
import package_article
import package_bundle  # noqa: E402
import package_increment  # noqa: E402
import make_preview_index  # noqa: E402
import render_article  # noqa: E402


class HTMLInventory(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.links = []
        self.step_ids = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "img":
            self.images.append(attrs)
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "article" and attrs.get("id", "").startswith("step-"):
            self.step_ids.append(attrs["id"])


class ExpandedArticleTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.directory = Path(self.tmp.name) / "article"
        self.directory.mkdir()
        original = ROOT / "content/Run-Your-First-5K"
        self.doc = json.loads((original / "article.json").read_text(encoding="utf-8"))
        (self.directory / "images").mkdir()
        for image in (original / "images").glob("*.webp"):
            shutil.copy2(image, self.directory / "images" / image.name)
        self.docfile = self.directory / "article.json"
        self.write_doc()

    def tearDown(self):
        self.tmp.cleanup()

    def write_doc(self):
        self.docfile.write_text(json.dumps(self.doc), encoding="utf-8")

    def check(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = check_article.main(str(self.docfile))
        return code, output.getvalue()

    def test_finished_article_passes_and_has_15_steps(self):
        code, output = self.check()
        self.assertEqual(code, 0, output)
        self.assertIn("步骤: 15", output)
        self.assertIn("0 error / 0 warning", output)

    def test_fourteen_or_twenty_one_steps_do_not_pass(self):
        original = list(self.doc["parts"][0]["steps"])
        self.doc["parts"][0]["steps"] = original[:-1]
        self.write_doc()
        code, output = self.check()
        self.assertNotEqual(code, 0)
        self.assertIn("步骤数 14", output)
        self.doc["parts"][0]["steps"] = original + [dict(original[0]) for _ in range(6)]
        self.write_doc()
        code, output = self.check()
        self.assertNotEqual(code, 0)
        self.assertIn("步骤数 21", output)

    def test_missing_image_and_alt_block_the_article(self):
        del self.doc["parts"][0]["steps"][0]["image"]
        self.doc["parts"][0]["steps"][1]["image"]["alt"] = ""
        self.write_doc()
        code, output = self.check()
        self.assertNotEqual(code, 0)
        self.assertIn("Step 1 无配图", output)
        self.assertIn("Step 2 缺少图片 alt", output)

    def test_duplicate_content_is_blocked_even_with_distinct_filenames(self):
        images = self.directory / "images"
        shutil.copyfile(images / "01-goal-1600.webp", images / "02-event-1600.webp")
        code, output = self.check()
        self.assertNotEqual(code, 0)
        self.assertIn("文章内必须互不相同", output)

    def test_missing_or_invalid_external_links_are_blocked(self):
        self.doc["externalLinks"] = []
        self.write_doc()
        code, output = self.check()
        self.assertNotEqual(code, 0)
        self.assertIn("出站链接 0 条，至少 2 条", output)
        self.doc["externalLinks"] = [
            {"label": "bad", "url": "javascript:alert(1)"},
            {"label": "internal", "url": "https://www.56juqingba.com/"},
        ]
        self.write_doc()
        code, output = self.check()
        self.assertNotEqual(code, 0)
        self.assertIn("站外 HTTPS 地址", output)

    def test_zip_has_all_images_links_and_review_notice(self):
        output = Path(self.tmp.name) / "output.zip"
        with contextlib.redirect_stdout(io.StringIO()):
            package_article.build_package(self.docfile, output)
        with ZipFile(output) as archive:
            self.assertIsNone(archive.testzip())
            root = "Run-Your-First-5K/"
            paths = set(archive.namelist())
            # 3 documents + 16 illustrations at two widths.
            self.assertEqual(len(paths), 35)
            document = archive.read(root + "index.html").decode("utf-8")
            inventory = HTMLInventory()
            inventory.feed(document)
            self.assertEqual(len(inventory.images), 16)
            self.assertEqual(len(inventory.step_ids), 15)
            self.assertEqual(len({image["src"] for image in inventory.images}), 16)
            for image in inventory.images:
                self.assertTrue(image.get("alt", "").strip())
                self.assertIn(root + image["src"], paths)
                # Both variants must be offered and both must actually be shipped,
                # otherwise a phone follows srcset straight into a 404.
                referenced = {
                    candidate.split()[0]
                    for candidate in image["srcset"].split(",")
                    if candidate.strip()
                }
                self.assertEqual(len(referenced), 2)
                self.assertTrue(any(ref.endswith("-960.webp") for ref in referenced))
                self.assertTrue(any(ref.endswith("-1600.webp") for ref in referenced))
                for ref in referenced:
                    self.assertIn(root + ref, paths)
            for link in self.doc["internalLinks"]:
                self.assertIn("https://www.56juqingba.com" + link["url"], inventory.links)
            for link in self.doc["externalLinks"]:
                self.assertIn(link["url"], inventory.links)
            self.assertIn("subject-matter review", document)
            self.assertIn("6 张使用此前制作", archive.read(root + "README-中文.txt").decode("utf-8"))
            for img in inventory.images:
                filename = img["src"].split("/")[-1]
                self.assertEqual(archive.read(root + img["src"]), (self.directory / "images" / filename).read_bytes())

    def test_zip_refuses_legacy_or_incomplete_documents(self):
        self.doc["requirements"]["stepMin"] = 9
        self.write_doc()
        with self.assertRaisesRegex(ValueError, "15–20"):
            package_article.build_package(self.docfile, Path(self.tmp.name) / "legacy.zip")
        self.doc["requirements"]["stepMin"] = 15
        self.doc["parts"][0]["steps"][0].pop("image")
        self.write_doc()
        with contextlib.redirect_stdout(io.StringIO()), self.assertRaisesRegex(ValueError, "体检未通过"):
            package_article.build_package(self.docfile, Path(self.tmp.name) / "incomplete.zip")

    def test_reference_urls_are_links_but_markup_is_escaped(self):
        output = render_article.reference_html('A <script>alert(1)</script> https://example.org/?a=1&b=2')
        self.assertNotIn('<script>', output)
        self.assertIn('&lt;script&gt;', output)
        self.assertIn('<a href="https://example.org/?a=1&amp;b=2"', output)


class InventoryTests(unittest.TestCase):
    def test_five_distinct_new_topics_per_category(self):
        with (ROOT / "content/expanded-plan.csv").open(encoding="utf-8", newline="") as file:
            rows = list(csv.DictReader(file))
        categories = Counter(row["category"] for row in rows)
        self.assertEqual(len(categories), 19)
        self.assertTrue(all(count == 5 for count in categories.values()))
        self.assertEqual(len({row["slug"].lower() for row in rows}), 95)
        self.assertTrue(all(row["title"].startswith("How to ") for row in rows))
        self.assertTrue(all(row["category_url"].startswith("/Category/") for row in rows))

    def test_recorded_image_progress_matches_the_files_on_disk(self):
        """Progress notes can never run ahead of the illustrations that actually exist."""
        for path in sorted((ROOT / "content").glob("*/article.json")):
            slug = path.parent.name
            if slug.startswith("_"):
                continue
            with self.subTest(slug=slug):
                article_dir = path.parent
                doc = json.loads(path.read_text(encoding="utf-8"))
                steps = [step for part in doc["parts"] for step in part["steps"]]
                missing = [step for step in steps if not step.get("image")]

                hero_base = doc["media"]["hero"]["base"]
                hero_ready = all(
                    (article_dir / "images" / f"{hero_base}-{width}.webp").is_file()
                    for width in ("960", "1600")
                )
                pending = len(missing) + (0 if hero_ready else 1)
                self.assertEqual(doc["publishing"]["imagePending"], pending)
                if "imageStatus" in doc:
                    self.assertEqual(doc["imageStatus"]["heroReady"], hero_ready)
                    self.assertEqual(
                        doc["imageStatus"]["stepImagesPending"],
                        [step["imageTodo"]["base"] for step in missing],
                    )
                    self.assertEqual(
                        doc["imageStatus"]["stepImagesReady"], len(steps) - len(missing)
                    )

                # Anything the document claims to have must be on disk at both widths.
                for step in steps:
                    if step.get("image"):
                        for width in ("960", "1600"):
                            asset = article_dir / "images" / f"{step['image']['base']}-{width}.webp"
                            self.assertTrue(asset.is_file(), f"missing {asset}")

    def test_an_incomplete_draft_cannot_be_packaged(self):
        """Packaging must refuse a guide that is still missing a step illustration.

        Built from a real finished guide with one image taken away, so the guard keeps
        working once every article on disk is complete.
        """
        source = ROOT / "content/Back-Up-Your-Photos"
        doc = json.loads((source / "article.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp) / source.name
            shutil.copytree(source, directory)
            dropped = doc["parts"][0]["steps"][0].pop("image")
            doc["parts"][0]["steps"][0]["imageTodo"] = dropped
            doc["publishing"]["imagePending"] = 1
            path = directory / "article.json"
            path.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")

            with contextlib.redirect_stdout(io.StringIO()):
                with self.assertRaisesRegex(ValueError, "体检未通过"):
                    package_article.build_package(path, Path(tmp) / "draft.zip")

    def test_finished_guides_are_fully_illustrated_with_original_art(self):
        """Every guide drawn from scratch must be complete and must not recycle other art."""
        for slug, category in (
            ("Repot-a-Houseplant", "Home and Garden"),
            ("Plan-a-Run-Walk-Workout", "Sports and Fitness"),
            ("Back-Up-Your-Photos", "Computers and Electronics"),
            ("Check-Your-Tire-Pressure", "Cars and Other Vehicles"),
            ("Meal-Prep-Safely-for-the-Week", "Food and Entertaining"),
            ("Build-an-Emergency-Fund", "Finance and Business"),
            ("Organize-Medicines-Safely-at-Home", "Health"),
            ("Pack-a-Personal-Item-for-a-Trip", "Travel"),
            ("Hold-a-Family-Meeting", "Family Life"),
            ("Build-a-Dog-Walking-Routine", "Pets and Animals"),
            ("Begin-a-Watercolor-Sketchbook", "Hobbies and Crafts"),
            ("Prepare-for-a-One-on-One-Meeting", "Work World"),
            ("Care-for-Dry-Hands", "Personal Care and Style"),
        ):
            with self.subTest(slug=slug):
                directory = ROOT / "content" / slug
                doc = json.loads((directory / "article.json").read_text(encoding="utf-8"))
                steps = [step for part in doc["parts"] for step in part["steps"]]
                self.assertEqual(len(steps), 15)
                self.assertEqual(doc["category"], category)
                self.assertEqual(doc["publishing"]["imagePending"], 0)
                self.assertEqual(doc["media"].get("reusedFrom"), {})
                self.assertEqual(doc["media"]["stylePending"], [])
                self.assertFalse(doc["publishing"]["expertReviewed"])

                digests = {}
                for image in [doc["media"]["hero"]] + [step["image"] for step in steps]:
                    self.assertTrue(image["alt"].strip())
                    # Alt text describes the picture; it is not a note to the illustrator.
                    self.assertNotRegex(image["alt"].lower(), r"no readable|no legible|abstract")
                    for width in ("960", "1600"):
                        asset = directory / "images" / f"{image['base']}-{width}.webp"
                        self.assertTrue(asset.is_file(), f"missing {asset}")
                        if width == "1600":
                            self.assertLessEqual(
                                asset.stat().st_size, 200_000, f"{asset.name} too heavy"
                            )
                            digests.setdefault(asset.read_bytes(), []).append(image["base"])
                self.assertEqual(len(digests), 16, "cover and step images must all differ")

                with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
                    output = Path(tmp) / f"{slug}.zip"
                    package_article.build_package(directory / "article.json", output)
                    with ZipFile(output) as archive:
                        self.assertIsNone(archive.testzip())
                        names = set(archive.namelist())
                        self.assertEqual(len(names), 35)
                        shipped = {n for n in names if n.endswith(".webp")}
                        self.assertEqual(
                            len({n for n in shipped if n.endswith("-960.webp")}), 16
                        )
                        self.assertEqual(
                            len({n for n in shipped if n.endswith("-1600.webp")}), 16
                        )
                        page = archive.read(f"{slug}/index.html").decode("utf-8")
                        inventory = HTMLInventory()
                        inventory.feed(page)
                        self.assertEqual(len(inventory.images), 16)
                        self.assertEqual(len(inventory.step_ids), 15)
                        self.assertEqual(len({i["alt"] for i in inventory.images}), 16)
                        for image in inventory.images:
                            self.assertIn(f"{slug}/" + image["src"], names)
                        readme = archive.read(f"{slug}/README-中文.txt").decode("utf-8")
                        self.assertIn("均为本文新制", readme)
                        # The review sentence has to name this article's own category.
                        self.assertIn(category, readme)

    def test_plan_status_matches_each_article_on_disk(self):
        with (ROOT / "content/expanded-plan.csv").open(encoding="utf-8", newline="") as file:
            rows = {row["slug"]: row for row in csv.DictReader(file)}
        for slug, row in rows.items():
            article = ROOT / "content" / slug / "article.json"
            if row["status"] == "planned":
                self.assertFalse(article.exists(), f"{slug} has a draft but is still marked planned")
            else:
                self.assertTrue(article.exists(), f"{slug} is marked {row['status']} without a draft")
                self.assertTrue(row["notes"].strip(), f"{slug} needs a progress note")


class IncrementPackageTests(unittest.TestCase):
    """增量包只装新增篇目，目录页却要列出服务器上最终会有的全部篇目。"""

    NEW = ["Care-for-Dry-Hands", "Prepare-for-a-One-on-One-Meeting"]
    OLD = ["Run-Your-First-5K", "Hold-a-Family-Meeting"]

    def _build(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        out = Path(tmp.name) / "add-on.zip"
        new = [str(ROOT / "content" / s / "article.json") for s in self.NEW]
        every = [str(ROOT / "content" / s / "article.json") for s in self.OLD + self.NEW]
        package_increment.build_increment(new, every, out)
        return out

    def test_only_new_articles_are_carried_but_index_lists_all(self):
        with contextlib.redirect_stdout(io.StringIO()):
            out = self._build()
        with ZipFile(out) as archive:
            names = archive.namelist()
            index = archive.read("index.html").decode("utf-8")
        folders = {name.split("/")[0] for name in names if "/" in name}
        self.assertEqual(folders, set(self.NEW), "增量包只应携带新增篇目的文件夹")
        self.assertEqual(len(names), len(self.NEW) * 35 + 2, "每篇 35 个条目，外加目录页与中文说明")
        for slug in self.OLD + self.NEW:
            self.assertIn(f'href="{slug}/index.html"', index, f"目录页漏了 {slug}")
        self.assertEqual(index.count('class="card"'), len(self.OLD + self.NEW))

    def test_carried_folders_match_the_standalone_packages(self):
        with contextlib.redirect_stdout(io.StringIO()):
            out = self._build()
            single = Path(out).with_name("single.zip")
            package_article.build_package(ROOT / "content" / self.NEW[0] / "article.json", single)
        with ZipFile(out) as bundle, ZipFile(single) as one:
            for name in one.namelist():
                self.assertEqual(bundle.read(name), one.read(name), f"{name} 与单篇包不一致")

    def test_new_article_missing_from_the_index_list_is_rejected(self):
        new = [str(ROOT / "content" / self.NEW[0] / "article.json")]
        every = [str(ROOT / "content" / s / "article.json") for s in self.OLD]
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        out = Path(tmp.name) / "broken.zip"
        with self.assertRaises(SystemExit):
            with contextlib.redirect_stdout(io.StringIO()):
                package_increment.build_increment(new, every, out)
        self.assertFalse(out.exists(), "校验失败时不应留下半成品压缩包")


class RendererRobustnessTests(unittest.TestCase):
    def test_markdown_warns_while_illustrations_are_missing(self):
        """The readable copy must announce an unfinished draft, and stop once it is complete.

        The incomplete side is built by removing images from a finished guide, so the
        warning stays under test even when nothing on disk is unfinished.
        """
        finished = json.loads((ROOT / "content/Run-Your-First-5K/article.json").read_text(encoding="utf-8"))
        self.assertEqual(render_article.pending_image_count(finished)[0], 0)
        self.assertNotIn("DRAFT — do not publish", render_article.render_markdown(finished))

        doc = copy.deepcopy(finished)
        for step in [s for part in doc["parts"] for s in part["steps"]][:3]:
            step["imageTodo"] = step.pop("image")
        missing, total = render_article.pending_image_count(doc)
        self.assertEqual((missing, total), (3, 16))
        banner = render_article.render_markdown(doc).splitlines()[0]
        self.assertIn("3 of 16 illustrations are still missing", banner)
        self.assertIn("DRAFT — do not publish", banner)

    def test_payload_survives_a_draft_without_publishing_metadata(self):
        """Hand-written drafts omit publishing fields; rendering must not crash."""
        doc = {
            "schema": "howly-guide/v1",
            "slug": "Example-Guide",
            "title": "How to Do Something",
            "seo": {"titleTag": "How to Do Something", "metaDescription": "Short description."},
            "category": "Home and Garden",
            "deck": "A deck.",
            "media": {"hero": {"base": "00-hero", "alt": "Hero"}},
            "tips": [],
            "warnings": [],
            "faq": [],
            "references": [],
        }
        payload = render_article.render_payload(doc, "<p>body</p>")
        self.assertEqual(payload["status"], "draft")
        self.assertEqual(payload["author"], "Editorial draft")
        self.assertIsNone(payload["datePublished"])


if __name__ == "__main__":
    unittest.main()


class BundleTests(unittest.TestCase):
    """The multi-article download must not become a way to ship unchecked work."""

    FINISHED = (
        "Run-Your-First-5K",
        "Repot-a-Houseplant",
        "Plan-a-Run-Walk-Workout",
        "Back-Up-Your-Photos",
        "Check-Your-Tire-Pressure",
        "Meal-Prep-Safely-for-the-Week",
        "Build-an-Emergency-Fund",
        "Organize-Medicines-Safely-at-Home",
        "Pack-a-Personal-Item-for-a-Trip",
        "Hold-a-Family-Meeting",
        "Build-a-Dog-Walking-Routine",
        "Begin-a-Watercolor-Sketchbook",
        "Prepare-for-a-One-on-One-Meeting",
        "Care-for-Dry-Hands",
    )

    def test_bundle_matches_the_single_article_packages_exactly(self):
        sources = [ROOT / "content" / slug / "article.json" for slug in self.FINISHED]
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            tmpdir = Path(tmp)
            bundle = tmpdir / "bundle.zip"
            package_bundle.build_bundle(sources, bundle)

            with ZipFile(bundle) as archive:
                self.assertIsNone(archive.testzip())
                names = set(archive.namelist())
                # One 35-entry folder per article, plus the landing page and bundle readme.
                self.assertEqual(len(names), len(self.FINISHED) * 35 + 2)

                for slug, source in zip(self.FINISHED, sources):
                    single = tmpdir / f"{slug}-single.zip"
                    package_article.build_package(source, single)
                    with ZipFile(single) as reference:
                        for name in reference.namelist():
                            self.assertIn(name, names)
                            self.assertEqual(archive.read(name), reference.read(name))

                landing = archive.read("index.html").decode("utf-8")
                inventory = HTMLInventory()
                inventory.feed(landing)
                self.assertEqual(len(inventory.images), len(self.FINISHED))
                for image in inventory.images:
                    self.assertIn(image["src"], names)
                    self.assertTrue(image.get("alt", "").strip())
                for slug in self.FINISHED:
                    self.assertIn(f"{slug}/index.html", landing)

                readme = archive.read("README-中文.txt").decode("utf-8")
                self.assertIn("不是已验证的文章系统导入包", readme)
                self.assertIn("尚未发布", readme)
                self.assertIn("真人进行事实与安全审校", readme)

    def test_repo_preview_index_resolves_and_rejects_unfinished_work(self):
        """The in-repo index must point at real files and must not flatter progress."""
        sources = [ROOT / "content" / slug / "article.json" for slug in self.FINISHED]
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            output = Path(tmp) / "index.html"
            make_preview_index.build_index(sources, output)
            page = output.read_text(encoding="utf-8")

            # Every local reference is resolved against preview/, where the page lives.
            preview = ROOT / "preview"
            local = [
                ref
                for ref in re.findall(r'(?:src|href)="([^"]+)"', page)
                if not ref.startswith(("http", "#", "mailto:", "data:"))
            ]
            self.assertTrue(local)
            for ref in local:
                self.assertTrue((preview / ref).resolve().is_file(), f"dangling {ref}")

            # No bundle-shaped paths survived the rewrite.
            self.assertNotIn("/index.html\"", page)
            self.assertNotIn("/Images/", page)

            # A guide that is still missing art cannot be listed as finished. Built from a
            # real finished guide with one image taken away, so the guard keeps working
            # once every article on disk is complete.
            source = ROOT / "content/Back-Up-Your-Photos"
            doc = json.loads((source / "article.json").read_text(encoding="utf-8"))
            directory = Path(tmp) / source.name
            shutil.copytree(source, directory)
            doc["parts"][0]["steps"][0]["imageTodo"] = doc["parts"][0]["steps"][0].pop("image")
            doc["publishing"]["imagePending"] = 1
            draft = directory / "article.json"
            draft.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")

            with self.assertRaisesRegex(ValueError, "配图"):
                make_preview_index.build_index([draft], Path(tmp) / "nope.html")
            self.assertFalse((Path(tmp) / "nope.html").exists())

    def test_bundle_refuses_an_unfinished_article(self):
        """One bad article must fail the whole bundle, not be quietly dropped."""
        source = ROOT / "content/Repot-a-Houseplant"
        doc = json.loads((source / "article.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp) / source.name
            shutil.copytree(source, directory)
            doc["parts"][0]["steps"][0]["imageTodo"] = doc["parts"][0]["steps"][0].pop("image")
            doc["publishing"]["imagePending"] = 1
            broken = directory / "article.json"
            broken.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")

            output = Path(tmp) / "bundle.zip"
            with contextlib.redirect_stdout(io.StringIO()):
                with self.assertRaises(ValueError):
                    package_bundle.build_bundle(
                        [ROOT / "content/Run-Your-First-5K/article.json", broken], output
                    )
            self.assertFalse(output.exists(), "失败的合集不能留下半成品文件")

    def test_bundle_rejects_a_duplicated_article(self):
        source = ROOT / "content/Run-Your-First-5K/article.json"
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            with self.assertRaisesRegex(ValueError, "重复"):
                package_bundle.build_bundle([source, source], Path(tmp) / "bundle.zip")
