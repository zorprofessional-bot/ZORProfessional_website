import {
  getPostBySlug as getFallbackPostBySlug,
  getPosts as getFallbackPosts,
  type BlogPost,
} from "@/content/blog";
import { routes, type Locale } from "@/content/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

export type BlogPostWithHref = BlogPost & {
  href: string;
  languageHrefs?: Record<Locale, string>;
};

function blogHref(locale: Locale, slug: string) {
  return locale === "hr" ? `/hr/blog/${slug}` : `/en/blog/${slug}`;
}

function paragraphize(content: string | null) {
  if (!content) {
    return [];
  }

  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function mapPost(row: BlogPostRow, locale: Locale): BlogPostWithHref {
  const href = blogHref(locale, row.slug);
  const fallbackTitle = locale === "hr" ? "Blog clanak" : "Blog post";
  const fallbackExcerpt = row.excerpt ?? row.seo_description ?? "";

  return {
    id: row.slug,
    slugs: {
      hr: locale === "hr" ? row.slug : "",
      en: locale === "en" ? row.slug : "",
    },
    title: {
      hr: locale === "hr" ? row.title : fallbackTitle,
      en: locale === "en" ? row.title : fallbackTitle,
    },
    eyebrow: {
      hr: "Blog",
      en: "Blog",
    },
    excerpt: {
      hr: locale === "hr" ? fallbackExcerpt : "",
      en: locale === "en" ? fallbackExcerpt : "",
    },
    body: {
      hr: locale === "hr" ? paragraphize(row.content) : [],
      en: locale === "en" ? paragraphize(row.content) : [],
    },
    date: (row.published_at ?? row.created_at).slice(0, 10),
    href,
    languageHrefs:
      locale === "hr"
        ? { hr: href, en: routes.en.blog }
        : { hr: routes.hr.blog, en: href },
  };
}

export async function getPublishedPosts(locale: Locale): Promise<BlogPostWithHref[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return getFallbackPosts(locale);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("locale", locale)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data || data.length === 0) {
    return getFallbackPosts(locale);
  }

  return data.map((post) => mapPost(post, locale));
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const post = getFallbackPostBySlug(locale, slug);
    return post
      ? {
          ...post,
          href: blogHref(locale, slug),
        }
      : undefined;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    const post = getFallbackPostBySlug(locale, slug);
    return post
      ? {
          ...post,
          href: blogHref(locale, slug),
        }
      : undefined;
  }

  return mapPost(data, locale);
}
