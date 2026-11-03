import { NextResponse } from 'next/server';
import { voteArticle } from '../../../lib/queries';

export async function POST(request) {
  try {
    const body = await request.json();
    const articleId = Number(body.articleId);
    if (!articleId) return NextResponse.json({ ok: false, error: 'Missing articleId' }, { status: 400 });
    const counts = voteArticle(articleId, Boolean(body.helpful));
    return NextResponse.json({ ok: true, ...counts });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Could not record vote' }, { status: 500 });
  }
}
