import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Toaletni papir iz hrvatske proizvodnje | ZOR Professional",
  description:
    "ZOR Professional predstavlja toaletni papir 24 role i 36 rola za domove, firme, apartmane i ustanove uz fer cijenu i jednostavnu narudžbu.",
};

export default function Page() {
  return <HomePage locale="hr" />;
}
