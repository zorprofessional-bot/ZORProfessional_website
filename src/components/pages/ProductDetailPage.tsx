import { DeckPage } from "@/components/deck/DeckPage";
import {
  DeckCardGrid,
  ImagePanel,
  SlideBody,
} from "@/components/deck/DeckVisuals";
import { chapterLabels } from "@/content/deck";
import type { Product } from "@/content/products";
import {
  getLanguageHrefs,
  getWhatsAppHref,
  routes,
  type Locale,
} from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type ProductDetailPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
  product: Product;
};

export function ProductDetailPage({
  deckData,
  locale,
  product,
}: ProductDetailPageProps) {
  const isHr = locale === "hr";
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
          body: productIntro.body ?? product.detail[locale],
          background: productIntro.background ?? "theme",
          layout: productIntro.layout ?? "split",
          primaryCta: productIntro.primaryCta ?? {
            label: isHr ? "PoÅ¡alji upit za proizvod" : "Send product inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: productIntro.secondaryCta ?? {
            label: isHr ? "Natrag na proizvode" : "Back to products",
            href: routes[locale].products,
            variant: "secondary",
          },
          visual: (
            <ImagePanel alt={product.name[locale]} priority src={product.image} />
          ),
        },
        {
          id: "specifikacije",
          eyebrow: isHr ? "Specifikacije" : "Specifications",
          title: isHr
            ? "NajvaÅ¾nije informacije stanu na jedan ekran."
            : "The key information fits on one screen.",
          body: (
            <SlideBody
              body={
                isHr
                  ? "Detaljnije cijene i finalne fotografije dodaju se kada se potvrdi asortiman."
                  : "Detailed prices and final photography will be added once the assortment is confirmed."
              }
              support={
                <DeckCardGrid
                  columns="three"
                  iconSet="none"
                  items={[
                    ...product.highlights[locale].map((highlight) => ({
                      title: highlight,
                    })),
                    ...product.specs.map((spec) => ({
                      meta: spec.label[locale],
                      title: spec.value[locale],
                    })),
                  ]}
                />
              }
            />
          ),
          background: "light",
          layout: "splitReverse",
          visual: <ImagePanel alt={product.name[locale]} src={product.image} />,
        },
        {
          id: "vizual",
          eyebrow: isHr ? "Vizual proizvoda" : "Product visual",
          title: isHr
            ? "Prikaz ostaje informativan, ne webshop katalog."
            : "The display stays informative, not a webshop catalogue.",
          body: product.summary[locale],
          background: "soft",
          layout: "split",
          visual: (
            <ImagePanel
              alt={
                isHr
                  ? "Vizual asortimana toaletnog papira"
                  : "Toilet paper assortment visual"
              }
              src={product.image}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "products"}
    />
  );
}
