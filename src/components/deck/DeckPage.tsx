import { DeckShell } from "./DeckShell";
import { DeckSlide } from "./DeckSlide";
import {
  getChapterTheme,
  type ChapterThemeId,
} from "./ChapterThemeProvider";
import type { DeckSlideDefinition } from "./types";
import type { Locale, RouteKey } from "@/content/site";

type DeckPageProps = {
  activeKey: RouteKey;
  chapterLabel: string;
  languageHrefs?: Record<Locale, string>;
  locale: Locale;
  menuFlow?: boolean;
  slides: DeckSlideDefinition[];
  theme: ChapterThemeId;
};

export function DeckPage({
  activeKey,
  chapterLabel,
  languageHrefs,
  locale,
  menuFlow = false,
  slides,
  theme,
}: DeckPageProps) {
  const themeTone = getChapterTheme(theme).navTone;
  const normalizedSlides = slides.map((slide) => ({
    ...slide,
    background: "theme" as const,
    tone: themeTone,
  }));

  return (
    <DeckShell
      activeKey={activeKey}
      chapterLabel={chapterLabel}
      languageHrefs={languageHrefs}
      locale={locale}
      menuFlow={menuFlow}
      slides={normalizedSlides.map(({ eyebrow, id, title }) => ({ eyebrow, id, title }))}
      theme={theme}
    >
      {normalizedSlides.map((slide) => (
        <DeckSlide {...slide} key={slide.id} />
      ))}
    </DeckShell>
  );
}
