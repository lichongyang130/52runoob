import Link from "next/link";
import { listArticles, listCategories } from "../../../lib/queries";
import { getCatIcon } from "../../../lib/cat-icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "All How-Tos" };

const SORTS = {
  newest: "Recently updated",
  popular: "Most read",
  alpha: "A–Z",
};

export default async function AllHowTosPage({ searchParams }) {
  const sp = await searchParams;
  const sort = Object.keys(SORTS).includes(sp?.sort) ? sp.sort : "newest";

  let articles = listArticles({ limit: 500 });
  if (sort === "popular") {
    articles = [...articles].sort((a, b) => b.views - a.views);
  } else if (sort === "alpha") {
    articles = [...articles].sort((a, b) => a.title.localeCompare(b.title));
  }

  const categories = listCategories();
  const grouped = categories
    .map((c) => ({
      category: c,
      items: articles.filter((a) => a.category_id === c.id),
    }))
    .filter((g) => g.items.length);

  return (
    <main className="page">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <span>All how-tos</span>
        </div>

        <div className="section-head">
          <div>
            <div className="eyebrow">Complete index</div>
            <h1 style={{ marginBottom: 4 }}>All How-Tos</h1>
            <p>
              {articles.length} illustrated guides,{" "}
              {sort === "popular" ? "sorted by reads" : sort === "alpha" ? "sorted A–Z" : "newest first"}
              .
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <form method="get" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label htmlFor="sort" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>
                Sort
              </label>
              <select id="sort" name="sort" className="select" defaultValue={sort} style={{ width: "auto" }}>
                {Object.entries(SORTS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button className="btn btn-outline btn-sm" type="submit">
                Apply
              </button>
            </form>
            <Link href="/random" className="btn btn-outline btn-sm">
              Surprise me
            </Link>
          </div>
        </div>

        <div style={{ display: "grid", gap: 26 }}>
          {grouped.map(({ category, items }) => (
            <section
              key={category.id}
              className="panel"
              style={{ marginBottom: 0 }}
            >
              <h3 style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span className="wk-cat-emoji" style={{ width: 38, height: 38 }}>
                  <img
                    src={getCatIcon(category.slug)}
                    alt={category.name}
                    className="wk-cat-icon-img"
                  />
                </span>
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    fontWeight: 400,
                    marginLeft: 8,
                  }}
                >
                  ({items.length})
                </span>
              </h3>
              <ul className="aside-list multi-col">
                {items.map((a) => (
                  <li key={a.id}>
                    <Link href={`/how-to/${a.slug}`}>How to {a.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
