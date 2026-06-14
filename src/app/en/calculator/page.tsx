import type { Metadata } from "next";
import { CalculatorPage } from "@/components/pages/CalculatorPage";

export const metadata: Metadata = {
  title: "Consumption calculator",
  description:
    "Foundation for a future calculator that estimates toilet paper consumption for homes, companies, apartments, and institutions.",
};

export default function Page() {
  return <CalculatorPage locale="en" />;
}
