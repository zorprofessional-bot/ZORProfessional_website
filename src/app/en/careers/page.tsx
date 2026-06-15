import type { Metadata } from "next";
import { CareersPage } from "@/components/pages/CareersPage";
import { getPublishedCareerPositions } from "@/lib/data/careers";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Production careers at ZOR d.o.o. and a first impression of a stable production environment.",
};

export default async function Page() {
  const [deckData, positions] = await Promise.all([
    getDeckPageData("en", "careers"),
    getPublishedCareerPositions("en"),
  ]);

  return <CareersPage deckData={deckData} locale="en" positions={positions} />;
}
