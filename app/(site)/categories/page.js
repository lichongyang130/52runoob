import Link from "next/link";
import { listCategories, listArticles } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Categories",
  description:
    "Browse every wikiHow category — from food and gardening to finance and fitness.",
};

export default function CategoriesPage() {
  const categories = listCategories();

  return (
    <main className="page">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <span>Categories</span>
        </div>

        <div className="section-head">
          <div>
            <div className="eyebrow">Explore</div>
            <h1 style={{ marginBottom: 6 }}>All Categories</h1>
            <p>
              Every how-to on the site lives in one of these {categories.length}{" "}
              categories.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 30 }}>
          {categories.map((c) => {
            const articles = listArticles({ categoryId: c.id, limit: 4 });
            return (
              <section key={c.id}>
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <span
                      className="cat-emoji"
                      style={{ background: `${c.color}1f` }}
                    >
                      {c.emoji}
                    </span>
                    <div>
                      <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
                        <Link href={`/category/${c.slug}`}>{c.name}</Link>
                      </h2>
                      <p style={{ margin: "2px 0 0" }}>
                        {c.description} · {c.article_count} how-tos
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/category/${c.slug}`}
                    className="btn btn-outline btn-sm"
                  >
                    View all →
                  </Link>
                </div>
                <div className="trend-list">
                  {articles.length === 0 ? (
                    <p style={{ fontSize: 14, color: "var(--muted)" }}>
                      No articles yet in this category.
                    </p>
                  ) : (
                    articles.map((a) => (
                      <Link
                        key={a.id}
                        href={`/wikiHow/${a.slug}`}
                        className="trend-item"
                      >
                        <span>
                          <h4>{a.title}</h4>
                          <div className="meta">
                            {a.read_time} min read ·{" "}
                            {Number(a.views).toLocaleString()} views
                          </div>
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
