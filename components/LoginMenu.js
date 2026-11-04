"use client";

import { useEffect, useRef, useState } from "react";

function UserTriggerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.6-3.7 4.3-5.5 7.5-5.5s5.9 1.8 7.5 5.5" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.25-.93 2.31-1.99 3.02v2.5h3.22c1.89-1.74 2.98-4.3 2.98-7.35 0-.71-.06-1.4-.31-2.15z"
      />
      <path
        fill="#34A853"
        d="M12.18 21c2.7 0 4.96-.9 6.62-2.4l-3.22-2.5c-.9.6-2.04.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.25v2.58C4.9 18.78 8.28 21 12.18 21z"
      />
      <path
        fill="#FBBC05"
        d="M6.57 12.93c-.2-.6-.31-1.24-.31-1.93s.11-1.33.31-1.93V6.49H3.25C2.58 7.83 2.2 9.36 2.2 11s.38 3.17 1.05 4.51l3.32-2.58z"
      />
      <path
        fill="#EA4335"
        d="M12.18 4.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87C17.13 1.98 14.88 1 12.18 1 8.28 1 4.9 3.22 3.25 6.49l3.32 2.58c.79-2.37 3-4.13 5.61-4.13z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="#24292f"
        d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.8c-2.93.64-3.55-1.24-3.55-1.24-.48-1.2-1.17-1.53-1.17-1.53-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.41-2.34-.27-4.8-1.17-4.8-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.35.1-2.8 0 0 .89-.29 2.9 1.08a10.1 10.1 0 0 1 5.28 0c2.01-1.37 2.9-1.08 2.9-1.08.57 1.45.21 2.53.1 2.8.67.74 1.08 1.68 1.08 2.83 0 4.04-2.47 4.93-4.82 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 36 36" width="28" height="28" aria-hidden="true">
      <path
        fill="#3b5998"
        d="M21.5 34V20.8h4.4l.7-5.1h-5.1v-3.3c0-1.5.4-2.5 2.5-2.5h2.7V5.3c-.5-.1-2.1-.2-3.9-.2-3.9 0-6.5 2.4-6.5 6.7v3.9h-4.4v5.1h4.4V34h5.2z"
      />
    </svg>
  );
}

export default function LoginMenu() {
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

  const scheduleHide = () => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => () => clearTimer(), []);

  return (
    <div
      className="wk-login-wrap wk-hide-sm"
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
    >
      <span
        className={`wk-action wk-action-login ${open ? "is-open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="wk-action-icon">
          <UserTriggerIcon />
        </span>
        <span className="wk-action-label">Log in</span>
      </span>

      <div
        className={`wk-login-dropdown ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Log in"
        aria-hidden={!open}
      >
        <div className="wk-login-title">Log in</div>

        <div className="wk-login-btns">
          <button
            type="button"
            className="wk-login-btn wk-login-btn-google"
            onClick={(e) => e.preventDefault()}
          >
            <span className="wk-login-btn-icon">
              <GoogleIcon />
            </span>
            <span className="wk-login-btn-text">Google</span>
          </button>

          <button
            type="button"
            className="wk-login-btn wk-login-btn-github"
            onClick={(e) => e.preventDefault()}
          >
            <span className="wk-login-btn-icon">
              <GitHubIcon />
            </span>
            <span className="wk-login-btn-text">GitHub</span>
          </button>

          <button
            type="button"
            className="wk-login-btn wk-login-btn-fb"
            onClick={(e) => e.preventDefault()}
          >
            <span className="wk-login-btn-icon">
              <FacebookIcon />
            </span>
            <span className="wk-login-btn-text">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
