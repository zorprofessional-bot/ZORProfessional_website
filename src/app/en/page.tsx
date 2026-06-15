import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Croatian toilet paper production | ZOR Professional",
  description:
    "ZOR Professional presents 24-roll and 36-roll toilet paper packs for homes, companies, apartments, and institutions with reliable availability and simple ordering.",
};

export default async function Page() {
  const deckData = await getDeckPageData("en", "home");

  return <HomePage deckData={deckData} locale="en" />;
}
