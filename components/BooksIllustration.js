"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GALLERY_SLIDES = [
  {
    src: "/img/categories/travel-hero.jpg",
    kicker: "Travel & Visual Journaling",
    title: "How to Keep a Daily Visual Sketchbook Diary While Traveling",
    href: "/how-to/Keep-a-Daily-Visual-Sketchbook-Diary-While-Traveling",
    steps: "9 Steps",
  },
  {
    src: "/img/steps/Learn-to-Draw-for-Beginners/21.jpg",
    kicker: "Classical Atelier Series",
    title: "How to Learn to Draw for Beginners",
    href: "/how-to/Learn-to-Draw-for-Beginners",
    steps: "24 Steps",
  },
  {
    src: "/img/steps/Bake-Bread-at-Home/19.jpg",
    kicker: "Artisan Hearth & Kitchen",
    title: "How to Bake Bread at Home",
    href: "/how-to/Bake-Bread-at-Home",
    steps: "23 Steps",
  },
  {
    src: "/img/steps/Keep-Houseplants-Alive/25.jpg",
    kicker: "Botanical Conservatory",
    title: "How to Keep Houseplants Alive",
    href: "/how-to/Keep-Houseplants-Alive",
    steps: "25 Steps",
  },
  {
    src: "/img/steps/Study-Effectively-for-Exams/10.jpg",
    kicker: "Scholar's Study & Wisdom",
    title: "How to Study Effectively for Exams",
    href: "/how-to/Study-Effectively-for-Exams",
    steps: "22 Steps",
  },
];

export default function BooksIllustration({ className = "" }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % GALLERY_SLIDES.length);
    }, 4800);
    return () => clearInterval(id);
  }, [paused]);

  const current = GALLERY_SLIDES[active] || GALLERY_SLIDES[0];

  return (
    <div
      className={`books-illus wk-hero-painting-frame ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="wk-hero-painting-mat">
        <Link href={current.href} className="wk-hero-painting-stage">
          <img
            src={current.src}
            alt={current.title}
            className="wk-hero-painting-img"
          />
          <span className="wk-hero-painting-pill">{current.steps}</span>
          <div className="wk-hero-painting-overlay">
            <span className="wk-hero-painting-kicker">{current.kicker}</span>
            <strong className="wk-hero-painting-title">{current.title}</strong>
            <span className="wk-hero-painting-cta">Read Illustrated Guide →</span>
          </div>
        </Link>

        <div className="wk-hero-thumbs" role="tablist" aria-label="Curated oil painting guides">
          {GALLERY_SLIDES.map((s, idx) => (
            <button
              key={s.href}
              type="button"
              role="tab"
              aria-selected={idx === active}
              className={`wk-hero-thumb-btn ${idx === active ? "is-active" : ""}`}
              onClick={() => setActive(idx)}
              title={s.title}
            >
              <img src={s.src} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
