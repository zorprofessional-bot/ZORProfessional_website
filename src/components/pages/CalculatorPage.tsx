import { DeckPage } from "@/components/deck/DeckPage";
import {
  ImagePanel,
  WhatsAppPanel,
} from "@/components/deck/DeckVisuals";
import {
  CalculatorInputCard,
  CalculatorResultCard,
} from "@/components/deck/InteractiveDeckCards";
import { calculatorDeck, chapterLabels } from "@/content/deck";
import { getWhatsAppHref, type Locale } from "@/content/site";

export function CalculatorPage({ locale }: { locale: Locale }) {
  const copy = calculatorDeck[locale];
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="calculator"
      chapterLabel={chapterLabels[locale].calculator}
      locale={locale}
      slides={[
        {
          ...copy[0],
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pošalji okvirnu potrošnju" : "Send estimated demand",
            href: getWhatsAppHref(locale),
          },
          visual: (
            <ImagePanel
              alt={
                isHr
                  ? "Vizual kalkulatora potrošnje wc papira"
                  : "Toilet paper consumption calculator visual"
              }
              priority
              src="/visuals/calculator-preview.png"
            />
          ),
        },
        {
          ...copy[1],
          background: "light",
          layout: "splitReverse",
          visual: <CalculatorInputCard locale={locale} />,
        },
        {
          ...copy[2],
          background: "soft",
          layout: "split",
          visual: <CalculatorResultCard locale={locale} />,
        },
        {
          ...copy[3],
          background: "theme",
          layout: "splitReverse",
          primaryCta: {
            label: isHr ? "WhatsApp upit" : "WhatsApp inquiry",
            href: getWhatsAppHref(locale),
          },
          tone: "light",
          visual: <WhatsAppPanel locale={locale} tone="light" />,
        },
      ]}
      theme="calculator"
    />
  );
}
