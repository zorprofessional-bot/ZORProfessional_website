import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ZOR Professional for toilet paper supply, company inquiries, apartments, institutions, production, and careers.",
};

export default function Page() {
  return <ContactPage locale="en" />;
}
