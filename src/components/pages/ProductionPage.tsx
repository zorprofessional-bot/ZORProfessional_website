import { DeckPage } from "@/components/deck/DeckPage";
import {
  ImagePanel,
  ProcessRail,
} from "@/components/deck/DeckVisuals";
import { chapterLabels, productionDeck } from "@/content/deck";
import { getWhatsAppHref, type Locale } from "@/content/site";

export function ProductionPage({ locale }: { locale: Locale }) {
  const slides = productionDeck[locale];
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="production"
      chapterLabel={chapterLabels[locale].production}
      locale={locale}
      slides={slides.map((slide, index) => ({
        ...slide,
        background: index === 0 ? "theme" : "steel",
        layout: index === 0 ? "split" : "splitReverse",
        primaryCta:
          index === 0 || index === slides.length - 1
            ? {
                label: isHr ? "Pošalji upit" : "Send inquiry",
                href: getWhatsAppHref(locale),
              }
            : undefined,
        visual:
          index === 0 ? (
            <ImagePanel
              alt={
                isHr
                  ? "Proizvodna linija za toaletni papir"
                  : "Toilet paper production line"
              }
              priority
              src="/visuals/production-line.png"
            />
          ) : (
            <ProcessRail activeIndex={index - 1} steps={slides.slice(1)} />
          ),
      }))}
      theme="production"
    />
  );
}
