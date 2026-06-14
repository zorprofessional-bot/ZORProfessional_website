import type { Metadata } from "next";
import { ProductsIndexPage } from "@/components/pages/ProductsIndexPage";

export const metadata: Metadata = {
  title: "Products",
  description:
    "ZOR Professional product overview for toilet paper supply in homes, companies, apartments, and institutions.",
};

export default function Page() {
  return <ProductsIndexPage locale="en" />;
}
