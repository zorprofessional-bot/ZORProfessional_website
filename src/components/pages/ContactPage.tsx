import { DeckPage } from "@/components/deck/DeckPage";
import {
  ContactDetailsVisual,
  DeckCardGrid,
  WhatsAppPanel,
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
            label: isHr ? "PoÅ¡alji WhatsApp upit" : "Send WhatsApp inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: slides[0]?.secondaryCta ?? {
            label: siteContact.email,
            href: `mailto:${siteContact.email}`,
            variant: "secondary",
          },
          tone: "dark",
          visual: <WhatsAppPanel locale={locale} tone="dark" />,
        },
        {
          ...slides[1],
          body: slides[1]?.body ?? copy[1].body,
          background: slides[1]?.background ?? "dark",
          layout: slides[1]?.layout ?? "splitReverse",
          tone: "dark",
          visual: <ContactFormCard locale={locale} />,
        },
        {
          ...slides[2],
          body: slides[2]?.body ?? copy[2].body,
          background: slides[2]?.background ?? "theme",
          layout: slides[2]?.layout ?? "split",
          tone: "dark",
          visual: (
            <div className="grid w-full gap-4">
              <ContactDetailsVisual locale={locale} tone="dark" />
              <div className="hidden sm:block">
                <DeckCardGrid
                  columns="two"
                  iconSet="none"
                  items={[
                    {
                      title: siteContact.location,
                      body: `${siteContact.city} Â· ${siteContact.company}`,
                    },
                    {
                      title: isHr
                        ? "Dostupnost prije obeÄ‡anja"
                        : "Availability before promises",
                      body: isHr
                        ? "Za konkretan rok i koliÄinu prvo provjeravamo zalihu."
                        : "For a concrete date and quantity, stock is checked first.",
                    },
                  ]}
                  tone="dark"
                />
              </div>
            </div>
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "contact"}
    />
  );
}
