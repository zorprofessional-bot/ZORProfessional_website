import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/BlogIndexPage";
import { getPublishedPosts } from "@/lib/data/blog";
import { getDeckPageData } from "@/lib/data/deck";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Short guides about consumption planning, toilet paper for apartments, and Croatian production.",
};

export default async function Page() {
  const [deckData, posts] = await Promise.all([
    getDeckPageData("en", "blog"),
    getPublishedPosts("en"),
  ]);

  return <BlogIndexPage deckData={deckData} locale="en" posts={posts} />;
}
