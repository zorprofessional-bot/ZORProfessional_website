"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DeckControlsProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  tone: "light" | "dark";
  labels: {
    next: string;
    previous: string;
  };
};

export function DeckControls({
  canGoNext,
  canGoPrevious,
  labels,
  onNext,
  onPrevious,
  tone,
}: DeckControlsProps) {
  const dark = tone === "dark";

  const buttonClass = cn(
    "grid h-11 w-11 place-items-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35",
    dark
      ? "border-white/24 bg-white/12 text-white hover:bg-white/18 focus-visible:ring-white/60 focus-visible:ring-offset-zor-blue-deep"
      : "border-zor-line bg-white/86 text-zor-blue-deep shadow-sm hover:border-zor-blue/35 hover:bg-white focus-visible:ring-zor-blue/45",
  );

  return (
    <div className="pointer-events-none fixed bottom-[5.8rem] right-4 z-40 hidden items-center gap-2 md:bottom-6 md:right-6 md:flex lg:bottom-auto lg:top-[5.35rem]">
      <button
        aria-label={labels.previous}
        className={cn(buttonClass, "pointer-events-auto")}
        disabled={!canGoPrevious}
        onClick={onPrevious}
        type="button"
      >
        <ChevronLeft aria-hidden size={21} strokeWidth={2.3} />
      </button>
      <button
        aria-label={labels.next}
        className={cn(buttonClass, "pointer-events-auto")}
        disabled={!canGoNext}
        onClick={onNext}
        type="button"
      >
        <ChevronRight aria-hidden size={21} strokeWidth={2.3} />
      </button>
    </div>
  );
}
