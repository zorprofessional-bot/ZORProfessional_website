import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailPage } from "@/components/pages/BlogDetailPage";
import { blogPosts } from "@/content/blog";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/blog";
import { getDeckPageData } from "@/lib/data/deck";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slugs.hr }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("hr", slug);

  return {
    title: post?.title.hr ?? "Blog",
    description: post?.excerpt.hr,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [deckData, post, posts] = await Promise.all([
    getDeckPageData("hr", "blog"),
    getPostBySlug("hr", slug),
    getPublishedPosts("hr"),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <BlogDetailPage
      deckData={deckData}
      languageHrefs={post.languageHrefs}
      locale="hr"
      post={post}
      relatedPosts={posts.filter((item) => item.id !== post.id).slice(0, 2)}
    />
  );
}
