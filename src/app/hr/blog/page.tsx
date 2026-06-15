import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/BlogIndexPage";
import { getPublishedPosts } from "@/lib/data/blog";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Kratki vodiči o planiranju potrošnje, toaletnom papiru za apartmane i hrvatskoj proizvodnji.",
};

export default async function Page() {
  const [deckData, posts] = await Promise.all([
    getDeckPageData("hr", "blog"),
    getPublishedPosts("hr"),
  ]);

  return <BlogIndexPage deckData={deckData} locale="hr" posts={posts} />;
}
