import { DeckShell } from "./DeckShell";
import { DeckSlide } from "./DeckSlide";
import type { ChapterThemeId } from "./ChapterThemeProvider";
import type { DeckSlideDefinition } from "./types";
import type { Locale, RouteKey } from "@/content/site";

type DeckPageProps = {
  activeKey: RouteKey;
  chapterLabel: string;
  languageHrefs?: Record<Locale, string>;
  locale: Locale;
  slides: DeckSlideDefinition[];
  theme: ChapterThemeId;
};

export function DeckPage({
  activeKey,
  chapterLabel,
  languageHrefs,
  locale,
  slides,
  theme,
}: DeckPageProps) {
  return (
    <DeckShell
      activeKey={activeKey}
      chapterLabel={chapterLabel}
      languageHrefs={languageHrefs}
      locale={locale}
      slides={slides.map(({ eyebrow, id, title }) => ({ eyebrow, id, title }))}
      theme={theme}
    >
      {slides.map((slide) => (
        <DeckSlide {...slide} key={slide.id} />
      ))}
    </DeckShell>
  );
}
