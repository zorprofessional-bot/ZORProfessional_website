import type { MetadataRoute } from "next";
import { locales, menuRouteOrder, routes, siteUrl } from "@/content/site";
import { getPublishedPosts } from "@/lib/data/blog";
import { getPublishedProducts } from "@/lib/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static chapter routes for both locales.
  for (const locale of locales) {
    for (const routeKey of menuRouteOrder) {
      entries.push({
        url: `${siteUrl}${routes[locale][routeKey]}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: routeKey === "home" ? 1 : 0.7,
      });
    }
  }

  // Dynamic product and blog detail routes (Supabase or fallback content).
  for (const locale of locales) {
    const [products, posts] = await Promise.all([
      getPublishedProducts(locale),
      getPublishedPosts(locale),
    ]);

    for (const product of products) {
      entries.push({
        url: `${siteUrl}${product.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const post of posts) {
      const lastModified = post.date ? new Date(post.date) : now;
      entries.push({
        url: `${siteUrl}${post.href}`,
        lastModified: Number.isNaN(lastModified.getTime()) ? now : lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
