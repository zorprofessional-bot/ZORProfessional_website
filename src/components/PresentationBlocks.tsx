import Link from "next/link";
import {
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Factory,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  School,
  Users,
  Warehouse,
} from "lucide-react";
import { ButtonLink } from "./ButtonLink";
import { LogoMark } from "./LogoMark";
import { getPosts } from "@/content/blog";
import { getProducts } from "@/content/products";
import {
  getWhatsAppHref,
  routes,
  siteContact,
  type Locale,
} from "@/content/site";
import { cn } from "@/lib/utils";

type Card = {
  title: string;
  body: string;
};

type Point = {
  value: string;
  label: string;
};

type FlowStep = {
  title: string;
  body: string;
};

const audienceIcons = [Home, Building2, Warehouse, School];

export function ProductHeroVisual({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";

  return (
    <div
      aria-label={
        isHr
          ? "Premium placeholder pakiranja ZOR Professional toaletnog papira"
          : "Premium placeholder packaging visual for ZOR Professional toilet paper"
      }
      className="relative min-h-[430px] w-full overflow-hidden rounded-[2.25rem] border border-white/75 bg-[radial-gradient(circle_at_74%_20%,rgba(176,212,255,0.5),transparent_17rem),linear-gradient(145deg,#ffffff_0%,#f3f8ff_62%,#e7f1fc_100%)] p-6 shadow-zor-soft sm:min-h-[560px] sm:p-8"
      role="img"
    >
      <div className="absolute -left-16 top-10 h-48 w-48 rounded-full border border-zor-line/80 bg-white/50" />
      <div className="absolute bottom-8 right-6 h-40 w-40 rounded-full bg-zor-blue-soft/70 blur-2xl" />

      <div className="relative flex h-full min-h-[380px] items-center justify-center sm:min-h-[500px]">
        <div className="absolute bottom-7 left-4 hidden w-52 rotate-[-7deg] rounded-[1.7rem] border border-white/80 bg-white/80 p-4 shadow-[0_26px_60px_rgba(8,42,83,0.14)] backdrop-blur sm:block">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 rounded-full bg-[radial-gradient(circle_at_42%_42%,#ffffff_0_22%,#d9e3ef_23%_34%,#ffffff_35%_100%)] shadow-inner">
              <div className="absolute inset-2 rounded-full border border-zor-line/70" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zor-blue">
                {isHr ? "Rola" : "Roll"}
              </p>
              <p className="mt-1 text-sm font-semibold text-zor-blue-deep">
                {isHr ? "čist bijeli papir" : "clean white paper"}
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[430px]">
          <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-white/80 shadow-[0_18px_50px_rgba(8,42,83,0.12)]" />
          <div className="absolute -right-1 -top-4 grid h-20 w-20 place-items-center rounded-full border border-zor-line bg-[radial-gradient(circle_at_center,#eef4fb_0_28%,#ffffff_29%_100%)] text-[10px] font-black uppercase tracking-[0.12em] text-zor-blue">
            24
          </div>

          <div className="relative overflow-hidden rounded-[2.2rem] border border-white bg-white shadow-[0_36px_100px_rgba(8,42,83,0.2)]">
            <div className="grid grid-cols-4 gap-1 border-b border-zor-line/55 bg-white px-5 py-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  className="aspect-square rounded-full bg-[radial-gradient(circle_at_45%_45%,#f8fbff_0_24%,#dbe5ef_25%_36%,#ffffff_37%_100%)] shadow-inner"
                  key={index}
                />
              ))}
            </div>

            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-6 py-9">
              <div className="rounded-[1.6rem] border border-zor-line bg-white p-5 shadow-[0_18px_45px_rgba(8,42,83,0.08)]">
                <LogoMark
                  className="h-14 w-14 rounded-2xl shadow-sm ring-1 ring-inset ring-zor-line"
                  imageClassName="p-1"
                  sizes="3.5rem"
                />
                <h3 className="mt-3 text-4xl font-semibold leading-none text-zor-blue-deep">
                  ZOR 24
                </h3>
                <p className="mt-3 text-sm font-semibold text-zor-muted">
                  {isHr ? "Toaletni papir iz hrvatske proizvodnje" : "Toilet paper from Croatian production"}
                </p>
              </div>
            </div>

            <div className="h-20 bg-[linear-gradient(135deg,#06244b_0%,#0b3b75_62%,#1c65b8_100%)] px-6 py-4 text-white">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold">{isHr ? "24 role" : "24 rolls"}</p>
                <p className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
                  {isHr ? "dostupno" : "available"}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 left-1/2 w-[78%] -translate-x-1/2 rounded-full bg-zor-blue-deep/16 blur-2xl" />
        </div>
      </div>
    </div>
  );
}

export function AudienceGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {cards.map((card, index) => {
        const Icon = audienceIcons[index] ?? Users;
        return (
          <article
            className="rounded-[1.65rem] border border-white/78 bg-white/84 p-6 shadow-zor-soft backdrop-blur"
            key={card.title}
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-zor-blue-soft text-zor-blue">
              <Icon aria-hidden size={23} strokeWidth={2.1} />
            </div>
            <h3 className="text-xl font-semibold text-zor-blue-deep">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zor-muted">{card.body}</p>
          </article>
        );
      })}
    </div>
  );
}

