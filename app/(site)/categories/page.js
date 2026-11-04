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
  { name: "Games", slug: "Games", parent: "Hobbies and Crafts", icon: "/img/cat-icons/games.jpg" },
  { name: "Drawing", slug: "Drawing", parent: "Hobbies and Crafts", icon: "/img/cat-icons/drawing.jpg" },
  { name: "Crafts", slug: "Crafts", parent: "Hobbies and Crafts", icon: "/img/cat-icons/crafts.jpg" },
  { name: "Board Games", slug: "Board-Games", parent: "Games", icon: "/img/cat-icons/boardgames.jpg" },
  { name: "Card Games", slug: "Card-Games", parent: "Games", icon: "/img/cat-icons/cardgames.jpg" },
  { name: "Party Games", slug: "Party-Games", parent: "Games", icon: "/img/cat-icons/partygames.jpg" },
  { name: "Computers", slug: "Computers", parent: "Computers and Electronics", icon: "/img/cat-icons/computers.jpg" },
  { name: "Houseplants", slug: "Houseplants", parent: "Home and Garden", icon: "/img/cat-icons/home.jpg" },
];

const CAT_ICON_BY_SLUG = {
  "Arts-and-Entertainment": "/img/cat-icons/arts.jpg",
  "Food-and-Entertaining": "/img/cat-icons/food.jpg",
  "Finance-and-Business": "/img/cat-icons/finance.jpg",
  Health: "/img/cat-icons/health.jpg",
  "Hobbies-and-Crafts": "/img/cat-icons/hobbies.jpg",
  "Home-and-Garden": "/img/cat-icons/home.jpg",
  "Pets-and-Animals": "/img/cat-icons/pets.jpg",
  "Work-World": "/img/cat-icons/work.jpg",
  "Computers-and-Electronics": "/img/cat-icons/computers.jpg",
  "Education-and-Communications": "/img/cat-icons/education.jpg",
  "Family-Life": "/img/cat-icons/family.jpg",
  "Sports-and-Fitness": "/img/cat-icons/sports.jpg",
  "Cars-and-Other-Vehicles": "/img/cat-icons/cars.jpg",
  "Holidays-and-Traditions": "/img/cat-icons/holidays.jpg",
  "Personal-Care-and-Style": "/img/cat-icons/style.jpg",
  "Philosophy-and-Religion": "/img/cat-icons/philosophy.jpg",
  Relationships: "/img/cat-icons/relationships.jpg",
  "Relationship-Quizzes": "/img/cat-icons/quizzes.jpg",
  Travel: "/img/cat-icons/travel.jpg",
  Youth: "/img/cat-icons/youth.jpg",
};

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
                <span className="wk-cat-emoji">
                  <img
                    src={s.icon}
                    alt={s.name}
                    className="wk-cat-icon-img"
                  />
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
            const articles = listArticles({ categoryId: c.id, limit: 8 });
            const enrich = getPrimaryEnrichment(c.slug);
            return (
              <section key={c.id} className="wk-card" style={{ padding: 22 }}>
                <div className="section-head" style={{ marginBottom: 12 }}>
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <span className="cat-emoji wk-cat-emoji">
                      <img
                        src={CAT_ICON_BY_SLUG[c.slug] || "/img/cat-icons/arts.jpg"}
                        alt={c.name}
                        className="wk-cat-icon-img"
                      />
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
