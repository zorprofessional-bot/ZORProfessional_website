import type { Locale } from "./site";

export type SlideCopy = {
  eyebrow: string;
  title: string;
  body: string;
};

export type HomeValueCard = {
  title: string;
  body: string;
};

export type ProductionStep = {
  title: string;
  body: string;
};

export const homeSlides: Record<
  Locale,
  {
    hero: SlideCopy;
    audience: SlideCopy;
    why: SlideCopy;
    products: SlideCopy;
    calculator: SlideCopy;
    production: SlideCopy;
    careers: SlideCopy;
    contact: SlideCopy;
  }
> = {
  hr: {
    hero: {
      eyebrow: "ZOR Professional",
      title: "Toaletni papir iz hrvatske proizvodnje, dostupan kad vam treba.",
      body: "Za domove, manje firme, apartmane i ustanove koje žele pouzdanu opskrbu, fer cijenu i jednostavnu narudžbu.",
    },
    audience: {
      eyebrow: "Svakodnevna potrošnja",
      title: "Za svakodnevnu potrošnju — bez kompliciranja.",
      body: "ZOR Professional wc papir je zamišljen za prostore koji žele jasnu zalihu i brzu narudžbu, bez kataloškog lutanja.",
    },
    why: {
      eyebrow: "Zašto ZOR",
      title: "Jednostavno: proizvodnja, dostupnost i fer cijena.",
      body: "Kad gledate toaletni papir cijena je važna, ali još je važnije znati da se isporuka može dogovoriti brzo i jasno.",
    },
    products: {
      eyebrow: "Paketi",
      title: "Tri jednostavna paketa za različite potrebe.",
      body: "Pregled je informativan i praktičan: toaletni papir 24 role za redovitu potrošnju i toaletni papir 36 rola kada želite mirniju zalihu.",
    },
    calculator: {
      eyebrow: "Kalkulator potrošnje",
      title: "Ne znate koliko vam treba mjesečno?",
      body: "Unesite koliko ljudi koristi papir i koliko vam sadašnji paket traje. Kalkulator će predložiti najpraktičniji ZOR paket.",
    },
    production: {
      eyebrow: "Proizvodnja",
      title: "Od jumbo role do gotovog paketa.",
      body: "Hrvatska proizvodnja toaletnog papira znači kraći put od dogovora do dostupne zalihe.",
    },
    careers: {
      eyebrow: "Karijere",
      title: "Nauči raditi na modernoj proizvodnoj liniji.",
      body: "Tražimo ljude koji žele naučiti posao u proizvodnji, raditi odgovorno i napredovati kroz praksu.",
    },
    contact: {
      eyebrow: "Upit",
      title: "Treba vam papir za dom, firmu ili apartmane?",
      body: "Za toaletni papir za firme, toaletni papir za apartmane ili kućnu zalihu, najbrži početak je kratak WhatsApp upit.",
    },
  },
  en: {
    hero: {
      eyebrow: "ZOR Professional",
      title: "Toilet paper from Croatian production, available when you need it.",
      body: "For homes, smaller companies, apartments, and institutions that want reliable supply, a fair price, and simple ordering.",
    },
    audience: {
      eyebrow: "Everyday demand",
      title: "For everyday use — without overcomplication.",
      body: "ZOR Professional is made for spaces that need a clear toilet paper supply and a fast ordering path without catalogue noise.",
    },
    why: {
      eyebrow: "Why ZOR",
      title: "Simple: production, availability, and a fair price.",
      body: "Price matters, but so does knowing that supply can be coordinated quickly, clearly, and close to the market.",
    },
    products: {
      eyebrow: "Packs",
      title: "Three simple packs for different needs.",
      body: "A practical preview: 24-roll packs for regular use and a 36-roll stock option when you want fewer supply interruptions.",
    },
    calculator: {
      eyebrow: "Consumption calculator",
      title: "Not sure how much you need each month?",
      body: "Enter how many people use paper and how long your current pack lasts. The calculator will suggest the most practical ZOR pack.",
    },
    production: {
      eyebrow: "Production",
      title: "From jumbo roll to finished pack.",
      body: "Croatian toilet paper production keeps the route from coordination to available stock shorter and clearer.",
    },
    careers: {
      eyebrow: "Careers",
      title: "Learn to work on a modern production line.",
      body: "We are looking for people who want to learn production work, take responsibility, and grow through practice.",
    },
    contact: {
      eyebrow: "Inquiry",
      title: "Need paper for your home, company, or apartments?",
      body: "For company supply, apartment use, institutions, or home stock, the fastest start is a short WhatsApp inquiry.",
    },
  },
};

