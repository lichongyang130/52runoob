'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { NAV_COLUMNS } from '../lib/nav-data';

/* Slugs for the menu links, falling back to the label when a category has no
   dedicated page yet (those links simply land on the full category index). */
function chunk(list, parts) {
  if (!list.length) return [];
  const per = Math.ceil(list.length / parts);
  const out = [];
  for (let i = 0; i < list.length; i += per) out.push(list.slice(i, i + per));
  return out;
}

function catHref(slug) {
  return `/category/${slug}`;
}

function subHref(slug, sub) {
  const q = encodeURIComponent(sub);
  return `/search?q=${q}`;
}

const TOP_LINKS = [
  [
    { label: 'Tech Help Pro', href: '/about' },
    { label: 'Request a New Article', href: '/about#contribute' },
  ],
  [
    { label: 'About Us', href: '/about' },
    { label: 'Community Dashboard', href: '/admin' },
  ],
  [
    { label: 'Random Article', href: '/random' },
    { label: 'Forums', href: '/categories' },
  ],
  [
    { label: 'Quizzes', href: '/categories' },
    { label: 'Community Quizzes', href: '/categories', badge: 'New' },
  ],
];

function ExploreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  );
}

export default function ExploreMenu({ allCategories = [] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const closeTimer = useRef(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const show = () => {
    clearTimer();
    setOpen(true);
  };

  /* Small grace period so the pointer can travel from the trigger into the
     panel without the menu flickering shut. */
  const scheduleHide = () => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => () => clearTimer(), []);

  const scrollToTop = () => setOpen(false);

  /* Alphabetical, de-duplicated list for the last row; columns are balanced so
     no category is ever cut off. */
  const seen = new Set();
  const sorted = [...allCategories]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((c) => {
      const key = c.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z]/g, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return (
    <div
      className="wk-explore"
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
      onFocus={show}
    >
      <button
        type="button"
        className={`wk-action wk-action-btn ${open ? 'is-open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="wk-action-icon">
          <ExploreIcon />
        </span>
        <span className="wk-action-label">Explore</span>
      </button>

      <div className={`wk-explore-panel ${open ? 'is-open' : ''}`} role="dialog" aria-label="Explore" aria-hidden={!open}>
        <div className="wk-explore-scrim" onClick={scrollToTop} aria-hidden="true" />
        <div className="wk-explore-inner">
          {/* top: quick links, 4 columns */}
          <div className="wk-ex-top">
            {TOP_LINKS.map((col, i) => (
              <ul key={i}>
                {col.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} onClick={scrollToTop}>
                      {l.label}
                      {l.badge ? <span className="wk-ex-new">{l.badge}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* middle: category columns with sub-links */}
          <div className="wk-ex-mid">
            {NAV_COLUMNS.map((col, i) => (
              <div className="wk-ex-col" key={i}>
                {col.items.map((item) => (
                  <div className="wk-ex-group" key={item.name}>
                    <Link href={catHref(item.slug)} className="wk-ex-cat" onClick={scrollToTop}>
                      {item.name}
                    </Link>
                    <ul>
                      {item.subs.map((sub) => (
                        <li key={sub}>
                          <Link href={subHref(item.slug, sub)} onClick={scrollToTop}>
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* bottom: every category, alphabetical, split into 4 columns */}
          <div className="wk-ex-bottom">
            {chunk(sorted, 4).map((group, i) => (
              <ul key={i}>
                {group.map((c) => (
                  <li key={c.slug}>
                    <Link href={catHref(c.slug)} onClick={scrollToTop}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
