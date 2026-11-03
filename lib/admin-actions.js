'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import db from './db';
import { slugify } from './util';
import { COOKIE_NAME, verifyPassword, createSession, destroySession, getUserByToken, hashPassword } from './auth';

async function currentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return getUserByToken(token);
}

async function mustUser() {
  const user = await currentUser();
  if (!user) redirect('/admin/login');
  return user;
}

export async function loginAction(formData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !verifyPassword(password, user.password_hash)) {
    redirect('/admin/login?error=1');
  }

  const { token, expires } = createSession(user.id);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(expires),
  });
  redirect('/admin');
}

export async function logoutAction() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  destroySession(token);
  store.delete(COOKIE_NAME);
  redirect('/admin/login');
}

export async function saveArticleAction(formData) {
  await mustUser();
  const id = Number(formData.get('id') || 0);
  const payload = JSON.parse(String(formData.get('payload') || '{}'));
  const title = String(payload.title || '').trim();
  if (!title) redirect('/admin/articles');

  const slug = String(payload.slug || '').trim() || slugify(title);
  const summary = String(payload.summary || '').trim();
  const intro = String(payload.intro || '').trim();
  const categoryId = Number(payload.category_id) || null;
  const heroImage = String(payload.hero_image || 'idea');
  const author = String(payload.author || 'wikiHow Staff').trim();
  const status = payload.status === 'published' ? 'published' : 'draft';
  const featured = payload.featured ? 1 : 0;
  const readTime = Number(payload.read_time) || 5;
  const methods = Array.isArray(payload.methods) ? payload.methods : [];
  const tips = Array.isArray(payload.tips) ? payload.tips : [];
  const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];
  const faqs = Array.isArray(payload.faqs) ? payload.faqs : [];
  const things = Array.isArray(payload.things) ? payload.things : [];

  const tx = db.transaction(() => {
    let articleId = id;
    if (id) {
      db.prepare(
        `UPDATE articles SET slug=?, title=?, summary=?, intro=?, category_id=?, hero_image=?, author=?, status=?, featured=?, read_time=?, updated_at=datetime('now') WHERE id=?`
      ).run(slug, title, summary, intro, categoryId, heroImage, author, status, featured, readTime, id);
      db.prepare('DELETE FROM methods WHERE article_id = ?').run(id);
      db.prepare('DELETE FROM steps WHERE article_id = ?').run(id);
      db.prepare('DELETE FROM tips WHERE article_id = ?').run(id);
      db.prepare('DELETE FROM faqs WHERE article_id = ?').run(id);
      db.prepare('DELETE FROM things WHERE article_id = ?').run(id);
    } else {
      const info = db
        .prepare(
          `INSERT INTO articles (slug, title, summary, intro, category_id, hero_image, author, status, featured, read_time)
           VALUES (?,?,?,?,?,?,?,?,?,?)`
        )
        .run(slug, title, summary, intro, categoryId, heroImage, author, status, featured, readTime);
      articleId = Number(info.lastInsertRowid);
    }

    methods.forEach((m, mi) => {
      const mInfo = db
        .prepare('INSERT INTO methods (article_id, title, position) VALUES (?,?,?)')
        .run(articleId, String(m.title || ''), mi);
      const methodId = Number(mInfo.lastInsertRowid);
      (m.steps || []).forEach((text, si) => {
        const clean = String(text || '').trim();
        if (!clean) return;
        db.prepare('INSERT INTO steps (article_id, method_id, position, text, image) VALUES (?,?,?,?,?)').run(
          articleId,
          methodId,
          si,
          clean,
          ''
        );
      });
    });

    tips.forEach((t, i) => {
      const clean = String(t || '').trim();
      if (clean) db.prepare('INSERT INTO tips (article_id, kind, body, position) VALUES (?,?,?,?)').run(articleId, 'tip', clean, i);
    });
    warnings.forEach((t, i) => {
      const clean = String(t || '').trim();
      if (clean) db.prepare('INSERT INTO tips (article_id, kind, body, position) VALUES (?,?,?,?)').run(articleId, 'warning', clean, i);
    });
    faqs.forEach((f, i) => {
      const q = String(f.question || '').trim();
      if (q) db.prepare('INSERT INTO faqs (article_id, question, answer, position) VALUES (?,?,?,?)').run(articleId, q, String(f.answer || '').trim(), i);
    });
    things.forEach((t, i) => {
      const clean = String(t || '').trim();
      if (clean) db.prepare('INSERT INTO things (article_id, text, position) VALUES (?,?,?)').run(articleId, clean, i);
    });

    return articleId;
  });

  const articleId = tx();
  revalidatePath('/');
  revalidatePath('/admin');
  redirect(`/admin/articles/${articleId}?saved=1`);
}