export const audienceCards: Record<Locale, HomeValueCard[]> = {
  hr: [
    {
      title: "Domovi i obitelji",
      body: "Pouzdana zaliha za redovitu kućnu potrošnju. Jednostavan izbor kad ne želite stalno uspoređivati police.",
    },
    {
      title: "Male firme i uredi",
      body: "Toaletni papir za firme koje trebaju urednu nabavu bez kompliciranih procesa.",
    },
    {
      title: "Apartmani",
      body: "Toaletni papir za apartmane i sezonsku potrošnju, uz lakši dogovor oko količine.",
    },
    {
      title: "Ustanove i zajednice",
      body: "Za škole, manje ustanove i zajednice kojima je važna stalna dostupnost i jasna komunikacija.",
    },
  ],
  en: [
    {
      title: "Homes and families",
      body: "Reliable stock for regular household use. A simple choice when you do not want to keep comparing shelves.",
    },
    {
      title: "Small companies and offices",
      body: "Toilet paper supply for teams that need neat procurement without complicated processes.",
    },
    {
      title: "Apartments",
      body: "A practical option for apartment and seasonal demand, with easier quantity coordination.",
    },
    {
      title: "Institutions and communities",
      body: "For schools, smaller institutions, and communities where availability and clear communication matter.",
    },
  ],
};

export const valueCards: Record<Locale, HomeValueCard[]> = {
  hr: [
    {
      title: "Hrvatska proizvodnja",
      body: "Proizvodnja je blizu kupcima, pa su dogovor, kontrola i reakcija jednostavniji.",
    },
    {
      title: "Stalna dostupnost",
      body: "Fokus je na robi koja se stvarno troši svaki dan, s jasnom zalihom prije obećanja.",
    },
    {
      title: "Fer cijena",
      body: "Cijena mora imati smisla za dom, ured, apartman i redovitu potrošnju.",
    },
    {
      title: "Dogovor za veće količine",
      body: "Za firme, ustanove i redovite narudžbe šaljemo posebnu ponudu prema potrebi.",
    },
  ],
  en: [
    {
      title: "Croatian production",
      body: "Production stays close to customers, making coordination, control, and response simpler.",
    },
    {
      title: "Steady availability",
      body: "The focus is on a product used every day, with clear stock before promises.",
    },
    {
      title: "Fair price",
      body: "The price needs to make sense for homes, offices, apartments, and regular use.",
    },
    {
      title: "Larger quantity offers",
      body: "For companies, institutions, and recurring quantities, we send a dedicated offer.",
    },
  ],
};

export const productionSteps: Record<Locale, ProductionStep[]> = {
  hr: [
    { title: "Sirovina", body: "Jumbo rola ulazi u kontrolirani proizvodni proces." },
    { title: "Premotavanje", body: "Papir se premotava u format za svakodnevno korištenje." },
    { title: "Rezanje", body: "Role se režu na praktične dimenzije pakiranja." },
    { title: "Pakiranje", body: "Paketi dobivaju čist, prepoznatljiv ZOR izgled." },
    { title: "Dostupnost iz skladišta", body: "Zaliha je spremna za brz dogovor i isporuku." },
  ],
  en: [
    { title: "Raw material", body: "The jumbo roll enters a controlled production process." },
    { title: "Rewinding", body: "Paper is rewound into a format made for everyday use." },
    { title: "Cutting", body: "Rolls are cut into practical pack dimensions." },
    { title: "Packaging", body: "Packs receive a clean, recognizable ZOR look." },
    { title: "Warehouse availability", body: "Stock is ready for fast coordination and delivery." },
  ],
};
