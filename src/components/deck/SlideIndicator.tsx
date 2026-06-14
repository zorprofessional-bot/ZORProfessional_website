"use client";

import { cn } from "@/lib/utils";
import type { DeckSlideMeta } from "./types";

type SlideIndicatorProps = {
  activeIndex: number;
  labels: {
    goTo: string;
    progress: string;
  };
  onSelect: (index: number) => void;
  slides: DeckSlideMeta[];
  tone: "light" | "dark";
};

export function SlideIndicator({
  activeIndex,
  labels,
  onSelect,
  slides,
  tone,
}: SlideIndicatorProps) {
  const dark = tone === "dark";

  return (
    <div className="pointer-events-none fixed bottom-[5.8rem] left-4 z-40 max-w-[calc(100vw-8.5rem)] md:bottom-6 md:left-6 md:max-w-[34rem]">
      <div
        className={cn(
          "pointer-events-auto flex max-w-full items-center gap-3 rounded-full border px-3 py-2 backdrop-blur-xl",
          dark
            ? "border-white/18 bg-white/10 text-white"
            : "border-zor-line bg-white/82 text-zor-blue-deep shadow-sm",
        )}
      >
        <span className={cn("shrink-0 text-xs font-bold", dark ? "text-white/74" : "text-zor-muted")}>
          {activeIndex + 1}/{slides.length}
        </span>
        <div className="flex min-w-0 items-center gap-1.5" role="tablist" aria-label={labels.progress}>
          {slides.map((slide, index) => {
            const active = index === activeIndex;

            return (
              <button
                aria-label={`${labels.goTo} ${index + 1}: ${slide.title}`}
                aria-selected={active}
                className={cn(
                  "group h-7 rounded-full transition focus:outline-none focus-visible:ring-2",
                  active ? "w-24 sm:w-36" : "w-7",
                  dark
                    ? "focus-visible:ring-white/60"
                    : "focus-visible:ring-zor-blue/45",
                )}
                key={slide.id}
                onClick={() => onSelect(index)}
                role="tab"
                type="button"
              >
                <span
                  className={cn(
                    "flex h-full items-center justify-center rounded-full text-[11px] font-bold",
                    active
                      ? dark
                        ? "bg-white text-zor-blue-deep"
                        : "bg-zor-blue text-white"
                      : dark
                        ? "bg-white/18 text-transparent group-hover:bg-white/28"
                        : "bg-zor-blue/16 text-transparent group-hover:bg-zor-blue/24",
                  )}
                >
                  <span className={cn("truncate px-2", active ? "block" : "sr-only")}>
                    {slide.eyebrow ?? slide.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
