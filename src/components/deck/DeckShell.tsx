"use client";

import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Navbar } from "@/components/Navbar";
import {
  getAdjacentMenuChapterHref,
  getLanguageHrefs,
  type Locale,
  type RouteKey,
} from "@/content/site";
import { cn } from "@/lib/utils";
import {
  ChapterThemeProvider,
  getChapterTheme,
  type ChapterThemeId,
} from "./ChapterThemeProvider";
import { DeckControls } from "./DeckControls";
import { SlideIndicator } from "./SlideIndicator";
import type { DeckSlideMeta } from "./types";

type DeckShellProps = {
  activeKey: RouteKey;
  chapterLabel: string;
  children: ReactNode;
  languageHrefs?: Record<Locale, string>;
  locale: Locale;
  menuFlow?: boolean;
  slides: DeckSlideMeta[];
  theme: ChapterThemeId;
};

const slideParamName = "slide";

const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, button, a, [contenteditable='true']"),
  );
}

export function DeckShell({
  activeKey,
  chapterLabel,
  children,
  languageHrefs = getLanguageHrefs(activeKey),
  locale,
  menuFlow = false,
  slides,
  theme,
}: DeckShellProps) {
  const router = useRouter();
  const themeConfig = getChapterTheme(theme);
  const [activeIndex, setActiveIndex] = useState(0);
  const controlsReady = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const wheelLockUntil = useRef(0);
  const slideNodes = useMemo(() => Children.toArray(children), [children]);
  const nextChapterHref = menuFlow
    ? getAdjacentMenuChapterHref(locale, activeKey, "next")
    : undefined;
  const previousChapterHref = menuFlow
    ? getAdjacentMenuChapterHref(locale, activeKey, "previous")
    : undefined;
  const canGoNext = activeIndex < slides.length - 1 || Boolean(nextChapterHref);
  const canGoPrevious = activeIndex > 0 || Boolean(previousChapterHref);

  const indexFromLocation = useCallback(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    const params = new URLSearchParams(window.location.search);
    const slideId = params.get(slideParamName);
    const foundIndex = slides.findIndex((slide) => slide.id === slideId);

    return foundIndex >= 0 ? foundIndex : 0;
  }, [slides]);

  const writeSlideToUrl = useCallback(
    (index: number, mode: "push" | "replace" = "push") => {
      if (typeof window === "undefined") {
        return;
      }

      const url = new URL(window.location.href);
      url.searchParams.set(slideParamName, slides[index]?.id ?? slides[0]?.id ?? "");
      const nextUrl = `${url.pathname}?${url.searchParams.toString()}${url.hash}`;

      if (`${window.location.pathname}${window.location.search}${window.location.hash}` === nextUrl) {
        return;
      }

      window.history[mode === "replace" ? "replaceState" : "pushState"](
        { slide: slides[index]?.id },
        "",
        nextUrl,
      );
    },
    [slides],
  );

  const goTo = useCallback(
    (index: number, mode: "push" | "replace" = "push") => {
      const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
      setActiveIndex(nextIndex);
      writeSlideToUrl(nextIndex, mode);
    },
    [slides.length, writeSlideToUrl],
  );

  const goNext = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      goTo(activeIndex + 1);
      return;
    }

    if (nextChapterHref) {
      router.push(nextChapterHref);
    }
  }, [activeIndex, goTo, nextChapterHref, router, slides.length]);

  const goPrevious = useCallback(() => {
    if (activeIndex > 0) {
      goTo(activeIndex - 1);
      return;
    }

    if (previousChapterHref) {
      router.push(previousChapterHref);
    }
  }, [activeIndex, goTo, previousChapterHref, router]);

  useEffect(() => {
    const syncFromUrl = () => {
      setActiveIndex(indexFromLocation());
    };
    const frame = window.requestAnimationFrame(syncFromUrl);

    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [indexFromLocation]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("[data-deck-scroll]")) {
      return;
    }

    event.preventDefault();

    const now = window.performance.now();
    if (now < wheelLockUntil.current || Math.abs(event.deltaY) < 34) {
      return;
    }

    wheelLockUntil.current = now + 720;

    if (event.deltaY > 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (!touchStart.current) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  const labels =
    locale === "hr"
      ? {
          next: "Sljedeći slide",
          previous: "Prethodni slide",
          goTo: "Idi na slide",
          progress: "Pozicija u poglavlju",
        }
      : {
          next: "Next slide",
          previous: "Previous slide",
          goTo: "Go to slide",
          progress: "Chapter position",
        };

  return (
    <ChapterThemeProvider theme={theme}>
      <Navbar
        activeKey={activeKey}
        languageHrefs={languageHrefs}
        locale={locale}
        tone={themeConfig.navTone}
      />
      <main
        aria-label={chapterLabel}
        className="relative h-[100svh] overflow-hidden pb-[6.1rem] pt-20 md:pb-0"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
      >
        <div className="relative h-full overflow-hidden">
          {slideNodes.map((child, index) => {
            const active = index === activeIndex;

            return (
              <div
                aria-hidden={!active}
                className={cn(
                  "absolute inset-0 h-full w-full transition-opacity duration-200 ease-out",
                  active ? "visible opacity-100" : "invisible opacity-0",
                )}
                key={slides[index]?.id ?? index}
              >
                {child}
              </div>
            );
          })}
        </div>
      </main>
      <SlideIndicator
        activeIndex={activeIndex}
        labels={{ goTo: labels.goTo, progress: labels.progress }}
        onSelect={(index) => goTo(index)}
        slides={slides}
        tone={themeConfig.navTone}
      />
      <DeckControls
        canGoNext={controlsReady ? canGoNext : true}
        canGoPrevious={controlsReady ? canGoPrevious : true}
        labels={{ next: labels.next, previous: labels.previous }}
        onNext={goNext}
        onPrevious={goPrevious}
        tone={themeConfig.navTone}
      />
      <MobileBottomNav activeKey={activeKey} locale={locale} tone={themeConfig.mobileTone} />
    </ChapterThemeProvider>
  );
}
