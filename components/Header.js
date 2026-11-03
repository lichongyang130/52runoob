import Link from 'next/link';
import CategoryBar from './CategoryBar';

const ICONS = {
  quizzes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h4v13H3zM9.5 4h4v16h-4zM16 9h4v11h-4z" />
      <path d="M2 20.5h20" />
    </svg>
  ),
  explore: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  ),
  login: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.6-3.7 4.3-5.5 7.5-5.5s5.9 1.8 7.5 5.5" />
    </svg>
  ),
  random: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export default function Header({ categories = [] }) {
  return (
    <header className="wk-header">
      <div className="wk-header-inner">
        <Link href="/" className="wk-logo" aria-label="wikiHow home">
          <span className="wk-logo-word">
            wiki<span>How</span>
          </span>
          <span className="wk-logo-tag">to do anything…</span>
        </Link>

        <form className="wk-header-search" action="/search" method="get" role="search">
          <input type="search" name="q" placeholder="Search wikiHow" aria-label="Search wikiHow" />
          <button type="submit">Search</button>
        </form>

        <nav className="wk-actions" aria-label="Site">
          <Link href="/admin/login" className="wk-pro">
            <span className="wk-pro-text">PRO</span>
            <span className="wk-pro-bolt">⚡</span>
          </Link>
          <Link href="/categories" className="wk-action">
            <span className="wk-action-icon">{ICONS.quizzes}</span>
            <span className="wk-action-label">Quizzes</span>
          </Link>
          <Link href="/categories" className="wk-action">
            <span className="wk-action-icon">{ICONS.explore}</span>
            <span className="wk-action-label">Explore</span>
          </Link>
          <Link href="/admin/login" className="wk-action">
            <span className="wk-action-icon">{ICONS.login}</span>
            <span className="wk-action-label">Log in</span>
          </Link>
          <Link href="/random" className="wk-action">
            <span className="wk-action-icon">{ICONS.random}</span>
            <span className="wk-action-label">Random</span>
          </Link>
        </nav>
      </div>
      <CategoryBar categories={categories} />
    </header>
  );
}
