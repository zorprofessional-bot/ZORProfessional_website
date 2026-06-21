"use client";

import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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

type DeckTransitionAxis = "horizontal" | "vertical";
type DeckTransitionDirection = "next" | "previous";

type DeckTransition = {
  axis: DeckTransitionAxis;
  direction: DeckTransitionDirection;
  fromIndex: number;
  toIndex: number;
  token: number;
};

const slideParamName = "slide";
const deckTransitionDurationMs = 480;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, button, a, [contenteditable='true']"),
  );
}

function getDeckTransitionMeta(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) {
    return null;
  }

  const direction: DeckTransitionDirection = toIndex > fromIndex ? "next" : "previous";
  const boundaryIndex = Math.max(0, direction === "next" ? fromIndex : fromIndex - 1);
  const axis: DeckTransitionAxis = boundaryIndex % 2 === 0 ? "horizontal" : "vertical";

  return { axis, direction };
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
  const [transition, setTransition] = useState<DeckTransition | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const touchStart = useRef<{
    x: number;
    y: number;
    canScroll: boolean;
    atTop: boolean;
    atBottom: boolean;
  } | null>(null);
  const transitionToken = useRef(0);
  const wheelLockUntil = useRef(0);
  const frameRefs = useRef(new Map<number, HTMLDivElement>());
  const [showScrollHint, setShowScrollHint] = useState(false);
  const slideNodes = useMemo(() => Children.toArray(children), [children]);
  const nextChapterHref = menuFlow
    ? getAdjacentMenuChapterHref(locale, activeKey, "next")
    : undefined;
  const previousChapterHref = menuFlow
    ? getAdjacentMenuChapterHref(locale, activeKey, "previous")
    : undefined;
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // "Scroll za više" afordansa: prikaži suptilan chevron samo na mobitelu, kad
  // aktivni slide prelazi viewport i još nije skrolan do dna.
  const measureScrollHint = useCallback(() => {
    const el = frameRefs.current.get(activeIndexRef.current);

    if (!el || !window.matchMedia("(max-width: 767px)").matches) {
      setShowScrollHint(false);
      return;
    }

    const canScroll = el.scrollHeight > el.clientHeight + 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    setShowScrollHint(canScroll && !atBottom);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(measureScrollHint);
    window.addEventListener("resize", measureScrollHint);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureScrollHint);
    };
  }, [activeIndex, measureScrollHint]);

  useEffect(() => {
    if (!transition) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setTransition((current) => (current?.token === transition.token ? null : current));
    }, deckTransitionDurationMs);

    return () => window.clearTimeout(timeout);
  }, [transition]);

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
      if (slides.length === 0) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
      const previousIndex = activeIndexRef.current;

      if (nextIndex === previousIndex) {
        writeSlideToUrl(nextIndex, mode);
        return;
      }

      const meta = getDeckTransitionMeta(previousIndex, nextIndex);
      transitionToken.current += 1;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      setTransition(
        meta
          ? {
              ...meta,
              fromIndex: previousIndex,
              toIndex: nextIndex,
              token: transitionToken.current,
            }
          : null,
      );
      writeSlideToUrl(nextIndex, mode);
    },
    [slides.length, writeSlideToUrl],
  );

  const goNext = useCallback(() => {
    const currentIndex = activeIndexRef.current;

    if (currentIndex < slides.length - 1) {
      goTo(currentIndex + 1);
      return;
    }

    if (nextChapterHref) {
      router.push(nextChapterHref);
    }
  }, [goTo, nextChapterHref, router, slides.length]);

  const goPrevious = useCallback(() => {
    const currentIndex = activeIndexRef.current;

    if (currentIndex > 0) {
      goTo(currentIndex - 1);
      return;
    }

    if (previousChapterHref) {
      router.push(previousChapterHref);
    }
  }, [goTo, previousChapterHref, router]);

  useEffect(() => {
    const syncFromUrl = (animate: boolean) => {
      const nextIndex = indexFromLocation();
      const previousIndex = activeIndexRef.current;

      if (nextIndex === previousIndex) {
        return;
      }

      const meta = animate ? getDeckTransitionMeta(previousIndex, nextIndex) : null;
      transitionToken.current += 1;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      setTransition(
        meta
          ? {
              ...meta,
              fromIndex: previousIndex,
              toIndex: nextIndex,
              token: transitionToken.current,
            }
          : null,
      );
    };
    const handlePopState = () => syncFromUrl(true);
    const frame = window.requestAnimationFrame(() => syncFromUrl(false));

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("popstate", handlePopState);
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

    if (window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    if (target.closest("[data-deck-scroll]")) {
      return;
    }

    event.preventDefault();

    const now = window.performance.now();
    const primaryDelta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    if (now < wheelLockUntil.current || Math.abs(primaryDelta) < 34) {
      return;
    }

    wheelLockUntil.current = now + 720;

    if (primaryDelta > 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    const scrollEl = (event.target as HTMLElement).closest(".deck-slide-frame");
    let canScroll = false;
    let atTop = true;
    let atBottom = true;

    if (scrollEl) {
      canScroll = scrollEl.scrollHeight > scrollEl.clientHeight + 1;
      atTop = scrollEl.scrollTop <= 1;
      atBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1;
    }

    touchStart.current = { x: touch.clientX, y: touch.clientY, canScroll, atTop, atBottom };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (!touchStart.current) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const { canScroll, atTop, atBottom } = touchStart.current;
    touchStart.current = null;

    if (Math.max(absX, absY) < 48) {
      return;
    }

    if (absX >= absY) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrevious();
      }
      return;
    }

    // Na mobitelu vertikalni gest najprije skrola sadržaj slidea; promjena
    // slidea se dogodi tek kad je sadržaj već na rubu (vrhu/dnu) na početku
    // gesta. Kad sadržaj stane u viewport (`canScroll` false), navigira odmah.
    if (canScroll && window.matchMedia("(max-width: 767px)").matches) {
      if (deltaY < 0) {
        if (atBottom) {
          goNext();
        }
      } else if (atTop) {
        goPrevious();
      }
      return;
    }

    if (deltaY < 0) {
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
        activeSlideIndex={activeIndex}
        languageHrefs={languageHrefs}
        locale={locale}
        onSlideSelect={(index) => goTo(index)}
        slideLabels={{ goTo: labels.goTo, progress: labels.progress }}
        slides={slides}
        tone="dark"
      />
      <main
        aria-label={chapterLabel}
        className="relative h-[100svh] overflow-hidden pb-[5.35rem] pt-[4.5rem] md:pb-[3rem] md:pt-20 lg:pb-[4.25rem] lg:pt-[7.75rem]"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
      >
        <div className="relative h-full overflow-hidden">
          {slideNodes.map((child, index) => {
            const active = index === activeIndex;
            const transitioningIn = transition?.toIndex === index;
            const transitioningOut = transition?.fromIndex === index;
            const transitioning = transitioningIn || transitioningOut;
            const visible = active || transitioningOut;
            // Učitavaj samo aktivni slide i njegove neposredne susjede. Udaljeni
            // slideovi dobivaju `display:none`, pa native lazy-loading ne dohvaća
            // njihove slike dok se ne približe. DOM (i stanje formi) ostaje montiran.
            const near = active || transitioning || Math.abs(index - activeIndex) <= 1;
            const transitionClass = transitioning
              ? transitioningIn
                ? `deck-slide-enter-${transition.axis}-${transition.direction}`
                : `deck-slide-exit-${transition.axis}-${transition.direction}`
              : undefined;

            return (
              <div
                aria-hidden={!active}
                className={cn(
                  "deck-slide-frame deck-scroll absolute inset-0 h-full w-full overflow-y-auto overscroll-contain transition-opacity duration-200 ease-out md:overflow-hidden",
                  !near && "hidden",
                  near &&
                    (visible
                      ? "visible opacity-100"
                      : "invisible pointer-events-none opacity-0"),
                  active ? "pointer-events-auto" : "pointer-events-none",
                  transitioningIn && "z-20",
                  transitioningOut && "z-10",
                  transitionClass,
                )}
                key={slides[index]?.id ?? index}
                onScroll={active ? measureScrollHint : undefined}
                ref={(node) => {
                  if (node) {
                    frameRefs.current.set(index, node);
                  } else {
                    frameRefs.current.delete(index);
                  }
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-2 z-30 flex justify-center transition-opacity duration-300 md:hidden",
            showScrollHint ? "opacity-70" : "opacity-0",
          )}
        >
          <span className="flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm">
            <svg
              aria-hidden
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </main>
      <SlideIndicator
        activeIndex={activeIndex}
        labels={{ goTo: labels.goTo, progress: labels.progress }}
        onSelect={(index) => goTo(index)}
        slides={slides}
        tone={themeConfig.navTone}
      />
      <MobileBottomNav activeKey={activeKey} locale={locale} tone={themeConfig.mobileTone} />
    </ChapterThemeProvider>
  );
}
