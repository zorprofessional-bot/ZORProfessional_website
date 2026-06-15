import type { Metadata } from "next";
import { ProductsIndexPage } from "@/components/pages/ProductsIndexPage";
import { getDeckPageData } from "@/lib/data/deck";
import { getPublishedProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "ZOR Professional product overview for toilet paper supply in homes, companies, apartments, and institutions.",
};

export default async function Page() {
  const [deckData, products] = await Promise.all([
    getDeckPageData("en", "products"),
    getPublishedProducts("en"),
  ]);

  return <ProductsIndexPage deckData={deckData} locale="en" products={products} />;
}
