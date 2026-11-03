import Link from 'next/link';

export default function Header({ categories = [], activeSlug = '' }) {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container">
          <div className="topbar-note">
            <span>🌱 The world&apos;s how-to manual — anyone can contribute</span>
          </div>
          <div className="topbar-links">
            <Link href="/about">About wikiHow</Link>
            <Link href="/wikiHow">All How-Tos</Link>
            <Link href="/admin">Admin Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="container header-main">
        <Link href="/" className="logo" aria-label="wikiHow home">
          <span className="logo-mark">w</span>
          <span>
            wiki<span className="logo-how">How</span>
          </span>
        </Link>

        <form className="search" action="/search" method="get" role="search">
          <input
            type="search"
            name="q"
            placeholder="How to do anything — search 15 how-tos…"
            aria-label="Search wikiHow"
            defaultValue=""
          />
          <button type="submit" aria-label="Search">
            🔍
          </button>
        </form>

        <div className="header-actions">
          <Link href="/random" className="btn btn-ghost btn-sm">
            🎲 Random
          </Link>
          <Link href="/admin" className="btn btn-primary btn-sm">
            Log in
          </Link>
        </div>
      </div>

      <nav className="catnav" aria-label="Categories">
        <div className="container catnav-inner">
          {categories.slice(0, 9).map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className={activeSlug === c.slug ? 'active' : ''}>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
