import type { Metadata } from "next";
import { ProductsIndexPage } from "@/components/pages/ProductsIndexPage";
import { getDeckPageData } from "@/lib/data/deck";
import { getPublishedProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Proizvodi",
  description:
    "Pregled ZOR Professional proizvoda za toaletni papir, wc papir, firme, apartmane i ustanove.",
};

export default async function Page() {
  const [deckData, products] = await Promise.all([
    getDeckPageData("hr", "proizvodi"),
    getPublishedProducts("hr"),
  ]);

  return <ProductsIndexPage deckData={deckData} locale="hr" products={products} />;
}
