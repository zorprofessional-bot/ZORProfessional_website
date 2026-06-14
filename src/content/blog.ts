import type { Locale } from "./site";

export type BlogPost = {
  id: string;
  slugs: Record<Locale, string>;
  title: Record<Locale, string>;
  eyebrow: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  body: Record<Locale, string[]>;
  date: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "paper-planning",
    slugs: {
      hr: "kako-planirati-potrosnju-toaletnog-papira",
      en: "how-to-plan-toilet-paper-consumption",
    },
    title: {
      hr: "Kako planirati potrošnju toaletnog papira bez prevelike zalihe",
      en: "How to plan toilet paper consumption without overstocking",
    },
    eyebrow: {
      hr: "Planiranje",
      en: "Planning",
    },
    excerpt: {
      hr: "Kratak vodič za apartmane, manje firme i ustanove koje žele jasniju mjesečnu procjenu.",
      en: "A short guide for apartments, small companies, and institutions that want a clearer monthly estimate.",
    },
    body: {
      hr: [
        "Dobra procjena počinje brojem korisnika, ritmom korištenja prostora i sigurnosnom zalihom.",
        "Za apartmane je sezonalnost važnija od prosjeka, dok škole i firme češće trebaju stabilan ritam narudžbe.",
      ],
      en: [
        "A good estimate starts with user count, the rhythm of the space, and a practical safety stock.",
        "For apartments, seasonality matters more than averages, while schools and companies often need a steady ordering rhythm.",
      ],
    },
    date: "2026-06-14",
  },
  {
    id: "local-production",
    slugs: {
      hr: "zasto-je-vazna-lokalna-proizvodnja",
      en: "why-local-production-matters",
    },
    title: {
      hr: "Zašto je lokalna proizvodnja važna za pouzdanu opskrbu",
      en: "Why local production matters for reliable supply",
    },
    eyebrow: {
      hr: "Proizvodnja",
      en: "Production",
    },
    excerpt: {
      hr: "Blizina proizvodnje pomaže u dostupnosti, komunikaciji i jednostavnijem dogovoru.",
      en: "Production close to the market helps with availability, communication, and simpler coordination.",
    },
    body: {
      hr: [
        "Lokalna proizvodnja skraćuje lanac dogovora i olakšava planiranje redovitih narudžbi.",
        "Za kupce koji ne žele webshop proces, izravan upit često je najbrži način da dobiju pravi sljedeći korak.",
      ],
      en: [
        "Local production shortens the coordination chain and makes repeat orders easier to plan.",
        "For buyers who do not need a webshop process, a direct inquiry is often the fastest next step.",
      ],
    },
    date: "2026-06-14",
  },
  {
    id: "apartments",
    slugs: {
      hr: "toaletni-papir-za-apartmane",
      en: "toilet-paper-for-apartments",
    },
    title: {
      hr: "Toaletni papir za apartmane: što je važno prije sezone",
      en: "Toilet paper for apartments: what matters before the season",
    },
    eyebrow: {
      hr: "Apartmani",
      en: "Apartments",
    },
    excerpt: {
      hr: "Apartmanska potrošnja traži jednostavnu zalihu, uredan dojam i brz dogovor.",
      en: "Apartment demand needs simple stock, a neat impression, and fast coordination.",
    },
    body: {
      hr: [
        "Apartmani imaju neujednačen ritam potrošnje, pa je dobro planirati prema sezoni, broju ležajeva i prosječnom trajanju boravka.",
        "Kvaliteta ne mora izgledati luksuzno, ali mora djelovati uredno, pouzdano i dovoljno dobra za gosta.",
      ],
      en: [
        "Apartments have uneven consumption, so planning should follow the season, bed count, and average stay length.",
        "The product does not need to feel luxury, but it should look neat, reliable, and good enough for guests.",
      ],
    },
    date: "2026-06-14",
  },
];

export function getPosts(locale: Locale) {
  return blogPosts.map((post) => ({
    ...post,
    href: locale === "hr" ? `/hr/blog/${post.slugs.hr}` : `/en/blog/${post.slugs.en}`,
  }));
}

export function getPostBySlug(locale: Locale, slug: string) {
  return blogPosts.find((post) => post.slugs[locale] === slug);
}
