"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  BriefcaseBusiness,
  Calculator,
  Factory,
  Home,
  Mail,
  Newspaper,
  Package,
} from "lucide-react";
import {
  mobileNav,
  routes,
  type Locale,
  type RouteKey,
} from "@/content/site";
import { cn } from "@/lib/utils";

type MobileBottomNavProps = {
  locale: Locale;
  activeKey: RouteKey;
  tone?: "light" | "dark";
};

const icons = {
  home: Home,
  products: Package,
  production: Factory,
  calculator: Calculator,
  blog: Newspaper,
  careers: BriefcaseBusiness,
  contact: Mail,
};

export function MobileBottomNav({ locale, activeKey, tone = "light" }: MobileBottomNavProps) {
  const dark = tone === "dark";
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [activeKey]);

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t px-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-18px_50px_rgba(8,42,83,0.12)] backdrop-blur-xl md:hidden",
        dark ? "border-white/14 bg-zor-blue-deep/88" : "border-zor-line bg-white/92",
      )}
    >
      <div className="mx-auto grid max-w-xl grid-cols-7 gap-1">
        {mobileNav[locale].map((item) => {
          const Icon = icons[item.key];
          const href = routes[locale][item.key as RouteKey];
          const active = item.key === activeKey;

          const content = (
            <>
              <span className="flex h-6 items-center justify-center">
                <Icon aria-hidden size={19} strokeWidth={2.1} />
              </span>
              <span className="block w-full truncate text-center text-[10px] font-bold leading-none">{item.label}</span>
            </>
          );

          const className = cn(
            "flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 transition",
            active
              ? dark
                ? "bg-white text-zor-blue-deep shadow-sm ring-1 ring-inset ring-white/70 shadow-[0_0_0_3px_rgba(142,201,255,0.18)]"
                : "bg-white text-zor-blue-deep shadow-sm ring-1 ring-inset ring-zor-line"
              : dark
                ? "text-white/68 hover:bg-white/10 hover:text-white"
                : "text-zor-muted hover:bg-zor-blue-soft hover:text-zor-blue",
          );

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={className}
              href={href}
              key={item.key}
              ref={active ? activeItemRef : undefined}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
