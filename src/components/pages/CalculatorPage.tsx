import { DeckPage } from "@/components/deck/DeckPage";
import {
  ImagePanel,
  SlideBody,
} from "@/components/deck/DeckVisuals";
import {
  CalculatorInputCard,
  CalculatorResultCard,
} from "@/components/deck/InteractiveDeckCards";
import { calculatorDeck, chapterLabels } from "@/content/deck";
import { getWhatsAppHref, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type CalculatorPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

export function CalculatorPage({ deckData, locale }: CalculatorPageProps) {
  const copy = calculatorDeck[locale];
  const isHr = locale === "hr";
  const slides = copy.map((slide) => resolveDeckSlideContent(deckData, slide));

  return (
    <DeckPage
      activeKey="calculator"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].calculator}
      locale={locale}
      menuFlow
      slides={[
        {
          ...slides[0],
          body: slides[0]?.body ?? copy[0].body,
          background: slides[0]?.background ?? "theme",
          layout: slides[0]?.layout ?? "split",
          primaryCta: slides[0]?.primaryCta ?? {
            label: isHr ? "PoÅ¡alji okvirnu potroÅ¡nju" : "Send estimated demand",
            href: getWhatsAppHref(locale),
          },
          visual: (
            <ImagePanel
              alt={
                isHr
                  ? "Vizual kalkulatora potroÅ¡nje wc papira"
                  : "Toilet paper consumption calculator visual"
              }
              priority
              src={slides[0]?.imageUrl ?? "/visuals/deck/calculator-intro.png"}
            />
          ),
        },
        {
          ...slides[1],
          body: (
            <SlideBody
              body={slides[1]?.body ?? copy[1].body}
              support={<CalculatorInputCard locale={locale} />}
            />
          ),
          background: slides[1]?.background ?? "light",
          layout: slides[1]?.layout ?? "splitReverse",
          visual: (
            <ImagePanel
              alt={isHr ? "Tri podatka za procjenu potrosnje" : "Three inputs for consumption estimate"}
              src={slides[1]?.imageUrl ?? "/visuals/deck/calculator-input.png"}
            />
          ),
        },
        {
          ...slides[2],
          body: (
            <SlideBody
              body={slides[2]?.body ?? copy[2].body}
              support={<CalculatorResultCard locale={locale} />}
            />
          ),
          background: slides[2]?.background ?? "soft",
          layout: slides[2]?.layout ?? "split",
          visual: (
            <ImagePanel
              alt={isHr ? "Prakticna preporuka paketa" : "Practical pack recommendation"}
              src={slides[2]?.imageUrl ?? "/visuals/deck/calculator-result.png"}
            />
          ),
        },
        {
          ...slides[3],
          body: slides[3]?.body ?? copy[3].body,
          background: slides[3]?.background ?? "theme",
          layout: slides[3]?.layout ?? "splitReverse",
          primaryCta: slides[3]?.primaryCta ?? {
            label: isHr ? "WhatsApp upit" : "WhatsApp inquiry",
            href: getWhatsAppHref(locale),
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Slanje rezultata kroz kratku poruku" : "Sending the result with a short message"}
              src={slides[3]?.imageUrl ?? "/visuals/deck/calculator-whatsapp.png"}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "calculator"}
    />
  );
}
