import { getCategories, getProducts } from "@/lib/storage";
import { MenuClient } from "@/components/MenuClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = await getCategories();
  const products = await getProducts();

  return <MenuClient categories={categories} products={products} />;
}
