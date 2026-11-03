import Link from "next/link";
import { Illustration } from "../../../../components/Illustration";
import {
  RelatedTopicsTree,
  CategoryNewsletterCard,
} from "../../../../components/CategoryPageWidgets";
import {
  getCategoryBySlug,
  listArticles,
  listMainCategories,
} from "../../../../lib/queries";
import {
  getSubcategoryInfo,
  getPrimaryEnrichment,
  ARTS_ARTICLES,
  ARTS_NEW_ARTICLES,
} from "../../../../lib/subcategories";

export const dynamic = "force-dynamic";

function resolveCategoryView(rawSlug) {
  const decoded = decodeURIComponent(String(rawSlug || "")).replace(
    /^Category:/i,
    ""
  );
  const primary = getCategoryBySlug(decoded);

  if (primary) {
    const dbArticles = listArticles({ categoryId: primary.id, limit: 36 });
    const enrich = getPrimaryEnrichment(primary.slug);
    const pool = enrich.showcaseArticles || ARTS_ARTICLES;

    const combined = [
      ...dbArticles.map((a) => ({
        slug: a.slug,
        title: a.title,
        kicker: "How to",
        hero_image: a.hero_image || "idea",
        image: a.first_step_image || "",
        expert: true,
        featured: Boolean(a.featured),
      })),
    ];

    for (const extra of pool) {
      if (!combined.some((x) => x.slug === extra.slug)) {
        combined.push(extra);
      }
    }

    return {
      isSubcategory: false,
      slug: primary.slug,
      name: primary.name,
      parentSlug: null,
      parentName: "Categories",
      parentHref: "/categories",
      description: primary.description,
      introLinks: combined.slice(0, 4).map((a) => ({
        label: a.title,
        href: `/how-to/${a.slug}`,
      })),
      featuredTopics: enrich.featuredTopics,
      relatedTopics: enrich.relatedTopics,
      articles: combined,
      newArticles: enrich.newArticles || ARTS_NEW_ARTICLES,
    };
  }

  // Secondary category (subcategory) such as Games, Artwork, Books, Movies, Music, Crafts, Drawing
  const sub = getSubcategoryInfo(decoded);
  return {
    isSubcategory: true,
    slug: sub.slug,
    name: sub.name,
    parentSlug: sub.parentSlug,
    parentName: sub.parentName,
    parentHref: `/category/${sub.parentSlug}`,
    description: sub.description,
    introLinks:
      sub.introLinks ||
      sub.articles.slice(0, 4).map((a) => ({
        label: a.title,
        href: `/how-to/${a.slug}`,
      })),
    featuredTopics: sub.featuredTopics,
    relatedTopics: sub.relatedTopics,
    articles: sub.articles,
    newArticles: [],
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const view = resolveCategoryView(slug);
  return {
    title: `${view.name} - how to articles from Howcompass`,
    description: view.description,
  };
}

const PAGE_SIZE = 12;

function CategoryArticleTile({ item }) {
  return (
    <Link href={`/how-to/${item.slug}`} className="wk-cattile">
      <div className="wk-cattile-art">
        {item.image ? (
          <img
            src={item.image}
            alt={`How to ${item.title}`}
            loading="lazy"
            width="375"
            height="300"
          />
        ) : (
          <Illustration name={item.hero_image || "puzzle"} />
        )}
        {item.expert !== false ? (
          <span className="wk-expert">
            <span className="wk-expert-badge" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path
                  d="M3.5 8.5l3 3 6-6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Expert
          </span>
        ) : null}
      </div>
      <div className="wk-cattile-body">
        <span className="wk-cattile-kicker">{item.kicker || "How to"}</span>
        <h3 className="wk-cattile-title">{item.title}</h3>
      </div>
    </Link>
  );
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page || sp?.pg || "1", 10) || 1);

  const view = resolveCategoryView(slug);
  const allCategories = listMainCategories();

  // Primary categories show 4 Featured Articles (1 row of 4, like Category:Arts-and-Entertainment);
  // Secondary categories show up to 8 Featured Articles (2 rows of 4, like Category:Games).
  const featuredCap = view.isSubcategory ? 8 : 4;
  const featuredList = view.articles
    .filter((a) => a.featured)
    .slice(0, featuredCap);

  const allList = view.articles;
  const totalPages = Math.max(1, Math.ceil(allList.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedArticles = allList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main className="wk-catpage">
      {/* Top trust bar */}
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

      <div className="wk-article-container wk-catpage-grid">
        {/* ==================== LEFT MAIN COLUMN ==================== */}
        <div className="wk-catpage-main">
          {/* HERO / INTRO CARD */}
          <section className="wk-card wk-cat-hero">
            <div className="wk-cat-crumb-row">
              <Link
                href={view.parentHref}
                className="wk-cat-back"
                aria-label={`Back to ${view.parentName}`}
              >
                &lt;
              </Link>
              <nav className="wk-cat-crumbs" aria-label="Breadcrumb">
                <Link href="/categories">Categories</Link>
                {view.isSubcategory ? (
                  <>
                    <span className="wk-bc-sep">»</span>
                    <Link href={view.parentHref}>{view.parentName}</Link>
                  </>
                ) : null}
                <span className="wk-bc-sep">»</span>
                <span>{view.name}</span>
              </nav>
            </div>

            <h1 className="wk-cat-h1">{view.name}</h1>

            <p className="wk-cat-intro">
              {view.slug === "Arts-and-Entertainment" ? (
                <>
                  Learn to{" "}
                  <Link href="/how-to/Be-Well-Read" className="wk-inline-link">
                    be well read
                  </Link>
                  , become a better artist, and sell your own music with
                  Howcompass&apos;s Arts and Entertainment category. Our
                  articles can help you develop talent in multiple areas and be
                  a good entertainer. Check out how-tos on{" "}
                  <Link
                    href="/how-to/Be-a-Good-Ventriloquist"
                    className="wk-inline-link"
                  >
                    learning ventriloquism
                  </Link>
                  ,{" "}
                  <Link
                    href="/how-to/Make-a-Radio-Show"
                    className="wk-inline-link"
                  >
                    making your own radio show
                  </Link>
                  , becoming a professional{" "}
                  <Link href="/how-to/Tell-a-Story" className="wk-inline-link">
                    storyteller
                  </Link>
                  , and more.
                </>
              ) : view.name === "Games" ? (
                <>
                  Discover new games and become a master of your old favorites
                  with Howcompass&apos;s Games category! Learn all about classic
                  games, like{" "}
                  <Link href="/how-to/Play-Othello" className="wk-inline-link">
                    Othello
                  </Link>
                  ,{" "}
                  <Link href="/how-to/Play-Marbles" className="wk-inline-link">
                    marbles
                  </Link>
                  ,{" "}
                  <Link
                    href="/how-to/Play-Tiddlywinks"
                    className="wk-inline-link"
                  >
                    Tiddlywinks
                  </Link>
                  , and more! If you don&apos;t have any special supplies,
                  don&apos;t worry! You can still try a game like{" "}
                  <Link
                    href="/how-to/Play-Dots-and-Boxes"
                    className="wk-inline-link"
                  >
                    Dots and Boxes
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/how-to/Play-Chopsticks"
                    className="wk-inline-link"
                  >
                    Chopsticks
                  </Link>{" "}
                  instead. Dive in and prepare to have fun!
                </>
              ) : (
                <>
                  {view.description}{" "}
                  {view.introLinks && view.introLinks.length > 0 ? (
                    <>
                      Popular guides in {view.name} include{" "}
                      {view.introLinks.map((l, i, arr) => (
                        <span key={l.href}>
                          {i > 0
                            ? i === arr.length - 1
                              ? ", and "
                              : ", "
                            : ""}
                          <Link href={l.href} className="wk-inline-link">
                            {l.label}
                          </Link>
                        </span>
                      ))}
                      .
                    </>
                  ) : null}
                </>
              )}
            </p>

            {/* FEATURED TOPICS (4 Wide Banner Cards like Category:Arts-and-Entertainment) */}
            {view.featuredTopics && view.featuredTopics.length > 0 ? (
              <div className="wk-feattopics">
                <h2 className="wk-feattopics-title">Featured Topics</h2>
                <div className="wk-feattopics-banners">
                  {view.featuredTopics.map((ft) => (
                    <Link
                      key={ft.name}
                      href={`/category/${ft.slug}`}
                      className="wk-feattopic-banner"
                    >
                      <div className="wk-feattopic-banner-art">
                        <Illustration name={ft.illus || "art"} />
                      </div>
                      <span className="wk-feattopic-banner-label">
                        {ft.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {/* FEATURED ARTICLES SECTION */}
          {featuredList.length > 0 ? (
            <section className="wk-card wk-cat-block">
              <header className="wk-cat-block-head">
                <h2>Featured Articles</h2>
              </header>
              <div className="wk-cattile-grid">
                {featuredList.map((item) => (
                  <CategoryArticleTile key={item.slug} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {/* ARTICLES ABOUT {CATEGORY} SECTION */}
          <section className="wk-card wk-cat-block" id="all-articles">
            <header className="wk-cat-block-head">
              <h2>Articles about {view.name}</h2>
            </header>
            <div className="wk-cattile-grid">
              {pagedArticles.map((item) => (
                <CategoryArticleTile key={item.slug} item={item} />
              ))}
            </div>

            {/* Pagination bar */}
            <nav className="wk-cat-pager" aria-label="Category pagination">
              <Link
                href={`/category/${view.slug}?pg=${Math.max(1, currentPage - 1)}`}
                className={`wk-pager-btn ${currentPage <= 1 ? "is-disabled" : ""}`}
              >
                Previous
              </Link>
              <ul className="wk-pager-nums">
                {Array.from({ length: Math.max(2, totalPages) }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <li key={p}>
                      <Link
                        href={`/category/${view.slug}?pg=${p}`}
                        className={currentPage === p ? "is-active" : ""}
                      >
                        {p}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/category/${view.slug}?pg=${Math.min(Math.max(2, totalPages), currentPage + 1)}`}
                className={`wk-pager-btn ${currentPage >= Math.max(2, totalPages) ? "is-disabled" : ""}`}
              >
                Next
              </Link>
            </nav>
          </section>

          {/* NEW ARTICLES ABOUT {CATEGORY} SECTION (Primary Category Directory block) */}
          {!view.isSubcategory &&
          view.newArticles &&
          view.newArticles.length > 0 ? (
            <section className="wk-card wk-cat-block" id="new-articles">
              <header className="wk-cat-block-head">
                <h2>New Articles about {view.name}</h2>
              </header>
              <div className="wk-cattile-grid">
                {view.newArticles.map((item) => (
                  <CategoryArticleTile key={item.slug} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* ==================== RIGHT SIDEBAR COLUMN ==================== */}
        <aside className="wk-catpage-side">
          {/* RELATED TOPICS TREE CARD */}
          <section className="wk-side-card wk-reltopics-card">
            <h2 className="wk-reltopics-heading">Related Topics</h2>
            <RelatedTopicsTree topics={view.relatedTopics} />
          </section>

          {/* WEEKLY NEWSLETTER CARD */}
          <CategoryNewsletterCard />

          {/* JOIN US IN OUR MISSION CARD */}
          <section className="wk-side-card wk-mission-card">
            <h4>Join us in our mission</h4>
            <p>
              For over two decades, we&apos;ve been on a mission: to help
              everyone in the world learn how to do anything. Our articles are
              human written and expert endorsed to ensure readers like you get
              reliable, current information.{" "}
              <strong>
                Before you get back to learning, explore our full library of
                illustrated guides. Thank you.
              </strong>
            </p>
            <Link href="/about" className="wk-mission-btn">
              Let&apos;s do this!
            </Link>
          </section>

          {/* BROWSE ALL PRIMARY CATEGORIES */}
          <section className="wk-side-card">
            <h4 className="wk-side-heading">Browse Main Categories</h4>
            <ul className="wk-side-nav">
              {allCategories.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`}>
                    <span className="wk-side-num" aria-hidden="true">
                      {c.emoji}
                    </span>
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
