import { DeckPage } from "@/components/deck/DeckPage";
import {
  ImagePanel,
  SlideBody,
} from "@/components/deck/DeckVisuals";
import { ContactFormCard } from "@/components/deck/InteractiveDeckCards";
import { chapterLabels, contactDeck } from "@/content/deck";
import { getWhatsAppHref, siteContact, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type ContactPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

export function ContactPage({ deckData, locale }: ContactPageProps) {
  const copy = contactDeck[locale];
  const isHr = locale === "hr";
  const slides = copy.map((slide) => resolveDeckSlideContent(deckData, slide));

  return (
    <DeckPage
      activeKey="contact"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].contact}
      locale={locale}
      menuFlow
      slides={[
        {
          ...slides[0],
          body: slides[0]?.body ?? copy[0].body,
          background: slides[0]?.background ?? "theme",
          layout: slides[0]?.layout ?? "split",
          primaryCta: slides[0]?.primaryCta ?? {
            label: isHr ? "Posalji WhatsApp upit" : "Send WhatsApp inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: slides[0]?.secondaryCta ?? {
            label: siteContact.email,
            href: `mailto:${siteContact.email}`,
            variant: "secondary",
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Kratka poruka za upit" : "Short inquiry message"}
              src={slides[0]?.imageUrl ?? "/visuals/deck/contact-whatsapp.png"}
            />
          ),
        },
        {
          ...slides[1],
          body: (
            <SlideBody
              body={slides[1]?.body ?? copy[1].body}
              support={<ContactFormCard locale={locale} />}
            />
          ),
          background: slides[1]?.background ?? "dark",
          layout: slides[1]?.layout ?? "splitReverse",
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Email upit s vise konteksta" : "Email inquiry with more context"}
              src={slides[1]?.imageUrl ?? "/visuals/deck/contact-form.png"}
            />
          ),
        },
        {
          ...slides[2],
          body: slides[2]?.body ?? copy[2].body,
          background: slides[2]?.background ?? "theme",
          layout: slides[2]?.layout ?? "split",
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Lokacija i dostupnost iz skladista" : "Location and warehouse availability"}
              src={slides[2]?.imageUrl ?? "/visuals/deck/contact-location.png"}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "contact"}
    />
  );
}
