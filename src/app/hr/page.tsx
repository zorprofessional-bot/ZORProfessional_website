import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Toaletni papir iz hrvatske proizvodnje | ZOR Professional",
  description:
    "ZOR Professional predstavlja toaletni papir 24 role i 36 rola za domove, firme, apartmane i ustanove uz fer cijenu i jednostavnu narudžbu.",
};

export default async function Page() {
  const deckData = await getDeckPageData("hr", "home");

  return <HomePage deckData={deckData} locale="hr" />;
}
