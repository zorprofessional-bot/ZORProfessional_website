import { DeckPage } from "@/components/deck/DeckPage";
import { chapterLabels, productionDeck } from "@/content/deck";
import { buildWhatsAppHref, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";
import { getSiteContact } from "@/lib/data/settings";

type ProductionPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

const productionSlideImages = [
  "/visuals/deck/production-intro.webp",
  "/visuals/deck/production-jumbo-roll.webp",
  "/visuals/deck/production-rewinding.webp",
  "/visuals/deck/production-cutting.webp",
  "/visuals/deck/production-packing.webp",
  "/visuals/deck/production-warehouse.webp",
];

export async function ProductionPage({ deckData, locale }: ProductionPageProps) {
  const fallbackSlides = productionDeck[locale];
  const slides = fallbackSlides.map((slide) =>
    resolveDeckSlideContent(deckData, slide),
  );
  const isHr = locale === "hr";
  const contact = await getSiteContact();

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
                label: isHr ? "Pošalji upit" : "Send inquiry",
                href: buildWhatsAppHref(contact.whatsappNumber, locale),
              }
            : undefined),
        image: {
          src: slide.imageUrl ?? productionSlideImages[index] ?? productionSlideImages[0],
          alt: slide.title,
          priority: index === 0,
        },
      }))}
      theme={deckData?.chapter.theme ?? "production"}
    />
  );
}
