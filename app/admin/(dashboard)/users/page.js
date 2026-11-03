import { redirect } from "next/navigation";
import db from "../../../../lib/db";
import { getCurrentUser } from "../../../../lib/session";
import {
  saveUserAction,
  deleteUserAction,
} from "../../../../lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");
  const sp = await searchParams;
  if (me.role !== "admin") {
    return (
      <div className="panel-admin">
        <h2>Not available</h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Only administrators can manage users. You are signed in as an{" "}
          {me.role}.
        </p>
      </div>
    );
  }
  const users = db
    .prepare(
      "SELECT id, username, name, role, created_at FROM users ORDER BY id",
    )
    .all();

  return (
    <div>
      <div className="panel-head">
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Users</h1>
          <p
            style={{ color: "var(--muted)", fontSize: 13.5, margin: "4px 0 0" }}
          >
            Editors can write and publish articles. Admins can also manage
            users.
          </p>
        </div>
      </div>

      {sp?.saved ? <div className="alert alert-ok">User created.</div> : null}
      {sp?.deleted ? <div className="alert alert-ok">User removed.</div> : null}
      {sp?.error === "2" ? (
        <div className="alert alert-error">That username is already taken.</div>
      ) : null}
      {sp?.error === "1" ? (
        <div className="alert alert-error">
          Username and password are required.
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 340px",
          gap: 22,
          alignItems: "start",
        }}
        className="user-cols"
      >
        <div className="panel-admin">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <b>{u.name}</b>
                      {u.id === me.id ? (
                        <span
                          className="pill pill-featured"
                          style={{ marginLeft: 8 }}
                        >
                          you
                        </span>
                      ) : null}
                    </td>
                    <td style={{ color: "var(--muted)" }}>{u.username}</td>
                    <td>
                      <span
                        className={`pill ${u.role === "admin" ? "pill-featured" : "pill-published"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: "var(--muted)" }}>
                      {String(u.created_at).slice(0, 10)}
                    </td>
                    <td>
                      <div className="table-actions">
                        {u.id !== me.id ? (
                          <form action={deleteUserAction}>
                            <input type="hidden" name="id" value={u.id} />
                            <button className="btn btn-danger btn-sm">
                              Remove
                            </button>
                          </form>
                        ) : (
                          <span
                            style={{ fontSize: 12.5, color: "var(--muted)" }}
                          >
                            —
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-admin">
          <h2>Add user</h2>
          <form action={saveUserAction}>
            <div className="field">
              <label htmlFor="name">Display name</label>
              <input
                id="name"
                name="name"
                className="input"
                placeholder="Jamie Rivera"
              />
            </div>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                className="input"
                required
                placeholder="jamie"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                required
                minLength={6}
              />
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                className="select"
                defaultValue="editor"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary btn-block">Create user</button>
          </form>
        </div>
      </div>

      <style>{`@media (max-width: 900px){ .user-cols{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
