import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt za ZOR Professional, WhatsApp upit, toaletni papir za firme, apartmane i ustanove.",
};

export default async function Page() {
  const deckData = await getDeckPageData("hr", "kontakt");

  return <ContactPage deckData={deckData} locale="hr" />;
}
