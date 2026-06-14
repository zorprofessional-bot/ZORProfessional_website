import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "./Container";
import { ButtonLink } from "./ButtonLink";
import {
  desktopNav,
  getWhatsAppHref,
  routes,
  type Locale,
  type RouteKey,
} from "@/content/site";
import { cn } from "@/lib/utils";

type NavbarProps = {
  locale: Locale;
  activeKey: RouteKey;
  languageHrefs: Record<Locale, string>;
  tone?: "light" | "dark";
};

export function Navbar({ locale, activeKey, languageHrefs, tone = "light" }: NavbarProps) {
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl",
        dark ? "border-white/14 bg-zor-blue-deep/78" : "border-white/70 bg-white/84",
      )}
    >
      <Container>
        <nav className="flex h-20 items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href={routes[locale].home}>
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-2xl text-sm font-black shadow-sm",
                dark ? "bg-white text-zor-blue-deep" : "bg-zor-blue text-white",
              )}
            >
              Z
            </span>
            <span className="leading-tight">
              <span className={cn("block text-sm font-bold", dark ? "text-white" : "text-zor-blue-deep")}>
                ZOR Professional
              </span>
              <span className={cn("block text-xs font-medium", dark ? "text-white/62" : "text-zor-muted")}>
                ZOR d.o.o.
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {desktopNav[locale].map((item) => (
              <Link
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition",
                  activeKey === item.key
                    ? dark
                      ? "bg-white text-zor-blue-deep"
                      : "bg-zor-blue text-white"
                    : dark
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-zor-muted hover:bg-zor-blue-soft hover:text-zor-blue",
                )}
                href={routes[locale][item.key]}
                key={item.key}
              >
                {item.label}
              </Link>
            ))}
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
              <ButtonLink href={getWhatsAppHref(locale)} onDark={dark} variant="primary">
                <MessageCircle aria-hidden size={16} />
                {locale === "hr" ? "WhatsApp upit" : "WhatsApp inquiry"}
              </ButtonLink>
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
