import { DeckPage } from "@/components/deck/DeckPage";
import {
  DeckCardGrid,
  ImagePanel,
  RouteChoiceGrid,
} from "@/components/deck/DeckVisuals";
import {
  audienceCards,
  chapterLabels,
  homeDeck,
  valueCards,
} from "@/content/deck";
import { getWhatsAppHref, routes, type Locale } from "@/content/site";

type HomePageProps = {
  locale: Locale;
};

export function HomePage({ locale }: HomePageProps) {
  const copy = homeDeck[locale];
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="home"
      chapterLabel={chapterLabels[locale].home}
      locale={locale}
      menuFlow
      slides={[
        {
          ...copy.hero,
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pošalji WhatsApp upit" : "Send WhatsApp inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: {
            label: isHr ? "Pogledaj proizvode" : "View products",
            href: routes[locale].products,
            variant: "secondary",
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={
                isHr
                  ? "ZOR Professional toaletni papir"
                  : "ZOR Professional toilet paper"
              }
              priority
              src="/visuals/hero-paper.png"
              tone="dark"
            />
          ),
        },
        {
          ...copy.audience,
          background: "light",
          layout: "splitReverse",
          tone: "light",
          visual: <DeckCardGrid columns="two" items={audienceCards[locale]} />,
        },
        {
          ...copy.why,
          background: "dark",
          layout: "split",
          tone: "dark",
          visual: <DeckCardGrid columns="two" items={valueCards[locale]} tone="dark" />,
        },
        {
          ...copy.quickPath,
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Izračunaj potrošnju" : "Calculate consumption",
            href: routes[locale].calculator,
          },
          secondaryCta: {
            label: isHr ? "Kontakt" : "Contact",
            href: routes[locale].contact,
            variant: "secondary",
          },
          tone: "dark",
          visual: <RouteChoiceGrid locale={locale} />,
        },
      ]}
      theme="home"
    />
  );
}
