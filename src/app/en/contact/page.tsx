import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ZOR Professional for toilet paper supply, company inquiries, apartments, institutions, production, and careers.",
};

export default async function Page() {
  const deckData = await getDeckPageData("en", "contact");

  return <ContactPage deckData={deckData} locale="en" />;
}