export function ValueCardGrid({
  cards,
  onDark = false,
}: {
  cards: Card[];
  onDark?: boolean;
}) {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <article
          className={cn(
            "rounded-[1.65rem] border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.14)] backdrop-blur",
            onDark
              ? "border-white/18 bg-white/10 text-white"
              : "border-zor-line bg-white/88 text-zor-ink shadow-zor-soft",
          )}
          key={card.title}
        >
          <div
            className={cn(
              "mb-5 grid h-12 w-12 place-items-center rounded-2xl",
              onDark ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
            )}
          >
            <CheckCircle2 aria-hidden size={23} strokeWidth={2.1} />
          </div>
          <h3 className="text-xl font-semibold">{card.title}</h3>
          <p className={cn("mt-3 text-sm leading-6", onDark ? "text-blue-50/78" : "text-zor-muted")}>
            {card.body}
          </p>
        </article>
      ))}
    </div>
  );
}

export function ProofStrip({ points }: { points: Point[] }) {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {points.map((point) => (
        <div
          className="rounded-[1.65rem] border border-white/18 bg-white/10 p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur"
          key={point.value}
        >
          <p className="text-4xl font-semibold tracking-normal">{point.value}</p>
          <p className="mt-3 text-sm leading-6 text-blue-50/78">{point.label}</p>
        </div>
      ))}
    </div>
  );
}

