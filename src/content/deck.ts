import type { Locale } from "./site";

type SlideText = {
  body: string;
  eyebrow: string;
  id: string;
  title: string;
};

export const chapterLabels: Record<
  Locale,
  Record<
    "home" | "products" | "production" | "calculator" | "blog" | "careers" | "contact",
    string
  >
> = {
  hr: {
    home: "Početna",
    products: "Proizvodi",
    production: "Proizvodnja",
    calculator: "Kalkulator",
    blog: "Blog",
    careers: "Karijere",
    contact: "Kontakt",
  },
  en: {
    home: "Home",
    products: "Products",
    production: "Production",
    calculator: "Calculator",
    blog: "Blog",
    careers: "Careers",
    contact: "Contact",
  },
};

export const homeDeck = {
  hr: {
    hero: {
      id: "hero",
      eyebrow: "ZOR Professional",
      title: "Toaletni papir iz hrvatske proizvodnje, dostupan kad vam treba.",
      body: "Za domove, manje firme, apartmane i ustanove koje žele pouzdanu opskrbu, fer cijenu i jednostavnu narudžbu.",
    },
    audience: {
      id: "za-koga-je",
      eyebrow: "Za koga je",
      title: "Jedan praktičan izbor za prostore koji troše papir svaki dan.",
      body: "Domovi, uredi, apartmani i ustanove trebaju jasnu zalihu, ne dugačak katalog.",
    },
    why: {
      id: "zasto-zor",
      eyebrow: "Zašto ZOR",
      title: "Proizvodnja, dostupnost i fer cijena u jednom jednostavnom putu.",
      body: "Kupac treba znati što može dobiti, kada može dobiti i kome poslati upit.",
    },
    quickPath: {
      id: "brzi-put-dalje",
      eyebrow: "Brzi put dalje",
      title: "Odaberite sljedeći korak bez lutanja po stranici.",
      body: "Proizvodi, kalkulator, karijere i kontakt ostaju jedan klik dalje.",
    },
  },
  en: {
    hero: {
      id: "hero",
      eyebrow: "ZOR Professional",
      title: "Toilet paper from Croatian production, available when you need it.",
      body: "For homes, smaller companies, apartments, and institutions that want reliable supply, a fair price, and simple ordering.",
    },
    audience: {
      id: "who-it-is-for",
      eyebrow: "Who it is for",
      title: "One practical choice for spaces that use paper every day.",
      body: "Homes, offices, apartments, and institutions need clear stock, not a long catalogue.",
    },
    why: {
      id: "why-zor",
      eyebrow: "Why ZOR",
      title: "Production, availability, and a fair price in one simple path.",
      body: "A buyer needs to know what is available, when it is available, and where to send the inquiry.",
    },
    quickPath: {
      id: "quick-path",
      eyebrow: "Quick path",
      title: "Choose the next step without wandering through the site.",
      body: "Products, calculator, careers, and contact stay one click away.",
    },
  },
} satisfies Record<Locale, Record<string, SlideText>>;

export const audienceCards = {
  hr: [
    { title: "Domovi i obitelji", body: "Pouzdana kućna zaliha bez stalnog uspoređivanja polica." },
    { title: "Male firme i uredi", body: "Uredna nabava za svakodnevnu uredsku potrošnju." },
    { title: "Apartmani", body: "Praktična zaliha za sezonu, goste i brzi dogovor količina." },
    { title: "Ustanove i zajednice", body: "Jasna dostupnost za škole, manje ustanove i zajednice." },
  ],
  en: [
    { title: "Homes and families", body: "Reliable home stock without constant shelf comparison." },
    { title: "Small companies and offices", body: "Neat procurement for everyday office demand." },
    { title: "Apartments", body: "Practical stock for the season, guests, and fast quantity planning." },
    { title: "Institutions and communities", body: "Clear availability for schools, smaller institutions, and communities." },
  ],
};

export const valueCards = {
  hr: [
    { title: "Hrvatska proizvodnja", body: "Kraći put od pogona do kupca." },
    { title: "Stalna dostupnost", body: "Prvo provjera zalihe, zatim obećanje." },
    { title: "Fer cijena", body: "Cijena mora imati smisla za redovitu potrošnju." },
    { title: "Dogovor za količine", body: "Posebna ponuda za firme i ustanove." },
  ],
  en: [
    { title: "Croatian production", body: "A shorter path from the plant to the buyer." },
    { title: "Steady availability", body: "Stock check first, promise second." },
    { title: "Fair price", body: "The price needs to make sense for recurring demand." },
    { title: "Quantity coordination", body: "Dedicated offers for companies and institutions." },
  ],
};

