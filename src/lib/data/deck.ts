import type {
  DeckBackground,
  DeckLayout,
} from "@/components/deck/types";
import type { ChapterThemeId } from "@/components/deck/ChapterThemeProvider";
import {
  blogDeck,
  calculatorDeck,
  careersDeck,
  chapterLabels,
  contactDeck,
  homeDeck,
  productionDeck,
  productsDeck,
} from "@/content/deck";
import {
  menuRouteOrder,
  routes,
  type Locale,
  type RouteKey,
} from "@/content/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ChapterRow = Database["public"]["Tables"]["deck_chapters"]["Row"];
type SlideRow = Database["public"]["Tables"]["deck_slides"]["Row"];

export type DeckChapterRecord = {
  id: string;
  slug: string;
  locale: Locale;
  label: string;
  navLabel: string;
  routePath: string;
  routeKey: RouteKey;
  theme: ChapterThemeId;
  sortOrder: number;
};

export type DeckSlideContent = {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  visualType?: string;
  imageUrl?: string;
  background?: DeckBackground;
  layout?: DeckLayout;
  align?: "left" | "center";
};

export type DeckPageData = {
  chapter: DeckChapterRecord;
  slides: DeckSlideContent[];
  source: "fallback" | "supabase";
};

const localizedChapterSlugs: Record<Locale, Record<RouteKey, string>> = {
  hr: {
    home: "home",
    products: "proizvodi",
    production: "proizvodnja",
    calculator: "kalkulator",
    blog: "blog",
    careers: "karijere",
    contact: "kontakt",
  },
  en: {
    home: "home",
    products: "products",
    production: "production",
    calculator: "calculator",
    blog: "blog",
    careers: "careers",
    contact: "contact",
  },
};

const themeByPromptValue: Record<string, ChapterThemeId> = {
  "dark-premium-blue": "home",
  "light-product-blue": "products",
  "industrial-neutral": "production",
  "practical-blue": "calculator",
  "editorial-white": "blog",
  "energetic-dark-blue": "careers",
  "contact-blue": "contact",
};

const routeTheme: Record<RouteKey, ChapterThemeId> = {
  home: "home",
  products: "products",
  production: "production",
  calculator: "calculator",
  blog: "blog",
  careers: "careers",
  contact: "contact",
};

const backgrounds = new Set<DeckBackground>([
  "theme",
  "light",
  "soft",
  "dark",
  "steel",
  "editorial",
]);

const layouts = new Set<DeckLayout>([
  "split",
  "splitReverse",
  "center",
  "visualFirst",
  "dense",
]);

function routeKeyFromSlug(locale: Locale, slug: string): RouteKey | undefined {
  return menuRouteOrder.find(
    (routeKey) =>
      localizedChapterSlugs[locale][routeKey] === slug || routeKey === slug,
  );
}

function routeKeyFromPath(locale: Locale, path: string): RouteKey | undefined {
  return menuRouteOrder.find((routeKey) => routes[locale][routeKey] === path);
}

function getTheme(theme: string | null, routeKey: RouteKey): ChapterThemeId {
  if (theme && theme in themeByPromptValue) {
    return themeByPromptValue[theme];
  }

  if (theme && menuRouteOrder.includes(theme as RouteKey)) {
    return theme as ChapterThemeId;
  }

  return routeTheme[routeKey];
}

function getBackground(value: string | null): DeckBackground | undefined {
  return value && backgrounds.has(value as DeckBackground)
    ? (value as DeckBackground)
    : undefined;
}

function getLayout(value: string | null): DeckLayout | undefined {
  return value && layouts.has(value as DeckLayout)
    ? (value as DeckLayout)
    : undefined;
}

function getAlign(value: string | null): "left" | "center" | undefined {
  return value === "left" || value === "center" ? value : undefined;
}

function mapChapter(row: ChapterRow): DeckChapterRecord | null {
  const routeKey =
    routeKeyFromPath(row.locale, row.route_path) ??
    routeKeyFromSlug(row.locale, row.slug);

  if (!routeKey) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    label: row.label,
    navLabel: row.nav_label ?? row.label,
    routePath: row.route_path,
    routeKey,
    theme: getTheme(row.theme, routeKey),
    sortOrder: row.sort_order,
  };
}

function mapSlide(row: SlideRow): DeckSlideContent {
  return {
    id: row.slide_key,
    eyebrow: row.eyebrow ?? undefined,
    title: row.title,
    body: row.body ?? undefined,
    primaryCta:
      row.primary_cta_label && row.primary_cta_href
        ? { label: row.primary_cta_label, href: row.primary_cta_href }
        : undefined,
    secondaryCta:
      row.secondary_cta_label && row.secondary_cta_href
        ? { label: row.secondary_cta_label, href: row.secondary_cta_href }
        : undefined,
    visualType: row.visual_type ?? undefined,
    imageUrl: row.image_url ?? undefined,
    background: getBackground(row.background_variant),
    layout: getLayout(row.layout_variant),
    align: getAlign(row.content_alignment),
  };
}

