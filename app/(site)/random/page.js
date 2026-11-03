import { redirect } from 'next/navigation';
import { randomArticle } from '../../../lib/queries';

export const dynamic = 'force-dynamic';

export default function RandomPage() {
  const row = randomArticle();
  if (row?.slug) redirect(`/wikiHow/${row.slug}`);
  redirect('/');
}
