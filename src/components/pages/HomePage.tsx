import { DeckPage } from "@/components/deck/DeckPage";
import {
  ImagePanel,
  RouteChoiceGrid,
  SlideBody,
} from "@/components/deck/DeckVisuals";
import {
  chapterLabels,
  homeDeck,
} from "@/content/deck";
import { getWhatsAppHref, routes, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type HomePageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

export function HomePage({ deckData, locale }: HomePageProps) {
  const copy = homeDeck[locale];
  const isHr = locale === "hr";
  const hero = resolveDeckSlideContent(deckData, copy.hero);
  const audience = resolveDeckSlideContent(deckData, copy.audience, ["audience"]);
  const why = resolveDeckSlideContent(deckData, copy.why, ["why-zor"]);
  const quickPath = resolveDeckSlideContent(deckData, copy.quickPath, ["next-step"]);

  return (
    <DeckPage
      activeKey="home"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].home}
      locale={locale}
      menuFlow
      slides={[
        {
          ...hero,
          body: hero.body ?? copy.hero.body,
          background: hero.background ?? "theme",
          layout: hero.layout ?? "split",
          primaryCta: hero.primaryCta ?? {
            label: isHr ? "PoÅ¡alji WhatsApp upit" : "Send WhatsApp inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: hero.secondaryCta ?? {
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
              src={hero.imageUrl ?? "/visuals/deck/home-hero.png"}
              tone="dark"
            />
          ),
        },
        {
          ...audience,
          body: audience.body ?? copy.audience.body,
          background: audience.background ?? "light",
          layout: audience.layout ?? "splitReverse",
          tone: "light",
          visual: (
            <ImagePanel
              alt={
                isHr
                  ? "Prostori koji svakodnevno koriste toaletni papir"
                  : "Spaces that use toilet paper every day"
              }
              src={audience.imageUrl ?? "/visuals/deck/home-audience.png"}
            />
          ),
        },
        {
          ...why,
          body: why.body ?? copy.why.body,
          background: why.background ?? "dark",
          layout: why.layout ?? "split",
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Proizvodnja i dostupnost ZOR papira" : "ZOR paper production and availability"}
              src={why.imageUrl ?? "/visuals/deck/home-why-zor.png"}
            />
          ),
        },
        {
          ...quickPath,
          body: (
            <SlideBody body={quickPath.body ?? copy.quickPath.body} support={<RouteChoiceGrid locale={locale} />} />
          ),
          background: quickPath.background ?? "theme",
          layout: quickPath.layout ?? "split",
          primaryCta: quickPath.primaryCta ?? {
            label: isHr ? "IzraÄunaj potroÅ¡nju" : "Calculate consumption",
            href: routes[locale].calculator,
          },
          secondaryCta: quickPath.secondaryCta ?? {
            label: isHr ? "Kontakt" : "Contact",
            href: routes[locale].contact,
            variant: "secondary",
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Brzi odabir sljedeceg koraka" : "Fast next-step choice"}
              src={quickPath.imageUrl ?? "/visuals/deck/home-quick-path.png"}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "home"}
    />
  );
}
