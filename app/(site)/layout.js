import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { listCategories } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }) {
  let categories = [];
  try {
    categories = listCategories();
  } catch (e) {
    categories = [];
  }
  return (
    <>
      <Header categories={categories} />
      {children}
      <Footer categories={categories} />
    </>
  );
}
