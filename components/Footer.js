import Link from "next/link";

export default function Footer({ categories = [] }) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link href="/" className="logo">
            <span className="logo-mark">w</span>
            <span>
              wiki<span className="logo-how">How</span>
            </span>
          </Link>
          <p>
            wikiHow is a collaborative how-to manual built by people who want to
            help. Every article is editable, illustrated, and written to be
            useful — not clever.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <Link href="/">Home</Link>
          <Link href="/categories">All Categories</Link>
          <Link href="/wikiHow">All How-Tos</Link>
          <Link href="/search">Search</Link>
          <Link href="/random">Random Article</Link>
        </div>

        <div>
          <h4>Popular Categories</h4>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>

        <div>
          <h4>More</h4>
          <Link href="/about">About</Link>
          <Link href="/about#contribute">Contribute</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/admin">Admin Dashboard</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} wikiHow Clone — a demo project for
          learning purposes.
        </span>
        <div className="footer-legal">
          <Link href="/terms">Terms of Use</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}
