import {
  getProductBySlug as getFallbackProductBySlug,
  getProducts as getFallbackProducts,
  type Product,
} from "@/content/products";
import type { Locale } from "@/content/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductWithHref = Product & { href: string };

function productHref(locale: Locale, slug: string) {
  return locale === "hr" ? `/hr/proizvodi/${slug}` : `/en/products/${slug}`;
}

function formatPrice(locale: Locale, price: number | string | null) {
  const numericPrice = typeof price === "string" ? Number(price) : price;

  if (numericPrice === null || !Number.isFinite(numericPrice)) {
    return locale === "hr" ? "Cijena na upit" : "Price on request";
  }

  return locale === "hr"
    ? `${numericPrice.toFixed(2).replace(".", ",")} EUR`
    : `EUR ${numericPrice.toFixed(2)}`;
}

function formatRollCount(locale: Locale, rollCount: number | null, packageSize: string | null) {
  if (packageSize) {
    return packageSize;
  }

  if (!rollCount) {
    return locale === "hr" ? "Pakiranje" : "Pack";
  }

  if (locale === "hr") {
    return rollCount === 36 ? "36 rola" : `${rollCount} role`;
  }

  return `${rollCount} rolls`;
}

function mapProduct(row: ProductRow, locale: Locale): ProductWithHref {
  const name = {
    hr: row.name_hr,
    en: row.name_en,
  };
  const packCount = {
    hr: formatRollCount("hr", row.roll_count, row.package_size),
    en: formatRollCount("en", row.roll_count, row.package_size),
  };
  const price = {
    hr: formatPrice("hr", row.price_eur),
    en: formatPrice("en", row.price_eur),
  };
  const summary = {
    hr: row.short_description_hr ?? row.description_hr ?? row.name_hr,
    en: row.short_description_en ?? row.description_en ?? row.name_en,
  };
  const detail = {
    hr: row.description_hr ?? summary.hr,
    en: row.description_en ?? summary.en,
  };

  return {
    id: row.slug,
    slugs: { hr: row.slug, en: row.slug },
    name,
    eyebrow: {
      hr: packCount.hr,
      en: packCount.en,
    },
    packCount,
    mockPrice: price,
    summary,
    detail,
    image: row.image_url ?? "/visuals/deck/product-range.webp",
    highlights: {
      hr: [
        row.recommended_for_hr ?? "Domovi, firme i apartmani",
        row.business_note_hr ?? "Posebna ponuda za redovite količine",
        "Jednostavan WhatsApp upit",
      ],
      en: [
        row.recommended_for_en ?? "Homes, companies, and apartments",
        row.business_note_en ?? "Dedicated offer for recurring quantities",
        "Simple WhatsApp inquiry",
      ],
    },
    specs: [
      {
        label: { hr: "Pakiranje", en: "Pack" },
        value: packCount,
      },
      {
        label: { hr: "Slojevi", en: "Layers" },
        value: {
          hr: row.layers ? `${row.layers} sloja` : "Specifikacija u pripremi",
          en: row.layers ? `${row.layers} layers` : "Specification pending",
        },
      },
      {
        label: { hr: "Cijena", en: "Price" },
        value: price,
      },
      {
        label: { hr: "Namjena", en: "Use" },
        value: {
          hr: row.recommended_for_hr ?? "Redovita potrošnja",
          en: row.recommended_for_en ?? "Regular demand",
        },
      },
    ],
    href: productHref(locale, row.slug),
  };
}

export async function getPublishedProducts(locale: Locale): Promise<ProductWithHref[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return getFallbackProducts(locale);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return getFallbackProducts(locale);
  }

  return data.map((product) => mapProduct(product, locale));
}

export async function getProductBySlug(locale: Locale, slug: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const product = getFallbackProductBySlug(locale, slug);
    return product ? { ...product, href: productHref(locale, slug) } : undefined;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    const product = getFallbackProductBySlug(locale, slug);
    return product ? { ...product, href: productHref(locale, slug) } : undefined;
  }

  return mapProduct(data, locale);
}
