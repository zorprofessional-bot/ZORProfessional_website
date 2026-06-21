import { DeckPage } from "@/components/deck/DeckPage";
import { SlideBody } from "@/components/deck/DeckVisuals";
import { chapterLabels, productsDeck } from "@/content/deck";
import { getProducts, type Product } from "@/content/products";
import { buildWhatsAppHref, routes, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";
import { getSiteContact } from "@/lib/data/settings";

type ProductsIndexPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
  products?: Array<Product & { href: string }>;
};

export async function ProductsIndexPage({
  deckData,
  locale,
  products = getProducts(locale),
}: ProductsIndexPageProps) {
  const copy = productsDeck[locale];
  const isHr = locale === "hr";
  const contact = await getSiteContact();
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
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Bez webshop pritiska — pregled služi **odluci**: koji paket za kakav prostor."
                  : "No webshop pressure — the overview supports one **decision**: which pack for which space."
              }
              points={[
                {
                  title: "ZORPro 24",
                  body: isHr
                    ? "Za **redovitu potrošnju** doma, u uredu ili apartmanu."
                    : "For **regular use** at home, in the office, or an apartment.",
                },
                {
                  title: "ZORPro 36",
                  body: isHr
                    ? "Za **mirniju zalihu** i rjeđe narudžbe kod veće potrošnje."
                    : "For **calmer stock** and fewer orders at higher demand.",
                },
              ]}
            />
          ),
          primaryCta: overview.primaryCta ?? {
            label: isHr ? "Pošalji upit za cijenu" : "Ask for price",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          secondaryCta: overview.secondaryCta ?? {
            label: isHr ? "Izračunaj potrošnju" : "Calculate consumption",
            href: routes[locale].calculator,
            variant: "secondary",
          },
          image: {
            src: overview.imageUrl ?? "/visuals/deck/product-range.webp",
            alt: isHr ? "ZOR Professional proizvodi" : "ZOR Professional products",
            priority: true,
          },
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
            body: (
              <SlideBody
                lead={productCopy.body ?? product.summary[locale]}
                points={product.highlights[locale].map((highlight) => ({
                  title: highlight,
                }))}
              />
            ),
            layout: productCopy.layout ?? ("splitReverse" as const),
            primaryCta: productCopy.primaryCta ?? {
              label: isHr ? "Detalji proizvoda" : "Product details",
              href: product.href,
            },
            secondaryCta: productCopy.secondaryCta ?? {
              label: isHr ? "WhatsApp upit" : "WhatsApp inquiry",
              href: buildWhatsAppHref(contact.whatsappNumber, locale),
              variant: "secondary" as const,
            },
            image: { src: product.image, alt: product.name[locale] },
          };
        }),
        {
          ...business,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Web trgovina dolazi kasnije — **upit radi odmah**, a ponudu slažemo prema prostoru i potrošnji."
                  : "The shop comes later — **the inquiry works now**, and we build the offer around space and demand."
              }
              points={[
                {
                  title: isHr ? "Firme i uredi" : "Companies and offices",
                  body: isHr ? "Uredna, **redovita nabava**." : "Neat, **recurring procurement**.",
                },
                {
                  title: isHr ? "Ustanove i zajednice" : "Institutions and communities",
                  body: isHr ? "**Stalna dostupnost** i jasna komunikacija." : "**Steady availability** and clear communication.",
                },
                {
                  title: isHr ? "Veće količine" : "Larger quantities",
                  body: isHr ? "**Posebna ponuda** prema potrebi." : "A **dedicated offer** as needed.",
                },
              ]}
            />
          ),
          primaryCta: business.primaryCta ?? {
            label: isHr ? "Pošalji poslovni upit" : "Send business inquiry",
            href: buildWhatsAppHref(contact.whatsappNumber, locale),
          },
          secondaryCta: business.secondaryCta ?? {
            label: isHr ? "Svi proizvodi" : "All products",
            href: routes[locale].products,
            variant: "secondary",
          },
          image: {
            src: business.imageUrl ?? "/visuals/deck/products-business.webp",
            alt: isHr ? "Poslovne količine i upit za ZOR papir" : "Business quantities and ZOR paper inquiry",
          },
        },
      ]}
      theme={deckData?.chapter.theme ?? "products"}
    />
  );
}
