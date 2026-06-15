import { DeckPage } from "@/components/deck/DeckPage";
import {
  ImagePanel,
  ProcessStepVisual,
} from "@/components/deck/DeckVisuals";
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
        visual:
          index === 0 ? (
            <ImagePanel
              alt={
                isHr
                  ? "Proizvodna linija za toaletni papir"
                  : "Toilet paper production line"
              }
              priority
              src={slide.imageUrl ?? "/visuals/production-line.png"}
            />
          ) : (
            <ProcessStepVisual
              step={slide}
              stepIndex={index - 1}
              totalSteps={slides.length - 1}
            />
          ),
      }))}
      theme={deckData?.chapter.theme ?? "production"}
    />
  );
}
