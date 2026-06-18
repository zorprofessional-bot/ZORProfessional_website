import { DeckPage } from "@/components/deck/DeckPage";
import {
  DeckCardGrid,
  ImagePanel,
  SlideBody,
} from "@/components/deck/DeckVisuals";
import { CareerApplicationCard } from "@/components/deck/InteractiveDeckCards";
import { careersDeck, chapterLabels } from "@/content/deck";
import { getWhatsAppHref, type Locale } from "@/content/site";
import type { CareerPosition } from "@/lib/data/careers";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type CareersPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
  positions?: CareerPosition[];
};

export function CareersPage({ deckData, locale, positions = [] }: CareersPageProps) {
  const copy = careersDeck[locale];
  const isHr = locale === "hr";
  const slides = copy.map((slide) => resolveDeckSlideContent(deckData, slide));
  const positionCards =
    positions.length > 0
      ? positions.slice(0, 4).map((position) => ({
          meta: position.employmentType,
          title: position.title,
          body: position.location,
        }))
      : [
          {
            meta: isHr ? "Uskoro" : "Soon",
            title: isHr ? "Operater na stroju" : "Machine operator",
            body: isHr
              ? "Detalji smjene, uvjeta i prijave dolaze u sljedecoj fazi."
              : "Shift, terms, and application details come in the next phase.",
          },
          {
            meta: isHr ? "Lokacija" : "Location",
            title: "Robni terminali Jankomir",
            body: isHr
              ? "Rad u Zagrebu, vezan uz proizvodnju i skladiste."
              : "Work in Zagreb, tied to production and warehouse stock.",
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
          ...slides[0],
          body: slides[0]?.body ?? copy[0].body,
          background: slides[0]?.background ?? "theme",
          layout: slides[0]?.layout ?? "split",
          primaryCta: slides[0]?.primaryCta ?? {
            label: isHr ? "Posalji upit za posao" : "Send job inquiry",
            href: getWhatsAppHref(locale),
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Radno okruzenje u proizvodnji" : "Production work environment"}
              priority
              src={slides[0]?.imageUrl ?? "/visuals/deck/careers-intro.png"}
              tone="dark"
            />
          ),
        },
        {
          ...slides[1],
          body: slides[1]?.body ?? copy[1].body,
          background: slides[1]?.background ?? "dark",
          layout: slides[1]?.layout ?? "splitReverse",
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Rad na proizvodnoj liniji" : "Production line work"}
              src={slides[1]?.imageUrl ?? "/visuals/deck/careers-operator.png"}
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
              alt={isHr ? "Obuka kroz praksu u proizvodnji" : "Training through production practice"}
              src={slides[2]?.imageUrl ?? "/visuals/deck/careers-training.png"}
            />
          ),
        },
        {
          ...slides[3],
          body: (
            <SlideBody
              body={slides[3]?.body ?? copy[3].body}
              support={<DeckCardGrid iconSet="none" items={positionCards} />}
            />
          ),
          background: slides[3]?.background ?? "light",
          layout: slides[3]?.layout ?? "splitReverse",
          visual: (
            <ImagePanel
              alt={isHr ? "Otvorene pozicije povezane s pogonom" : "Open roles tied to the plant"}
              src={slides[3]?.imageUrl ?? "/visuals/deck/careers-positions.png"}
            />
          ),
        },
        {
          ...slides[4],
          body: (
            <SlideBody
              body={slides[4]?.body ?? copy[4].body}
              support={<CareerApplicationCard locale={locale} positions={positions} />}
            />
          ),
          background: slides[4]?.background ?? "dark",
          layout: slides[4]?.layout ?? "split",
          primaryCta: slides[4]?.primaryCta ?? {
            label: isHr ? "Posalji prijavu" : "Send application",
            href: getWhatsAppHref(locale),
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Kratka prijava za rad u proizvodnji" : "Short application for production work"}
              src={slides[4]?.imageUrl ?? "/visuals/deck/careers-application.png"}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "careers"}
    />
  );
}
