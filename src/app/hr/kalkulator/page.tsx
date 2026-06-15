import type { Metadata } from "next";
import { CalculatorPage } from "@/components/pages/CalculatorPage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Kalkulator potrošnje",
  description:
    "Temelj budućeg kalkulatora za procjenu potrošnje toaletnog papira za domove, firme, apartmane i ustanove.",
};

export default async function Page() {
  const deckData = await getDeckPageData("hr", "kalkulator");

  return <CalculatorPage deckData={deckData} locale="hr" />;
}
