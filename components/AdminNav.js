"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "▦", exact: true },
  { href: "/admin/articles", label: "Articles", icon: "📄" },
  { href: "/admin/articles/new", label: "New Article", icon: "➕" },
  { href: "/admin/categories", label: "Categories", icon: "🏷" },
  { href: "/admin/comments", label: "Comments", icon: "💬" },
];

const ADMIN_LINKS = [{ href: "/admin/users", label: "Users", icon: "👥" }];

export default function AdminNav({ role }) {
  const pathname = usePathname();
  const isActive = (link) =>
    link.exact
      ? pathname === link.href
      : pathname === link.href || pathname.startsWith(link.href + "/");

  return (
    <nav className="admin-nav">
      <div className="sep">Content</div>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={isActive(l) ? "active" : ""}
        >
          <span>{l.icon}</span>
          {l.label}
        </Link>
      ))}
      {role === "admin" ? (
        <>
          <div className="sep">Settings</div>
          {ADMIN_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l) ? "active" : ""}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </>
      ) : null}
    </nav>
  );
}
