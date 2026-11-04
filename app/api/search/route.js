import { NextResponse } from "next/server";
import { searchArticles } from "../../../lib/queries";
import { getCatIcon } from "../../../lib/cat-icons";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json({ results: [] });
  }
  const rows = searchArticles(q).slice(0, 6);
  const results = rows.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category_name: a.category_name || "Guide",
    category_slug: a.category_slug || "Arts-and-Entertainment",
    read_time: a.read_time || 8,
    image:
      a.first_step_image && a.first_step_image.startsWith("/")
        ? a.first_step_image
        : getCatIcon(a.category_slug),
  }));
  return NextResponse.json({ results });
}
