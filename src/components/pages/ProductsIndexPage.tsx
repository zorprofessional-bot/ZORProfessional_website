import { DeckPage } from "@/components/deck/DeckPage";
import {
  DeckCardGrid,
  ImagePanel,
  ProductCardsVisual,
  ProductPackVisual,
} from "@/components/deck/DeckVisuals";
import { chapterLabels, productsDeck } from "@/content/deck";
import { getProducts } from "@/content/products";
import { getWhatsAppHref, routes, type Locale } from "@/content/site";

export function ProductsIndexPage({ locale }: { locale: Locale }) {
  const copy = productsDeck[locale];
  const products = getProducts(locale);
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="products"
      chapterLabel={chapterLabels[locale].products}
      locale={locale}
      slides={[
        {
          ...copy.overview,
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pošalji upit za cijenu" : "Ask for price",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: {
            label: isHr ? "Izračunaj potrošnju" : "Calculate consumption",
            href: routes[locale].calculator,
            variant: "secondary",
          },
          visual: (
            <ImagePanel
              alt={isHr ? "ZOR Professional proizvodi" : "ZOR Professional products"}
              priority
              src="/visuals/product-range.png"
            />
          ),
        },
        ...products.map((product) => ({
          id: product.slugs[locale],
          eyebrow: product.eyebrow[locale],
          title: product.name[locale],
          body: product.summary[locale],
          background: "soft" as const,
          layout: "splitReverse" as const,
          primaryCta: {
            label: isHr ? "Detalji proizvoda" : "Product details",
            href: product.href,
          },
          secondaryCta: {
            label: isHr ? "WhatsApp upit" : "WhatsApp inquiry",
            href: getWhatsAppHref(locale),
            variant: "secondary" as const,
          },
          visual: (
            <ProductPackVisual
              count={product.packCount[locale]}
              label={product.name[locale]}
              price={product.mockPrice[locale]}
            />
          ),
        })),
        {
          ...copy.business,
          background: "light",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pošalji poslovni upit" : "Send business inquiry",
            href: getWhatsAppHref(locale),
          },
          secondaryCta: {
            label: isHr ? "Svi proizvodi" : "All products",
            href: routes[locale].products,
            variant: "secondary",
          },
          visual: (
            <div className="grid w-full gap-4">
              <ProductCardsVisual locale={locale} products={products} />
              <DeckCardGrid
                columns="two"
                iconSet="none"
                items={[
                  {
                    title: isHr ? "Firme i ustanove" : "Companies and institutions",
                    body: isHr
                      ? "Ponuda se slaže prema potrošnji, lokaciji i ritmu narudžbe."
                      : "The offer follows demand, location, and ordering rhythm.",
                  },
                  {
                    title: "shop.zorpro.hr",
                    body: isHr
                      ? "Web trgovina je planirana kao kasniji kanal."
                      : "The web shop is planned as a later channel.",
                  },
                ]}
              />
            </div>
          ),
        },
      ]}
      theme="products"
    />
  );
}
