const db = require("./db.js");

const published = `a.status = 'published'`;

function categoryMap() {
  const rows = db
    .prepare("SELECT * FROM categories ORDER BY position, id")
    .all();
  return Object.fromEntries(rows.map((r) => [r.id, r]));
}

function listCategories() {
  return db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM articles a WHERE a.category_id = c.id AND ${published}) AS article_count
       FROM categories c ORDER BY c.position, c.id`,
    )
    .all();
}

/* Categories that own real articles — used for the homepage cards and the
   category bar, so the mega-menu-only entries stay out of the way. */
function listMainCategories() {
  return listCategories().filter((c) => (c.nav_group || "main") !== "extra");
}

/* The extra entries that only exist to fill out the mega menu. */
function listExtraCategories() {
  return listCategories().filter((c) => c.nav_group === "extra");
}

function getCategoryBySlug(slug) {
  return db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug);
}

function listArticles({
  categoryId,
  q,
  featured,
  limit = 24,
  offset = 0,
  status = "published",
  includeDrafts = false,
} = {}) {
  const where = [];
  const params = [];
  if (!includeDrafts) {
    where.push(`a.status = '${status}'`);
  }
  if (categoryId) {
    where.push("a.category_id = ?");
    params.push(categoryId);
  }
  if (featured) {
    where.push("a.featured = 1");
  }
  if (q) {
    where.push("(a.title LIKE ? OR a.summary LIKE ? OR a.intro LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const sql = `
    SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji,
           (SELECT s.image FROM steps s WHERE s.article_id = a.id AND s.image != '' ORDER BY s.position, s.id LIMIT 1) AS first_step_image
    FROM articles a LEFT JOIN categories c ON c.id = a.category_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY a.featured DESC, a.updated_at DESC, a.id DESC
    LIMIT ? OFFSET ?`;
  return db.prepare(sql).all(...params, limit, offset);
}

function countArticles(opts = {}) {
  const where = [];
  const params = [];
  if (!opts.includeDrafts) where.push(`status = 'published'`);
  if (opts.categoryId) {
    where.push("category_id = ?");
    params.push(opts.categoryId);
  }
  if (opts.q) {
    where.push("(title LIKE ? OR summary LIKE ?)");
    params.push(`%${opts.q}%`, `%${opts.q}%`);
  }
  const sql = `SELECT COUNT(*) AS c FROM articles ${where.length ? "WHERE " + where.join(" AND ") : ""}`;
  return db.prepare(sql).get(...params).c;
}

function buildShowcaseArticle(item) {
  const cleanTitle = item.title.replace(/^How to\s+/i, "");
  const img1 = item.image || "/img/thumbs/drumsticks.jpg";
  const m = String(img1).match(/\/img\/thumbs\/cat\/([a-z]+)-(\d+)\.jpg/);
  const catKey = m ? m[1] : "arts";
  const baseIdx = m ? parseInt(m[2], 10) : (String(item.slug || "").length % 20) + 1;
  const stepImg = (offset) => {
    if (offset === 0) return img1;
    const n = ((baseIdx + offset * 3 - 1) % 20) + 1;
    return `/img/thumbs/cat/${catKey}-${String(n).padStart(2, "0")}.jpg`;
  };
  return {
    id: 9000,
    slug: item.slug,
    title: cleanTitle,
    summary: item.summary,
    intro: `${item.summary} Follow the step-by-step rules, setup guidelines, and winning strategies below to get started right away.`,
    category_id: 8,
    category_name: "Hobbies and Crafts",
    category_slug: "Hobbies-and-Crafts",
    category_color: "#7cb342",
    category_emoji: "🎲",
    hero_image: item.image || item.hero_image || "puzzle",
    first_step_image: img1,
    author: "Howcompass Editorial Staff",
    read_time: 8,
    views: 42850,
    helpful_yes: 94,
    helpful_no: 5,
    featured: item.featured ? 1 : 0,
    status: "published",
    updated_at: "2026-03-17",
    methods: [
      {
        id: 1,
        title: "Setting Up & Getting Started",
        steps: [
          {
            id: 101,
            image: stepImg(0),
            text: `Prepare a flat, well-lit workspace and gather everything needed to ${cleanTitle.toLowerCase()}. Make sure every participant can comfortably reach the center of the area.`,
          },
          {
            id: 102,
            image: stepImg(1),
            text: "Agree on the starting rules, sequence, and target goal before the first round begins. Deciding on house variations upfront keeps every session smooth and enjoyable.",
          },
          {
            id: 103,
            image: stepImg(2),
            text: "Start with a relaxed posture and steady hand position. Keeping your shoulders and wrists loose gives you better control from the very first move.",
          },
        ],
      },
      {
        id: 2,
        title: "Core Technique & Practice",
        steps: [
          {
            id: 201,
            image: stepImg(3),
            text: "Work through the opening sequence with deliberate, balanced movements that keep your options open. Observe how each adjustment changes the result before speeding up.",
          },
          {
            id: 202,
            image: stepImg(4),
            text: "Focus on rhythm and consistency during the middle stage. Small, repeatable adjustments build muscle memory much faster than rushing.",
          },
          {
            id: 203,
            image: stepImg(5),
            text: "Review your progress as you finish the main sequence. A calm final check prevents the most common beginner mistakes.",
          },
        ],
      },
      {
        id: 3,
        title: "Advanced Tips & Variations",
        steps: [
          {
            id: 301,
            image: stepImg(6),
            text: "Plan two steps ahead once the fundamentals feel automatic. Anticipating the next transition makes your technique look effortless.",
          },
          {
            id: 302,
            image: stepImg(7),
            text: "Practice in short 15-minute sessions and try fun variations with friends or family to keep your skills sharp.",
          },
        ],
      },
    ],
    steps: [],
    step_count: 8,
    tips: [
      { id: 1, body: "Play a quick practice round with open hands or explained moves when teaching a brand-new player." },
      { id: 2, body: "Keep a small notepad nearby if you are playing a multi-round tournament with friends or family." },
    ],
    warnings: [
      { id: 1, body: "Keep small game pieces, marbles, and tokens out of reach of children under three years old." },
    ],
    things: ["Flat table or floor space", "Score pad and pencil", "Game pieces or playing surface"],
    faqs: [
      {
        id: 1,
        question: `How long does a typical game take?`,
        answer: "Most casual rounds take between 10 and 20 minutes once every player knows the basic turn order.",
      },
      {
        id: 2,
        question: "What is the best strategy for beginners?",
        answer: "Focus on controlling the center early and avoid making moves that give your opponent an immediate counter-capture.",
      },
    ],
    references: [
      {
        id: 1,
        title: "Classic Tabletop & Parlor Game Rules Archive",
        publisher: "BoardGameGeek Reference Library",
        url: "https://boardgamegeek.com/",
      },
      {
        id: 2,
        title: "Traditional Games and Play History",
        publisher: "Victoria and Albert Museum — Museum of Childhood",
        url: "https://www.vam.ac.uk/",
      },
    ],
    comments: [],
  };
}

function getArticleBySlug(slug) {
  const article = db
    .prepare(
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji
       FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.slug = ?`,
    )
    .get(slug);
  if (article) return hydrateArticle(article);

  const { ALL_SHOWCASE_ARTICLES } = require("./subcategories.js");
  const found = ALL_SHOWCASE_ARTICLES.find(
    (item) => item.slug.toLowerCase() === String(slug || "").toLowerCase()
  );
  if (found) return buildShowcaseArticle(found);
  return null;
}

