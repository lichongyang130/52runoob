/* European Museum Golden-Hour Oil Painting Hero Showcase */

export default function BooksIllustration({ className = "" }) {
  return (
    <div
      className={`books-illus wk-hero-painting-frame ${className}`}
      role="img"
      aria-label="Golden-hour European oil painting of a traveler overlooking a historic river city at sunset"
    >
      <div className="wk-hero-painting-mat">
        <img
          src="/img/categories/travel-hero.jpg"
          alt="Golden-hour European oil painting overlooking a sunset river city"
          className="wk-hero-painting-img"
        />
        <span className="wk-hero-painting-caption">
          Howcompass Curated Illustrated Guides
        </span>
      </div>
    </div>
  );
}
