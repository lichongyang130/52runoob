"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryBar({ categories = [] }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/how-to/")) return null;

  return (
    <div className="wk-catbar">
      <div className="wk-catbar-inner">
        <Link href="/how-to" className="wk-catbar-home">
          All how-tos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className={pathname === `/category/${c.slug}` ? "active" : ""}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
