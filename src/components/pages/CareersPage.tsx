import { DeckPage } from "@/components/deck/DeckPage";
import {
  DeckCardGrid,
  ImagePanel,
  WhatsAppPanel,
} from "@/components/deck/DeckVisuals";
import { careersDeck, chapterLabels } from "@/content/deck";
import { getWhatsAppHref, type Locale } from "@/content/site";

export function CareersPage({ locale }: { locale: Locale }) {
  const copy = careersDeck[locale];
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="careers"
      chapterLabel={chapterLabels[locale].careers}
      locale={locale}
      slides={[
        {
          ...copy[0],
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pošalji upit za posao" : "Send job inquiry",
            href: getWhatsAppHref(locale),
          },
          tone: "dark",
          visual: (
            <ImagePanel
              alt={isHr ? "Radno okruženje u proizvodnji" : "Production work environment"}
              priority
              src="/visuals/careers-workspace.png"
              tone="dark"
            />
          ),
        },
        {
          ...copy[1],
          background: "dark",
          layout: "splitReverse",
          tone: "dark",
          visual: (
            <DeckCardGrid
              iconSet="process"
              items={[
                {
                  title: isHr ? "Praćenje procesa" : "Following the process",
                  body: isHr ? "Ritam linije mora ostati miran i uredan." : "The line rhythm should stay calm and orderly.",
                },
                {
                  title: isHr ? "Urednost" : "Order",
                  body: isHr ? "Radno mjesto treba ostati jasno i sigurno." : "The workplace needs to stay clear and safe.",
                },
              ]}
              tone="dark"
            />
          ),
        },
        {
          ...copy[2],
          background: "theme",
          layout: "split",
          tone: "dark",
          visual: (
            <DeckCardGrid
              columns="two"
              iconSet="process"
              items={[
                {
                  title: isHr ? "Obuka uz posao" : "Training on the job",
                  body: isHr ? "Učenje se događa kroz stvarni ritam proizvodnje." : "Learning happens through the real production rhythm.",
                },
                {
                  title: isHr ? "Jasna očekivanja" : "Clear expectations",
                  body: isHr ? "Pouzdanost, pažnja i spremnost na učenje." : "Reliability, attention, and willingness to learn.",
                },
              ]}
              tone="dark"
            />
          ),
        },
        {
          ...copy[3],
          background: "light",
          layout: "splitReverse",
          visual: (
            <DeckCardGrid
              iconSet="none"
              items={[
                {
                  meta: isHr ? "Uskoro" : "Soon",
                  title: isHr ? "Operater na stroju" : "Machine operator",
                  body: isHr ? "Detalji smjene, uvjeta i prijave dolaze u sljedećoj fazi." : "Shift, terms, and application details come in the next phase.",
                },
                {
                  meta: isHr ? "Lokacija" : "Location",
                  title: "Robni terminali Jankomir",
                  body: isHr ? "Rad u Zagrebu, vezan uz proizvodnju i skladište." : "Work in Zagreb, tied to production and warehouse stock.",
                },
              ]}
            />
          ),
        },
        {
          ...copy[4],
          background: "dark",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pošalji prijavu" : "Send application",
            href: getWhatsAppHref(locale),
          },
          tone: "dark",
          visual: <WhatsAppPanel locale={locale} tone="dark" />,
        },
      ]}
      theme="careers"
    />
  );
}