export function ProductPreviewCards({
  locale,
  limit,
  onDark = false,
  layout = "stacked",
}: {
  locale: Locale;
  limit?: number;
  onDark?: boolean;
  layout?: "stacked" | "grid";
}) {
  const items = getProducts(locale).slice(0, limit ?? 3);
  const note =
    locale === "hr"
      ? "Za firme i redovite količine šaljemo posebnu ponudu."
      : "For companies and recurring quantities, we send a dedicated offer.";

  return (
    <div
      className={cn(
        "grid w-full gap-4",
        layout === "grid" && "lg:grid-cols-3",
      )}
    >
      {items.map((product) => (
        <article
          className={cn(
            "group flex min-h-full flex-col rounded-[1.65rem] border p-5 transition hover:-translate-y-0.5",
            onDark
              ? "border-white/16 bg-white/10 text-white hover:bg-white/14"
              : "border-zor-line bg-white/90 text-zor-ink shadow-zor-soft hover:border-zor-blue/28",
          )}
          key={product.id}
        >
          <div
            aria-hidden
            className="mb-5 overflow-hidden rounded-[1.35rem] border border-zor-line bg-[linear-gradient(145deg,#ffffff_0%,#f4f8ff_100%)] p-4"
          >
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: product.id.includes("36") ? 12 : 8 }).map((_, index) => (
                <span
                  className="aspect-square rounded-full bg-[radial-gradient(circle_at_45%_45%,#fdfefe_0_24%,#d9e3ef_25%_36%,#ffffff_37%_100%)] shadow-inner"
                  key={index}
                />
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-zor-blue px-4 py-3 text-white">
              <LogoMark
                className="h-10 w-10 rounded-xl shadow-sm ring-1 ring-inset ring-white/70"
                imageClassName="p-0.5"
                sizes="2.5rem"
              />
              <p className="mt-1 text-lg font-semibold">{product.packCount[locale]}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-[0.2em]",
                onDark ? "text-blue-100/70" : "text-zor-blue",
              )}
            >
              {product.eyebrow[locale]}
            </p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight">{product.name[locale]}</h3>
            <p className={cn("mt-3 text-sm leading-6", onDark ? "text-blue-50/78" : "text-zor-muted")}>
              {product.summary[locale]}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className={cn("rounded-2xl p-4", onDark ? "bg-white/10" : "bg-zor-blue-soft/70")}>
                <p className={cn("text-xs font-bold uppercase tracking-[0.16em]", onDark ? "text-blue-100/70" : "text-zor-blue")}>
                  {locale === "hr" ? "Pakiranje" : "Pack"}
                </p>
                <p className="mt-2 text-sm font-bold">{product.packCount[locale]}</p>
              </div>
              <div className={cn("rounded-2xl p-4", onDark ? "bg-white/10" : "bg-zor-blue-soft/70")}>
                <p className={cn("text-xs font-bold uppercase tracking-[0.16em]", onDark ? "text-blue-100/70" : "text-zor-blue")}>
                  {locale === "hr" ? "Mock cijena" : "Mock price"}
                </p>
                <p className="mt-2 text-sm font-bold">{product.mockPrice[locale]}</p>
              </div>
            </div>

            <p className={cn("mt-4 text-xs leading-5", onDark ? "text-blue-50/70" : "text-zor-muted")}>
              {note}
            </p>

            <ButtonLink className="mt-5 w-full" href={product.href} onDark={onDark} variant="secondary">
              {locale === "hr" ? "Detalji proizvoda" : "Product details"}
            </ButtonLink>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProductDetailPanel({
  locale,
  highlights,
  specs,
}: {
  locale: Locale;
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="w-full rounded-[2rem] border border-zor-line bg-white/88 p-6 shadow-zor-soft">
      <div className="grid gap-3">
        {highlights.map((item) => (
          <div className="flex items-start gap-3 rounded-2xl bg-zor-blue-soft/70 p-4" key={item}>
            <CheckCircle2 className="mt-0.5 shrink-0 text-zor-blue" aria-hidden size={20} />
            <p className="text-sm font-semibold leading-6 text-zor-blue-deep">{item}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {specs.map((spec) => (
          <div className="rounded-2xl border border-zor-line bg-white p-4" key={spec.label}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zor-blue">
              {spec.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-zor-blue-deep">{spec.value}</p>
          </div>
        ))}
      </div>
      <ButtonLink className="mt-6 w-full" href={getWhatsAppHref(locale)}>
        {locale === "hr" ? "Pošalji upit za proizvod" : "Send product inquiry"}
      </ButtonLink>
    </div>
  );
}

export function CalculatorMockup({ locale }: { locale: Locale }) {
  const rows =
    locale === "hr"
      ? [
          ["Ljudi", "18"],
          ["Sadašnji paket", "24 role"],
          ["Trajanje paketa", "16 dana"],
        ]
      : [
          ["People", "18"],
          ["Current pack", "24 rolls"],
          ["Pack duration", "16 days"],
        ];

  return (
    <div className="w-full rounded-[2rem] border border-white/78 bg-white/88 p-5 shadow-zor-soft backdrop-blur">
      <div className="flex items-center justify-between gap-4 border-b border-zor-line pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zor-blue">
            {locale === "hr" ? "Procjena" : "Estimate"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-zor-blue-deep">
            {locale === "hr" ? "Mjesečna potrošnja" : "Monthly demand"}
          </h3>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zor-blue text-white">
          <Calculator aria-hidden size={23} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {rows.map(([label, value]) => (
          <div
            className="flex items-center justify-between rounded-2xl border border-zor-line bg-white px-4 py-3"
            key={label}
          >
            <span className="text-sm font-medium text-zor-muted">{label}</span>
            <span className="text-sm font-bold text-zor-blue-deep">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-zor-blue p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/75">
          {locale === "hr" ? "Prijedlog paketa" : "Suggested pack"}
        </p>
        <p className="mt-2 text-3xl font-semibold">
          {locale === "hr" ? "ZOR 36 Zaliha" : "ZOR 36 Supply"}
        </p>
        <p className="mt-2 text-sm leading-6 text-blue-50/78">
          {locale === "hr"
            ? "Manje prekida i praktičnija mjesečna zaliha."
            : "Fewer interruptions and more practical monthly stock."}
        </p>
      </div>
    </div>
  );
}

export function ProductionFlow({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-5">
      {steps.map((step, index) => (
        <article
          className="relative rounded-[1.65rem] border border-zor-line bg-white/90 p-5 shadow-zor-soft"
          key={step.title}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zor-blue-soft text-zor-blue">
              {index === 0 ? (
                <Warehouse aria-hidden size={22} />
              ) : index === 1 ? (
                <Factory aria-hidden size={22} />
              ) : index === 4 ? (
                <Package aria-hidden size={22} />
              ) : (
                <ClipboardList aria-hidden size={22} />
              )}
            </div>
            <span className="text-xs font-black text-zor-blue/45">0{index + 1}</span>
          </div>
          <h3 className="text-lg font-semibold text-zor-blue-deep">{step.title}</h3>
          <p className="mt-3 text-sm leading-6 text-zor-muted">{step.body}</p>
        </article>
      ))}
    </div>
  );
}

export function ProductionChecklist({ locale }: { locale: Locale }) {
  const items =
    locale === "hr"
      ? ["Hrvatska proizvodnja", "Robni terminali Jankomir", "Dostupnost prije obećanja", "Jednostavan dogovor"]
      : ["Croatian production", "Robni terminali Jankomir", "Availability before promises", "Simple coordination"];

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div className="rounded-[1.65rem] border border-zor-line bg-white/86 p-6 shadow-zor-soft" key={item}>
          <CheckCircle2 className="mb-5 text-zor-blue" aria-hidden size={24} />
          <p className="text-lg font-semibold text-zor-blue-deep">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function ArticleCards({ locale, limit }: { locale: Locale; limit?: number }) {
  const posts = getPosts(locale).slice(0, limit ?? 3);

  return (
    <div className="grid w-full gap-4">
      {posts.map((post) => (
        <Link
          className="group rounded-[1.65rem] border border-zor-line bg-white/88 p-6 shadow-zor-soft transition hover:-translate-y-0.5 hover:border-zor-blue/28"
          href={post.href}
          key={post.id}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zor-blue">
            {post.eyebrow[locale]}
          </p>
          <h3 className="mt-3 text-xl font-semibold leading-snug text-zor-blue-deep">
            {post.title[locale]}
          </h3>
          <p className="mt-3 text-sm leading-6 text-zor-muted">{post.excerpt[locale]}</p>
        </Link>
      ))}
    </div>
  );
}

export function ContactPanel({ locale }: { locale: Locale }) {
  const details = [
    {
      icon: Package,
      label: locale === "hr" ? "Brend" : "Brand",
      value: `${siteContact.brand} by ${siteContact.company}`,
    },
    {
      icon: MapPin,
      label: locale === "hr" ? "Lokacija" : "Location",
      value: siteContact.location,
    },
    {
      icon: Warehouse,
      label: locale === "hr" ? "Web trgovina" : "Shop",
      value: "shop.zorpro.hr coming soon",
    },
    {
      icon: Mail,
      label: "Email",
      value: siteContact.email,
    },
    {
      icon: Phone,
      label: locale === "hr" ? "Telefon" : "Phone",
      value: siteContact.phone,
    },
  ];

  return (
    <div className="w-full rounded-[2rem] border border-white/18 bg-white/10 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="grid gap-3">
        {details.map((detail) => {
          const Icon = detail.icon;
          return (
            <div className="flex items-center gap-4 rounded-[1.35rem] bg-white/10 p-4" key={detail.label}>
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-zor-blue">
                <Icon aria-hidden size={21} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100/70">
                  {detail.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{detail.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ButtonLink href={getWhatsAppHref(locale)} onDark>
          <MessageCircle aria-hidden size={16} />
          WhatsApp
        </ButtonLink>
        <ButtonLink href={routes[locale].contact} onDark variant="secondary">
          {locale === "hr" ? "Kontakt forma" : "Contact form"}
        </ButtonLink>
      </div>
    </div>
  );
}

export function CareersPanel({ locale }: { locale: Locale }) {
  const items =
    locale === "hr"
      ? ["Učenje na liniji", "Odgovoran radni ritam", "Robni terminali Jankomir"]
      : ["Line training", "Responsible work rhythm", "Robni terminali Jankomir"];

  return (
    <div className="grid w-full gap-4">
      {items.map((item, index) => (
        <div className="flex items-center gap-4 rounded-[1.65rem] border border-zor-line bg-white/86 p-5 shadow-zor-soft" key={item}>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zor-blue-soft text-zor-blue">
            {index === 2 ? <MapPin aria-hidden size={22} /> : <ClipboardList aria-hidden size={22} />}
          </div>
          <p className="text-lg font-semibold text-zor-blue-deep">{item}</p>
        </div>
      ))}
    </div>
  );
}
