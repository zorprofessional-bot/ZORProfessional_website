import type { Metadata } from "next";
import { ProductionPage } from "@/components/pages/ProductionPage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Proizvodnja",
  description:
    "Hrvatska proizvodnja toaletnog papira ZOR Professional s praktičnom logistikom u Robnim terminalima Jankomir.",
};

export default async function Page() {
  const deckData = await getDeckPageData("hr", "proizvodnja");

  return <ProductionPage deckData={deckData} locale="hr" />;
}
