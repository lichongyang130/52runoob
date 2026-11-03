import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleEditor from "../../../../../components/ArticleEditor";
import { getArticleById, listCategories } from "../../../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const article = getArticleById(Number(id));
  if (!article) notFound();
  const categories = listCategories();

  return (
    <div>
      {sp?.saved ? (
        <div className="alert alert-ok">✅ Article saved successfully.</div>
      ) : null}
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin/articles" style={{ fontSize: 13, fontWeight: 600 }}>
          ← Back to articles
        </Link>
      </div>
      <ArticleEditor article={article} categories={categories} />
    </div>
  );
}
