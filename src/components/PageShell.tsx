import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { Navbar } from "./Navbar";
import { getLanguageHrefs, type Locale, type RouteKey } from "@/content/site";

type PageShellProps = {
  children: ReactNode;
  locale: Locale;
  activeKey: RouteKey;
  languageHrefs?: Record<Locale, string>;
};

export function PageShell({
  children,
  locale,
  activeKey,
  languageHrefs = getLanguageHrefs(activeKey),
}: PageShellProps) {
  return (
    <>
      <Navbar activeKey={activeKey} languageHrefs={languageHrefs} locale={locale} />
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer locale={locale} />
      <MobileBottomNav activeKey={activeKey} locale={locale} />
    </>
  );
}
