import { ButtonLink } from "@/components/ButtonLink";
import { cn } from "@/lib/utils";
import type { DeckSlideDefinition } from "./types";

const backgroundClasses = {
  theme:
    "bg-[linear-gradient(135deg,var(--deck-bg)_0%,var(--deck-bg-2)_100%)] text-[var(--deck-text)]",
  light: "bg-white text-zor-ink",
  soft:
    "bg-[linear-gradient(135deg,#f7fbff_0%,#e5f2ff_100%)] text-zor-ink",
  dark:
    "bg-[linear-gradient(135deg,#061a3d_0%,#0b3b75_64%,#05152f_100%)] text-white",
  steel:
    "bg-[linear-gradient(135deg,#f4f7fa_0%,#d5dee8_100%)] text-zor-ink",
  editorial:
    "bg-[linear-gradient(135deg,#ffffff_0%,#f2f5f8_100%)] text-zor-ink",
};

export function DeckSlide({
  actions,
  align = "center",
  background = "theme",
  body,
  eyebrow,
  id,
  layout = "split",
  primaryCta,
  secondaryCta,
  title,
  tone = "light",
  visual,
}: DeckSlideDefinition) {
  const onDark = tone === "dark";
  const allActions = actions ?? [primaryCta, secondaryCta].filter(Boolean);
  const centered = align === "center" || layout === "center";
  const hasVisual = Boolean(visual);

  const content = (
    <div
      className={cn(
        "order-1 min-w-0",
        (layout === "splitReverse" || layout === "visualFirst") && "lg:order-2",
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        layout === "dense" && "max-w-xl",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-4 text-xs font-bold uppercase tracking-[0.22em]",
            onDark ? "text-white/72" : "text-zor-blue",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "text-3xl font-semibold leading-[1.08] sm:text-5xl sm:leading-[1.04] lg:text-6xl",
          layout === "dense" && "lg:text-5xl",
        )}
        id={`${id}-title`}
      >
        {title}
      </h1>
      <div
        className={cn(
          "mt-5 text-base leading-7 sm:text-lg",
          onDark ? "text-white/80" : "text-zor-muted",
          centered && "mx-auto max-w-2xl",
        )}
      >
        {typeof body === "string" ? <p>{body}</p> : body}
      </div>
      {allActions.length > 0 ? (
        <div
          className={cn(
            "mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center",
            centered && "sm:justify-center",
          )}
        >
          {allActions.map((action) =>
            action ? (
              <ButtonLink
                className={cn("w-full sm:w-auto", action.variant === "secondary" && "max-sm:hidden")}
                href={action.href}
                key={`${action.href}-${action.label}`}
                onDark={onDark}
                variant={action.variant}
              >
                {action.label}
              </ButtonLink>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );

  const visualNode = visual ? (
    <div
      className={cn(
        "order-2 flex min-h-0 w-full min-w-0 items-center justify-center overflow-hidden",
        (layout === "splitReverse" || layout === "visualFirst") && "lg:order-1",
      )}
    >
      {visual}
    </div>
  ) : null;

  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-roledescription="slide"
      className={cn(
        "min-h-full md:h-full md:overflow-hidden",
        backgroundClasses[background],
      )}
      data-slide-id={id}
    >
      <div
        className={cn(
          "mx-auto grid min-h-full max-w-7xl content-start justify-items-center gap-5 px-4 pb-16 pt-6 sm:px-6 md:h-full md:content-center md:items-center md:gap-8 md:px-8 md:py-5 lg:px-10",
          hasVisual && layout !== "center"
            ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            : "place-items-center",
          layout === "dense" && "lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]",
        )}
      >
        {layout === "splitReverse" || layout === "visualFirst" ? (
          <>
            {visualNode}
            {content}
          </>
        ) : layout === "center" ? (
          <div className="grid w-full min-w-0 gap-5">
            {content}
            {visualNode}
          </div>
        ) : (
          <>
            {content}
            {visualNode}
          </>
        )}
      </div>
    </section>
  );
}
