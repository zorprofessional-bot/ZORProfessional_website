import type { Metadata } from "next";
import { CareersPage } from "@/components/pages/CareersPage";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Production careers at ZOR d.o.o. and a first impression of a stable production environment.",
};

export default function Page() {
  return <CareersPage locale="en" />;
}
