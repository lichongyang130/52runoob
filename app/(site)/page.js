import Link from 'next/link';
import { Illustration } from '../../components/Illustration';
import { ArticleCard, MiniCard } from '../../components/ArticleCard';
import { listCategories, listArticles, popularArticles } from '../../lib/queries';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const categories = listCategories();
  const featured = listArticles({ featured: true, limit: 5 });
  const latest = listArticles({ limit: 9 });
  const popular = popularArticles(6);
  const hero = featured[0] || latest[0];
  const sideFeatures = (featured.length > 1 ? featured.slice(1) : latest.slice(1)).slice(0, 3);

  return (
    <main>
      {/* ---------------------------------- hero --------------------------------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-badge">🌿 Learn how to do just about anything</span>
            <h1>
              Learn how to do <span style={{ color: 'var(--green-dark)' }}>anything</span>, one
              clear step at a time.
            </h1>
            <p className="lead">
              Thousands of illustrated how-tos written by people who actually did the thing.
              No fluff, no paywall — just steps you can follow today.
            </p>
            <div className="inline-form" style={{ marginTop: 22, maxWidth: 520 }}>
              <form className="search" action="/search" method="get" style={{ width: '100%' }}>
                <input type="search" name="q" placeholder="What do you want to learn today?" aria-label="Search how-tos" />
                <button type="submit">Search</button>
              </form>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{categories.reduce((n, c) => n + c.article_count, 0)}</strong>
                <span>How-tos</span>
              </div>
              <div className="hero-stat">
                <strong>{categories.length}</strong>
                <span>Categories</span>
              </div>
              <div className="hero-stat">
                <strong>100%</strong>
                <span>Free to read</span>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <Link href={`/wikiHow/${hero?.slug || ''}`} aria-label={hero?.title}>
              <Illustration name={hero?.hero_image || 'idea'} ratio="3 / 4" />
            </Link>
            <Link href={`/wikiHow/${latest[1]?.slug || ''}`} aria-label={latest[1]?.title}>
              <Illustration name={latest[1]?.hero_image || 'books'} ratio="4 / 3" />
            </Link>
            <Link href={`/wikiHow/${latest[2]?.slug || ''}`} aria-label={latest[2]?.title}>
              <Illustration name={latest[2]?.hero_image || 'camera'} ratio="4 / 3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------- categories ------------------------------ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Browse by topic</div>
              <h2>Pick a category, start learning</h2>
            </div>
            <Link href="/categories" className="btn btn-outline btn-sm">
              All categories →
            </Link>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="cat-card">
                <span className="cat-emoji" style={{ background: `${c.color}1f` }}>
                  {c.emoji}
                </span>
                <span>
                  <h3>{c.name}</h3>
                  <span className="count">{c.article_count} how-tos</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- featured ------------------------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Featured this week</div>
              <h2>Hand-picked guides to get you started</h2>
            </div>
          </div>
          <div className="feature-grid">
            {hero ? (
              <Link href={`/wikiHow/${hero.slug}`} className="feature-main">
                <Illustration name={hero.hero_image || 'idea'} />
                <div className="card-body">
                  <span className="card-tag" style={{ position: 'static', alignSelf: 'flex-start', marginBottom: 8 }}>
                    {hero.category_name}
                  </span>
                  <h3>{hero.title}</h3>
                  <p>{hero.summary}</p>
                  <div className="card-meta">
                    <span>⏱ {hero.read_time} min</span>
                    <span>👍 {hero.helpful_yes} found this helpful</span>
                  </div>
                </div>
              </Link>
            ) : null}
            <div className="feature-side">
              {sideFeatures.map((a) => (
                <MiniCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------- latest ------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Fresh from the community</div>
              <h2>Recently updated how-tos</h2>
            </div>
            <Link href="/search" className="btn btn-outline btn-sm">
              Browse all →
            </Link>
          </div>
          <div className="card-grid">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- popular ------------------------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="hero-grid" style={{ alignItems: 'start', gap: 40 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Trending now
              </div>
              <h2 style={{ marginBottom: 18 }}>Most-read how-tos this month</h2>
              <div className="trend-list">
                {popular.map((a, i) => (
                  <Link key={a.id} href={`/wikiHow/${a.slug}`} className="trend-item">
                    <span className="trend-num">{i + 1}</span>
                    <span>
                      <h4>{a.title}</h4>
                      <div className="meta">
                        {a.category_name} · {Number(a.views).toLocaleString()} views
                      </div>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="panel" style={{ background: '#fff', margin: 0 }}>
              <h3>
                <span className="panel-icon">✍️</span> Be part of the manual
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--ink-soft)' }}>
                Every word on this site started as someone&apos;s real experience. Share a skill you
                have and help thousands of readers do it too.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <Link href="/about#contribute" className="btn btn-primary">
                  Start writing
                </Link>
                <Link href="/about" className="btn btn-outline">
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
