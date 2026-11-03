import Link from "next/link";
import { Illustration } from "./Illustration";

export function ArticleCard({ article }) {
  return (
    <Link href={`/wikiHow/${article.slug}`} className="card">
      <div className="card-art">
        <Illustration name={article.hero_image || "idea"} />
        {article.category_name ? (
          <span className="card-tag">{article.category_name}</span>
        ) : null}
      </div>
      <div className="card-body">
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <div className="card-meta">
          <span>⏱ {article.read_time} min read</span>
          <span>👁 {Number(article.views || 0).toLocaleString()} views</span>
        </div>
      </div>
    </Link>
  );
}

export function MiniCard({ article }) {
  return (
    <Link href={`/wikiHow/${article.slug}`} className="mini-card">
      <span className="illus-wrap">
        <Illustration name={article.hero_image || "idea"} ratio="1 / 1" />
      </span>
      <span>
        <h4>{article.title}</h4>
        <span className="cat">{article.category_name || "How-To"}</span>
      </span>
    </Link>
  );
}
