import Link from "next/link";
import db from "../../../../lib/db";
import {
  deleteCommentAction,
  toggleCommentApprovalAction,
} from "../../../../lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage({ searchParams }) {
  const sp = await searchParams;
  const comments = db
    .prepare(
      `SELECT c.*, a.title, a.slug FROM comments c JOIN articles a ON a.id = c.article_id
       ORDER BY c.id DESC LIMIT 300`,
    )
    .all();

  return (
    <div>
      <div className="panel-head">
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Comments</h1>
          <p
            style={{ color: "var(--muted)", fontSize: 13.5, margin: "4px 0 0" }}
          >
            {comments.length} comments across all articles
          </p>
        </div>
      </div>

      {sp?.deleted ? (
        <div className="alert alert-ok">Comment deleted.</div>
      ) : null}

      <div className="panel-admin">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Comment</th>
                <th>Article</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: 30,
                    }}
                  >
                    No comments yet.
                  </td>
                </tr>
              ) : (
                comments.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <b>{c.author}</b>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {String(c.created_at).slice(0, 10)}
                      </div>
                    </td>
                    <td style={{ maxWidth: 380 }}>{c.body}</td>
                    <td>
                      <Link
                        href={`/wikiHow/${c.slug}#comments`}
                        className="title-cell"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td style={{ color: "var(--yellow)" }}>
                      {"★".repeat(c.rating || 0)}
                    </td>
                    <td>
                      <span
                        className={`pill ${c.approved ? "pill-published" : "pill-draft"}`}
                      >
                        {c.approved ? "approved" : "hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <form action={toggleCommentApprovalAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button className="btn btn-outline btn-sm">
                            {c.approved ? "Hide" : "Approve"}
                          </button>
                        </form>
                        <form action={deleteCommentAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button className="btn btn-danger btn-sm">
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
