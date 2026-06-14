import { DeckPage } from "@/components/deck/DeckPage";
import {
  ContactDetailsVisual,
  DeckCardGrid,
  WhatsAppPanel,
} from "@/components/deck/DeckVisuals";
import { ContactFormCard } from "@/components/deck/InteractiveDeckCards";
import { chapterLabels, contactDeck } from "@/content/deck";
import { getWhatsAppHref, siteContact, type Locale } from "@/content/site";

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = contactDeck[locale];
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="contact"
      chapterLabel={chapterLabels[locale].contact}
      locale={locale}
      slides={[
        {
          ...copy[0],
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pošalji WhatsApp upit" : "Send WhatsApp inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: {
            label: siteContact.email,
            href: `mailto:${siteContact.email}`,
            variant: "secondary",
          },
          tone: "dark",
          visual: <WhatsAppPanel locale={locale} tone="dark" />,
        },
        {
          ...copy[1],
          background: "dark",
          layout: "splitReverse",
          tone: "dark",
          visual: <ContactFormCard locale={locale} />,
        },
        {
          ...copy[2],
          background: "theme",
          layout: "split",
          tone: "dark",
          visual: (
            <div className="grid w-full gap-4">
              <ContactDetailsVisual locale={locale} tone="dark" />
              <DeckCardGrid
                columns="two"
                iconSet="none"
                items={[
                  {
                    title: siteContact.location,
                    body: `${siteContact.city} · ${siteContact.company}`,
                  },
                  {
                    title: isHr ? "Dostupnost prije obećanja" : "Availability before promises",
                    body: isHr
                      ? "Za konkretan rok i količinu prvo provjeravamo zalihu."
                      : "For a concrete date and quantity, stock is checked first.",
                  },
                ]}
                tone="dark"
              />
            </div>
          ),
        },
      ]}
      theme="contact"
    />
  );
}