export async function deleteArticleAction(formData) {
  await mustUser();
  const id = Number(formData.get('id') || 0);
  if (id) db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin/articles?deleted=1');
}

export async function toggleArticleStatusAction(formData) {
  await mustUser();
  const id = Number(formData.get('id') || 0);
  const article = db.prepare('SELECT status FROM articles WHERE id = ?').get(id);
  if (article) {
    const next = article.status === 'published' ? 'draft' : 'published';
    db.prepare("UPDATE articles SET status = ?, updated_at = datetime('now') WHERE id = ?").run(next, id);
  }
  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin/articles');
}

export async function saveCategoryAction(formData) {
  await mustUser();
  const id = Number(formData.get('id') || 0);
  const name = String(formData.get('name') || '').trim();
  if (!name) redirect('/admin/categories');
  const slug = String(formData.get('slug') || '').trim() || slugify(name);
  const description = String(formData.get('description') || '').trim();
  const emoji = String(formData.get('emoji') || '📘').trim().slice(0, 4);
  const color = String(formData.get('color') || '#7cb342');
  const position = Number(formData.get('position')) || 0;
  const description2 = description;

  if (id) {
    db.prepare('UPDATE categories SET name=?, slug=?, description=?, emoji=?, color=?, position=? WHERE id=?').run(
      name,
      slug,
      description2,
      emoji,
      color,
      position,
      id
    );
  } else {
    db.prepare('INSERT INTO categories (name, slug, description, emoji, color, position) VALUES (?,?,?,?,?,?)').run(
      name,
      slug,
      description2,
      emoji,
      color,
      position
    );
  }
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories?saved=1');
}

export async function deleteCategoryAction(formData) {
  await mustUser();
  const id = Number(formData.get('id') || 0);
  if (id) db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function deleteCommentAction(formData) {
  await mustUser();
  const id = Number(formData.get('id') || 0);
  if (id) db.prepare('DELETE FROM comments WHERE id = ?').run(id);
  revalidatePath('/admin/comments');
  redirect('/admin/comments?deleted=1');
}

export async function toggleCommentApprovalAction(formData) {
  await mustUser();
  const id = Number(formData.get('id') || 0);
  const c = db.prepare('SELECT approved FROM comments WHERE id = ?').get(id);
  if (c) db.prepare('UPDATE comments SET approved = ? WHERE id = ?').run(c.approved ? 0 : 1, id);
  revalidatePath('/admin/comments');
  redirect('/admin/comments');
}

export async function saveUserAction(formData) {
  const me = await mustUser();
  if (me.role !== 'admin') redirect('/admin');
  const username = String(formData.get('username') || '').trim();
  const name = String(formData.get('name') || '').trim();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'editor');
  if (!username || !password) redirect('/admin/users?error=1');
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (exists) redirect('/admin/users?error=2');
  db.prepare('INSERT INTO users (username, name, password_hash, role) VALUES (?,?,?,?)').run(
    username,
    name || username,
    hashPassword(password),
    role
  );
  revalidatePath('/admin/users');
  redirect('/admin/users?saved=1');
}

export async function deleteUserAction(formData) {
  const me = await mustUser();
  if (me.role !== 'admin') redirect('/admin');
  const id = Number(formData.get('id') || 0);
  if (id && id !== me.id) db.prepare('DELETE FROM users WHERE id = ?').run(id);
  redirect('/admin/users?deleted=1');
}

