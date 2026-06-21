import type { Locale } from "./site";

export type Product = {
  id: string;
  slugs: Record<Locale, string>;
  name: Record<Locale, string>;
  eyebrow: Record<Locale, string>;
  packCount: Record<Locale, string>;
  mockPrice: Record<Locale, string>;
  summary: Record<Locale, string>;
  detail: Record<Locale, string>;
  image: string;
  highlights: Record<Locale, string[]>;
  specs: Array<{ label: Record<Locale, string>; value: Record<Locale, string> }>;
};

export const products: Product[] = [
  {
    id: "zorpro-24",
    slugs: {
      hr: "zorpro-24",
      en: "zorpro-24",
    },
    name: {
      hr: "ZORPro 24",
      en: "ZORPro 24",
    },
    eyebrow: {
      hr: "24 role",
      en: "24 rolls",
    },
    packCount: {
      hr: "24 role",
      en: "24 rolls",
    },
    mockPrice: {
      hr: "12,90 EUR",
      en: "EUR 12.90",
    },
    summary: {
      hr: "Praktičan paket toaletnog papira za domove, manje urede, apartmane i redovitu zalihu.",
      en: "A practical toilet paper pack for homes, smaller offices, apartments, and regular stock.",
    },
    detail: {
      hr: "ZORPro 24 je jednostavan izbor kada su važni dostupnost, fer cijena i narudžba bez dugog kataloga.",
      en: "ZORPro 24 is a simple choice when availability, a fair price, and ordering without a long catalogue matter.",
    },
    image: "/visuals/deck/product-zorpro-24.webp",
    highlights: {
      hr: ["24 role za redovitu potrošnju", "Dobar omjer cijene i dostupnosti", "Jednostavan WhatsApp upit"],
      en: ["24 rolls for regular use", "Good balance of price and availability", "Simple WhatsApp inquiry"],
    },
    specs: [
      {
        label: { hr: "Pakiranje", en: "Pack" },
        value: { hr: "24 role", en: "24 rolls" },
      },
      {
        label: { hr: "Slojevi", en: "Layers" },
        value: { hr: "2 sloja", en: "2 layers" },
      },
      {
        label: { hr: "Mock cijena", en: "Mock price" },
        value: { hr: "12,90 EUR", en: "EUR 12.90" },
      },
      {
        label: { hr: "Namjena", en: "Use" },
        value: { hr: "Domovi, uredi, apartmani", en: "Homes, offices, apartments" },
      },
    ],
  },
  {
    id: "zorpro-36",
    slugs: {
      hr: "zorpro-36",
      en: "zorpro-36",
    },
    name: {
      hr: "ZORPro 36",
      en: "ZORPro 36",
    },
    eyebrow: {
      hr: "36 rola",
      en: "36 rolls",
    },
    packCount: {
      hr: "36 rola",
      en: "36 rolls",
    },
    mockPrice: {
      hr: "18,90 EUR",
      en: "EUR 18.90",
    },
    summary: {
      hr: "Veći paket za obitelji, apartmane, male firme i zajednice koje žele rjeđe naručivati.",
      en: "A larger pack for families, apartments, small companies, and communities that want fewer reorders.",
    },
    detail: {
      hr: "ZORPro 36 pomaže držati mirniju zalihu za prostore s većom mjesečnom potrošnjom.",
      en: "ZORPro 36 helps keep calmer stock for spaces with higher monthly demand.",
    },
    image: "/visuals/deck/product-zorpro-36.webp",
    highlights: {
      hr: ["36 rola za veću zalihu", "Praktično za redovite količine", "Manje prekida u nabavi"],
      en: ["36 rolls for higher stock", "Practical for recurring quantities", "Fewer procurement interruptions"],
    },
    specs: [
      {
        label: { hr: "Pakiranje", en: "Pack" },
        value: { hr: "36 rola", en: "36 rolls" },
      },
      {
        label: { hr: "Slojevi", en: "Layers" },
        value: { hr: "2 sloja", en: "2 layers" },
      },
      {
        label: { hr: "Mock cijena", en: "Mock price" },
        value: { hr: "18,90 EUR", en: "EUR 18.90" },
      },
      {
        label: { hr: "Namjena", en: "Use" },
        value: { hr: "Firme, ustanove, zajednice", en: "Companies, institutions, communities" },
      },
    ],
  },
];

export function getProducts(locale: Locale) {
  return products.map((product) => ({
    ...product,
    href:
      locale === "hr"
        ? `/hr/proizvodi/${product.slugs.hr}`
        : `/en/products/${product.slugs.en}`,
  }));
}

export function getProductBySlug(locale: Locale, slug: string) {
  return products.find((product) => product.slugs[locale] === slug);
}
