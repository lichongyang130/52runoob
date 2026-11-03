import Link from "next/link";
import { listMainCategories, listArticles } from "../../../lib/queries";
import { getPrimaryEnrichment } from "../../../lib/subcategories";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Categories",
  description:
    "Browse every Howcompass category and secondary topic — from games, drawing, and crafts to food, home, and technology.",
};

const POPULAR_SUBCATEGORIES = [
  { name: "Games", slug: "Games", parent: "Hobbies and Crafts", emoji: "🎲" },
  { name: "Drawing", slug: "Drawing", parent: "Hobbies and Crafts", emoji: "✏️" },
  { name: "Crafts", slug: "Crafts", parent: "Hobbies and Crafts", emoji: "🧶" },
  { name: "Board Games", slug: "Board-Games", parent: "Games", emoji: "♟️" },
  { name: "Card Games", slug: "Card-Games", parent: "Games", emoji: "🃏" },
  { name: "Party Games", slug: "Party-Games", parent: "Games", emoji: "🎉" },
  { name: "Computers", slug: "Computers", parent: "Computers and Electronics", emoji: "💻" },
  { name: "Houseplants", slug: "Houseplants", parent: "Home and Garden", emoji: "🪴" },
];

export default function CategoriesPage() {
  const categories = listMainCategories();

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
            <div className="eyebrow">Explore Howcompass</div>
            <h1 style={{ marginBottom: 6 }}>Explore Categories &amp; Topics</h1>
            <p>
              Find step-by-step illustrated guides by exploring a primary
              category or diving straight into a secondary topic like{" "}
              <Link href="/category/Games" className="wk-inline-link">
                Games
              </Link>
              ,{" "}
              <Link href="/category/Drawing" className="wk-inline-link">
                Drawing
              </Link>
              , or{" "}
              <Link href="/category/Crafts" className="wk-inline-link">
                Crafts
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Popular Secondary Categories (Subcategories) */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: 12 }}>
            Popular Secondary Categories
          </h2>
          <div className="wk-cat-grid">
            {POPULAR_SUBCATEGORIES.map((s) => (
              <Link
                key={s.slug}
                href={`/category/${s.slug}`}
                className="wk-cat-card"
              >
                <span
                  className="wk-cat-emoji"
                  style={{ background: "rgba(124, 179, 66, 0.14)" }}
                >
                  {s.emoji}
                </span>
                <span className="wk-cat-text">
                  <strong>{s.name}</strong>
                  <span>in {s.parent}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div style={{ display: "grid", gap: 30 }}>
          {categories.map((c) => {
            const articles = listArticles({ categoryId: c.id, limit: 4 });
            const enrich = getPrimaryEnrichment(c.slug);
            return (
              <section key={c.id} className="wk-card" style={{ padding: 22 }}>
                <div className="section-head" style={{ marginBottom: 12 }}>
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

                {enrich.featuredTopics && enrich.featuredTopics.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {enrich.featuredTopics.map((ft) => (
                      <Link
                        key={ft.name}
                        href={`/category/${ft.slug}`}
                        className="wk-reltopic-pill"
                      >
                        {ft.name}
                      </Link>
                    ))}
                  </div>
                ) : null}

                <div className="trend-list">
                  {articles.length === 0 ? (
                    <p style={{ fontSize: 14, color: "var(--muted)" }}>
                      No articles yet in this category.
                    </p>
                  ) : (
                    articles.map((a) => (
                      <Link
                        key={a.id}
                        href={`/how-to/${a.slug}`}
                        className="trend-item"
                      >
                        <span>
                          <h4>How to {a.title}</h4>
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
