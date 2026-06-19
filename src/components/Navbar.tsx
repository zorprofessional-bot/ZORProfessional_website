"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "./Container";
import { ButtonLink } from "./ButtonLink";
import { LogoMark } from "./LogoMark";
import {
  buildWhatsAppHref,
  desktopNav,
  routes,
  type Locale,
  type RouteKey,
} from "@/content/site";
import { useSiteContact } from "@/components/SiteSettingsProvider";
import type { DeckSlideMeta } from "@/components/deck/types";
import { cn } from "@/lib/utils";

type NavbarProps = {
  activeSlideIndex?: number;
  locale: Locale;
  activeKey: RouteKey;
  languageHrefs: Record<Locale, string>;
  onSlideSelect?: (index: number) => void;
  slideLabels?: {
    goTo: string;
    progress: string;
  };
  slides?: DeckSlideMeta[];
  tone?: "light" | "dark";
};

export function Navbar({
  activeSlideIndex = 0,
  locale,
  activeKey,
  languageHrefs,
  onSlideSelect,
  slideLabels,
  slides,
  tone = "dark",
}: NavbarProps) {
  const dark = tone === "dark";
  const contact = useSiteContact();
  const hasDesktopSlideTabs = Boolean(slides?.length && onSlideSelect && slideLabels);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl",
        dark ? "border-white/14 bg-[#072650]/96" : "border-white/70 bg-white/84",
      )}
    >
      <Container>
        <nav className="flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
          <Link aria-label="ZOR" className="flex items-center" href={routes[locale].home}>
            <LogoMark
              alt=""
              className={cn(
                "h-12 w-12 rounded-2xl shadow-sm ring-1 ring-inset md:h-14 md:w-14",
                dark ? "ring-white/70" : "ring-zor-line",
              )}
              imageClassName="p-1"
              priority
              sizes="(min-width: 768px) 3.5rem, 3rem"
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {desktopNav[locale].map((item) => {
              const active = activeKey === item.key;

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-semibold transition",
                    active
                      ? dark
                        ? "bg-white text-zor-blue-deep shadow-sm ring-1 ring-inset ring-white/70 shadow-[0_0_0_3px_rgba(142,201,255,0.18)]"
                        : "bg-white text-zor-blue-deep shadow-sm ring-1 ring-inset ring-zor-line"
                      : dark
                        ? "text-white/70 hover:bg-white/10 hover:text-white"
                        : "text-zor-muted hover:bg-zor-blue-soft hover:text-zor-blue",
                  )}
                  href={routes[locale][item.key]}
                  key={item.key}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex rounded-full border p-1 text-xs font-bold",
                dark ? "border-white/18 bg-white/10" : "border-zor-line bg-white",
              )}
            >
              <Link
                className={cn(
                  "rounded-full px-3 py-2 transition",
                  locale === "hr"
                    ? dark
                      ? "bg-white text-zor-blue-deep"
                      : "bg-zor-blue text-white"
                    : dark
                      ? "text-white/70 hover:text-white"
                      : "text-zor-muted hover:text-zor-blue",
                )}
                href={languageHrefs.hr}
              >
                HR
              </Link>
              <Link
                className={cn(
                  "rounded-full px-3 py-2 transition",
                  locale === "en"
                    ? dark
                      ? "bg-white text-zor-blue-deep"
                      : "bg-zor-blue text-white"
                    : dark
                      ? "text-white/70 hover:text-white"
                      : "text-zor-muted hover:text-zor-blue",
                )}
                href={languageHrefs.en}
              >
                EN
              </Link>
            </div>
            <div className="hidden lg:block">
              <ButtonLink href={buildWhatsAppHref(contact.whatsappNumber, locale)} onDark={dark} variant="primary">
                <MessageCircle aria-hidden size={16} />
                {locale === "hr" ? "WhatsApp upit" : "WhatsApp inquiry"}
              </ButtonLink>
            </div>
          </div>
        </nav>
        {hasDesktopSlideTabs ? (
          <div className="hidden h-11 items-center justify-center border-t border-white/10 lg:flex">
            <div className="mx-auto flex max-w-full items-center justify-center gap-3 overflow-hidden">
              <span className="shrink-0 text-xs font-bold text-white/58">
                {activeSlideIndex + 1}/{slides?.length}
              </span>
              <div
                aria-label={slideLabels?.progress}
                className="flex min-w-0 max-w-full items-center gap-1 overflow-x-auto"
                role="tablist"
              >
                {slides?.map((slide, index) => {
                  const active = index === activeSlideIndex;

                  return (
                    <button
                      aria-label={`${slideLabels?.goTo} ${index + 1}: ${slide.title}`}
                      aria-selected={active}
                      className={cn(
                        "min-h-8 max-w-48 rounded-full px-3 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                        active
                          ? "bg-white text-zor-blue-deep shadow-sm ring-1 ring-inset ring-white/70"
                          : "bg-white/8 text-white/66 hover:bg-white/14 hover:text-white",
                      )}
                      key={slide.id}
                      onClick={() => onSlideSelect?.(index)}
                      role="tab"
                      type="button"
                    >
                      <span className="block truncate">{slide.eyebrow ?? slide.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
