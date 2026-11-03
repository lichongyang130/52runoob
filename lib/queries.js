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
    SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji
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

function getArticleBySlug(slug) {
  const article = db
    .prepare(
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji
       FROM articles a LEFT JOIN categories c ON c.id = a.category_id WHERE a.slug = ?`,
    )
    .get(slug);
  if (!article) return null;
  return hydrateArticle(article);
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
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji
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
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji
       FROM articles a LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.status = 'published' AND (a.title LIKE ? OR a.summary LIKE ? OR a.intro LIKE ?)
       ORDER BY a.featured DESC, a.views DESC LIMIT ?`,
    )
    .all(`%${q}%`, `%${q}%`, `%${q}%`, limit);
}

function popularArticles(limit = 6) {
  return db
    .prepare(
      `SELECT a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, c.emoji AS category_emoji
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
