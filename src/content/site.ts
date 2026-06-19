export type Locale = "hr" | "en";

export type RouteKey =
  | "home"
  | "products"
  | "production"
  | "calculator"
  | "blog"
  | "careers"
  | "contact";

export type MobileRouteKey = RouteKey;

export const locales: Locale[] = ["hr", "en"];

export const menuRouteOrder: RouteKey[] = [
  "home",
  "products",
  "production",
  "calculator",
  "blog",
  "careers",
  "contact",
];

export const routes: Record<Locale, Record<RouteKey, string>> = {
  hr: {
    home: "/hr",
    products: "/hr/proizvodi",
    production: "/hr/proizvodnja",
    calculator: "/hr/kalkulator",
    blog: "/hr/blog",
    careers: "/hr/karijere",
    contact: "/hr/kontakt",
  },
  en: {
    home: "/en",
    products: "/en/products",
    production: "/en/production",
    calculator: "/en/calculator",
    blog: "/en/blog",
    careers: "/en/careers",
    contact: "/en/contact",
  },
};

export const desktopNav: Record<
  Locale,
  Array<{ key: RouteKey; label: string }>
> = {
  hr: [
    { key: "home", label: "Početna" },
    { key: "products", label: "Proizvodi" },
    { key: "production", label: "Proizvodnja" },
    { key: "calculator", label: "Kalkulator" },
    { key: "blog", label: "Blog" },
    { key: "careers", label: "Karijere" },
    { key: "contact", label: "Kontakt" },
  ],
  en: [
    { key: "home", label: "Home" },
    { key: "products", label: "Products" },
    { key: "production", label: "Production" },
    { key: "calculator", label: "Calculator" },
    { key: "blog", label: "Blog" },
    { key: "careers", label: "Careers" },
    { key: "contact", label: "Contact" },
  ],
};

const menuChapterSlides: Record<
  Locale,
  Record<RouteKey, { first: string; last: string }>
> = {
  hr: {
    home: { first: "hero", last: "brzi-put-dalje" },
    products: { first: "pregled", last: "poslovne-kolicine" },
    production: { first: "hrvatska-proizvodnja", last: "skladiste" },
    calculator: { first: "unos", last: "whatsapp-upit" },
    blog: { first: "featured", last: "vodici" },
    careers: { first: "uvod", last: "prijava" },
    contact: { first: "whatsapp", last: "lokacija" },
  },
  en: {
    home: { first: "hero", last: "quick-path" },
    products: { first: "overview", last: "business-quantities" },
    production: { first: "croatian-production", last: "warehouse" },
    calculator: { first: "input", last: "whatsapp-inquiry" },
    blog: { first: "featured", last: "guides" },
    careers: { first: "intro", last: "application" },
    contact: { first: "whatsapp", last: "location" },
  },
};

export function getMenuChapterHref(
  locale: Locale,
  routeKey: RouteKey,
  edge: "first" | "last" = "first",
) {
  const slideId = menuChapterSlides[locale][routeKey][edge];
  return `${routes[locale][routeKey]}?slide=${slideId}`;
}

export function getAdjacentMenuChapterHref(
  locale: Locale,
  routeKey: RouteKey,
  direction: "next" | "previous",
) {
  const currentIndex = menuRouteOrder.indexOf(routeKey);
  const adjacentIndex =
    direction === "next" ? currentIndex + 1 : currentIndex - 1;
  const adjacentKey = menuRouteOrder[adjacentIndex];

  if (!adjacentKey) {
    return undefined;
  }

  return getMenuChapterHref(
    locale,
    adjacentKey,
    direction === "next" ? "first" : "last",
  );
}

export const mobileNav: Record<
  Locale,
  Array<{ key: MobileRouteKey; label: string }>
> = {
  hr: [
    { key: "home", label: "Početna" },
    { key: "products", label: "Proizvodi" },
    { key: "production", label: "Pogon" },
    { key: "calculator", label: "Kalkulator" },
    { key: "blog", label: "Blog" },
    { key: "careers", label: "Karijere" },
    { key: "contact", label: "Kontakt" },
  ],
  en: [
    { key: "home", label: "Home" },
    { key: "products", label: "Products" },
    { key: "production", label: "Plant" },
    { key: "calculator", label: "Calculator" },
    { key: "blog", label: "Blog" },
    { key: "careers", label: "Careers" },
    { key: "contact", label: "Contact" },
  ],
};

export const siteContact = {
  company: "ZOR d.o.o.",
  brand: "ZOR Professional",
  location: "Robni terminali Jankomir",
  city: "Zagreb, Hrvatska",
  phone: "+385 00 000 000",
  email: "upit@zor-professional.hr",
  whatsappNumber: "385000000000",
};

export const whatsappCopy: Record<Locale, string> = {
  hr: "Pozdrav, zanima me ZOR Professional toaletni papir.",
  en: "Hello, I am interested in ZOR Professional toilet paper.",
};

// Resolved public contact values. Source of truth is the `site_settings` table
// (via getSiteContact); this static object is the fallback when Supabase is off.
export type SiteContact = {
  brand: string;
  company: string;
  location: string;
  city: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  shopUrl: string;
};

export const fallbackSiteContact: SiteContact = {
  brand: siteContact.brand,
  company: siteContact.company,
  location: siteContact.location,
  city: siteContact.city,
  phone: siteContact.phone,
  email: siteContact.email,
  whatsappNumber: siteContact.whatsappNumber,
  shopUrl: "https://shop.zorpro.hr",
};

export function buildWhatsAppHref(whatsappNumber: string, locale: Locale) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappCopy[locale],
  )}`;
}

export function getWhatsAppHref(locale: Locale) {
  return buildWhatsAppHref(siteContact.whatsappNumber, locale);
}

export function getLanguageHrefs(
  routeKey: RouteKey,
  slugs?: Partial<Record<Locale, string>>,
) {
  const hr =
    routeKey === "products" && slugs?.hr
      ? `${routes.hr.products}/${slugs.hr}`
      : routeKey === "blog" && slugs?.hr
        ? `${routes.hr.blog}/${slugs.hr}`
        : routes.hr[routeKey];

  const en =
    routeKey === "products" && slugs?.en
      ? `${routes.en.products}/${slugs.en}`
      : routeKey === "blog" && slugs?.en
        ? `${routes.en.blog}/${slugs.en}`
        : routes.en[routeKey];

  return { hr, en };
}

export const seoPhrases = [
  "toaletni papir",
  "wc papir",
  "toaletni papir cijena",
  "toaletni papir za firme",
  "toaletni papir za apartmane",
  "hrvatska proizvodnja toaletnog papira",
  "proizvođač toaletnog papira Hrvatska",
];
