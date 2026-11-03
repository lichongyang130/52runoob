import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "../../../../components/ArticleCard";
import {
  getCategoryBySlug,
  listArticles,
  listCategories,
  countArticles,
} from "../../../../lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} How-Tos`,
    description: category.description,
  };
}

const PAGE_SIZE = 9;

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page || "1", 10) || 1);
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = listArticles({
    categoryId: category.id,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const total = countArticles({ categoryId: category.id });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allCategories = listCategories();

  return (
    <main className="page">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <Link href="/categories">Categories</Link>
          <span className="sep">›</span>
          <span>{category.name}</span>
        </div>

        <div className="section-head">
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span
              className="cat-emoji"
              style={{
                width: 60,
                height: 60,
                fontSize: 28,
                background: `${category.color}1f`,
              }}
            >
              {category.emoji}
            </span>
            <div>
              <h1
                style={{
                  marginBottom: 4,
                  fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                }}
              >
                {category.name}
              </h1>
              <p>{category.description}</p>
              <p style={{ fontSize: 12.5, color: "var(--muted)", margin: 0 }}>
                {total} how-tos in this category
              </p>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="empty">
            <span className="big">🌱</span>
            <h3>Nothing here yet</h3>
            <p>Be the first to write a how-to in {category.name}.</p>
            <Link href="/admin/articles/new" className="btn btn-primary">
              Write an article
            </Link>
          </div>
        ) : (
          <div className="card-grid">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}

        {pages > 1 ? (
          <div className="pagination">
            <Link
              href={`/category/${slug}?page=${page - 1}`}
              className={page <= 1 ? "disabled" : ""}
            >
              ← Prev
            </Link>
            {Array.from({ length: pages }).map((_, i) => (
              <Link
                key={i}
                href={`/category/${slug}?page=${i + 1}`}
                className={page === i + 1 ? "current" : ""}
              >
                {i + 1}
              </Link>
            ))}
            <Link
              href={`/category/${slug}?page=${page + 1}`}
              className={page >= pages ? "disabled" : ""}
            >
              Next →
            </Link>
          </div>
        ) : null}

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Keep exploring</div>
              <h2 style={{ fontSize: "1.35rem" }}>Other categories</h2>
            </div>
          </div>
          <div className="cat-grid">
            {allCategories
              .filter((c) => c.slug !== slug)
              .slice(0, 8)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="cat-card"
                >
                  <span
                    className="cat-emoji"
                    style={{ background: `${c.color}1f` }}
                  >
                    {c.emoji}
                  </span>
                  <span>
                    <h3>{c.name}</h3>
                    <span className="count">{c.article_count} how-tos</span>
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
