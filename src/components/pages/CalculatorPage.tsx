import { DeckPage } from "@/components/deck/DeckPage";
import { ImagePanel, SlideBody } from "@/components/deck/DeckVisuals";
import { CalculatorInputCard } from "@/components/deck/InteractiveDeckCards";
import { calculatorDeck, chapterLabels } from "@/content/deck";
import { buildWhatsAppHref, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";
import { getSiteContact } from "@/lib/data/settings";

type CalculatorPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

export async function CalculatorPage({ deckData, locale }: CalculatorPageProps) {
  const copy = calculatorDeck[locale];
  const isHr = locale === "hr";
  const contact = await getSiteContact();
  const input = resolveDeckSlideContent(deckData, copy[0], ["unos", "input"]);
  const whatsapp = resolveDeckSlideContent(deckData, copy[1], [
    "whatsapp-upit",
    "whatsapp-inquiry",
  ]);

  return (
    <DeckPage
      activeKey="calculator"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].calculator}
      locale={locale}
      menuFlow
      slides={[
        {
          ...input,
          body: (
            <SlideBody
              lead={input.body ?? copy[0].body}
              support={<CalculatorInputCard locale={locale} />}
            />
          ),
          layout: input.layout ?? "splitReverse",
          hideVisualOnMobile: true,
          visual: (
            <ImagePanel
              alt={isHr ? "Procjena potrošnje po korisniku" : "Per-user consumption estimate"}
              priority
              src={input.imageUrl ?? "/visuals/deck/calculator-input.png"}
            />
          ),
        },
        {
          ...whatsapp,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Pošaljite rezultat u **jednoj poruci** — bez dugog obrasca."
                  : "Send the result in **one message** — no long form."
              }
            />
          ),
          primaryCta: whatsapp.primaryCta ?? {
            label: isHr ? "WhatsApp upit" : "WhatsApp inquiry",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          image: {
            src: whatsapp.imageUrl ?? "/visuals/deck/calculator-whatsapp.png",
            alt: isHr ? "Slanje rezultata kroz kratku poruku" : "Sending the result with a short message",
          },
        },
      ]}
      theme={deckData?.chapter.theme ?? "calculator"}
    />
  );
}