export const productsDeck = {
  hr: {
    overview: {
      id: "pregled",
      eyebrow: "Proizvodi",
      title: "Dva jasna paketa, bez webshop pritiska.",
      body: "Pregled služi odluci: ZORPro 24 ili ZORPro 36, za kakav prostor i koji je sljedeći korak.",
    },
    business: {
      id: "poslovne-kolicine",
      eyebrow: "Poslovne količine",
      title: "shop.zorpro.hr dolazi kasnije. Upit radi odmah.",
      body: "Za firme, ustanove i redovite količine šaljemo ponudu prema prostoru i potrošnji.",
    },
  },
  en: {
    overview: {
      id: "overview",
      eyebrow: "Products",
      title: "Two clear packs, without webshop pressure.",
      body: "The overview supports a decision: ZORPro 24 or ZORPro 36, space type, and the next step.",
    },
    business: {
      id: "business-quantities",
      eyebrow: "Business quantities",
      title: "shop.zorpro.hr comes later. Inquiry works now.",
      body: "For companies, institutions, and recurring quantities, we send an offer based on space and demand.",
    },
  },
} satisfies Record<Locale, Record<string, SlideText>>;

export const productionDeck = {
  hr: [
    { id: "hrvatska-proizvodnja", eyebrow: "Proizvodnja", title: "Hrvatska proizvodnja s praktičnom logistikom.", body: "Blizina pogona pomaže dostupnosti, kontroli i bržem dogovoru." },
    { id: "jumbo-rola", eyebrow: "01", title: "Jumbo rola ulazi u kontrolirani proces.", body: "Sirovina je početna točka za stabilnu kvalitetu i planiranje zalihe." },
    { id: "premotavanje", eyebrow: "02", title: "Premotavanje priprema papir za svakodnevnu upotrebu.", body: "Veliki format prelazi u praktičnu rolu za kupca." },
    { id: "rezanje", eyebrow: "03", title: "Rezanje daje pakiranju točnu dimenziju.", body: "Uredan format olakšava pakiranje, skladištenje i isporuku." },
    { id: "pakiranje", eyebrow: "04", title: "Pakiranje čuva čist i prepoznatljiv ZOR izgled.", body: "Paket mora biti jasan, uredan i spreman za redovitu potrošnju." },
    { id: "skladiste", eyebrow: "05", title: "Dostupnost iz skladišta skraćuje put do kupca.", body: "Dogovor ima smisla tek kada je zaliha provjerena." },
  ],
  en: [
    { id: "croatian-production", eyebrow: "Production", title: "Croatian production with practical logistics.", body: "A nearby plant helps availability, control, and faster coordination." },
    { id: "jumbo-roll", eyebrow: "01", title: "The jumbo roll enters a controlled process.", body: "Raw material is the starting point for stable quality and stock planning." },
    { id: "rewinding", eyebrow: "02", title: "Rewinding prepares paper for everyday use.", body: "The large format becomes a practical roll for the buyer." },
    { id: "cutting", eyebrow: "03", title: "Cutting gives the pack its exact dimension.", body: "A neat format supports packing, storage, and delivery." },
    { id: "packing", eyebrow: "04", title: "Packing keeps the ZOR look clean and recognizable.", body: "A pack should feel clear, tidy, and ready for recurring demand." },
    { id: "warehouse", eyebrow: "05", title: "Warehouse availability shortens the route to the buyer.", body: "A promise matters only after stock has been checked." },
  ],
} satisfies Record<Locale, SlideText[]>;

export const calculatorDeck = {
  hr: [
    { id: "intro", eyebrow: "Kalkulator", title: "Procjena potrošnje prije narudžbe.", body: "Unesite broj korisnika i trajanje paketa. Cilj je jednostavna preporuka, ne komplicirana matematika." },
    { id: "unos", eyebrow: "Input form", title: "Tri podatka su dovoljna za okvir.", body: "Broj korisnika, veličina paketa i koliko dana paket traje." },
    { id: "rezultat", eyebrow: "Result", title: "Rezultat treba odmah voditi prema praktičnom paketu.", body: "Za veće potrebe preporuka ide prema mirnijoj zalihi i rjeđem naručivanju." },
    { id: "whatsapp-upit", eyebrow: "WhatsApp", title: "Pošaljite rezultat i dobijte sljedeći korak.", body: "Kratka poruka može zamijeniti dugačak obrazac." },
  ],
  en: [
    { id: "intro", eyebrow: "Calculator", title: "Estimate consumption before ordering.", body: "Enter users and pack duration. The goal is a simple recommendation, not complicated math." },
    { id: "input", eyebrow: "Input form", title: "Three inputs are enough for a useful estimate.", body: "Users, pack size, and how many days the pack lasts." },
    { id: "result", eyebrow: "Result", title: "The result should lead to a practical pack immediately.", body: "For higher demand, the recommendation moves toward calmer stock and fewer reorders." },
    { id: "whatsapp-inquiry", eyebrow: "WhatsApp", title: "Send the result and get the next step.", body: "A short message can replace a long form." },
  ],
} satisfies Record<Locale, SlideText[]>;

