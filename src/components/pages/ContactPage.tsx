import { DeckPage } from "@/components/deck/DeckPage";
import { ImagePanel, SlideBody } from "@/components/deck/DeckVisuals";
import { ContactFormCard } from "@/components/deck/InteractiveDeckCards";
import { chapterLabels, contactDeck } from "@/content/deck";
import { buildWhatsAppHref, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";
import { getSiteContact } from "@/lib/data/settings";

type ContactPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
};

export async function ContactPage({ deckData, locale }: ContactPageProps) {
  const copy = contactDeck[locale];
  const isHr = locale === "hr";
  const contact = await getSiteContact();
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
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Najbrži početak je **kratka poruka** — napišite prostor i okvirnu potrošnju."
                  : "The fastest start is a **short message** — tell us the space and rough demand."
              }
              points={[
                {
                  title: isHr ? "Dom ili apartman" : "Home or apartment",
                  body: isHr ? "Kućna ili **sezonska** zaliha." : "Household or **seasonal** stock.",
                },
                {
                  title: isHr ? "Firma ili ustanova" : "Company or institution",
                  body: isHr ? "**Redovita** nabava i ponuda za količine." : "**Recurring** supply and quantity offers.",
                },
              ]}
            />
          ),
          primaryCta: {
            label: isHr ? "Pošalji WhatsApp upit" : "Send WhatsApp inquiry",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          secondaryCta: {
            label: contact.email,
            href: `mailto:${contact.email}`,
            variant: "secondary",
          },
          image: {
            src: slides[0]?.imageUrl ?? "/visuals/deck/contact-whatsapp.png",
            alt: isHr ? "Kratka poruka za upit" : "Short inquiry message",
            priority: true,
          },
        },
        {
          ...slides[1],
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Trebate li **više konteksta**, forma slaže email s osnovnim podacima."
                  : "Need **more context**? The form prepares an email with the basics."
              }
              support={<ContactFormCard locale={locale} />}
            />
          ),
          layout: "splitReverse",
          hideVisualOnMobile: true,
          visual: (
            <ImagePanel
              alt={isHr ? "Email upit s više konteksta" : "Email inquiry with more context"}
              src={slides[1]?.imageUrl ?? "/visuals/deck/contact-form.png"}
            />
          ),
        },
        {
          ...slides[2],
          body: (
            <SlideBody
              lead={
                isHr
                  ? "**Robni terminali Jankomir** dio su priče o dostupnosti."
                  : "**Robni terminali Jankomir** is part of the availability story."
              }
              points={[
                {
                  title: isHr ? "Lokacija u Zagrebu" : "Zagreb location",
                  body: isHr ? "Uz **proizvodnju i skladište**." : "Next to **production and warehouse**.",
                },
                {
                  title: isHr ? "Brži dogovor" : "Faster coordination",
                  body: isHr ? "Blizina skraćuje put do **dostupne zalihe**." : "Proximity shortens the path to **available stock**.",
                },
              ]}
            />
          ),
          image: {
            src: slides[2]?.imageUrl ?? "/visuals/deck/contact-location.png",
            alt: isHr ? "Lokacija i dostupnost iz skladišta" : "Location and warehouse availability",
          },
        },
      ]}
      theme={deckData?.chapter.theme ?? "contact"}
    />
  );
}
