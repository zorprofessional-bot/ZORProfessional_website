import { DeckPage } from "@/components/deck/DeckPage";
import { ImagePanel, SlideBody } from "@/components/deck/DeckVisuals";
import { CareerApplicationCard } from "@/components/deck/InteractiveDeckCards";
import { careersDeck, chapterLabels } from "@/content/deck";
import { buildWhatsAppHref, type Locale } from "@/content/site";
import type { CareerPosition } from "@/lib/data/careers";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";
import { getSiteContact } from "@/lib/data/settings";

type CareersPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
  positions?: CareerPosition[];
};

export async function CareersPage({ deckData, locale, positions = [] }: CareersPageProps) {
  const copy = careersDeck[locale];
  const isHr = locale === "hr";
  const contact = await getSiteContact();
  const intro = resolveDeckSlideContent(deckData, copy[0]);
  const roles = resolveDeckSlideContent(deckData, copy[1], ["operater", "operator"]);
  const openings = resolveDeckSlideContent(deckData, copy[3], ["pozicije", "positions"]);
  const application = resolveDeckSlideContent(deckData, copy[4], ["prijava", "application"]);

  const positionPoints =
    positions.length > 0
      ? positions.slice(0, 4).map((position) => ({
          title: position.title,
          body: `${position.employmentType} · ${position.location}`,
        }))
      : [
          {
            title: isHr ? "Operater na stroju" : "Machine operator",
            body: isHr
              ? "**Robni terminali Jankomir** — detalji smjene uskoro."
              : "**Robni terminali Jankomir** — shift details soon.",
          },
          {
            title: isHr ? "Otvorena prijava" : "Open application",
            body: isHr
              ? "Javi se i **prije** službenog oglasa."
              : "Reach out **before** a formal opening.",
          },
        ];

  return (
    <DeckPage
      activeKey="careers"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].careers}
      locale={locale}
      menuFlow
      slides={[
        {
          ...intro,
          body: intro.body ?? copy[0].body,
          primaryCta: {
            label: isHr ? "Pošalji upit za posao" : "Send job inquiry",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          image: {
            src: intro.imageUrl ?? "/visuals/deck/careers-intro.webp",
            alt: isHr ? "Radno okruženje u proizvodnji" : "Production work environment",
            priority: true,
          },
        },
        {
          ...roles,
          eyebrow: isHr ? "Posao i obuka" : "Work and training",
          title: isHr ? "Što posao traži, a što nudimo." : "What the work asks, and what we offer.",
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Rad na liniji je konkretan i pošten — **ritam, urednost i učenje** kroz praksu."
                  : "Line work is concrete and honest — **rhythm, order, and learning** through practice."
              }
              points={[
                {
                  title: isHr ? "Pažnja i ritam" : "Attention and rhythm",
                  body: isHr
                    ? "Linija traži **stalnu pažnju** i pouzdan tempo."
                    : "The line needs **steady attention** and a reliable pace.",
                },
                {
                  title: isHr ? "Odgovornost" : "Responsibility",
                  body: isHr
                    ? "**Urednost** i reakcija na vrijeme drže proces stabilnim."
                    : "**Order** and timely reaction keep the process stable.",
                },
                {
                  title: isHr ? "Učenje kroz praksu" : "Learning by doing",
                  body: isHr
                    ? "Ne moraš znati sve prvog dana — **učiš u pogonu**."
                    : "You don't need to know everything on day one — **you learn on the floor**.",
                },
              ]}
            />
          ),
          layout: "splitReverse",
          image: {
            src: roles.imageUrl ?? "/visuals/deck/careers-operator.webp",
            alt: isHr ? "Rad na proizvodnoj liniji" : "Production line work",
          },
        },
        {
          ...openings,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Prvi oglasi su **kratki, konkretni** i vezani uz pogon."
                  : "First openings are **short, concrete**, and tied to the plant."
              }
              points={positionPoints}
            />
          ),
          image: {
            src: openings.imageUrl ?? "/visuals/deck/careers-positions.webp",
            alt: isHr ? "Otvorene pozicije povezane s pogonom" : "Open roles tied to the plant",
          },
        },
        {
          ...application,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Kandidatura može početi **kratkom porukom** — bez dugog obrasca."
                  : "An application can start with a **short message** — no long form."
              }
              support={<CareerApplicationCard locale={locale} positions={positions} />}
            />
          ),
          layout: "split",
          hideVisualOnMobile: true,
          primaryCta: {
            label: isHr ? "Pošalji prijavu" : "Send application",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          visual: (
            <ImagePanel
              alt={isHr ? "Kratka prijava za rad u proizvodnji" : "Short application for production work"}
              src={application.imageUrl ?? "/visuals/deck/careers-application.webp"}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "careers"}
    />
  );
}
