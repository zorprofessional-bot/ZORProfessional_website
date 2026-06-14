import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Croatian toilet paper production | ZOR Professional",
  description:
    "ZOR Professional presents 24-roll and 36-roll toilet paper packs for homes, companies, apartments, and institutions with reliable availability and simple ordering.",
};

export default function Page() {
  return <HomePage locale="en" />;
}
