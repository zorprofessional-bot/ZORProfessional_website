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
    id: "zor-24-everyday",
    slugs: {
      hr: "zor-24-svakodnevni",
      en: "zor-24-everyday",
    },
    name: {
      hr: "ZOR 24 Svakodnevni",
      en: "ZOR 24 Everyday",
    },
    eyebrow: {
      hr: "Redovita potrošnja",
      en: "Regular use",
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
      hr: "Uravnotežen toaletni papir 24 role za domove, manje urede i redovitu zalihu.",
      en: "A balanced 24-roll toilet paper pack for homes, smaller offices, and regular stock.",
    },
    detail: {
      hr: "Pouzdan izbor za svakodnevnu potrošnju kada su važni stabilna zaliha, fer cijena i jednostavna narudžba.",
      en: "A reliable choice for everyday demand when steady stock, a fair price, and simple ordering matter.",
    },
    image: "/visuals/product-range.png",
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
        label: { hr: "Mock cijena", en: "Mock price" },
        value: { hr: "12,90 EUR", en: "EUR 12.90" },
      },
      {
        label: { hr: "Namjena", en: "Use" },
        value: { hr: "Domovi, uredi, manje zajednice", en: "Homes, offices, smaller communities" },
      },
      {
        label: { hr: "Pozicija", en: "Positioning" },
        value: { hr: "Fer svakodnevni izbor", en: "Fair everyday choice" },
      },
    ],
  },
  {
    id: "zor-24-softer",
    slugs: {
      hr: "zor-24-meksi",
      en: "zor-24-softer",
    },
    name: {
      hr: "ZOR 24 Mekši",
      en: "ZOR 24 Softer",
    },
    eyebrow: {
      hr: "Mekši dojam",
      en: "Softer feel",
    },
    packCount: {
      hr: "24 role",
      en: "24 rolls",
    },
    mockPrice: {
      hr: "14,90 EUR",
      en: "EUR 14.90",
    },
    summary: {
      hr: "Mekši wc papir za apartmane, urede i prostore u kojima gostima želite ostaviti uredan dojam.",
      en: "A softer option for apartments, offices, and spaces where the guest experience should feel neat.",
    },
    detail: {
      hr: "Praktičan izbor kada wc papir treba djelovati uredno, moderno i pouzdano, bez prelaska u luksuzni katalog.",
      en: "A practical choice when toilet paper should feel neat, modern, and reliable without turning into a luxury catalogue.",
    },
    image: "/visuals/product-range.png",
    highlights: {
      hr: ["Mekši osjećaj korištenja", "Dobar za apartmane i manje firme", "Jasan pregled potrošnje"],
      en: ["Softer user feel", "Good for apartments and small companies", "Clear consumption planning"],
    },
    specs: [
      {
        label: { hr: "Pakiranje", en: "Pack" },
        value: { hr: "24 role", en: "24 rolls" },
      },
      {
        label: { hr: "Mock cijena", en: "Mock price" },
        value: { hr: "14,90 EUR", en: "EUR 14.90" },
      },
      {
        label: { hr: "Namjena", en: "Use" },
        value: { hr: "Apartmani, uredi, gostinjski prostori", en: "Apartments, offices, guest spaces" },
      },
      {
        label: { hr: "Pozicija", en: "Positioning" },
        value: { hr: "Premium praktično", en: "Practical premium" },
      },
    ],
  },
  {
    id: "zor-36-supply",
    slugs: {
      hr: "zor-36-zaliha",
      en: "zor-36-supply",
    },
    name: {
      hr: "ZOR 36 Zaliha",
      en: "ZOR 36 Supply",
    },
    eyebrow: {
      hr: "Veća zaliha",
      en: "Higher stock",
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
      hr: "Toaletni papir 36 rola za firme, ustanove i prostore koji žele rjeđe naručivati.",
      en: "A 36-roll toilet paper pack for companies, institutions, and spaces that want fewer reorders.",
    },
    detail: {
      hr: "Namijenjeno objektima koji žele mirniju zalihu, manje prekida i lakši dogovor oko redovitih količina.",
      en: "Designed for spaces that want calmer stock, fewer interruptions, and easier coordination around recurring quantities.",
    },
    image: "/visuals/product-range.png",
    highlights: {
      hr: ["36 rola za veću mjesečnu potrošnju", "Pomaže planirati nabavu", "Praktično za ustanove i zajednice"],
      en: ["36 rolls for higher monthly demand", "Helps plan procurement", "Practical for institutions and communities"],
    },
    specs: [
      {
        label: { hr: "Pakiranje", en: "Pack" },
        value: { hr: "36 rola", en: "36 rolls" },
      },
      {
        label: { hr: "Mock cijena", en: "Mock price" },
        value: { hr: "18,90 EUR", en: "EUR 18.90" },
      },
      {
        label: { hr: "Namjena", en: "Use" },
        value: { hr: "Firme, ustanove, zajednice", en: "Companies, institutions, communities" },
      },
      {
        label: { hr: "Pozicija", en: "Positioning" },
        value: { hr: "Pouzdana zaliha", en: "Reliable stock" },
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
