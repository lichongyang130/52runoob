import Link from 'next/link';
import { listArticles, listCategories } from '../../../../lib/queries';
import { deleteArticleAction, toggleArticleStatusAction } from '../../../../lib/admin-actions';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q || '').toString().trim();
  const status = (sp?.status || '').toString();
  const categoryId = Number(sp?.category) || 0;

  let rows = listArticles({ includeDrafts: true, q: q || undefined, limit: 300 });
  if (status) rows = rows.filter((r) => r.status === status);
  if (categoryId) rows = rows.filter((r) => r.category_id === categoryId);
  const categories = listCategories();

  return (
    <div>
      <div className="panel-head">
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Articles</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: '4px 0 0' }}>
            {rows.length} article{rows.length === 1 ? '' : 's'} shown
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">
          ➕ New article
        </Link>
      </div>

      {sp?.deleted ? <div className="alert alert-ok">Article deleted.</div> : null}

      <div className="panel-admin">
        <form className="inline-form" method="get" style={{ marginBottom: 16 }}>
          <div className="field">
            <label htmlFor="q">Search</label>
            <input id="q" name="q" className="input" defaultValue={q} placeholder="Search titles…" />
          </div>
          <div className="field" style={{ maxWidth: 180 }}>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" className="select" defaultValue={status}>
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="field" style={{ maxWidth: 240 }}>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" className="select" defaultValue={categoryId || ''}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-navy" type="submit">
            Filter
          </button>
          <Link href="/admin/articles" className="btn btn-ghost">
            Reset
          </Link>
        </form>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>
                    No articles match these filters.
                  </td>
                </tr>
              ) : (
                rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/admin/articles/${a.id}`} className="title-cell">
                        {a.title}
                      </Link>
                      {a.featured ? (
                        <span className="pill pill-featured" style={{ marginLeft: 8 }}>
                          Featured
                        </span>
                      ) : null}
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>/wikiHow/{a.slug}</div>
                    </td>
                    <td>{a.category_name || '—'}</td>
                    <td>
                      <span className={`pill pill-${a.status}`}>{a.status}</span>
                    </td>
                    <td>{Number(a.views).toLocaleString()}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>{String(a.updated_at).slice(0, 10)}</td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/articles/${a.id}`} className="btn btn-outline btn-sm">
                          Edit
                        </Link>
                        <Link href={`/wikiHow/${a.slug}`} className="btn btn-ghost btn-sm" target="_blank">
                          View
                        </Link>
                        <form action={toggleArticleStatusAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <button className="btn btn-ghost btn-sm" type="submit">
                            {a.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                        </form>
                        <form action={deleteArticleAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <button className="btn btn-danger btn-sm" type="submit">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
