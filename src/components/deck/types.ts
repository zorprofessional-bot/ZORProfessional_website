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
  visual?: ReactNode;
  primaryCta?: DeckAction;
  secondaryCta?: DeckAction;
  actions?: DeckAction[];
  layout?: DeckLayout;
  background?: DeckBackground;
  tone?: DeckTone;
  align?: "left" | "center";
};

export type DeckSlideMeta = {
  id: string;
  title: string;
  eyebrow?: string;
};
