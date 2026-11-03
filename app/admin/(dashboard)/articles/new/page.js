import ArticleEditor from '../../../../../components/ArticleEditor';
import { listCategories } from '../../../../../lib/queries';

export const dynamic = 'force-dynamic';

export default function NewArticlePage() {
  const categories = listCategories();
  return <ArticleEditor categories={categories} />;
}
