#!/usr/bin/env node
/**
 * Import (or update) a long-form guide from lib/guides/<file>.js
 *
 *   node scripts/import-guide.js arts
 *   node scripts/import-guide.js arts food health     # several at once
 *   node scripts/import-guide.js --all
 *
 * The guide file exports: slug, title, category (slug), hero_image, author,
 * read_time, featured, summary, intro, methods[{title, steps[{text, image}]}],
 * tips[], warnings[], things[], faqs[{question,answer}], references[{title,
 * publisher,url}]
 *
 * Step images are stored as "/img/steps/<article-slug>/<n>.jpg" so the pages
 * pick them up automatically once scripts/generate-step-images.js has run.
 */
const path = require('path');
const fs = require('fs');
const db = require('../lib/db');

function loadGuide(name) {
  const file = path.join(__dirname, '..', 'lib', 'guides', `${name}.js`);
  if (!fs.existsSync(file)) throw new Error(`No guide file: ${file}`);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function categoryId(slug) {
  const row = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
  if (!row) throw new Error(`Unknown category slug: ${slug}`);
  return row.id;
}

function upsertGuide(guide) {
  const catId = categoryId(guide.category);
  const existing = db.prepare('SELECT id FROM articles WHERE slug = ?').get(guide.slug);

  const tx = db.transaction(() => {
    let articleId;
    if (existing) {
      articleId = existing.id;
      db.prepare(
        `UPDATE articles SET title=?, summary=?, intro=?, category_id=?, hero_image=?, author=?, status='published', featured=?, read_time=?, updated_at=datetime('now') WHERE id=?`
      ).run(
        guide.title,
        guide.summary,
        guide.intro,
        catId,
        guide.hero_image,
        guide.author,
        guide.featured ? 1 : 0,
        guide.read_time,
        articleId
      );
      for (const t of ['methods', 'steps', 'tips', 'faqs', 'things', 'refs']) {
        db.prepare(`DELETE FROM ${t} WHERE article_id = ?`).run(articleId);
      }
    } else {
      const info = db
        .prepare(
          `INSERT INTO articles (slug, title, summary, intro, category_id, hero_image, author, status, featured, read_time)
           VALUES (?,?,?,?,?,?,?,'published',?,?)`
        )
        .run(
          guide.slug,
          guide.title,
          guide.summary,
          guide.intro,
          catId,
          guide.hero_image,
          guide.author,
          guide.featured ? 1 : 0,
          guide.read_time
        );
      articleId = Number(info.lastInsertRowid);
    }

    const mStmt = db.prepare('INSERT INTO methods (article_id, title, position) VALUES (?,?,?)');
    const sStmt = db.prepare(
      'INSERT INTO steps (article_id, method_id, position, text, image) VALUES (?,?,?,?,?)'
    );
    let n = 0;
    (guide.methods || []).forEach((m, mi) => {
      const mId = Number(mStmt.run(articleId, m.title || '', mi).lastInsertRowid);
      (m.steps || []).forEach((step) => {
        n += 1;
        const text = typeof step === 'string' ? step : step.text;
        const candidate = `/img/steps/${guide.slug}/${String(n).padStart(2, '0')}.jpg`;
        const diskPath = path.join(__dirname, '..', 'public', candidate);
        const explicit = typeof step === 'object' && step.image;
        // Only reference an image that actually exists on disk; the renderer
        // falls back to the built-in vector illustration otherwise.
        const image = explicit || (fs.existsSync(diskPath) ? candidate : '');
        sStmt.run(articleId, mId, n, text, image);
      });
    });

    (guide.tips || []).forEach((t, i) =>
      db.prepare('INSERT INTO tips (article_id, kind, body, position) VALUES (?,?,?,?)').run(articleId, 'tip', t, i)
    );
    (guide.warnings || []).forEach((t, i) =>
      db
        .prepare('INSERT INTO tips (article_id, kind, body, position) VALUES (?,?,?,?)')
        .run(articleId, 'warning', t, i)
    );
    (guide.faqs || []).forEach((f, i) =>
      db
        .prepare('INSERT INTO faqs (article_id, question, answer, position) VALUES (?,?,?,?)')
        .run(articleId, f.question, f.answer, i)
    );
    (guide.things || []).forEach((t, i) =>
      db.prepare('INSERT INTO things (article_id, text, position) VALUES (?,?,?)').run(articleId, t, i)
    );
    (guide.references || []).forEach((r, i) =>
      db
        .prepare('INSERT INTO refs (article_id, title, publisher, url, position) VALUES (?,?,?,?,?)')
        .run(articleId, r.title, r.publisher || '', r.url || '', i)
    );

    return { articleId, steps: n };
  });

  return tx();
}

function main() {
  const args = process.argv.slice(2);
  let names = args;
  if (!names.length || names.includes('--all')) {
    names = fs
      .readdirSync(path.join(__dirname, '..', 'lib', 'guides'))
      .filter((f) => f.endsWith('.js'))
      .map((f) => f.replace(/\.js$/, ''));
  }

  let totalSteps = 0;
  for (const name of names) {
    const guide = loadGuide(name);
    const { articleId, steps } = upsertGuide(guide);
    totalSteps += steps;
    console.log(
      `✓ ${guide.slug.padEnd(40)} id=${String(articleId).padEnd(4)} steps=${String(steps).padEnd(3)} refs=${(guide.references || []).length}`
    );
  }
  console.log(`\nImported ${names.length} guide(s), ${totalSteps} steps total.`);
}

main();
