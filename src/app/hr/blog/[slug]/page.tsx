import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailPage } from "@/components/pages/BlogDetailPage";
import { blogPosts, getPostBySlug } from "@/content/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slugs.hr }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("hr", slug);

  return {
    title: post?.title.hr ?? "Blog",
    description: post?.excerpt.hr,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("hr", slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailPage locale="hr" post={post} />;
}
