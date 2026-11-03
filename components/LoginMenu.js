"use client";

import Link from "next/link";
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

function AccountAvatarIcon() {
  return (
    <svg viewBox="0 0 36 36" width="28" height="28" aria-hidden="true">
      <circle cx="18" cy="12.5" r="5.8" fill="#93b874" />
      <path
        d="M7.5 31c1.2-6.2 5.1-9.8 10.5-9.8S27.3 24.8 28.5 31H7.5z"
        fill="#93b874"
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

  const closeMenu = () => setOpen(false);

  return (
    <div
      className="wk-login-wrap wk-hide-sm"
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
      onFocus={show}
    >
      <Link
        href="/admin/login"
        className={`wk-action wk-action-login ${open ? "is-open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="wk-action-icon">
          <UserTriggerIcon />
        </span>
        <span className="wk-action-label">Log in</span>
      </Link>

      <div
        className={`wk-login-dropdown ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Log in"
        aria-hidden={!open}
      >
        <div className="wk-login-title">Log in</div>

        <div className="wk-login-btns">
          <Link
            href="/admin/login?provider=facebook"
            className="wk-login-btn wk-login-btn-fb"
            onClick={closeMenu}
          >
            <span className="wk-login-btn-icon">
              <FacebookIcon />
            </span>
            <span className="wk-login-btn-text">Facebook</span>
          </Link>

          <Link
            href="/admin/login?provider=google"
            className="wk-login-btn wk-login-btn-google"
            onClick={closeMenu}
          >
            <span className="wk-login-btn-icon">
              <GoogleIcon />
            </span>
            <span className="wk-login-btn-text">Google</span>
          </Link>

          <Link
            href="/admin/login"
            className="wk-login-btn wk-login-btn-account"
            onClick={closeMenu}
          >
            <span className="wk-login-btn-icon">
              <AccountAvatarIcon />
            </span>
            <span className="wk-login-btn-text">Howcompass Account</span>
          </Link>
        </div>

        <div className="wk-login-footer">
          No account yet?{" "}
          <Link href="/admin/login?mode=signup" onClick={closeMenu}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
