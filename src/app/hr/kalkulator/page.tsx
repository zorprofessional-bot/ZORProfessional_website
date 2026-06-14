import type { Metadata } from "next";
import { CalculatorPage } from "@/components/pages/CalculatorPage";

export const metadata: Metadata = {
  title: "Kalkulator potrošnje",
  description:
    "Temelj budućeg kalkulatora za procjenu potrošnje toaletnog papira za domove, firme, apartmane i ustanove.",
};

export default function Page() {
  return <CalculatorPage locale="hr" />;
}
