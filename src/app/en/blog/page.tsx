import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/BlogIndexPage";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Short guides about consumption planning, toilet paper for apartments, and Croatian production.",
};

export default function Page() {
  return <BlogIndexPage locale="en" />;
}