function getArticleById(id) {
  const article = db
    .prepare(
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji
       FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.id = ?`,
    )
    .get(id);
  if (!article) return null;
  return hydrateArticle(article);
}

function hydrateArticle(article) {
  const methods = db
    .prepare("SELECT * FROM methods WHERE article_id = ? ORDER BY position, id")
    .all(article.id);
  const steps = db
    .prepare("SELECT * FROM steps WHERE article_id = ? ORDER BY position, id")
    .all(article.id);
  methods.forEach((m) => {
    m.steps = steps.filter((s) => s.method_id === m.id);
  });
  article.methods = methods;
  article.steps = steps;
  article.tips = db
    .prepare(
      "SELECT * FROM tips WHERE article_id = ? AND kind = 'tip' ORDER BY position, id",
    )
    .all(article.id);
  article.warnings = db
    .prepare(
      "SELECT * FROM tips WHERE article_id = ? AND kind = 'warning' ORDER BY position, id",
    )
    .all(article.id);
  article.faqs = db
    .prepare("SELECT * FROM faqs WHERE article_id = ? ORDER BY position, id")
    .all(article.id);
  article.references = db
    .prepare("SELECT * FROM refs WHERE article_id = ? ORDER BY position, id")
    .all(article.id);
  article.things = db
    .prepare("SELECT * FROM things WHERE article_id = ? ORDER BY position, id")
    .all(article.id)
    .map((t) => t.text);
  article.comments = db
    .prepare(
      "SELECT * FROM comments WHERE article_id = ? AND approved = 1 ORDER BY id DESC",
    )
    .all(article.id);
  article.step_count = steps.length;
  return article;
}

function relatedArticles(article, limit = 3) {
  const rows = db
    .prepare(
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji,
              (SELECT s.image FROM steps s WHERE s.article_id = a.id AND s.image != '' ORDER BY s.position, s.id LIMIT 1) AS first_step_image
       FROM articles a LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.id != ? AND a.status = 'published'
       ORDER BY (a.category_id = ?) DESC, a.views DESC LIMIT ?`,
    )
    .all(article.id, article.category_id, limit);
  return rows;
}

