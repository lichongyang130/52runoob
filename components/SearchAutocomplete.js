"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const POPULAR_SUGGESTIONS = [
  {
    slug: "Learn-to-Draw-for-Beginners",
    title: "Learn to Draw for Beginners",
    category_name: "Arts and Entertainment",
    read_time: 18,
    image: "/img/steps/Learn-to-Draw-for-Beginners/21.jpg",
  },
  {
    slug: "Bake-Bread-at-Home",
    title: "Bake Bread at Home",
    category_name: "Food and Entertaining",
    read_time: 18,
    image: "/img/steps/Bake-Bread-at-Home/19.jpg",
  },
  {
    slug: "Keep-Houseplants-Alive",
    title: "Keep Houseplants Alive",
    category_name: "Home and Garden",
    read_time: 18,
    image: "/img/steps/Keep-Houseplants-Alive/25.jpg",
  },
  {
    slug: "Speed-Up-a-Slow-Laptop",
    title: "Speed Up a Slow Laptop",
    category_name: "Computers and Electronics",
    read_time: 18,
    image: "/img/steps/Speed-Up-a-Slow-Laptop/01.jpg",
  },
];

export default function SearchAutocomplete({
  variant = "header",
  placeholder = "Search how-to guides",
}) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setItems([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(data.results) ? data.results : []);
        }
      } catch {
        // ignore transient fetch errors
      }
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayList = query.trim() ? items : POPULAR_SUGGESTIONS;

  return (
    <div
      ref={wrapRef}
      className={
        variant === "hero" ? "wk-search-auto-wrap is-hero" : "wk-search-auto-wrap is-header"
      }
    >
      <form
        className={variant === "hero" ? "wk-hero-search" : "wk-header-search"}
        action="/search"
        method="get"
        role="search"
      >
        {variant === "hero" ? (
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
        ) : null}
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {open && displayList.length > 0 ? (
        <div className="wk-search-dropdown" role="listbox">
          <div className="wk-search-dropdown-head">
            <span>{query.trim() ? `Matching Guides (${displayList.length})` : "Popular Master Guides"}</span>
            {query.trim() ? (
              <Link href={`/search?q=${encodeURIComponent(query.trim())}`} onClick={() => setOpen(false)}>
                View all →
              </Link>
            ) : (
              <Link href="/quizzes" onClick={() => setOpen(false)}>
                Take a Quiz →
              </Link>
            )}
          </div>
          <div className="wk-search-dropdown-list">
            {displayList.map((item) => (
              <Link
                key={item.slug}
                href={`/how-to/${item.slug}`}
                className="wk-search-dropdown-item"
                onClick={() => setOpen(false)}
              >
                <img src={item.image} alt="" className="wk-search-dropdown-thumb" />
                <span className="wk-search-dropdown-meta">
                  <strong>How to {item.title}</strong>
                  <small>
                    {item.category_name} · {item.read_time} min read
                  </small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
