import Link from "next/link";
import { ArticleCard } from "../../../components/ArticleCard";
import { searchArticles, listMainCategories } from "../../../lib/queries";
import { getCatIcon } from "../../../lib/cat-icons";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q || "").toString().trim();
  const results = q ? searchArticles(q) : [];
  const categories = listMainCategories();

  return (
    <main className="page">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <span>Search</span>
        </div>

        <h1 style={{ marginBottom: 16 }}>
          {q ? `Results for “${q}”` : "Search Howcompass"}
        </h1>

        <form
          className="search"
          action="/search"
          method="get"
          style={{ maxWidth: 640, marginBottom: 28 }}
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="How to…"
            aria-label="Search how-tos"
          />
          <button type="submit">Search</button>
        </form>

        {q ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            {results.length} how-to{results.length === 1 ? "" : "s"} found
          </p>
        ) : null}

        {q && results.length === 0 ? (
          <div className="empty">
            <span className="wk-cat-emoji" style={{ margin: "0 auto 12px" }}>
              <img src="/img/cat-icons/travel.jpg" alt="" className="wk-cat-icon-img" />
            </span>
            <h3>No results for “{q}”</h3>
            <p>Try a broader phrase, like “pasta”, “garden”, or “resume”.</p>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/categories" className="btn btn-primary">
                Browse categories
              </Link>
              <Link href="/" className="btn btn-outline">
                Back home
              </Link>
            </div>
          </div>
        ) : null}

        {results.length > 0 ? (
          <div className="card-grid">
            {results.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : null}

        {!q ? (
          <section>
            <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>
              Popular categories
            </h2>
            <div className="wk-cat-grid">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="wk-cat-card"
                >
                  <span className="wk-cat-emoji">
                    <img
                      src={getCatIcon(c.slug)}
                      alt={c.name}
                      className="wk-cat-icon-img"
                    />
                  </span>
                  <span className="wk-cat-text">
                    <strong>{c.name}</strong>
                    <span>{c.article_count} how-tos</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
