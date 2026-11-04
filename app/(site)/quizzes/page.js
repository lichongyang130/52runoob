import Link from "next/link";
import QuizPlayer from "../../../components/QuizPlayer";
import { listArticles } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Interactive Illustrated Quizzes — Howcompass",
  description:
    "Test your practical mastery across classical drawing, artisan baking, botanical care, and cognitive study science with our illustrated quizzes.",
};

export default function QuizzesPage() {
  const quizArticles = listArticles({ categorySlug: "Relationship-Quizzes", limit: 4 });

  return (
    <main className="page wk-article-page" style={{ paddingTop: 28 }}>
      <div className="container">
        <div className="breadcrumbs" style={{ marginBottom: 14 }}>
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <span>Interactive Quizzes</span>
        </div>

        <div className="section-head" style={{ marginBottom: 22 }}>
          <div>
            <div className="eyebrow">Howcompass Knowledge Guild</div>
            <h1 style={{ marginBottom: 6 }}>Interactive Illustrated Quizzes</h1>
            <p style={{ maxWidth: 740, color: "var(--ink-soft)", margin: 0 }}>
              Choose a subject below to test your real-world intuition across art, culinary science,
              botanical care, and study mastery — each question is paired with a golden-hour oil painting
              and detailed explanation.
            </p>
          </div>
          <Link href="/random" className="btn btn-outline btn-sm">
            Random Guide →
          </Link>
        </div>

        <QuizPlayer />

        {quizArticles.length > 0 ? (
          <section style={{ marginTop: 42 }}>
            <div className="wk-section-head">
              <h2>Self-Reflection &amp; Relationship Assessment Guides</h2>
              <Link href="/category/Relationship-Quizzes" className="wk-more">
                View all assessment guides
                <span aria-hidden="true">›</span>
              </Link>
            </div>
            <div className="wk-latest-grid">
              {quizArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/how-to/${a.slug}`}
                  className="wk-latest-card"
                >
                  <div className="wk-latest-art">
                    <img
                      src={a.first_step_image || "/img/categories/quizzes-hero.jpg"}
                      alt={a.title}
                      style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <h3>How to {a.title}</h3>
                  <p>{a.summary}</p>
                  <span className="wk-latest-meta">
                    {Number(a.views).toLocaleString()} views · {a.read_time} min read
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
