import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div
        className="container"
        style={{ textAlign: "center", padding: "60px 0" }}
      >
        <div style={{ fontSize: 46, marginBottom: 10 }}>🧭</div>
        <h1>We couldn&apos;t find that page</h1>
        <p
          style={{
            color: "var(--muted)",
            maxWidth: "34em",
            margin: "0 auto 22px",
          }}
        >
          The how-to you are looking for may have been renamed or unpublished.
          Try searching, or browse the categories below.
        </p>
        <form
          className="search"
          action="/search"
          method="get"
          style={{ maxWidth: 520, margin: "0 auto 26px" }}
        >
          <input
            type="search"
            name="q"
            placeholder="Search how-tos…"
            aria-label="Search"
          />
          <button type="submit">Search</button>
        </form>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" className="btn btn-primary btn-lg">
            Back to home
          </Link>
          <Link href="/categories" className="btn btn-outline btn-lg">
            Browse categories
          </Link>
        </div>
      </div>
    </main>
  );
}