export const careersDeck = {
  hr: [
    { id: "uvod", eyebrow: "Karijere", title: "Nauči raditi na modernoj proizvodnoj liniji.", body: "Tražimo pouzdane ljude koji žele učiti posao u proizvodnji." },
    { id: "operater", eyebrow: "Operater na stroju", title: "Rad na liniji traži pažnju, ritam i odgovornost.", body: "Važno je pratiti proces, držati urednost i reagirati na vrijeme." },
    { id: "obuka", eyebrow: "Obuka", title: "Očekivanja su jasna, a učenje ide kroz praksu.", body: "Nova osoba ne mora znati sve prvog dana, ali treba željeti učiti." },
    { id: "pozicije", eyebrow: "Otvorene pozicije", title: "Prvi oglasi bit će kratki, konkretni i povezani s pogonom.", body: "Lokacija rada je Robni terminali Jankomir." },
    { id: "prijava", eyebrow: "Prijava", title: "Kandidatura može početi kratkom porukom.", body: "Pošaljite osnovne podatke i za koju vrstu posla se javljate." },
  ],
  en: [
    { id: "intro", eyebrow: "Careers", title: "Learn to work on a modern production line.", body: "We are looking for reliable people who want to learn production work." },
    { id: "operator", eyebrow: "Machine operator", title: "Line work requires attention, rhythm, and responsibility.", body: "It matters to follow the process, keep order, and react on time." },
    { id: "training", eyebrow: "Training", title: "Expectations are clear, and learning happens through practice.", body: "A new person does not need to know everything on day one, but should want to learn." },
    { id: "positions", eyebrow: "Open roles", title: "First openings will be short, concrete, and tied to the plant.", body: "The work location is Robni terminali Jankomir." },
    { id: "application", eyebrow: "Application", title: "An application can start with a short message.", body: "Send basic information and what kind of work you are interested in." },
  ],
} satisfies Record<Locale, SlideText[]>;

export const contactDeck = {
  hr: [
    { id: "whatsapp", eyebrow: "WhatsApp", title: "Najbrži početak je kratka poruka.", body: "Napišite trebate li papir za dom, firmu, apartman, ustanovu ili razgovor o poslu." },
    { id: "forma", eyebrow: "Kontakt forma", title: "Ako trebate više konteksta, pošaljite email upit.", body: "Forma slaže email s osnovnim podacima i porukom." },
    { id: "lokacija", eyebrow: "Lokacija", title: "Robni terminali Jankomir su dio priče o dostupnosti.", body: "Lokacija u Zagrebu podržava proizvodnju, skladište i brži dogovor." },
  ],
  en: [
    { id: "whatsapp", eyebrow: "WhatsApp", title: "The fastest start is a short message.", body: "Write whether you need paper for a home, company, apartment, institution, or a job conversation." },
    { id: "form", eyebrow: "Contact form", title: "If you need more context, send an email inquiry.", body: "The form prepares an email with basic details and your message." },
    { id: "location", eyebrow: "Location", title: "Robni terminali Jankomir is part of the availability story.", body: "The Zagreb location supports production, warehouse stock, and faster coordination." },
  ],
} satisfies Record<Locale, SlideText[]>;

export const blogDeck = {
  hr: [
    { id: "featured", eyebrow: "Blog", title: "Kratki vodiči za odluke prije upita.", body: "Blog ne glumi magazin. Pomaže kupcu razumjeti potrošnju, zalihu i lokalnu proizvodnju." },
    { id: "vodici", eyebrow: "Praktični vodiči", title: "Planiranje potrošnje treba biti jednostavno.", body: "Najbolji tekstovi vode prema jasnijoj količini i boljem pitanju." },
    { id: "savjeti", eyebrow: "Proizvodnja i kupnja", title: "Savjeti ostaju kratki, korisni i povezani s opskrbom.", body: "Ako tema traži duži tekst, članak koristi unutarnji reader panel." },
  ],
  en: [
    { id: "featured", eyebrow: "Blog", title: "Short guides for decisions before inquiry.", body: "The blog does not pretend to be a magazine. It helps buyers understand demand, stock, and local production." },
    { id: "guides", eyebrow: "Practical guides", title: "Consumption planning should stay simple.", body: "The best posts lead to a clearer quantity and a better question." },
    { id: "advice", eyebrow: "Production and buying", title: "Advice stays short, useful, and connected to supply.", body: "If a topic needs longer text, the article uses an internal reader panel." },
  ],
} satisfies Record<Locale, SlideText[]>;
