import Link from 'next/link';
import { listArticles, listCategories } from '../../../lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'All How-Tos' };

export default function AllHowTosPage() {
  const articles = listArticles({ limit: 500 });
  const categories = listCategories();
  const grouped = categories
    .map((c) => ({ category: c, items: articles.filter((a) => a.category_id === c.id) }))
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
            <p>{articles.length} illustrated guides, grouped by category.</p>
          </div>
          <Link href="/random" className="btn btn-outline btn-sm">
            🎲 Surprise me
          </Link>
        </div>

        <div style={{ display: 'grid', gap: 26 }}>
          {grouped.map(({ category, items }) => (
            <section key={category.id} className="panel" style={{ marginBottom: 0 }}>
              <h3 style={{ marginBottom: 12 }}>
                <span style={{ marginRight: 8 }}>{category.emoji}</span>
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400, marginLeft: 8 }}>
                  ({items.length})
                </span>
              </h3>
              <ul className="aside-list multi-col">
                {items.map((a) => (
                  <li key={a.id}>
                    <Link href={`/wikiHow/${a.slug}`}>How to {a.title}</Link>
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
