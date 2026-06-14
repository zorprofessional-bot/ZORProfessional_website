import type { Metadata } from "next";
import { CareersPage } from "@/components/pages/CareersPage";

export const metadata: Metadata = {
  title: "Karijere",
  description:
    "Karijere u proizvodnji ZOR d.o.o. i prvi dojam o stabilnom proizvodnom okruženju.",
};

export default function Page() {
  return <CareersPage locale="hr" />;
}
