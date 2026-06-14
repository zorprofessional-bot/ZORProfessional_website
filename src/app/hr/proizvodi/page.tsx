import type { Metadata } from "next";
import { ProductsIndexPage } from "@/components/pages/ProductsIndexPage";

export const metadata: Metadata = {
  title: "Proizvodi",
  description:
    "Pregled ZOR Professional proizvoda za toaletni papir, wc papir, firme, apartmane i ustanove.",
};

export default function Page() {
  return <ProductsIndexPage locale="hr" />;
}
