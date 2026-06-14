import type { ReactNode } from "react";
import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export type SlideBackground =
  | "white"
  | "softBlueGradient"
  | "darkPremiumBlue"
  | "paperTexture"
  | "industrialNeutral";

export type SlideLayout =
  | "splitLeft"
  | "splitRight"
  | "centered"
  | "visualFirst"
  | "compact";

export type SlideAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

type SlideSectionProps = {
  eyebrow?: string;
  title: string;
  body: ReactNode;
  actions?: SlideAction[];
  visual?: ReactNode;
  background?: SlideBackground;
  layout?: SlideLayout;
  className?: string;
};

const backgroundClasses: Record<SlideBackground, string> = {
  white: "bg-white text-zor-ink",
  softBlueGradient:
    "bg-[radial-gradient(circle_at_78%_18%,rgba(166,207,255,0.45),transparent_34rem),linear-gradient(135deg,#ffffff_0%,#eef7ff_100%)] text-zor-ink",
  darkPremiumBlue:
    "bg-[radial-gradient(circle_at_80%_10%,rgba(88,151,231,0.24),transparent_30rem),linear-gradient(135deg,#06244b_0%,#0b3b75_58%,#031936_100%)] text-white",
  paperTexture: "paper-texture text-zor-ink",
  industrialNeutral: "industrial-grid text-zor-ink",
};

export function SlideSection({
  eyebrow,
  title,
  body,
  actions = [],
  visual,
  background = "white",
  layout = "splitLeft",
  className,
}: SlideSectionProps) {
  const onDark = background === "darkPremiumBlue";
  const isCentered = layout === "centered";
  const isCompact = layout === "compact";
  const reverse = layout === "splitRight";
  const visualFirst = layout === "visualFirst";

  const content = (
    <div
      className={cn(
        "slide-reveal flex w-full min-w-0 flex-col justify-center",
        isCentered ? "mx-auto max-w-4xl text-center" : "max-w-2xl",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-5 text-xs font-bold uppercase tracking-[0.24em]",
            onDark ? "text-blue-100/80" : "text-zor-blue",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "text-3xl font-semibold leading-[1.05] sm:text-balance sm:text-5xl lg:text-7xl",
          isCompact && "lg:text-5xl",
        )}
      >
        {title}
      </h1>
      <div
        className={cn(
          "mt-7 text-base leading-7 sm:text-xl sm:leading-8",
          onDark ? "text-blue-50/82" : "text-zor-muted",
          isCentered && "mx-auto max-w-3xl",
        )}
      >
        {typeof body === "string" ? <p>{body}</p> : body}
      </div>
      {actions.length > 0 ? (
        <div
          className={cn(
            "mt-9 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center",
            isCentered && "sm:justify-center",
          )}
        >
          {actions.map((action) => (
            <ButtonLink
              className="w-full sm:w-auto"
              href={action.href}
              key={`${action.href}-${action.label}`}
              onDark={onDark}
              variant={action.variant}
            >
              {action.label}
            </ButtonLink>
          ))}
        </div>
      ) : null}
    </div>
  );

  const visualNode = visual ? (
    <div className="slide-reveal flex min-w-0 items-center justify-center">{visual}</div>
  ) : null;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-20 sm:py-24 md:min-h-[80svh] md:py-28",
        backgroundClasses[background],
        className,
      )}
    >
      <Container>
        {isCentered || !visualNode ? (
          <div className="grid gap-12">{content}{visualNode}</div>
        ) : isCompact ? (
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">{content}{visualNode}</div>
        ) : visualFirst ? (
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            {visualNode}
            {content}
          </div>
        ) : reverse ? (
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            {visualNode}
            {content}
          </div>
        ) : (
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            {content}
            {visualNode}
          </div>
        )}
      </Container>
    </section>
  );
}
