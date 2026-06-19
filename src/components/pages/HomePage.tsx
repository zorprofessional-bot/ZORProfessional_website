import { DeckPage } from "@/components/deck/DeckPage";
import { RouteChoiceGrid, SlideBody } from "@/components/deck/DeckVisuals";
import { chapterLabels, homeDeck } from "@/content/deck";
import { audienceCards, valueCards } from "@/content/home";
import { buildWhatsAppHref, routes, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";
import { getSiteContact } from "@/lib/data/settings";

type HomePageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

export async function HomePage({ deckData, locale }: HomePageProps) {
  const copy = homeDeck[locale];
  const isHr = locale === "hr";
  const contact = await getSiteContact();
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
          layout: hero.layout ?? "split",
          primaryCta: hero.primaryCta ?? {
            label: isHr ? "Pošalji WhatsApp upit" : "Send WhatsApp inquiry",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          secondaryCta: hero.secondaryCta ?? {
            label: isHr ? "Pogledaj proizvode" : "View products",
            href: routes[locale].products,
            variant: "secondary",
          },
          image: {
            src: hero.imageUrl ?? "/visuals/deck/home-hero.png",
            alt: isHr ? "ZOR Professional toaletni papir" : "ZOR Professional toilet paper",
            priority: true,
          },
        },
        {
          ...audience,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Jedan praktičan izbor za prostore koji **svaki dan** troše papir — bez kataloškog lutanja."
                  : "One practical choice for spaces that use paper **every day** — without catalogue noise."
              }
              points={audienceCards[locale]}
            />
          ),
          layout: audience.layout ?? "splitReverse",
          image: {
            src: audience.imageUrl ?? "/visuals/deck/home-audience.png",
            alt: isHr
              ? "Prostori koji svakodnevno koriste toaletni papir"
              : "Spaces that use toilet paper every day",
          },
        },
        {
          ...why,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Kupac treba znati **što** dobiva, **kada** to može dobiti i **kome** poslati upit."
                  : "A buyer should know **what** they get, **when** they can get it, and **who** to ask."
              }
              points={valueCards[locale]}
            />
          ),
          layout: why.layout ?? "split",
          image: {
            src: why.imageUrl ?? "/visuals/deck/home-why-zor.png",
            alt: isHr ? "Proizvodnja i dostupnost ZOR papira" : "ZOR paper production and availability",
          },
        },
        {
          ...quickPath,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Odaberite **sljedeći korak** bez lutanja po stranici."
                  : "Pick your **next step** without wandering the site."
              }
              support={<RouteChoiceGrid locale={locale} />}
            />
          ),
          layout: quickPath.layout ?? "split",
          primaryCta: quickPath.primaryCta ?? {
            label: isHr ? "Izračunaj potrošnju" : "Calculate consumption",
            href: routes[locale].calculator,
          },
          secondaryCta: quickPath.secondaryCta ?? {
            label: isHr ? "Kontakt" : "Contact",
            href: routes[locale].contact,
            variant: "secondary",
          },
          image: {
            src: quickPath.imageUrl ?? "/visuals/deck/home-quick-path.png",
            alt: isHr ? "Brzi odabir sljedećeg koraka" : "Fast next-step choice",
          },
        },
      ]}
      theme={deckData?.chapter.theme ?? "home"}
    />
  );
}
