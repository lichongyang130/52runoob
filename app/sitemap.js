import { listArticles, listCategories } from "../lib/queries";

export const dynamic = "force-dynamic";

export default function sitemap() {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const staticPaths = [
    "",
    "/categories",
    "/wikiHow",
    "/search",
    "/about",
    "/privacy",
    "/terms",
  ];
  const categories = listCategories().map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const articles = listArticles({ limit: 1000 }).map((a) => ({
    url: `${base}/wikiHow/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "monthly",
    priority: 0.9,
  }));
  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      priority: p === "" ? 1 : 0.6,
    })),
    ...categories,
    ...articles,
  ];
}
