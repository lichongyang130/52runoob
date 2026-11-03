"use client";

import Link from "next/link";
import { useState } from "react";

function topicSlug(name) {
  return String(name || "")
    .trim()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function RelatedTopicsTree({ topics = [] }) {
  const [openMap, setOpenMap] = useState(() =>
    Object.fromEntries(topics.map((t, idx) => [t.slug || idx, true]))
  );

  function toggle(key) {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="wk-reltopics-list">
      {topics.map((group, idx) => {
        const key = group.slug || idx;
        const isOpen = openMap[key] !== false;
        const hasChildren =
          Array.isArray(group.children) && group.children.length > 0;
        return (
          <div
            className={`wk-reltopic-group ${isOpen ? "is-open" : ""}`}
            key={key}
          >
            <div className="wk-reltopic-head">
              <Link
                href={`/category/${group.slug || topicSlug(group.title)}`}
                className="wk-reltopic-parent"
              >
                {group.title}
              </Link>
              {hasChildren ? (
                <button
                  type="button"
                  className="wk-reltopic-toggle"
                  onClick={() => toggle(key)}
                  aria-expanded={isOpen}
                  aria-label={`Toggle ${group.title} subtopics`}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d={isOpen ? "M3.5 10L8 5.5 12.5 10" : "M3.5 6L8 10.5 12.5 6"}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : null}
            </div>

            {hasChildren && isOpen ? (
              <div className="wk-reltopic-children">
                {group.children.map((child) => (
                  <Link
                    key={child}
                    href={`/category/${topicSlug(child)}`}
                    className="wk-reltopic-pill"
                  >
                    {child}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function CategoryNewsletterCard() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <div className="wk-side-card wk-cat-newsletter">
      <div className="wk-cat-nl-icon" aria-hidden="true">
        ✉️
      </div>
      <h4>Get all the best how-tos!</h4>
      <p>Sign up for Howcompass&apos;s weekly email newsletter</p>
      {done ? (
        <div className="wk-cat-nl-ok">You&apos;re all set!</div>
      ) : (
        <form onSubmit={onSubmit} className="wk-cat-nl-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
}
