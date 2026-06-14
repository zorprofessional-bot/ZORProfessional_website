import type { Locale } from "./site";

export const pageCopy: Record<
  Locale,
  {
    products: { eyebrow: string; title: string; body: string };
    production: { eyebrow: string; title: string; body: string };
    calculator: { eyebrow: string; title: string; body: string };
    blog: { eyebrow: string; title: string; body: string };
    careers: { eyebrow: string; title: string; body: string };
    contact: { eyebrow: string; title: string; body: string };
  }
> = {
  hr: {
    products: {
      eyebrow: "Proizvodi",
      title: "Jasan pregled asortimana bez webshop pritiska.",
      body: "Odaberite smjer koji odgovara prostoru, potrošnji i načinu narudžbe. Cijena i dostupnost potvrđuju se jednostavnim upitom.",
    },
    production: {
      eyebrow: "Proizvodnja",
      title: "Hrvatska proizvodnja toaletnog papira s praktičnom logistikom.",
      body: "ZOR Professional se predstavlja kroz urednu proizvodnju, lokalnu dostupnost i lokaciju u Robnim terminalima Jankomir.",
    },
    calculator: {
      eyebrow: "Kalkulator",
      title: "Procjena potrošnje prije narudžbe.",
      body: "Ovaj ekran postavlja temelj budućeg alata koji će pomoći domovima, firmama, apartmanima i ustanovama planirati zalihu.",
    },
    blog: {
      eyebrow: "Blog",
      title: "Kratki vodiči za pametniju opskrbu.",
      body: "Sadržaj podržava kupce koji žele razumjeti potrošnju, dostupnost i lokalnu proizvodnju bez dugih tekstualnih zidova.",
    },
    careers: {
      eyebrow: "Karijere",
      title: "Proizvodnja koja treba pouzdane ljude.",
      body: "Stranica za karijere gradi prvi dojam o radu u ZOR d.o.o.: uredno, konkretno i stabilno.",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Najbrži početak je kratka poruka.",
      body: "Pošaljite upit za toaletni papir, opskrbu firme ili apartmana, proizvodnju, karijere ili dolazak u Robne terminale Jankomir.",
    },
  },
  en: {
    products: {
      eyebrow: "Products",
      title: "A clear product overview without webshop pressure.",
      body: "Choose the direction that fits your space, demand, and ordering style. Price and availability are confirmed through a simple inquiry.",
    },
    production: {
      eyebrow: "Production",
      title: "Croatian toilet paper production with practical logistics.",
      body: "ZOR Professional is presented through clean production, local availability, and its position at Robni terminali Jankomir.",
    },
    calculator: {
      eyebrow: "Calculator",
      title: "Estimate consumption before ordering.",
      body: "This screen sets the foundation for a future tool that helps homes, companies, apartments, and institutions plan supply.",
    },
    blog: {
      eyebrow: "Blog",
      title: "Short guides for smarter supply.",
      body: "Content supports buyers who want to understand consumption, availability, and local production without long walls of text.",
    },
    careers: {
      eyebrow: "Careers",
      title: "Production work for reliable people.",
      body: "The careers page creates the first impression of working at ZOR d.o.o.: clean, concrete, and stable.",
    },
    contact: {
      eyebrow: "Contact",
      title: "The fastest start is a short message.",
      body: "Send an inquiry about toilet paper, company or apartment supply, production, careers, or visiting Robni terminali Jankomir.",
    },
  },
};
