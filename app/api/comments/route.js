import { NextResponse } from 'next/server';
import { addComment } from '../../../lib/queries';

export async function POST(request) {
  try {
    const body = await request.json();
    const articleId = Number(body.articleId);
    const text = String(body.body || '').trim();
    if (!articleId) return NextResponse.json({ ok: false, error: 'Missing article' }, { status: 400 });
    if (text.length < 2) return NextResponse.json({ ok: false, error: 'Comment is too short' }, { status: 400 });
    if (text.length > 2000) return NextResponse.json({ ok: false, error: 'Comment is too long' }, { status: 400 });
    const author = String(body.author || '').trim().slice(0, 60) || 'Anonymous Reader';
    const comment = addComment({ articleId, author, body: text, rating: Number(body.rating) || 0 });
    return NextResponse.json({ ok: true, comment });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Could not save comment' }, { status: 500 });
  }
}
