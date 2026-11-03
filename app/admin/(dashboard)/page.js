import Link from "next/link";
import { adminStats, listArticles, listCategories } from "../../../lib/queries";
import db from "../../../lib/db";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const stats = adminStats();
  const recent = listArticles({ includeDrafts: true, limit: 6 });
  const categories = listCategories();
  const recentComments = db
    .prepare(
      `SELECT c.*, a.title, a.slug FROM comments c JOIN articles a ON a.id = c.article_id
       ORDER BY c.id DESC LIMIT 5`,
    )
    .all();

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Welcome back 👋</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
          Here is what is happening on your site today.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <span>Published</span>
          <strong>{stats.published}</strong>
        </div>
        <div className="stat">
          <span>Drafts</span>
          <strong>{stats.drafts}</strong>
        </div>
        <div className="stat">
          <span>Total views</span>
          <strong>{stats.views.toLocaleString()}</strong>
        </div>
        <div className="stat">
          <span>Comments</span>
          <strong>{stats.comments}</strong>
        </div>
        <div className="stat">
          <span>Categories</span>
          <strong>{stats.categories}</strong>
        </div>
        <div className="stat">
          <span>Users</span>
          <strong>{stats.users}</strong>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)",
          gap: 22,
        }}
        className="dash-cols"
      >
        <div className="panel-admin">
          <div className="panel-head">
            <h2>Recent articles</h2>
            <Link href="/admin/articles" className="btn btn-outline btn-sm">
              Manage all
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link
                        href={`/admin/articles/${a.id}`}
                        className="title-cell"
                      >
                        {a.title}
                      </Link>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {a.category_name || "Uncategorized"}
                      </div>
                    </td>
                    <td>
                      <span className={`pill pill-${a.status}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{Number(a.views).toLocaleString()}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={`/wikiHow/${a.slug}`}
                        className="btn btn-ghost btn-sm"
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="panel-admin">
            <div className="panel-head">
              <h2>Quick actions</h2>
            </div>
            <div style={{ display: "grid", gap: 9 }}>
              <Link
                href="/admin/articles/new"
                className="btn btn-primary btn-block"
              >
                ➕ New article
              </Link>
              <Link
                href="/admin/categories"
                className="btn btn-outline btn-block"
              >
                🏷 Manage categories
              </Link>
              <Link
                href="/admin/comments"
                className="btn btn-outline btn-block"
              >
                💬 Moderate comments
              </Link>
            </div>
          </div>

          <div className="panel-admin">
            <div className="panel-head">
              <h2>Latest comments</h2>
            </div>
            {recentComments.length === 0 ? (
              <p style={{ fontSize: 13.5, color: "var(--muted)", margin: 0 }}>
                No comments yet.
              </p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {recentComments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      fontSize: 13.5,
                      borderBottom: "1px solid #f1f3f4",
                      paddingBottom: 10,
                    }}
                  >
                    <b>{c.author}</b>{" "}
                    <span style={{ color: "var(--yellow)" }}>
                      {"★".repeat(c.rating || 0)}
                    </span>
                    <p style={{ margin: "3px 0", color: "var(--ink-soft)" }}>
                      {c.body.slice(0, 110)}
                    </p>
                    <Link
                      href={`/wikiHow/${c.slug}#comments`}
                      style={{ fontSize: 12 }}
                    >
                      on {c.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="panel-admin">
        <div className="panel-head">
          <h2>Categories at a glance</h2>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/categories?id=${c.id}`}
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
                <span className="count">{c.article_count} articles</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`@media (max-width: 900px){ .dash-cols{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
