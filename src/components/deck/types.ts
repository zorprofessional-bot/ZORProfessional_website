import type { ReactNode } from "react";

export type DeckAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type DeckLayout =
  | "split"
  | "splitReverse"
  | "center"
  | "visualFirst"
  | "dense";

export type DeckBackground =
  | "theme"
  | "light"
  | "soft"
  | "dark"
  | "steel"
  | "editorial";

export type DeckTone = "light" | "dark";

export type DeckSlideDefinition = {
  id: string;
  eyebrow?: string;
  title: string;
  body: ReactNode;
  /**
   * Slika slajda. Na desktopu se prikazuje u svojoj koloni; na mobitelu postaje
   * pozadina cijelog slajda s tamnim preljevom (tekst preko slike). Za custom
   * vizuale (npr. paket proizvoda) koristi `visual`.
   */
  image?: { src: string; alt: string; priority?: boolean };
  visual?: ReactNode;
  primaryCta?: DeckAction;
  secondaryCta?: DeckAction;
  actions?: DeckAction[];
  layout?: DeckLayout;
  background?: DeckBackground;
  tone?: DeckTone;
  align?: "left" | "center";
  /**
   * Skriva dekorativni vizual na mobitelu (md:flex). Koristi se za slajdove
   * čiji je sadržaj forma/interaktivna kartica, da stane bez skrolanja.
   */
  hideVisualOnMobile?: boolean;
};

export type DeckSlideMeta = {
  id: string;
  title: string;
  eyebrow?: string;
};
