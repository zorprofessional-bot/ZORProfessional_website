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

export const mobileNav: Record<
  Locale,
  Array<{ key: MobileRouteKey; label: string }>
> = {
  hr: [
    { key: "home", label: "Home" },
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

export function getWhatsAppHref(locale: Locale) {
  return `https://wa.me/${siteContact.whatsappNumber}?text=${encodeURIComponent(
    whatsappCopy[locale],
  )}`;
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
