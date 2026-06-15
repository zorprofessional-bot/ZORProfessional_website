import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Factory,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Newspaper,
  Package,
  Scissors,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { LogoMark } from "@/components/LogoMark";
import type { BlogPost } from "@/content/blog";
import type { Product } from "@/content/products";
import {
  getWhatsAppHref,
  routes,
  siteContact,
  type Locale,
} from "@/content/site";
import { cn } from "@/lib/utils";

type VisualTone = "light" | "dark";

type CardItem = {
  body?: string;
  href?: string;
  meta?: string;
  title: string;
};

const audienceIcons = [Home, Building2, Warehouse, Users];
const processIcons = [Factory, Warehouse, ClipboardList, Scissors, Package, Truck];
const processImagePositions = [
  "42% center",
  "52% center",
  "60% center",
  "70% center",
  "78% center",
];
const routeIcons = {
  products: Package,
  calculator: Calculator,
  careers: BriefcaseBusiness,
  contact: Mail,
};

function panelClasses(tone: VisualTone) {
  return cn(
    "border backdrop-blur",
    tone === "dark"
      ? "border-white/18 bg-white/10 text-white"
      : "border-[var(--deck-line)] bg-[var(--deck-panel)] text-zor-ink shadow-zor-soft",
  );
}

function mutedClass(tone: VisualTone) {
  return tone === "dark" ? "text-white/74" : "text-zor-muted";
}

export function ImagePanel({
  alt,
  priority = false,
  src,
}: {
  alt: string;
  priority?: boolean;
  src: string;
  tone?: VisualTone;
}) {
  return (
    <div className="relative h-[22svh] max-h-48 min-h-40 w-full overflow-hidden rounded-[1.25rem] sm:h-[42svh] sm:max-h-[25rem] lg:h-[64svh]">
      <Image
        alt={alt}
        className="object-cover"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 48vw, 100vw"
        src={src}
      />
    </div>
  );
}

export function DeckCardGrid({
  columns = "two",
  iconSet = "audience",
  items,
  tone = "dark",
}: {
  columns?: "two" | "three" | "four";
  iconSet?: "audience" | "process" | "none";
  items: CardItem[];
  tone?: VisualTone;
}) {
  return (
    <div
      className={cn(
        "grid w-full gap-3",
        columns === "two" && "grid-cols-1 sm:grid-cols-2",
        columns === "three" && "grid-cols-2 sm:grid-cols-3",
        columns === "four" && "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
      )}
    >
      {items.map((item, index) => {
        const Icon =
          iconSet === "audience"
            ? audienceIcons[index] ?? Users
            : iconSet === "process"
              ? processIcons[index] ?? CheckCircle2
              : CheckCircle2;
        const content = (
          <>
            {iconSet !== "none" ? (
              <div
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:mx-auto sm:mb-4",
                  tone === "dark" ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
                )}
              >
                <Icon aria-hidden size={20} strokeWidth={2.15} />
              </div>
            ) : null}
            <div className="min-w-0">
              {item.meta ? (
                <p
                  className={cn(
                    "mb-1 text-[10px] font-bold uppercase tracking-[0.16em] sm:mb-2 sm:text-xs sm:tracking-[0.18em]",
                    tone === "dark" ? "text-white/62" : "text-zor-blue",
                  )}
                >
                  {item.meta}
                </p>
              ) : null}
              <h3 className="text-sm font-semibold leading-snug sm:text-lg">{item.title}</h3>
              {item.body ? (
                <p className={cn("mt-1 text-xs leading-5 sm:mt-2 sm:text-sm sm:leading-6", mutedClass(tone))}>{item.body}</p>
              ) : null}
            </div>
          </>
        );
        const className = cn(
          "flex min-h-0 items-start gap-3 rounded-[1.25rem] p-3 transition sm:block sm:min-h-32 sm:p-5 sm:text-center",
          panelClasses(tone),
          item.href && "hover:-translate-y-0.5",
        );

        return item.href ? (
          <Link className={className} href={item.href} key={item.title}>
            {content}
          </Link>
        ) : (
          <article className={className} key={item.title}>
            {content}
          </article>
        );
      })}
    </div>
  );
}

