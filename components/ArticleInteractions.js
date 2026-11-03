"use client";

import { useState } from "react";

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
    <div className="helpful-box">
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
          👍 Yes, it helped
        </button>
        <button
          className="btn btn-outline"
          onClick={() => vote(false)}
          disabled={voted || busy}
        >
          👎 Not really
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