function searchArticles(q, limit = 30) {
  return db
    .prepare(
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji,
              (SELECT s.image FROM steps s WHERE s.article_id = a.id AND s.image != '' ORDER BY s.position, s.id LIMIT 1) AS first_step_image
       FROM articles a LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.status = 'published' AND (a.title LIKE ? OR a.summary LIKE ? OR a.intro LIKE ?)
       ORDER BY a.featured DESC, a.views DESC LIMIT ?`,
    )
    .all(`%${q}%`, `%${q}%`, `%${q}%`, limit);
}

function popularArticles(limit = 6) {
  return db
    .prepare(
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji,
              (SELECT s.image FROM steps s WHERE s.article_id = a.id AND s.image != '' ORDER BY s.position, s.id LIMIT 1) AS first_step_image
       FROM articles a LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.status = 'published' ORDER BY a.views DESC LIMIT ?`,
    )
    .all(limit);
}

function incrementViews(id) {
  db.prepare("UPDATE articles SET views = views + 1 WHERE id = ?").run(id);
}

function voteArticle(id, helpful) {
  const col = helpful ? "helpful_yes" : "helpful_no";
  db.prepare(`UPDATE articles SET ${col} = ${col} + 1 WHERE id = ?`).run(id);
  return db
    .prepare("SELECT helpful_yes, helpful_no FROM articles WHERE id = ?")
    .get(id);
}

function addComment({ articleId, author, body, rating }) {
  const info = db
    .prepare(
      "INSERT INTO comments (article_id, author, body, rating, approved) VALUES (?,?,?,?,1)",
    )
    .run(articleId, author || "Anonymous Reader", body, rating || 0);
  return db
    .prepare("SELECT * FROM comments WHERE id = ?")
    .get(Number(info.lastInsertRowid));
}

function randomArticle() {
  return db
    .prepare(
      "SELECT slug FROM articles WHERE status = 'published' ORDER BY RANDOM() LIMIT 1",
    )
    .get();
}

function adminStats() {
  return {
    articles: db.prepare("SELECT COUNT(*) c FROM articles").get().c,
    published: db
      .prepare("SELECT COUNT(*) c FROM articles WHERE status = 'published'")
      .get().c,
    drafts: db
      .prepare("SELECT COUNT(*) c FROM articles WHERE status = 'draft'")
      .get().c,
    categories: db.prepare("SELECT COUNT(*) c FROM categories").get().c,
    comments: db.prepare("SELECT COUNT(*) c FROM comments").get().c,
    views: db.prepare("SELECT COALESCE(SUM(views),0) c FROM articles").get().c,
    users: db.prepare("SELECT COUNT(*) c FROM users").get().c,
  };
}

module.exports = {
  db,
  listCategories,
  listMainCategories,
  listExtraCategories,
  getCategoryBySlug,
  listArticles,
  countArticles,
  getArticleBySlug,
  getArticleById,
  hydrateArticle,
  relatedArticles,
  searchArticles,
  popularArticles,
  incrementViews,
  voteArticle,
  addComment,
  randomArticle,
  adminStats,
  categoryMap,
};
