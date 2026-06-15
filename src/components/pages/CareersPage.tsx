import { DeckPage } from "@/components/deck/DeckPage";
import {
  DeckCardGrid,
  ImagePanel,
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
              ? "Detalji smjene, uvjeta i prijave dolaze u sljedeÄ‡oj fazi."
              : "Shift, terms, and application details come in the next phase.",
          },
          {
            meta: isHr ? "Lokacija" : "Location",
            title: "Robni terminali Jankomir",
            body: isHr
              ? "Rad u Zagrebu, vezan uz proizvodnju i skladiÅ¡te."
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
            label: isHr ? "PoÅ¡alji upit za posao" : "Send job inquiry",
            href: getWhatsAppHref(locale),
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Radno okruÅ¾enje u proizvodnji" : "Production work environment"}
              priority
              src={slides[0]?.imageUrl ?? "/visuals/careers-workspace.png"}
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
            <DeckCardGrid
              iconSet="process"
              items={[
                {
                  title: isHr ? "PraÄ‡enje procesa" : "Following the process",
                  body: isHr
                    ? "Ritam linije mora ostati miran i uredan."
                    : "The line rhythm should stay calm and orderly.",
                },
                {
                  title: isHr ? "Urednost" : "Order",
                  body: isHr
                    ? "Radno mjesto treba ostati jasno i sigurno."
                    : "The workplace needs to stay clear and safe.",
                },
              ]}
              tone="dark"
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
            <DeckCardGrid
              columns="two"
              iconSet="process"
              items={[
                {
                  title: isHr ? "Obuka uz posao" : "Training on the job",
                  body: isHr
                    ? "UÄenje se dogaÄ‘a kroz stvarni ritam proizvodnje."
                    : "Learning happens through the real production rhythm.",
                },
                {
                  title: isHr ? "Jasna oÄekivanja" : "Clear expectations",
                  body: isHr
                    ? "Pouzdanost, paÅ¾nja i spremnost na uÄenje."
                    : "Reliability, attention, and willingness to learn.",
                },
              ]}
              tone="dark"
            />
          ),
        },
        {
          ...slides[3],
          body: slides[3]?.body ?? copy[3].body,
          background: slides[3]?.background ?? "light",
          layout: slides[3]?.layout ?? "splitReverse",
          visual: <DeckCardGrid iconSet="none" items={positionCards} />,
        },
        {
          ...slides[4],
          body: slides[4]?.body ?? copy[4].body,
          background: slides[4]?.background ?? "dark",
          layout: slides[4]?.layout ?? "split",
          primaryCta: slides[4]?.primaryCta ?? {
            label: isHr ? "PoÅ¡alji prijavu" : "Send application",
            href: getWhatsAppHref(locale),
          },
          tone: "dark",
          visual: <CareerApplicationCard locale={locale} positions={positions} />,
        },
      ]}
      theme={deckData?.chapter.theme ?? "careers"}
    />
  );
}
