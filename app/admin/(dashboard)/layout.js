import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/session";
import { logoutAction } from "../../../lib/admin-actions";
import AdminNav from "../../../components/AdminNav";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/" className="brand">
          <span className="logo-mark">h</span> Howcompass Admin
        </Link>
        <AdminNav role={user.role} />
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              Signed in as{" "}
              <b style={{ color: "var(--ink)" }}>
                {user.name || user.username}
              </b>{" "}
              · {user.role}
            </span>
            <Link href="/" className="btn btn-outline btn-sm" target="_blank">
              View site ↗
            </Link>
          </div>
          <form action={logoutAction}>
            <button className="btn btn-ghost btn-sm" type="submit">
              Log out
            </button>
          </form>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
