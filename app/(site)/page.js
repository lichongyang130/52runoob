import Link from "next/link";
import { Illustration } from "../../components/Illustration";
import BooksIllustration from "../../components/BooksIllustration";
import { MiniCard } from "../../components/ArticleCard";
import {
  listMainCategories,
  listArticles,
  popularArticles,
  randomArticle,
} from "../../lib/queries";

export const dynamic = "force-dynamic";

const BADGE_BY_CATEGORY = {
  Health: "Expert Q&A",
  "Finance-and-Business": "Review",
  "Food-and-Entertaining": "Tested",
  "Home-and-Garden": "Tested",
  "Pets-and-Animals": "Expert Q&A",
  "Work-World": "Review",
};

export default function HomePage() {
  /* Homepage showcases categories that actually have articles, most-filled
     first — empty ones stay reachable from /categories and the Explore menu. */
  const categories = listMainCategories()
    .filter((c) => c.article_count > 0)
    .sort((a, b) => b.article_count - a.article_count);
  const trending = popularArticles(6);
  const featured = listArticles({ featured: true, limit: 4 });
  const latest = listArticles({ limit: 4 });
  const pick = latest[0] || featured[0];
  const totalCount = categories.reduce((n, c) => n + c.article_count, 0);
  const random = randomArticle();

  return (
    <main className="wk-home">
      {/* --------------------------------- hero --------------------------------- */}
      <section className="wk-hero">
        <div className="container wk-hero-grid">
          <div className="wk-hero-copy">
            <h1>
              Welcome to Howcompass, the most trusted how-to site on the internet.
            </h1>
            <p className="wk-hero-sub">What will you learn on Howcompass today?</p>

            <form
              className="wk-hero-search"
              action="/search"
              method="get"
              role="search"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="wk-search-icon"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5L21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="search"
                name="q"
                placeholder="Search how to..."
                aria-label="Search how to"
              />
              <button type="submit">Search</button>
            </form>

            <Link href="/random" className="wk-dice">
              Roll the Compass
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3.5"
                  y="3.5"
                  width="17"
                  height="17"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
              </svg>
            </Link>
          </div>

          <div className="wk-hero-art">
            <BooksIllustration />
          </div>
        </div>
      </section>

      {/* ------------------------------- trending ------------------------------- */}
      <section className="wk-section">
        <div className="container">
          <div className="wk-section-head">
            <h2>Trending Now</h2>
            <Link href="/how-to?sort=popular" className="wk-more">
              See more trending
              <span aria-hidden="true">›</span>
            </Link>
          </div>

          <div className="wk-trend-grid">
            {trending.map((a, i) => (
              <Link
                key={a.id}
                href={`/how-to/${a.slug}`}
                className="wk-trend-card"
              >
                <div className="wk-trend-art">
                  <span className="wk-expert">
                    <span className="wk-expert-badge" aria-hidden="true">
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <circle cx="12" cy="9" r="3.6" fill="currentColor" />
                        <path
                          d="M4.8 20c1.5-3.4 4-5.1 7.2-5.1s5.7 1.7 7.2 5.1z"
                          fill="currentColor"
                        />
                        <path
                          d="M12 3.2l1.5 2.1-1.5 1.4-1.5-1.4z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    Expert
                  </span>
                  <Illustration name={a.hero_image || "idea"} ratio="4 / 3" />
                  <span className="wk-rank">{i + 1}</span>
                </div>
                <div className="wk-trend-body">
                  <span className="wk-kicker">
                    {BADGE_BY_CATEGORY[a.category_slug] || "How-To"}
                  </span>
                  <h3>{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- how-to pick + featured ------------------------ */}
      <section className="wk-section wk-section-tint">
        <div className="container">
          <div className="wk-section-head">
            <h2>How-to of the day</h2>
            <Link href="/categories" className="wk-more">
              Browse all categories
              <span aria-hidden="true">›</span>
            </Link>
          </div>

          <div className="wk-featured-grid">
            {pick ? (
              <Link href={`/how-to/${pick.slug}`} className="wk-feature-main">
                <div className="wk-feature-art">
                  <Illustration
                    name={pick.hero_image || "idea"}
                    ratio="16 / 10"
                  />
                </div>
                <div className="wk-feature-body">
                  {pick.category_name ? (
                    <span className="wk-pill">{pick.category_name}</span>
                  ) : null}
                  <h3>How to {pick.title}</h3>
                  <p>{pick.summary}</p>
                  <div className="wk-feature-meta">
                    <span>⏱ {pick.read_time} min read</span>
                    <span>
                      👍 {Number(pick.helpful_yes || 0).toLocaleString()} found
                      helpful
                    </span>
                    <span>👁 {Number(pick.views).toLocaleString()} views</span>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="wk-feature-side">
              {featured.slice(0, 3).map((a) => (
                <MiniCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ categories ------------------------------ */}
      <section className="wk-section">
        <div className="container">
          <div className="wk-section-head">
            <h2>Explore {totalCount} how-tos</h2>
            <Link href="/categories" className="wk-more">
              See all {categories.length} categories
              <span aria-hidden="true">›</span>
            </Link>
          </div>

          <div className="wk-cat-grid">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="wk-cat-card"
              >
                <span
                  className="wk-cat-emoji"
                  style={{ background: `${c.color}22` }}
                >
                  {c.emoji}
                </span>
                <span className="wk-cat-text">
                  <strong>{c.name}</strong>
                  <span>
                    {c.article_count} {c.article_count === 1 ? "how-to" : "how-tos"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- latest ------------------------------- */}
      <section className="wk-section wk-section-tint">
        <div className="container">
          <div className="wk-section-head">
            <h2>Recently updated</h2>
            <Link href="/how-to" className="wk-more">
              All how-tos
              <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className="wk-latest-grid">
            {latest.map((a) => (
              <Link
                key={a.id}
                href={`/how-to/${a.slug}`}
                className="wk-latest-card"
              >
                <div className="wk-latest-art">
                  <Illustration name={a.hero_image || "idea"} ratio="16 / 9" />
                  {a.category_name ? (
                    <span className="wk-pill wk-pill-float">
                      {a.category_name}
                    </span>
                  ) : null}
                </div>
                <h3>How to {a.title}</h3>
                <p>{a.summary}</p>
                <span className="wk-latest-meta">
                  {Number(a.views).toLocaleString()} views · {a.read_time} min
                  read
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- CTA --------------------------------- */}
      <section className="wk-cta">
        <div className="container wk-cta-inner">
          <div>
            <h2>Anyone can write a how-to.</h2>
            <p>
              Every article on Howcompass started with someone who had done the
              thing and wanted to help. Share a skill you have — an editor will
              help you polish it.
            </p>
          </div>
          <div className="wk-cta-actions">
            <Link href="/about#contribute" className="wk-btn wk-btn-solid">
              Start writing
            </Link>
            {random ? (
              <Link
                href={`/how-to/${random.slug}`}
                className="wk-btn wk-btn-ghost"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
                  <circle cx="8.6" cy="8.6" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="15.4" cy="8.6" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="8.6" cy="15.4" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="15.4" cy="15.4" r="1.4" fill="currentColor" stroke="none" />
                </svg>
                Random how-to
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