export function ProductPackVisual({
  count,
  label,
  price,
  tone = "dark",
}: {
  count: string;
  label: string;
  price?: string;
  tone?: VisualTone;
}) {
  const rollCount = count.includes("36") ? 12 : 8;

  return (
    <div className={cn("flex w-full max-w-lg items-stretch gap-3 rounded-[1.5rem] p-3 sm:block sm:p-5", panelClasses(tone))}>
      <div className="grid w-24 shrink-0 grid-cols-4 gap-1 rounded-[1.1rem] bg-white p-3 sm:w-full sm:gap-2 sm:p-4">
        {Array.from({ length: rollCount }).map((_, index) => (
          <span
            className="aspect-square rounded-full bg-[radial-gradient(circle_at_48%_48%,#ffffff_0_24%,#d8e3ef_25%_36%,#ffffff_37%_100%)] shadow-inner"
            key={index}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1 rounded-[1.1rem] bg-zor-blue p-4 text-white sm:mt-4 sm:p-5 sm:text-center">
        <LogoMark
          className="h-10 w-10 rounded-xl shadow-sm ring-1 ring-inset ring-white/70 sm:mx-auto"
          imageClassName="p-0.5"
          sizes="2.5rem"
        />
        <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{label}</h3>
        <div className="mt-3 grid gap-1 sm:mt-4 sm:flex sm:items-center sm:justify-center sm:gap-3">
          <p className="text-sm font-bold">{count}</p>
          {price ? <p className="text-sm font-bold">{price}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function ProductCardsVisual({
  locale,
  products,
  tone = "dark",
}: {
  locale: Locale;
  products: Array<Product & { href: string }>;
  tone?: VisualTone;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
      {products.map((product) => (
        <Link
          className={cn("flex items-center gap-3 rounded-[1.25rem] p-3 transition hover:-translate-y-0.5 sm:block sm:p-4", panelClasses(tone))}
          href={product.href}
          key={product.id}
        >
          <div className="grid w-20 shrink-0 grid-cols-4 gap-1 rounded-xl bg-white p-2 sm:w-full sm:p-3">
            {Array.from({ length: product.id.includes("36") ? 12 : 8 }).map((_, index) => (
              <span
                className="aspect-square rounded-full bg-[radial-gradient(circle_at_48%_48%,#ffffff_0_24%,#d8e3ef_25%_36%,#ffffff_37%_100%)] shadow-inner"
                key={index}
              />
            ))}
          </div>
          <div className="min-w-0 sm:text-center">
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.16em] sm:mt-4 sm:text-xs sm:tracking-[0.18em]",
                tone === "dark" ? "text-white/62" : "text-zor-blue",
              )}
            >
              {product.eyebrow[locale]}
            </p>
            <h3 className="mt-1 text-base font-semibold leading-tight sm:mt-2 sm:text-xl">{product.name[locale]}</h3>
            <p className={cn("mt-1 text-xs leading-5 sm:mt-2 sm:text-sm sm:leading-6", mutedClass(tone))}>
              {product.packCount[locale]} / {product.mockPrice[locale]}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ProcessRail({
  activeIndex,
  steps,
  tone = "dark",
}: {
  activeIndex?: number;
  steps: CardItem[];
  tone?: VisualTone;
}) {
  return (
    <div className="grid w-full gap-3">
      {steps.map((step, index) => {
        const Icon = processIcons[index] ?? CheckCircle2;
        const active = activeIndex === undefined || activeIndex === index;

        return (
          <article
            className={cn(
              "flex items-center gap-4 rounded-[1.25rem] p-4",
              panelClasses(tone),
              !active && "opacity-60",
            )}
            key={step.title}
          >
            <div
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                tone === "dark" ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
              )}
            >
              <Icon aria-hidden size={21} />
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.18em]",
                  tone === "dark" ? "text-white/58" : "text-zor-blue",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              {step.body ? <p className={cn("mt-1 text-sm", mutedClass(tone))}>{step.body}</p> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ProcessStepVisual({
  step,
  stepIndex,
  totalSteps,
}: {
  step: CardItem;
  stepIndex: number;
  tone?: VisualTone;
  totalSteps: number;
}) {
  const Icon = processIcons[stepIndex] ?? CheckCircle2;
  const stepNumber = String(stepIndex + 1).padStart(2, "0");

  return (
    <figure className="w-full max-w-xl overflow-hidden rounded-[1.25rem]">
      <div className="relative h-[24svh] min-h-44 sm:h-[42svh] lg:h-[58svh]">
        <Image
          alt={step.title}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 42vw, 100vw"
          src="/visuals/production-line.png"
          style={{ objectPosition: processImagePositions[stepIndex] ?? "center" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(245,250,255,0.06)_0%,rgba(6,36,75,0.1)_46%,rgba(6,36,75,0.72)_100%)]" />
        <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-center gap-3 rounded-[1rem] border border-white/22 bg-white/92 p-3 text-zor-blue-deep shadow-zor-soft backdrop-blur">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-zor-blue text-white">
              <Icon aria-hidden size={21} />
            </div>
            <div className="min-w-0 sm:text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zor-blue">
                {stepNumber}/{String(totalSteps).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug sm:text-base">{step.title}</p>
            </div>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}

export function RouteChoiceGrid({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";
  const items = [
    {
      icon: routeIcons.products,
      label: isHr ? "Proizvodi" : "Products",
      href: routes[locale].products,
    },
    {
      icon: routeIcons.calculator,
      label: isHr ? "Kalkulator" : "Calculator",
      href: routes[locale].calculator,
    },
    {
      icon: routeIcons.careers,
      label: isHr ? "Karijere" : "Careers",
      href: routes[locale].careers,
    },
    {
      icon: routeIcons.contact,
      label: isHr ? "Kontakt" : "Contact",
      href: routes[locale].contact,
    },
  ];

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            className="group flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/18 bg-white/10 p-3 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 sm:justify-center sm:gap-4 sm:p-5"
            href={item.href}
            key={item.href}
          >
            <span className="flex items-center gap-3 sm:gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-zor-blue sm:h-11 sm:w-11">
                <Icon aria-hidden size={21} />
              </span>
              <span className="text-base font-semibold sm:text-lg">{item.label}</span>
            </span>
            <span aria-hidden className="text-xl transition group-hover:translate-x-0.5 sm:hidden">
              &gt;
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function ContactDetailsVisual({ locale, tone = "dark" }: { locale: Locale; tone?: VisualTone }) {
  const isHr = locale === "hr";
  const details = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: isHr ? "Najbrži upit za količine i dostupnost" : "Fastest inquiry for quantity and availability",
    },
    {
      icon: Mail,
      label: "Email",
      value: siteContact.email,
    },
    {
      icon: MapPin,
      label: isHr ? "Lokacija" : "Location",
      value: `${siteContact.location}, ${siteContact.city}`,
    },
    {
      icon: Package,
      label: isHr ? "Web trgovina" : "Shop",
      value: "shop.zorpro.hr soon",
    },
  ];

  return (
    <div className="grid w-full gap-3">
      {details.map((detail) => {
        const Icon = detail.icon;

        return (
          <div
            className={cn("flex items-center gap-3 rounded-[1.25rem] p-3 sm:gap-4 sm:p-4", panelClasses(tone))}
            key={detail.label}
          >
            <div
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11",
                tone === "dark" ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
              )}
            >
              <Icon aria-hidden size={21} />
            </div>
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-[0.18em]", mutedClass(tone))}>
                {detail.label}
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-snug sm:text-sm">{detail.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BlogCardsVisual({
  locale,
  posts,
  tone = "dark",
}: {
  locale: Locale;
  posts: Array<BlogPost & { href: string }>;
  tone?: VisualTone;
}) {
  return (
    <div className="grid w-full gap-3">
      {posts.map((post) => (
        <Link
          className={cn("rounded-[1.25rem] p-3 transition hover:-translate-y-0.5 sm:p-5 sm:text-center", panelClasses(tone))}
          href={post.href}
          key={post.id}
        >
          <div className="mb-3 flex items-center justify-between gap-3 sm:justify-center">
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-[0.18em]",
                tone === "dark" ? "text-white/62" : "text-zor-blue",
              )}
            >
              {post.eyebrow[locale]}
            </p>
            <Newspaper aria-hidden className={cn("sm:hidden", tone === "dark" ? "text-white/54" : "text-zor-blue")} size={18} />
          </div>
          <h3 className="text-base font-semibold leading-snug sm:text-xl">{post.title[locale]}</h3>
          <p className={cn("mt-2 hidden text-sm leading-6 sm:block", mutedClass(tone))}>{post.excerpt[locale]}</p>
        </Link>
      ))}
    </div>
  );
}

export function ArticleReader({
  body,
  date,
  locale,
  postTitle,
}: {
  body: string[];
  date: string;
  locale: Locale;
  postTitle: string;
}) {
  const formattedDate = new Intl.DateTimeFormat(locale === "hr" ? "hr-HR" : "en-US", {
    dateStyle: "medium",
  }).format(new Date(date));

  return (
    <article
      className="max-h-[54svh] w-full overflow-y-auto rounded-[1.25rem] border border-zor-line bg-white/90 p-6 text-zor-ink shadow-zor-soft md:max-h-[66svh]"
      data-deck-scroll
      tabIndex={0}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zor-blue">{formattedDate}</p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-zor-blue-deep">{postTitle}</h2>
      <div className="mt-5 space-y-4 text-base leading-7 text-zor-muted">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export function WhatsAppPanel({ locale, tone = "dark" }: { locale: Locale; tone?: VisualTone }) {
  const isHr = locale === "hr";

  return (
    <div className={cn("w-full max-w-lg rounded-[1.5rem] p-4 sm:p-6 sm:text-center", panelClasses(tone))}>
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-xl sm:mx-auto",
          tone === "dark" ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
        )}
      >
        <MessageCircle aria-hidden size={23} />
      </div>
      <h3 className="mt-4 text-xl font-semibold sm:mt-5 sm:text-2xl">
        {isHr ? "Jedna poruka je dovoljna za početak." : "One message is enough to start."}
      </h3>
      <p className={cn("mt-3 text-sm leading-6", mutedClass(tone))}>
        {isHr
          ? "Napišite prostor, okvirnu potrošnju i želite li ponudu za dom, firmu, apartman ili ustanovu."
          : "Send the space type, rough demand, and whether the offer is for a home, company, apartment, or institution."}
      </p>
      <ButtonLink className="mt-5 w-full sm:mt-6" href={getWhatsAppHref(locale)} onDark={tone === "dark"}>
        WhatsApp
      </ButtonLink>
    </div>
  );
}
