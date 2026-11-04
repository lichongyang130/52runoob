"use client";

import { useEffect, useState } from "react";

function readCompletedSteps(slug) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(`hc_steps_${slug}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCompletedSteps(slug, list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`hc_steps_${slug}`, JSON.stringify(list));
    window.dispatchEvent(
      new CustomEvent("hc-steps-updated", { detail: { slug, list } })
    );
  } catch {
    // ignore storage quota errors
  }
}

export function StepProgressTracker({ slug, totalSteps = 0 }) {
  const [done, setDone] = useState([]);

  useEffect(() => {
    setDone(readCompletedSteps(slug));
    const onUpdate = (e) => {
      if (e.detail?.slug === slug) {
        setDone(e.detail.list);
      }
    };
    window.addEventListener("hc-steps-updated", onUpdate);
    return () => window.removeEventListener("hc-steps-updated", onUpdate);
  }, [slug]);

  if (!totalSteps || totalSteps < 1) return null;

  const pct = Math.min(100, Math.round((done.length / totalSteps) * 100));

  const toggleStep = (n) => {
    const exists = done.includes(n);
    const next = exists ? done.filter((x) => x !== n) : [...done, n];
    setDone(next);
    writeCompletedSteps(slug, next);
  };

  const resetAll = () => {
    setDone([]);
    writeCompletedSteps(slug, []);
  };

  return (
    <div className="wk-step-tracker">
      <div className="wk-step-tracker-head">
        <div>
          <strong>Interactive Step Checklist</strong>
          <span>
            {done.length} of {totalSteps} steps completed ({pct}%)
          </span>
        </div>
        {done.length > 0 ? (
          <button
            type="button"
            className="wk-step-tracker-reset"
            onClick={resetAll}
          >
            Reset progress
          </button>
        ) : null}
      </div>
      <div className="wk-step-tracker-bar">
        <div className="wk-step-tracker-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="wk-step-tracker-pills">
        {Array.from({ length: totalSteps }, (_, idx) => {
          const n = idx + 1;
          const isDone = done.includes(n);
          return (
            <button
              key={n}
              type="button"
              className={`wk-step-pill-btn ${isDone ? "is-done" : ""}`}
              onClick={() => toggleStep(n)}
              title={`Toggle Step ${n} completion`}
            >
              {isDone ? `✓ ${n}` : n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepCheckButton({ slug, stepNumber }) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setIsDone(readCompletedSteps(slug).includes(stepNumber));
    const onUpdate = (e) => {
      if (e.detail?.slug === slug) {
        setIsDone(e.detail.list.includes(stepNumber));
      }
    };
    window.addEventListener("hc-steps-updated", onUpdate);
    return () => window.removeEventListener("hc-steps-updated", onUpdate);
  }, [slug, stepNumber]);

  const toggle = () => {
    const current = readCompletedSteps(slug);
    const next = current.includes(stepNumber)
      ? current.filter((x) => x !== stepNumber)
      : [...current, stepNumber];
    setIsDone(next.includes(stepNumber));
    writeCompletedSteps(slug, next);
  };

  return (
    <button
      type="button"
      className={`wk-step-check-btn ${isDone ? "is-done" : ""}`}
      onClick={toggle}
    >
      {isDone ? "✓ Step Completed" : "○ Mark Step Done"}
    </button>
  );
}

export function ArticleActionButtons({ title }) {
  const [shareMsg, setShareMsg] = useState(null);
  const [preferred, setPreferred] = useState(false);

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `How to ${title}`, url });
        return;
      } catch (e) {
        /* fallback to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied!");
      setTimeout(() => setShareMsg(null), 2200);
    } catch (e) {
      setShareMsg("Copy URL from address bar");
      setTimeout(() => setShareMsg(null), 2200);
    }
  }

  return (
    <div className="wk-action-row">
      <button
        type="button"
        className="wk-act-btn wk-act-pdf"
        onClick={handlePrint}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="wk-act-ico">
          <path
            d="M8 1.5v8.2M4.8 6.8L8 10l3.2-3.2M2.5 12.5h11v1.5h-11z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Download PDF</span>
      </button>

      <button
        type="button"
        className="wk-act-btn wk-act-outline"
        onClick={handleShare}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="wk-act-ico">
          <circle cx="12" cy="3.2" r="2" fill="currentColor" />
          <circle cx="4" cy="8" r="2" fill="currentColor" />
          <circle cx="12" cy="12.8" r="2" fill="currentColor" />
          <path
            d="M5.7 7l4.6-2.8M5.7 9l4.6 2.8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span>{shareMsg || "Share"}</span>
      </button>

      <button
        type="button"
        className={`wk-act-btn wk-act-outline wk-act-pref ${preferred ? "is-active" : ""}`}
        onClick={() => setPreferred((p) => !p)}
      >
        <span className="wk-pref-badge" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7" fill="#eef5e8" stroke="#7cb342" strokeWidth="1.4" />
            <path d="M8 2.5l1.6 3.9L13.5 8 9.6 9.6 8 13.5 6.4 9.6 2.5 8l3.9-1.6z" fill="#507f44" />
          </svg>
        </span>
        <span>
          {preferred
            ? "Saved as preferred guide"
            : "Set as preferred source on Howcompass"}
        </span>
      </button>
    </div>
  );
}

export function MethodPdfButton() {
  return (
    <button
      type="button"
      className="wk-method-pdf"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="wk-act-ico">
        <path
          d="M8 1.5v8.2M4.8 6.8L8 10l3.2-3.2M2.5 12.5h11v1.5h-11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Download PDF</span>
    </button>
  );
}

export function SidebarStarRating({ articleId, helpfulYes = 48, helpfulNo = 4 }) {
  const [counts, setCounts] = useState({
    yes: Math.max(12, Number(helpfulYes) || 48),
    no: Number(helpfulNo) || 3,
  });
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);

  const totalVotes = counts.yes + counts.no;
  const pct = totalVotes > 0 ? Math.round((counts.yes / totalVotes) * 100) : 92;
  const activeStars = hoverStar || selectedStar || 4;

  async function rate(star) {
    if (selectedStar) return;
    setSelectedStar(star);
    const helpful = star >= 4;
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, helpful }),
      });
      const data = await res.json();
      if (data.ok) {
        setCounts({ yes: data.helpful_yes, no: data.helpful_no });
      }
    } catch (e) {
      /* best effort */
    }
  }

  return (
    <div className="wk-star-box">
      <div
        className="wk-stars-row"
        onMouseLeave={() => setHoverStar(0)}
        role="group"
        aria-label="Rate this article from 1 to 5 stars"
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            className={`wk-star-btn ${s <= activeStars ? "is-lit" : ""}`}
            onMouseEnter={() => setHoverStar(s)}
            onClick={() => rate(s)}
            aria-label={`Rate ${s} out of 5 stars`}
          >
            ★
          </button>
        ))}
      </div>
      <div className="wk-star-votes">
        {totalVotes} votes - {pct}%
      </div>
      <div className="wk-star-cta">
        {selectedStar ? "Thanks for rating!" : "Click a star to rate"}
      </div>
    </div>
  );
}

export function HelpfulBox({ articleId, helpfulYes, helpfulNo }) {
  const [counts, setCounts] = useState({ yes: helpfulYes, no: helpfulNo });
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function vote(helpful) {
    if (voted || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, helpful }),
      });
      const data = await res.json();
      if (data.ok) {
        setCounts({ yes: data.helpful_yes, no: data.helpful_no });
        setVoted(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wk-card wk-helpful-card" id="helpful">
      <h3>
        {voted ? "Thanks for your feedback!" : "Did this article help you?"}
      </h3>
      <p>
        {voted
          ? `${counts.yes} readers found this helpful. Your vote helps us improve.`
          : `${counts.yes} readers found this helpful — add your vote.`}
      </p>
      <div className="helpful-actions">
        <button
          className="btn btn-primary"
          onClick={() => vote(true)}
          disabled={voted || busy}
        >
          Yes
        </button>
        <button
          className="btn btn-outline"
          onClick={() => vote(false)}
          disabled={voted || busy}
        >
          No
        </button>
      </div>
    </div>
  );
}

export function CommentForm({ articleId, onAdded }) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, author, body, rating }),
      });
      const data = await res.json();
      if (data.ok) {
        setBody("");
        setAuthor("");
        setRating(5);
        setStatus({ type: "ok", text: "Thanks! Your comment is now live." });
        if (onAdded) onAdded(data.comment);
      } else {
        setStatus({
          type: "error",
          text: data.error || "Could not post your comment.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", text: "Network error — please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 18 }}>
      {status ? (
        <div className={`alert alert-${status.type}`}>{status.text}</div>
      ) : null}
      <div className="inline-form">
        <div className="field" style={{ maxWidth: 240 }}>
          <label htmlFor="c-author">Your name</label>
          <input
            id="c-author"
            className="input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous Reader"
          />
        </div>
        <div className="field" style={{ maxWidth: 180 }}>
          <label htmlFor="c-rating">Rating</label>
          <select
            id="c-rating"
            className="select"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {"★".repeat(r)} ({r})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-body">Your comment</label>
        <textarea
          id="c-body"
          className="textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Did the steps work for you? Share what you learned…"
          required
        />
      </div>
      <button className="btn btn-primary" disabled={busy}>
        {busy ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}

export function CommentList({ initial, articleId }) {
  const [comments, setComments] = useState(initial);

  return (
    <div>
      <div id="comment-list">
        {comments.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            No comments yet — be the first to share your results.
          </p>
        ) : (
          comments.map((c) => (
            <div className="comment" key={c.id}>
              <div className="comment-avatar">
                {(c.author || "A").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <b>{c.author}</b>
                <span className="when">
                  {String(c.created_at || "").slice(0, 10)}
                </span>
                <div className="stars">{"★".repeat(c.rating || 0)}</div>
                <p>{c.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <CommentForm
        articleId={articleId}
        onAdded={(comment) => setComments((prev) => [comment, ...prev])}
      />
    </div>
  );
}
