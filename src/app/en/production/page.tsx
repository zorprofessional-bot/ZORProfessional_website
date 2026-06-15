import type { Metadata } from "next";
import { ProductionPage } from "@/components/pages/ProductionPage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Production",
  description:
    "Croatian toilet paper production by ZOR Professional with practical logistics at Robni terminali Jankomir.",
};

export default async function Page() {
  const deckData = await getDeckPageData("en", "production");

  return <ProductionPage deckData={deckData} locale="en" />;
}
