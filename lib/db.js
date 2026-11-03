const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, "howcompass.db");

const globalForDb = globalThis;

function createDb() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seed(db);
  return db;
}

function migrate(db) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    emoji TEXT DEFAULT '📘',
    color TEXT DEFAULT '#a6ce39',
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT DEFAULT '',
    intro TEXT DEFAULT '',
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    hero_image TEXT DEFAULT '',
    author TEXT DEFAULT 'howcompass Editorial Team',
    status TEXT DEFAULT 'published',
    featured INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    helpful_yes INTEGER DEFAULT 0,
    helpful_no INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 5,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    title TEXT DEFAULT '',
    position INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    method_id INTEGER NOT NULL REFERENCES methods(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    text TEXT DEFAULT '',
    image TEXT DEFAULT '',
    caption TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    kind TEXT DEFAULT 'tip',
    body TEXT DEFAULT '',
    position INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    question TEXT DEFAULT '',
    answer TEXT DEFAULT '',
    position INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS things (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    text TEXT DEFAULT '',
    position INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author TEXT DEFAULT '匿名读者',
    body TEXT DEFAULT '',
    rating INTEGER DEFAULT 0,
    approved INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    name TEXT DEFAULT '',
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_steps_method ON steps(method_id);
  CREATE INDEX IF NOT EXISTS idx_methods_article ON methods(article_id);
  CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
  `);
}

function seed(db) {
  const row = db.prepare("SELECT COUNT(*) AS c FROM articles").get();
  if (row.c > 0) {
    const hasUser = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      )
      .get();
    const userCount = hasUser
      ? db.prepare("SELECT COUNT(*) c FROM users").get().c
      : 0;
    if (!userCount) {
      const { hashPassword } = require("./auth.js");
      db.prepare(
        "INSERT INTO users (username, name, password_hash, role) VALUES (?,?,?,?)",
      ).run("admin", "Site Admin", hashPassword("admin123"), "admin");
    }
    return;
  }
  const { seedDatabase } = require("./seed-data.js");
  const { hashPassword } = require("./auth.js");
  const tx = db.transaction(() => {
    seedDatabase(db);
    const exists = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get("admin");
    if (!exists) {
      db.prepare(
        "INSERT INTO users (username, name, password_hash, role) VALUES (?,?,?,?)",
      ).run("admin", "Site Admin", hashPassword("admin123"), "admin");
    }
  });
  tx();
}

const db = globalForDb.__howcompassDb || (globalForDb.__howcompassDb = createDb());

module.exports = db;
module.exports.DB_PATH = DB_PATH;
