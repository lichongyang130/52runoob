import Link from "next/link";
import { listCategories } from "../../../../lib/queries";
import {
  saveCategoryAction,
  deleteCategoryAction,
} from "../../../../lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({ searchParams }) {
  const sp = await searchParams;
  const categories = listCategories();
  const editing = sp?.id
    ? categories.find((c) => c.id === Number(sp.id))
    : null;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Categories</h1>
          <p
            style={{ color: "var(--muted)", fontSize: 13.5, margin: "4px 0 0" }}
          >
            {categories.length} categories organize every how-to on the site.
          </p>
        </div>
      </div>

      {sp?.saved ? <div className="alert alert-ok">Category saved.</div> : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 340px",
          gap: 22,
          alignItems: "start",
        }}
        className="cat-cols"
      >
        <div className="panel-admin">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Articles</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="cat-emoji"
                          style={{
                            width: 34,
                            height: 34,
                            fontSize: 16,
                            background: `${c.color}1f`,
                          }}
                        >
                          {c.emoji}
                        </span>
                        <div>
                          <b>{c.name}</b>
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>
                            {c.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5, color: "var(--muted)" }}>
                      /{c.slug}
                    </td>
                    <td>{c.article_count}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          href={`/admin/categories?id=${c.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </Link>
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button
                            className="btn btn-danger btn-sm"
                            type="submit"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-admin">
          <h2>{editing ? "Edit category" : "Add category"}</h2>
          <form action={saveCategoryAction}>
            {editing ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                className="input"
                defaultValue={editing?.name || ""}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                className="input"
                defaultValue={editing?.slug || ""}
                placeholder="auto from name"
              />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                style={{ minHeight: 64 }}
                defaultValue={editing?.description || ""}
              />
            </div>
            <div className="inline-form" style={{ marginBottom: 14 }}>
              <div className="field" style={{ maxWidth: 90 }}>
                <label htmlFor="emoji">Emoji</label>
                <input
                  id="emoji"
                  name="emoji"
                  className="input"
                  defaultValue={editing?.emoji || "📘"}
                />
              </div>
              <div className="field">
                <label htmlFor="color">Color</label>
                <input
                  id="color"
                  name="color"
                  type="color"
                  className="input"
                  style={{ height: 42, padding: 4 }}
                  defaultValue={editing?.color || "#7cb342"}
                />
              </div>
              <div className="field" style={{ maxWidth: 90 }}>
                <label htmlFor="position">Order</label>
                <input
                  id="position"
                  name="position"
                  type="number"
                  className="input"
                  defaultValue={editing?.position || 0}
                />
              </div>
            </div>
            <button className="btn btn-primary btn-block">
              {editing ? "Save changes" : "Create category"}
            </button>
            {editing ? (
              <Link
                href="/admin/categories"
                className="btn btn-ghost btn-block"
                style={{ marginTop: 8 }}
              >
                Cancel edit
              </Link>
            ) : null}
          </form>
        </div>
      </div>

      <style>{`@media (max-width: 900px){ .cat-cols{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
