import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/BlogIndexPage";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Kratki vodiči o planiranju potrošnje, toaletnom papiru za apartmane i hrvatskoj proizvodnji.",
};

export default function Page() {
  return <BlogIndexPage locale="hr" />;
}
