import type { Metadata } from "next";
import { CalculatorPage } from "@/components/pages/CalculatorPage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Consumption calculator",
  description:
    "Foundation for a future calculator that estimates toilet paper consumption for homes, companies, apartments, and institutions.",
};

export default async function Page() {
  const deckData = await getDeckPageData("en", "calculator");

  return <CalculatorPage deckData={deckData} locale="en" />;
}
