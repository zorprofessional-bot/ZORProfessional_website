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

export const chapterThemes: Record<ChapterThemeId, ChapterTheme> = {
  home: {
    id: "home",
    navTone: "dark",
    mobileTone: "dark",
    vars: {
      "--deck-bg": "#061a3d",
      "--deck-bg-2": "#0b3b75",
      "--deck-text": "#ffffff",
      "--deck-muted": "#d7e8ff",
      "--deck-accent": "#8ec9ff",
      "--deck-panel": "rgba(255,255,255,0.12)",
      "--deck-line": "rgba(255,255,255,0.2)",
    } as CSSProperties,
  },
  products: {
    id: "products",
    navTone: "light",
    mobileTone: "light",
    vars: {
      "--deck-bg": "#f5faff",
      "--deck-bg-2": "#d9ebff",
      "--deck-text": "#102033",
      "--deck-muted": "#526a84",
      "--deck-accent": "#0b63c4",
      "--deck-panel": "rgba(255,255,255,0.82)",
      "--deck-line": "rgba(11,59,117,0.16)",
    } as CSSProperties,
  },
  production: {
    id: "production",
    navTone: "light",
    mobileTone: "light",
    vars: {
      "--deck-bg": "#eef3f7",
      "--deck-bg-2": "#c7d2dd",
      "--deck-text": "#132235",
      "--deck-muted": "#566879",
      "--deck-accent": "#376b9c",
      "--deck-panel": "rgba(255,255,255,0.76)",
      "--deck-line": "rgba(55,107,156,0.22)",
    } as CSSProperties,
  },
  calculator: {
    id: "calculator",
    navTone: "light",
    mobileTone: "light",
    vars: {
      "--deck-bg": "#e9f8ff",
      "--deck-bg-2": "#a9ddff",
      "--deck-text": "#0d263f",
      "--deck-muted": "#466077",
      "--deck-accent": "#0075d8",
      "--deck-panel": "rgba(255,255,255,0.82)",
      "--deck-line": "rgba(0,117,216,0.18)",
    } as CSSProperties,
  },
  blog: {
    id: "blog",
    navTone: "light",
    mobileTone: "light",
    vars: {
      "--deck-bg": "#ffffff",
      "--deck-bg-2": "#eef3f8",
      "--deck-text": "#111c2b",
      "--deck-muted": "#5a6877",
      "--deck-accent": "#244f8f",
      "--deck-panel": "rgba(255,255,255,0.86)",
      "--deck-line": "rgba(17,28,43,0.12)",
    } as CSSProperties,
  },
  careers: {
    id: "careers",
    navTone: "dark",
    mobileTone: "dark",
    vars: {
      "--deck-bg": "#071d3d",
      "--deck-bg-2": "#0d3e78",
      "--deck-text": "#ffffff",
      "--deck-muted": "#d5e8ff",
      "--deck-accent": "#27d3ff",
      "--deck-panel": "rgba(255,255,255,0.12)",
      "--deck-line": "rgba(255,255,255,0.2)",
    } as CSSProperties,
  },
  contact: {
    id: "contact",
    navTone: "dark",
    mobileTone: "dark",
    vars: {
      "--deck-bg": "#06244b",
      "--deck-bg-2": "#0a3970",
      "--deck-text": "#ffffff",
      "--deck-muted": "#d9eaff",
      "--deck-accent": "#ffffff",
      "--deck-panel": "rgba(255,255,255,0.11)",
      "--deck-line": "rgba(255,255,255,0.22)",
    } as CSSProperties,
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
