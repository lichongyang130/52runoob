import Link from "next/link";
import { Illustration } from "../../../components/Illustration";
import { adminStats, listMainCategories } from "../../../lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "About Howcompass" };

export default function AboutPage() {
  const stats = adminStats();
  const categories = listMainCategories();

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-badge">🌱 Our mission</span>
            <h1>
              We&apos;re building the world&apos;s most useful how-to manual.
            </h1>
            <p className="lead">
              Howcompass exists so that anyone, anywhere, can learn to do something
              new — without paying for it, and without wading through ads to
              find the actual steps.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{stats.published}</strong>
                <span>Published how-tos</span>
              </div>
              <div className="hero-stat">
                <strong>{stats.views.toLocaleString()}</strong>
                <span>Total reads</span>
              </div>
              <div className="hero-stat">
                <strong>{stats.categories}</strong>
                <span>Categories</span>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <Illustration name="books" ratio="3 / 4" />
            <Illustration name="idea" ratio="4 / 3" />
            <Illustration name="heart" ratio="4 / 3" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container wrap-narrow">
          <h2>How a Howcompass article gets made</h2>
          <p>
            Every article starts with a real question someone needed answered.
            From there, our editors turn rough notes into a numbered list of
            steps that anyone can follow, add illustrations so readers can see
            what &ldquo;fold the dough&rdquo; actually looks like, and then
            check the result against experts and readers.
          </p>

          <div className="card-grid" style={{ marginTop: 26 }}>
            {[
              {
                icon: "📝",
                title: "1. Write",
                body: "Someone shares the steps they actually used — including the parts that went wrong.",
              },
              {
                icon: "✏️",
                title: "2. Edit",
                body: "Editors tighten the language, cut filler, and make each step one clear action.",
              },
              {
                icon: "🎨",
                title: "3. Illustrate",
                body: "Flat, friendly illustrations show the important detail in every step.",
              },
              {
                icon: "✅",
                title: "4. Verify",
                body: "Facts get checked, warnings added, and readers test the steps in real life.",
              },
            ].map((c) => (
              <div key={c.title} className="panel" style={{ margin: 0 }}>
                <h3>
                  <span className="panel-icon">{c.icon}</span> {c.title}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>

          <h2 id="contribute" style={{ marginTop: 44 }}>
            Contribute
          </h2>
          <p>
            You do not need credentials to contribute — you need to have done
            the thing and be willing to explain it plainly. Articles are
            reviewed by editors before publishing, and every edit is credited.
          </p>
          <ul>
            <li>
              Pick a topic you know well and check whether we already cover it.
            </li>
            <li>Write the steps in the order you would actually do them.</li>
            <li>
              Mention what surprised you — that is usually the most useful part.
            </li>
          </ul>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <Link href="/admin/articles/new" className="btn btn-primary btn-lg">
              Write a how-to
            </Link>
            <Link href="/categories" className="btn btn-outline btn-lg">
              Browse categories
            </Link>
          </div>

          <h2 style={{ marginTop: 44 }}>Editorial standards</h2>
          <p style={{ color: "var(--ink-soft)" }}>
            We separate <strong>Tips</strong> from <strong>Warnings</strong> on
            purpose. Anything that could cause harm, break equipment, or waste
            serious money is labeled as a warning — never buried in a paragraph.
            Health and legal topics always carry a note that the article is not
            a substitute for professional advice.
          </p>

          <h2 style={{ marginTop: 36 }}>Categories we cover</h2>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="cat-card"
              >
                <span
                  className="cat-emoji"
                  style={{ background: `${c.color}1f` }}
                >
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
    </main>
  );
}
