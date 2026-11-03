import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Illustration,
  StepIllustration,
} from "../../../../components/Illustration";
import {
  HelpfulBox,
  CommentList,
} from "../../../../components/ArticleInteractions";
import ReadingProgress from "../../../../components/ReadingProgress";
import {
  getArticleBySlug,
  relatedArticles,
  incrementViews,
} from "../../../../lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: `How to ${article.title}`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  try {
    incrementViews(article.id);
  } catch (e) {
    /* view counting is best-effort */
  }

  const related = relatedArticles(article, 4);
  let stepNumber = 0;

  return (
    <main className="page">
      <ReadingProgress />
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <Link href="/categories">Categories</Link>
          <span className="sep">›</span>
          {article.category_slug ? (
            <>
              <Link href={`/category/${article.category_slug}`}>
                {article.category_name}
              </Link>
              <span className="sep">›</span>
            </>
          ) : null}
          <span>{article.title}</span>
        </div>

        <div className="article-layout">
          <article>
            <header className="article-head">
              <h1>How to {article.title}</h1>
              <div className="article-meta">
                <span>
                  Co-authored by{" "}
                  <b style={{ color: "var(--ink)" }}>{article.author}</b>
                </span>
                <span className="dot" />
                <span>Updated {String(article.updated_at).slice(0, 10)}</span>
                <span className="dot" />
                <span>{article.read_time} min read</span>
                <span className="dot" />
                <span>{Number(article.views).toLocaleString()} views</span>
              </div>
            </header>

            <div className="article-hero">
              <Illustration name={article.hero_image || "idea"} />
            </div>

            <div className="expert-badge">
              <span className="avatar">{article.author.slice(0, 1)}</span>
              <div>
                <b>Reviewed by the {article.author}</b>
                Our team of editors verifies each step for accuracy, safety, and
                clarity before publishing.
              </div>
            </div>

            {article.summary ? (
              <div className="summary-box">
                <strong>Quick summary: </strong>
                {article.summary}
              </div>
            ) : null}

            {article.methods.length > 0 ? (
              <nav className="toc" aria-label="Table of contents">
                <h4>What you&apos;ll find in this article</h4>
                <ol>
                  {article.methods.length > 1 ? (
                    <>
                      {article.methods.map((m, i) => (
                        <li key={m.id}>
                          <a href={`#method-${i + 1}`}>
                            {m.title || `Method ${i + 1}`}
                          </a>
                        </li>
                      ))}
                      {article.tips.length ? (
                        <li>
                          <a href="#tips">Tips</a>
                        </li>
                      ) : null}
                      {article.warnings.length ? (
                        <li>
                          <a href="#warnings">Warnings</a>
                        </li>
                      ) : null}
                      <li>
                        <a href="#things">Things You&apos;ll Need</a>
                      </li>
                      <li>
                        <a href="#faq">FAQ</a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <a href="#method-1">Step-by-step instructions</a>
                      </li>
                      {article.tips.length ? (
                        <li>
                          <a href="#tips">Tips</a>
                        </li>
                      ) : null}
                      {article.warnings.length ? (
                        <li>
                          <a href="#warnings">Warnings</a>
                        </li>
                      ) : null}
                      <li>
                        <a href="#things">Things You&apos;ll Need</a>
                      </li>
                      <li>
                        <a href="#faq">FAQ</a>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            ) : null}

            {article.intro ? (
              <p
                style={{
                  fontSize: 17,
                  color: "var(--ink-soft)",
                  marginBottom: 30,
                }}
              >
                {article.intro}
              </p>
            ) : null}

            {article.methods.map((method, mi) => (
              <section
                className="method"
                id={`method-${mi + 1}`}
                key={method.id}
              >
                {article.methods.length > 1 ? (
                  <h2 className="method-title">
                    <span className="method-num">{mi + 1}</span>
                    Method {mi + 1}: {method.title}
                  </h2>
                ) : (
                  <h2 className="method-title">
                    <span className="method-num">✓</span>
                    Step-by-step instructions
                  </h2>
                )}
                {method.steps.map((step) => {
                  stepNumber += 1;
                  const n = stepNumber;
                  return (
                    <div className="step" key={step.id}>
                      <div className="step-art">
                        <StepIllustration
                          name={article.hero_image || "idea"}
                          index={n}
                        />
                      </div>
                      <div className="step-body">
                        <h4>Step {n}</h4>
                        <p>{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </section>
            ))}

            {article.tips.length ? (
              <section className="panel panel-tip" id="tips">
                <h3>
                  <span className="panel-icon">💡</span> Tips
                </h3>
                <ul>
                  {article.tips.map((t) => (
                    <li key={t.id}>{t.body}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {article.warnings.length ? (
              <section className="panel panel-warn" id="warnings">
                <h3>
                  <span className="panel-icon">⚠️</span> Warnings
                </h3>
                <ul>
                  {article.warnings.map((t) => (
                    <li key={t.id}>{t.body}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {article.things && article.things.length ? (
              <section className="panel" id="things">
                <h3>
                  <span className="panel-icon">🧰</span> Things You&apos;ll Need
                </h3>
                <ul className="things-list">
                  {article.things.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {article.faqs.length ? (
              <section className="panel" id="faq">
                <h3>
                  <span className="panel-icon">❓</span> Frequently Asked
                  Questions
                </h3>
                <div className="qa">
                  {article.faqs.map((f) => (
                    <details className="qa-item" key={f.id}>
                      <summary>{f.question}</summary>
                      <div className="answer">{f.answer}</div>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <HelpfulBox
              articleId={article.id}
              helpfulYes={article.helpful_yes}
              helpfulNo={article.helpful_no}
            />

            <section className="panel" id="comments">
              <h3>
                <span className="panel-icon">💬</span> Reader Comments (
                {article.comments.length})
              </h3>
              <CommentList initial={article.comments} articleId={article.id} />
            </section>
          </article>

          <aside>
            <div className="aside-card sticky">
              <h4>In this article</h4>
              <ul className="aside-list">
                {article.methods.length > 1
                  ? article.methods.map((m, i) => (
                      <li key={m.id}>
                        <a href={`#method-${i + 1}`}>
                          {m.title || `Method ${i + 1}`}
                        </a>
                        <span className="meta">{m.steps.length} steps</span>
                      </li>
                    ))
                  : [
                      <li key="s">
                        <a href="#method-1">Step-by-step instructions</a>
                        <span className="meta">{article.step_count} steps</span>
                      </li>,
                    ]}
                <li>
                  <a href="#things">Things You&apos;ll Need</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#comments">Reader Comments</a>
                </li>
              </ul>
            </div>

            <div className="aside-card">
              <h4>Related how-tos</h4>
              <ul className="aside-list">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/how-to/${r.slug}`}>{r.title}</Link>
                    <span className="meta">{r.category_name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="aside-card"
              style={{ background: "var(--bg-warm)" }}
            >
              <h4>Keep learning</h4>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--ink-soft)",
                  marginBottom: 12,
                }}
              >
                Browse the full {article.category_name} category for more
                illustrated guides.
              </p>
              <Link
                href={`/category/${article.category_slug}`}
                className="btn btn-outline btn-sm btn-block"
              >
                More in {article.category_name}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
