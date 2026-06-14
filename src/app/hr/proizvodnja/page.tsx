import type { Metadata } from "next";
import { ProductionPage } from "@/components/pages/ProductionPage";

export const metadata: Metadata = {
  title: "Proizvodnja",
  description:
    "Hrvatska proizvodnja toaletnog papira ZOR Professional s praktičnom logistikom u Robnim terminalima Jankomir.",
};

export default function Page() {
  return <ProductionPage locale="hr" />;
}
