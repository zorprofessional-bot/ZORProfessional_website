import { DeckPage } from "@/components/deck/DeckPage";
import { ImagePanel } from "@/components/deck/DeckVisuals";
import { chapterLabels, productsDeck } from "@/content/deck";
import { getProducts, type Product } from "@/content/products";
import { getWhatsAppHref, routes, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type ProductsIndexPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
  products?: Array<Product & { href: string }>;
};

export function ProductsIndexPage({
  deckData,
  locale,
  products = getProducts(locale),
}: ProductsIndexPageProps) {
  const copy = productsDeck[locale];
  const isHr = locale === "hr";
  const overview = resolveDeckSlideContent(deckData, copy.overview);
  const business = resolveDeckSlideContent(deckData, copy.business, [
    "business-quantities",
  ]);

  return (
    <DeckPage
      activeKey="products"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].products}
      locale={locale}
      menuFlow
      slides={[
        {
          ...overview,
          body: overview.body ?? copy.overview.body,
          background: overview.background ?? "theme",
          layout: overview.layout ?? "split",
          primaryCta: overview.primaryCta ?? {
            label: isHr ? "Posalji upit za cijenu" : "Ask for price",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: overview.secondaryCta ?? {
            label: isHr ? "Izracunaj potrosnju" : "Calculate consumption",
            href: routes[locale].calculator,
            variant: "secondary",
          },
          visual: (
            <ImagePanel
              alt={isHr ? "ZOR Professional proizvodi" : "ZOR Professional products"}
              priority
              src={overview.imageUrl ?? "/visuals/deck/product-range.png"}
            />
          ),
        },
        ...products.map((product) => {
          const productCopy = resolveDeckSlideContent(deckData, {
            id: product.slugs[locale],
            eyebrow: product.eyebrow[locale],
            title: product.name[locale],
            body: product.summary[locale],
          });

          return {
            ...productCopy,
            body: productCopy.body ?? product.summary[locale],
            background: productCopy.background ?? ("soft" as const),
            layout: productCopy.layout ?? ("splitReverse" as const),
            primaryCta: productCopy.primaryCta ?? {
              label: isHr ? "Detalji proizvoda" : "Product details",
              href: product.href,
            },
            secondaryCta: productCopy.secondaryCta ?? {
              label: isHr ? "WhatsApp upit" : "WhatsApp inquiry",
              href: getWhatsAppHref(locale),
              variant: "secondary" as const,
            },
            visual: <ImagePanel alt={product.name[locale]} src={product.image} />,
          };
        }),
        {
          ...business,
          body: business.body ?? copy.business.body,
          background: business.background ?? "light",
          layout: business.layout ?? "split",
          primaryCta: business.primaryCta ?? {
            label: isHr ? "Posalji poslovni upit" : "Send business inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: business.secondaryCta ?? {
            label: isHr ? "Svi proizvodi" : "All products",
            href: routes[locale].products,
            variant: "secondary",
          },
          visual: (
            <ImagePanel
              alt={isHr ? "Poslovne kolicine i upit za ZOR papir" : "Business quantities and ZOR paper inquiry"}
              src={business.imageUrl ?? "/visuals/deck/products-business.png"}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "products"}
    />
  );
}
