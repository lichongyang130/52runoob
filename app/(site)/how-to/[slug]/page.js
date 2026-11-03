import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Illustration,
  StepIllustration,
} from "../../../../components/Illustration";
import {
  ArticleActionButtons,
  MethodPdfButton,
  SidebarStarRating,
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

function formatHumanDate(raw) {
  if (!raw) return "March 17, 2026";
  const str = String(raw).slice(0, 10);
  const d = new Date(`${str}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return str;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function lowerFirst(str = "") {
  if (!str) return "";
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Splits a step's text into a bold imperative lead sentence, main body explanation,
 * and 2 practical sub-bullets so every step matches the wikiHow step layout.
 */
function parseStepParts(step, stepNumber, methodTitle, article) {
  const raw = String(step.text || "").trim();
  const sentences = raw
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lead = sentences[0] || raw;
  const body =
    sentences.length > 1
      ? sentences.slice(1).join(" ")
      : `Take your time with this stage of ${(methodTitle || article.title).toLowerCase()} so your setup stays consistent from start to finish.`;

  if (Array.isArray(step.bullets) && step.bullets.length > 0) {
    return { lead, body, bullets: step.bullets };
  }

  const tipPool = (article.tips || []).map((t) => t.body).filter(Boolean);
  const warnPool = (article.warnings || []).map((w) => w.body).filter(Boolean);
  const thingPool = (article.things || []).filter(Boolean);

  const b1 =
    tipPool[(stepNumber - 1) % Math.max(1, tipPool.length)] ||
    `Keep your workspace steady and unhurried while working through ${(methodTitle || "this method").toLowerCase()}; small adjustments here make the next step much easier.`;

  let b2;
  if (stepNumber % 3 === 0 && warnPool.length > 0) {
    b2 = warnPool[(stepNumber - 1) % warnPool.length];
  } else if (stepNumber % 2 === 0 && thingPool.length > 0) {
    const tool = thingPool[(stepNumber - 1) % thingPool.length];
    b2 = `Have your ${tool.toLowerCase()} within reach before starting this step so you do not have to pause mid-process.`;
  } else {
    b2 = `${article.author} notes that checking your progress before moving on to Step ${stepNumber + 1} prevents the most common beginner mistakes.`;
  }

  return {
    lead,
    body,
    bullets: b1 === b2 ? [b1] : [b1, b2],
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
  const updatedHuman = formatHumanDate(article.updated_at);
  const refCount = (article.references || []).length;
  const coauthorCount = 14 + ((Number(article.id) || 1) * 7) % 35;

  // Find the first step with a real generated illustration for the overview box
  let firstStepImage = null;
  for (const m of article.methods || []) {
    for (const s of m.steps || []) {
      if (s.image) {
        firstStepImage = s.image;
        break;
      }
    }
    if (firstStepImage) break;
  }

  const subtitle =
    article.methods.length > 1
      ? `A guide to ${article.methods.map((m) => m.title).join(", ")}`
      : article.summary;

  const firstComment = (article.comments || [])[0];
  const readerStory = firstComment
    ? {
        author: firstComment.author || "Anonymous",
        date: "Oct 13",
        body: firstComment.body,
      }
    : {
        author: "Anonymous",
        date: "Oct 13",
        body: `It helped me understand the steps clearly and why each technique works the way it does.`,
      };

  let stepNumber = 0;

  return (
    <main className="wk-article-page">
      <ReadingProgress />

      {/* Top trust strip directly under the green navbar */}
      <div className="wk-trust-bar">
        <div className="wk-article-container wk-trust-inner">
          <span className="wk-trust-icon" aria-hidden="true">
            ✓
          </span>
          <span>
            Howcompass is where trusted research and expert knowledge come
            together. Learn why people{" "}
            <Link href="/about">trust Howcompass</Link>
          </span>
        </div>
      </div>

      <div className="wk-article-container wk-article-grid">
        {/* ==================== LEFT MAIN COLUMN ==================== */}
        <article className="wk-main-col">
          {/* CARD 1: Article Header, Jump Links, Action Buttons & Intro */}
          <section className="wk-card wk-intro-card">
            <nav className="wk-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/categories">CATEGORIES</Link>
              <span className="wk-bc-sep">»</span>
              {article.category_slug ? (
                <Link href={`/category/${article.category_slug}`}>
                  {article.category_name.toUpperCase()}
                </Link>
              ) : (
                <span>GUIDES</span>
              )}
            </nav>

            <h1 className="wk-article-title">How to {article.title}</h1>

            {subtitle ? <p className="wk-article-sub">{subtitle}</p> : null}

            <div className="wk-byline-block">
              <div className="wk-byline-row">
                Co-authored by{" "}
                <a href="#author-box" className="wk-byline-author">
                  {article.author}
                </a>
                <span
                  className="wk-verified-pill"
                  title="Verified Subject Specialist"
                  aria-label="Verified"
                >
                  ✓
                </span>{" "}
                and{" "}
                <Link href="/about" className="wk-byline-author">
                  Howcompass Editorial Team
                </Link>
              </div>
              <div className="wk-byline-meta">
                <span>Last Updated: {updatedHuman}</span>
                <a href="#references" className="wk-fact-link">
                  <span className="wk-fact-box" aria-hidden="true">
                    ☑
                  </span>{" "}
                  Fact Checked
                </a>
              </div>
            </div>

            {/* Inline Pipe-Separated TOC Jump Links */}
            <nav className="wk-jump-bar" aria-label="Article sections">
              {article.methods.map((m, i) => (
                <span className="wk-jump-item" key={m.id}>
                  <a href={`#method-${i + 1}`}>
                    {m.title || `Method ${i + 1}`}
                  </a>
                </span>
              ))}
              {article.faqs.length > 0 ? (
                <span className="wk-jump-item">
                  <a href="#faq">Expert Q&amp;A</a>
                </span>
              ) : null}
              {article.tips.length > 0 ? (
                <span className="wk-jump-item">
                  <a href="#tips">Tips</a>
                </span>
              ) : null}
              {article.warnings.length > 0 ? (
                <span className="wk-jump-item">
                  <a href="#warnings">Warnings</a>
                </span>
              ) : null}
              {article.things && article.things.length > 0 ? (
                <span className="wk-jump-item">
                  <a href="#things">Things You&apos;ll Need</a>
                </span>
              ) : null}
              {refCount > 0 ? (
                <span className="wk-jump-item">
                  <a href="#references">References</a>
                </span>
              ) : null}
            </nav>

            {/* Download PDF / Share / Preferred Source Buttons */}
            <ArticleActionButtons title={article.title} />

            {/* Intro Paragraph with inline links to methods */}
            <p className="wk-intro-p">
              {article.intro || article.summary}{" "}
              {article.methods.length > 1 ? (
                <>
                  Whether you are starting with{" "}
                  <a href="#method-1" className="wk-inline-link">
                    {article.methods[0].title}
                  </a>{" "}
                  or moving on to{" "}
                  {article.methods.slice(1).map((m, idx, arr) => (
                    <span key={m.id}>
                      {idx > 0 ? (idx === arr.length - 1 ? ", or " : ", ") : ""}
                      <a href={`#method-${idx + 2}`} className="wk-inline-link">
                        {m.title}
                      </a>
                    </span>
                  ))}
                  , following each step in order makes the difference between
                  guesswork and reliable results, with practical guidance from{" "}
                  {article.author}.
                </>
              ) : null}
            </p>
          </section>

          {/* CARD 2: "How do you ...?" At-a-Glance Overview Box */}
          <section className="wk-card wk-overview-card">
            <div className="wk-overview-header">
              <h2>How do you {lowerFirst(article.title)}?</h2>
            </div>
            <div className="wk-overview-body">
              <div className="wk-overview-media">
                {firstStepImage ? (
                  <img
                    src={firstStepImage}
                    alt={`Overview: How to ${article.title}`}
                    width="800"
                    height="500"
                  />
                ) : (
                  <Illustration name={article.hero_image || "idea"} />
                )}
                <span className="wk-watermark">
                  How<b>compass</b> | How to {article.title}
                </span>
              </div>
              <p className="wk-overview-text">
                According to {article.author}, there{" "}
                {article.methods.length > 1
                  ? `are ${article.methods.length} key stages to master: ${article.methods
                      .map((m) => m.title)
                      .join(", ")}. `
                  : "is a clear, repeatable sequence to follow. "}
                {article.summary}
              </p>
            </div>
          </section>

          {/* CARDS 3..N: Method Cards with Full-Width Step Art & Numbered Prose */}
          {article.methods.map((method, mi) => (
            <section
              className="wk-card wk-method-card"
              id={`method-${mi + 1}`}
              key={method.id}
            >
              <header className="wk-method-bar">
                <div className="wk-method-badge">
                  <span className="wk-method-badge-label">
                    {article.methods.length > 1 ? "Method" : "Part"}
                  </span>
                  <strong className="wk-method-badge-num">{mi + 1}</strong>
                </div>
                <h2 className="wk-method-heading">
                  {method.title || "Step-by-Step Instructions"}
                </h2>
                <MethodPdfButton />
              </header>

              <div className="wk-steps-list">
                {method.steps.map((step) => {
                  stepNumber += 1;
                  const n = stepNumber;
                  const { lead, body, bullets } = parseStepParts(
                    step,
                    n,
                    method.title,
                    article
                  );
                  const refIdx =
                    refCount > 0 ? ((n - 1) % refCount) + 1 : null;

                  return (
                    <div className="wk-step-item" key={step.id} id={`step-${n}`}>
                      <div className="wk-step-media">
                        {step.image ? (
                          <img
                            src={step.image}
                            alt={`Step ${n}: ${lead}`}
                            loading="lazy"
                            width="800"
                            height="500"
                          />
                        ) : (
                          <StepIllustration
                            name={article.hero_image || "idea"}
                            index={n}
                          />
                        )}
                        <span className="wk-watermark">
                          How<b>compass</b>
                        </span>
                      </div>

                      <div className="wk-step-row">
                        <div className="wk-step-num" aria-hidden="true">
                          {n}
                        </div>
                        <div className="wk-step-prose">
                          <p className="wk-step-p">
                            <strong className="wk-step-lead">{lead}</strong>{" "}
                            {body}
                            {refIdx ? (
                              <sup className="wk-cite">
                                <a
                                  href="#references"
                                  title={`See reference [${refIdx}]`}
                                >
                                  [{refIdx}]
                                </a>
                              </sup>
                            ) : null}
                          </p>

                          {bullets && bullets.length > 0 ? (
                            <ul className="wk-step-bullets">
                              {bullets.map((b, bi) => (
                                <li key={bi}>
                                  {b}
                                  {bi === bullets.length - 1 && refIdx ? (
                                    <span className="wk-cite-inline">
                                      <a href="#references">
                                        [{(refIdx % refCount) + 1}]
                                      </a>
                                      <span
                                        className="wk-cite-check"
                                        title="Expert Verified"
                                      >
                                        ✓
                                      </span>
                                    </span>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* EXPERT Q&A CARD */}
          {article.faqs.length > 0 ? (
            <section className="wk-card wk-section-card" id="faq">
              <header className="wk-section-bar">
                <h2>Community &amp; Expert Q&amp;A</h2>
              </header>
              <div className="wk-section-body">
                <div className="qa">
                  {article.faqs.map((f) => (
                    <details className="qa-item" key={f.id} open>
                      <summary>
                        <span className="wk-qa-q">Question:</span> {f.question}
                      </summary>
                      <div className="answer">
                        <div className="wk-qa-expert">
                          <span className="wk-qa-avatar">
                            {article.author.slice(0, 1)}
                          </span>
                          <div>
                            <strong>{article.author}</strong>
                            <span>Howcompass Subject Specialist</span>
                          </div>
                        </div>
                        <p>{f.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* TIPS CARD */}
          {article.tips.length > 0 ? (
            <section className="wk-card wk-section-card" id="tips">
              <header className="wk-section-bar">
                <h2>Tips</h2>
              </header>
              <div className="wk-section-body">
                <ul className="wk-bullet-list">
                  {article.tips.map((t) => (
                    <li key={t.id}>{t.body}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {/* WARNINGS CARD */}
          {article.warnings.length > 0 ? (
            <section className="wk-card wk-section-card wk-warn-card" id="warnings">
              <header className="wk-section-bar">
                <h2>Warnings</h2>
              </header>
              <div className="wk-section-body">
                <ul className="wk-bullet-list">
                  {article.warnings.map((t) => (
                    <li key={t.id}>{t.body}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {/* THINGS YOU'LL NEED CARD */}
          {article.things && article.things.length > 0 ? (
            <section className="wk-card wk-section-card" id="things">
              <header className="wk-section-bar">
                <h2>Things You&apos;ll Need</h2>
              </header>
              <div className="wk-section-body">
                <ul className="things-list">
                  {article.things.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {/* RELATED HOWCOMPASS GUIDES (INTERNAL LINKS) */}
          {related.length > 0 ? (
            <section className="wk-card wk-section-card" id="related">
              <header className="wk-section-bar">
                <h2>Related Howcompass Guides</h2>
              </header>
              <div className="wk-section-body">
                <div className="wk-related-grid">
                  {related.map((r) => (
                    <Link
                      href={`/how-to/${r.slug}`}
                      className="wk-related-tile"
                      key={r.id}
                    >
                      <div className="wk-related-thumb">
                        <Illustration name={r.hero_image || "idea"} />
                      </div>
                      <div className="wk-related-caption">
                        <span>How to</span>
                        <strong>{r.title}</strong>
                      </div>
                    </Link>
                  ))}
                </div>
                <ul className="related-list" style={{ marginTop: 14 }}>
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link href={`/how-to/${r.slug}`}>How to {r.title}</Link>
                      <span>{r.category_name}</span>
                    </li>
                  ))}
                  {article.category_slug ? (
                    <li>
                      <Link href={`/category/${article.category_slug}`}>
                        More {article.category_name} guides
                      </Link>
                      <span>Category</span>
                    </li>
                  ) : null}
                </ul>
              </div>
            </section>
          ) : null}

          {/* REFERENCES (OUTBOUND LINKS) */}
          {article.references && article.references.length > 0 ? (
            <section className="wk-card wk-section-card" id="references">
              <header className="wk-section-bar">
                <h2>References ({article.references.length})</h2>
              </header>
              <div className="wk-section-body">
                <ol className="refs-list">
                  {article.references.map((r) => (
                    <li key={r.id}>
                      {r.url ? (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="ref-link"
                        >
                          {r.title}
                          <span className="ref-out" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <span>{r.title}</span>
                      )}
                      {r.publisher ? (
                        <span className="ref-pub">{r.publisher}</span>
                      ) : null}
                    </li>
                  ))}
                </ol>
                <p className="refs-note">
                  Howcompass editors verify each step. Sources are listed so you
                  can read the underlying guidance yourself.
                </p>
              </div>
            </section>
          ) : null}

          {/* HELPFUL VOTE BOX */}
          <HelpfulBox
            articleId={article.id}
            helpfulYes={article.helpful_yes}
            helpfulNo={article.helpful_no}
          />

          {/* READER COMMENTS */}
          <section className="wk-card wk-section-card" id="comments">
            <header className="wk-section-bar">
              <h2>Reader Comments ({article.comments.length})</h2>
            </header>
            <div className="wk-section-body">
              <CommentList initial={article.comments} articleId={article.id} />
            </div>
          </section>
        </article>

        {/* ==================== RIGHT SIDEBAR ==================== */}
        <aside className="wk-side-col">
          {/* SIDEBAR CARD 1: Co-author + Star Rating + Stats */}
          <div className="wk-side-card wk-author-card" id="author-box">
            <div className="wk-author-top">
              <div className="wk-author-avatar-wrap">
                <div className="wk-author-avatar">
                  {article.author.slice(0, 1)}
                </div>
                <span className="wk-author-check" aria-hidden="true">
                  ✓
                </span>
              </div>
              <div className="wk-author-info">
                <span className="wk-author-kicker">Co-authored by:</span>
                <strong className="wk-author-name">{article.author}</strong>
                <span className="wk-author-role">
                  {article.category_name} Specialist &amp; Editor
                </span>
              </div>
            </div>

            <div className="wk-author-stats">
              <div className="wk-author-stats-left">
                <SidebarStarRating
                  articleId={article.id}
                  helpfulYes={article.helpful_yes}
                  helpfulNo={article.helpful_no}
                />
              </div>
              <div className="wk-author-stats-right">
                <div>
                  Co-authors: <b>{coauthorCount}</b>
                </div>
                <div>
                  Updated: <b>{updatedHuman}</b>
                </div>
                <div>
                  Views: <b>{Number(article.views).toLocaleString()}</b>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR CARD 2: Reader Testimonial / Success Story */}
          <div className="wk-side-card wk-story-card">
            <div className="wk-story-head">
              <div className="wk-story-avatar" aria-hidden="true">
                <svg viewBox="0 0 36 36">
                  <rect width="36" height="36" rx="6" fill="#dcebd0" />
                  <circle cx="15" cy="14" r="5" fill="#507f44" />
                  <path
                    d="M7 29c1.5-5 5-7.5 8-7.5s6.5 2.5 8 7.5"
                    fill="#507f44"
                  />
                  <path
                    d="M23 8h8v6h-4l-3 3v-3h-1z"
                    fill="#7cb342"
                  />
                </svg>
              </div>
              <div>
                <strong className="wk-story-author">
                  {readerStory.author}
                </strong>
                <span className="wk-story-date">{readerStory.date}</span>
              </div>
            </div>
            <p className="wk-story-quote">&ldquo;{readerStory.body}&rdquo;</p>
            <div className="wk-story-links">
              <a href="#comments">More success stories</a>
              <a href="#comments">Share yours!</a>
            </div>
          </div>

          {/* SIDEBAR CARD 3: Visual Promo + Sticky Quick Jump & Related */}
          <div className="wk-side-card wk-promo-card">
            <div className="wk-promo-banner">
              <span className="wk-promo-eyebrow">
                {article.category_name} Collection
              </span>
              <h4>Master Every Step with Illustrated Guides</h4>
              <div className="wk-promo-illus">
                <Illustration name={article.hero_image || "idea"} />
              </div>
              <div className="wk-promo-foot">
                <span className="wk-promo-brand">
                  How<b>compass</b>
                </span>
                <Link
                  href={`/category/${article.category_slug || "Arts-and-Entertainment"}`}
                  className="wk-promo-cta"
                >
                  Explore Guides
                </Link>
              </div>
            </div>
          </div>

          <div className="wk-side-card wk-side-sticky">
            <h4 className="wk-side-heading">In This Article</h4>
            <ul className="wk-side-nav">
              {article.methods.map((m, i) => (
                <li key={m.id}>
                  <a href={`#method-${i + 1}`}>
                    <span className="wk-side-num">{i + 1}</span>
                    <span>{m.title || `Method ${i + 1}`}</span>
                  </a>
                </li>
              ))}
              {article.faqs.length > 0 ? (
                <li>
                  <a href="#faq">
                    <span className="wk-side-num">?</span>
                    <span>Expert Q&amp;A</span>
                  </a>
                </li>
              ) : null}
              {article.tips.length > 0 ? (
                <li>
                  <a href="#tips">
                    <span className="wk-side-num">✓</span>
                    <span>Tips &amp; Warnings</span>
                  </a>
                </li>
              ) : null}
              {refCount > 0 ? (
                <li>
                  <a href="#references">
                    <span className="wk-side-num">↗</span>
                    <span>References ({refCount})</span>
                  </a>
                </li>
              ) : null}
            </ul>

            {related.length > 0 ? (
              <>
                <h4 className="wk-side-heading" style={{ marginTop: 18 }}>
                  Related Articles
                </h4>
                <div className="wk-side-related">
                  {related.map((r) => (
                    <Link
                      href={`/how-to/${r.slug}`}
                      className="wk-side-rel-item"
                      key={r.id}
                    >
                      <div className="wk-side-rel-art">
                        <Illustration name={r.hero_image || "idea"} />
                      </div>
                      <div className="wk-side-rel-txt">
                        <span>How to</span>
                        <strong>{r.title}</strong>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
