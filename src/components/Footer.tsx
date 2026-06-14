import Link from "next/link";
import { Container } from "./Container";
import { desktopNav, routes, siteContact, type Locale } from "@/content/site";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-t border-zor-line bg-white pb-28 pt-14 md:pb-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-zor-blue text-sm font-black text-white">
                Z
              </span>
              <div>
                <p className="font-bold text-zor-blue-deep">{siteContact.brand}</p>
                <p className="text-sm text-zor-muted">{siteContact.company}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-zor-muted">
              {locale === "hr"
                ? "Hrvatska proizvodnja, fer cijena, pouzdana dostupnost i jednostavna narudžba."
                : "Croatian production, fair price, reliable availability, and simple ordering."}
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-zor-blue">
              {locale === "hr" ? "Navigacija" : "Navigation"}
            </p>
            <div className="grid gap-2">
              {desktopNav[locale].map((item) => (
                <Link
                  className="text-sm font-medium text-zor-muted transition hover:text-zor-blue"
                  href={routes[locale][item.key]}
                  key={item.key}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-zor-blue">
              {locale === "hr" ? "Lokacija" : "Location"}
            </p>
            <p className="text-sm font-semibold text-zor-blue-deep">{siteContact.location}</p>
            <p className="mt-1 text-sm text-zor-muted">{siteContact.city}</p>
            <p className="mt-5 text-sm text-zor-muted">{siteContact.email}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-zor-line pt-6 text-xs text-zor-muted">
          <p>© 2026 {siteContact.company}</p>
          <p>{locale === "hr" ? "Strukturni temelj bez webshopa." : "Structural foundation without webshop flow."}</p>
        </div>
      </Container>
    </footer>
  );
}
