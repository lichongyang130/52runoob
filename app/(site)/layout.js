import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { listMainCategories, listCategories } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }) {
  let categories = [];
  let allCategories = [];
  try {
    categories = listMainCategories();
    allCategories = listCategories();
  } catch (e) {
    categories = [];
    allCategories = [];
  }
  return (
    <>
      <Header categories={categories} allCategories={allCategories} />
      {children}
      <Footer categories={categories} />
    </>
  );
}
