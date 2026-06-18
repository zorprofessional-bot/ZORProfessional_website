import { DeckPage } from "@/components/deck/DeckPage";
import { ImagePanel } from "@/components/deck/DeckVisuals";
import { chapterLabels, productionDeck } from "@/content/deck";
import { getWhatsAppHref, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type ProductionPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

const productionSlideImages = [
  "/visuals/deck/production-intro.png",
  "/visuals/deck/production-jumbo-roll.png",
  "/visuals/deck/production-rewinding.png",
  "/visuals/deck/production-cutting.png",
  "/visuals/deck/production-packing.png",
  "/visuals/deck/production-warehouse.png",
];

export function ProductionPage({ deckData, locale }: ProductionPageProps) {
  const fallbackSlides = productionDeck[locale];
  const slides = fallbackSlides.map((slide) =>
    resolveDeckSlideContent(deckData, slide),
  );
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="production"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].production}
      locale={locale}
      menuFlow
      slides={slides.map((slide, index) => ({
        ...slide,
        body: slide.body ?? fallbackSlides[index]?.body ?? "",
        background: slide.background ?? (index === 0 ? "theme" : "steel"),
        layout: slide.layout ?? "split",
        primaryCta:
          slide.primaryCta ??
          (index === 0 || index === slides.length - 1
            ? {
                label: isHr ? "PoÅ¡alji upit" : "Send inquiry",
                href: getWhatsAppHref(locale),
              }
            : undefined),
        visual: (
            <ImagePanel
              alt={slide.title}
              priority={index === 0}
              src={slide.imageUrl ?? productionSlideImages[index] ?? productionSlideImages[0]}
            />
          ),
      }))}
      theme={deckData?.chapter.theme ?? "production"}
    />
  );
}
