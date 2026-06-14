import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt za ZOR Professional, WhatsApp upit, toaletni papir za firme, apartmane i ustanove.",
};

export default function Page() {
  return <ContactPage locale="hr" />;
}
