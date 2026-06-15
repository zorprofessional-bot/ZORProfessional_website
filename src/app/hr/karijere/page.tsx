import type { Metadata } from "next";
import { CareersPage } from "@/components/pages/CareersPage";
import { getPublishedCareerPositions } from "@/lib/data/careers";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Karijere",
  description:
    "Karijere u proizvodnji ZOR d.o.o. i prvi dojam o stabilnom proizvodnom okruženju.",
};

export default async function Page() {
  const [deckData, positions] = await Promise.all([
    getDeckPageData("hr", "karijere"),
    getPublishedCareerPositions("hr"),
  ]);

  return <CareersPage deckData={deckData} locale="hr" positions={positions} />;
}
