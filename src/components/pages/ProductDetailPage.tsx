import { DeckPage } from "@/components/deck/DeckPage";
import { SlideBody } from "@/components/deck/DeckVisuals";
import { chapterLabels } from "@/content/deck";
import type { Product } from "@/content/products";
import {
  buildWhatsAppHref,
  getLanguageHrefs,
  routes,
  type Locale,
} from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";
import { getSiteContact } from "@/lib/data/settings";

type ProductDetailPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
  product: Product;
};

export async function ProductDetailPage({
  deckData,
  locale,
  product,
}: ProductDetailPageProps) {
  const isHr = locale === "hr";
  const contact = await getSiteContact();
  const productIntro = resolveDeckSlideContent(deckData, {
    id: product.slugs[locale],
    eyebrow: product.eyebrow[locale],
    title: product.name[locale],
    body: product.detail[locale],
  });

  return (
    <DeckPage
      activeKey="products"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].products}
      languageHrefs={getLanguageHrefs("products", product.slugs)}
      locale={locale}
      slides={[
        {
          ...productIntro,
          body: (
            <SlideBody
              lead={productIntro.body ?? product.detail[locale]}
              points={product.highlights[locale].map((highlight) => ({
                title: highlight,
              }))}
            />
          ),
          layout: productIntro.layout ?? "split",
          primaryCta: productIntro.primaryCta ?? {
            label: isHr ? "Pošalji upit za proizvod" : "Send product inquiry",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          secondaryCta: productIntro.secondaryCta ?? {
            label: isHr ? "Natrag na proizvode" : "Back to products",
            href: routes[locale].products,
            variant: "secondary",
          },
          image: { src: product.image, alt: product.name[locale], priority: true },
        },
        {
          id: "specifikacije",
          eyebrow: isHr ? "Specifikacije" : "Specifications",
          title: isHr
            ? "Najvažnije informacije na jednom ekranu."
            : "The key information on one screen.",
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Detaljne cijene i finalne fotografije dolaze s **potvrdom asortimana**."
                  : "Detailed prices and final photos arrive once the **assortment is confirmed**."
              }
              points={product.specs.map((spec) => ({
                title: spec.label[locale],
                body: spec.value[locale],
              }))}
            />
          ),
          layout: "splitReverse",
          image: { src: product.image, alt: product.name[locale] },
        },
      ]}
      theme={deckData?.chapter.theme ?? "products"}
    />
  );
}
