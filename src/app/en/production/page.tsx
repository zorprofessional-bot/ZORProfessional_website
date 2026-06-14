import type { Metadata } from "next";
import { ProductionPage } from "@/components/pages/ProductionPage";

export const metadata: Metadata = {
  title: "Production",
  description:
    "Croatian toilet paper production by ZOR Professional with practical logistics at Robni terminali Jankomir.",
};

export default function Page() {
  return <ProductionPage locale="en" />;
}
