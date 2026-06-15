import type { CSSProperties, ReactNode } from "react";

export type ChapterThemeId =
  | "home"
  | "products"
  | "production"
  | "calculator"
  | "blog"
  | "careers"
  | "contact";

export type ChapterTheme = {
  id: ChapterThemeId;
  navTone: "light" | "dark";
  mobileTone: "light" | "dark";
  vars: CSSProperties;
};

const zorDarkVars = {
  "--deck-bg": "#061a3d",
  "--deck-bg-2": "#0b3b75",
  "--deck-text": "#ffffff",
  "--deck-muted": "#d7e8ff",
  "--deck-accent": "#8ec9ff",
  "--deck-panel": "rgba(255,255,255,0.12)",
  "--deck-line": "rgba(255,255,255,0.2)",
} as CSSProperties;

export const chapterThemes: Record<ChapterThemeId, ChapterTheme> = {
  home: {
    id: "home",
    navTone: "dark",
    mobileTone: "dark",
    vars: zorDarkVars,
  },
  products: {
    id: "products",
    navTone: "dark",
    mobileTone: "dark",
    vars: zorDarkVars,
  },
  production: {
    id: "production",
    navTone: "dark",
    mobileTone: "dark",
    vars: zorDarkVars,
  },
  calculator: {
    id: "calculator",
    navTone: "dark",
    mobileTone: "dark",
    vars: zorDarkVars,
  },
  blog: {
    id: "blog",
    navTone: "dark",
    mobileTone: "dark",
    vars: zorDarkVars,
  },
  careers: {
    id: "careers",
    navTone: "dark",
    mobileTone: "dark",
    vars: zorDarkVars,
  },
  contact: {
    id: "contact",
    navTone: "dark",
    mobileTone: "dark",
    vars: zorDarkVars,
  },
};

export function getChapterTheme(theme: ChapterThemeId) {
  return chapterThemes[theme];
}

export function ChapterThemeProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: ChapterThemeId;
}) {
  const chapterTheme = getChapterTheme(theme);

  return (
    <div
      className="h-[100svh] overflow-hidden bg-[linear-gradient(135deg,var(--deck-bg)_0%,var(--deck-bg-2)_100%)] text-[var(--deck-text)]"
      data-chapter-theme={theme}
      style={chapterTheme.vars}
    >
      {children}
    </div>
  );
}