function fallbackChapter(locale: Locale, routeKey: RouteKey): DeckChapterRecord {
  return {
    id: `fallback-${locale}-${routeKey}`,
    slug: localizedChapterSlugs[locale][routeKey],
    locale,
    label: chapterLabels[locale][routeKey],
    navLabel: chapterLabels[locale][routeKey],
    routePath: routes[locale][routeKey],
    routeKey,
    theme: routeTheme[routeKey],
    sortOrder: menuRouteOrder.indexOf(routeKey) + 1,
  };
}

function fallbackSlides(locale: Locale, routeKey: RouteKey): DeckSlideContent[] {
  if (routeKey === "home") {
    const copy = homeDeck[locale];
    return [copy.hero, copy.audience, copy.why, copy.quickPath];
  }

  if (routeKey === "products") {
    const copy = productsDeck[locale];
    return [copy.overview, copy.business];
  }

  if (routeKey === "production") {
    return productionDeck[locale];
  }

  if (routeKey === "calculator") {
    return calculatorDeck[locale];
  }

  if (routeKey === "blog") {
    return blogDeck[locale];
  }

  if (routeKey === "careers") {
    return careersDeck[locale];
  }

  return contactDeck[locale];
}

function fallbackPageData(locale: Locale, slug: string): DeckPageData {
  const routeKey = routeKeyFromSlug(locale, slug) ?? "home";

  return {
    chapter: fallbackChapter(locale, routeKey),
    slides: fallbackSlides(locale, routeKey),
    source: "fallback",
  };
}

export function resolveDeckSlideContent(
  data: DeckPageData | undefined,
  fallback: DeckSlideContent,
  aliases: string[] = [],
): DeckSlideContent {
  const candidates = [fallback.id, ...aliases];
  const slide = data?.slides.find((item) => candidates.includes(item.id));

  return {
    id: slide?.id ?? fallback.id,
    eyebrow: slide?.eyebrow ?? fallback.eyebrow,
    title: slide?.title ?? fallback.title,
    body: slide?.body ?? fallback.body,
    primaryCta: slide?.primaryCta ?? fallback.primaryCta,
    secondaryCta: slide?.secondaryCta ?? fallback.secondaryCta,
    visualType: slide?.visualType ?? fallback.visualType,
    imageUrl: slide?.imageUrl ?? fallback.imageUrl,
    background: slide?.background ?? fallback.background,
    layout: slide?.layout ?? fallback.layout,
    align: slide?.align ?? fallback.align,
  };
}

export async function getActiveChapters(locale: Locale) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return menuRouteOrder.map((routeKey) => fallbackChapter(locale, routeKey));
  }

  const { data, error } = await supabase
    .from("deck_chapters")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return menuRouteOrder.map((routeKey) => fallbackChapter(locale, routeKey));
  }

  const chapters = data
    .map(mapChapter)
    .filter((chapter): chapter is DeckChapterRecord => Boolean(chapter));

  return chapters.length > 0
    ? chapters
    : menuRouteOrder.map((routeKey) => fallbackChapter(locale, routeKey));
}

export async function getChapterBySlug(locale: Locale, slug: string) {
  const supabase = getSupabaseServerClient();
  const routeKey = routeKeyFromSlug(locale, slug) ?? "home";

  if (!supabase) {
    return fallbackChapter(locale, routeKey);
  }

  const { data, error } = await supabase
    .from("deck_chapters")
    .select("*")
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return fallbackChapter(locale, routeKey);
  }

  return mapChapter(data) ?? fallbackChapter(locale, routeKey);
}

export async function getSlidesForChapter(locale: Locale, chapterSlug: string) {
  const supabase = getSupabaseServerClient();
  const routeKey = routeKeyFromSlug(locale, chapterSlug) ?? "home";

  if (!supabase) {
    return fallbackSlides(locale, routeKey);
  }

  const chapter = await getChapterBySlug(locale, chapterSlug);

  if (chapter.id.startsWith("fallback-")) {
    return fallbackSlides(locale, routeKey);
  }

  const { data, error } = await supabase
    .from("deck_slides")
    .select("*")
    .eq("chapter_id", chapter.id)
    .eq("locale", locale)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return fallbackSlides(locale, chapter.routeKey);
  }

  return data.map(mapSlide);
}

export async function getDeckPageData(
  locale: Locale,
  chapterSlug: string,
): Promise<DeckPageData> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return fallbackPageData(locale, chapterSlug);
  }

  try {
    const chapter = await getChapterBySlug(locale, chapterSlug);
    const slides = await getSlidesForChapter(locale, chapterSlug);

    return {
      chapter,
      slides,
      source: chapter.id.startsWith("fallback-") ? "fallback" : "supabase",
    };
  } catch {
    return fallbackPageData(locale, chapterSlug);
  }
}
