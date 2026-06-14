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
  tone = "light",
}: {
  alt: string;
  priority?: boolean;
  src: string;
  tone?: VisualTone;
}) {
  return (
    <div
      className={cn(
        "relative h-[30svh] max-h-[25rem] min-h-48 w-full overflow-hidden rounded-[1.25rem] border sm:h-[42svh] lg:h-[64svh]",
        tone === "dark" ? "border-white/18 bg-white/10" : "border-white/70 bg-white shadow-zor-soft",
      )}
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 48vw, 100vw"
        src={src}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_48%,rgba(6,36,75,0.14))]" />
    </div>
  );
}

export function DeckCardGrid({
  columns = "two",
  iconSet = "audience",
  items,
  tone = "light",
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
        columns === "two" && "grid-cols-2",
        columns === "three" && "grid-cols-2 sm:grid-cols-3",
        columns === "four" && "grid-cols-2 xl:grid-cols-4",
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
                  "mb-4 grid h-10 w-10 place-items-center rounded-xl",
                  tone === "dark" ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
                )}
              >
                <Icon aria-hidden size={20} strokeWidth={2.15} />
              </div>
            ) : null}
            {item.meta ? (
              <p
                className={cn(
                  "mb-2 text-xs font-bold uppercase tracking-[0.18em]",
                  tone === "dark" ? "text-white/62" : "text-zor-blue",
                )}
              >
                {item.meta}
              </p>
            ) : null}
            <h3 className="text-base font-semibold leading-snug sm:text-lg">{item.title}</h3>
            {item.body ? (
              <p className={cn("mt-2 text-xs leading-5 sm:text-sm sm:leading-6", mutedClass(tone))}>{item.body}</p>
            ) : null}
          </>
        );
        const className = cn(
          "min-h-28 rounded-[1.25rem] p-4 transition sm:min-h-32 sm:p-5",
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
  tone = "light",
}: {
  count: string;
  label: string;
  price?: string;
  tone?: VisualTone;
}) {
  const rollCount = count.includes("36") ? 12 : 8;

  return (
    <div className={cn("w-full max-w-lg rounded-[1.5rem] p-5", panelClasses(tone))}>
      <div className="grid grid-cols-4 gap-2 rounded-[1.1rem] bg-white p-4">
        {Array.from({ length: rollCount }).map((_, index) => (
          <span
            className="aspect-square rounded-full bg-[radial-gradient(circle_at_48%_48%,#ffffff_0_24%,#d8e3ef_25%_36%,#ffffff_37%_100%)] shadow-inner"
            key={index}
          />
        ))}
      </div>
      <div className="mt-4 rounded-[1.1rem] bg-zor-blue p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">ZOR Professional</p>
        <h3 className="mt-2 text-3xl font-semibold">{label}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
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
  tone = "light",
}: {
  locale: Locale;
  products: Array<Product & { href: string }>;
  tone?: VisualTone;
}) {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {products.map((product) => (
        <Link
          className={cn("rounded-[1.25rem] p-4 transition hover:-translate-y-0.5", panelClasses(tone))}
          href={product.href}
          key={product.id}
        >
          <div className="grid grid-cols-4 gap-1 rounded-xl bg-white p-3">
            {Array.from({ length: product.id.includes("36") ? 12 : 8 }).map((_, index) => (
              <span
                className="aspect-square rounded-full bg-[radial-gradient(circle_at_48%_48%,#ffffff_0_24%,#d8e3ef_25%_36%,#ffffff_37%_100%)] shadow-inner"
                key={index}
              />
            ))}
          </div>
          <p
            className={cn(
              "mt-4 text-xs font-bold uppercase tracking-[0.18em]",
              tone === "dark" ? "text-white/62" : "text-zor-blue",
            )}
          >
            {product.eyebrow[locale]}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-tight sm:text-xl">{product.name[locale]}</h3>
          <p className={cn("mt-2 text-xs leading-5 sm:text-sm sm:leading-6", mutedClass(tone))}>
            {product.packCount[locale]} / {product.mockPrice[locale]}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function ProcessRail({
  activeIndex,
  steps,
  tone = "light",
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
            className="group flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/18 bg-white/10 p-5 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
            href={item.href}
            key={item.href}
          >
            <span className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-zor-blue">
                <Icon aria-hidden size={21} />
              </span>
              <span className="text-lg font-semibold">{item.label}</span>
            </span>
            <span aria-hidden className="text-xl transition group-hover:translate-x-0.5">
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
            className={cn("flex items-center gap-4 rounded-[1.25rem] p-4", panelClasses(tone))}
            key={detail.label}
          >
            <div
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                tone === "dark" ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
              )}
            >
              <Icon aria-hidden size={21} />
            </div>
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-[0.18em]", mutedClass(tone))}>
                {detail.label}
              </p>
              <p className="mt-1 text-sm font-semibold">{detail.value}</p>
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
  tone = "light",
}: {
  locale: Locale;
  posts: Array<BlogPost & { href: string }>;
  tone?: VisualTone;
}) {
  return (
    <div className="grid w-full gap-3">
      {posts.map((post) => (
        <Link
          className={cn("rounded-[1.25rem] p-5 transition hover:-translate-y-0.5", panelClasses(tone))}
          href={post.href}
          key={post.id}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-[0.18em]",
                tone === "dark" ? "text-white/62" : "text-zor-blue",
              )}
            >
              {post.eyebrow[locale]}
            </p>
            <Newspaper aria-hidden className={tone === "dark" ? "text-white/54" : "text-zor-blue"} size={18} />
          </div>
          <h3 className="text-xl font-semibold leading-snug">{post.title[locale]}</h3>
          <p className={cn("mt-2 text-sm leading-6", mutedClass(tone))}>{post.excerpt[locale]}</p>
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
    <div className={cn("w-full max-w-lg rounded-[1.5rem] p-6", panelClasses(tone))}>
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-xl",
          tone === "dark" ? "bg-white text-zor-blue" : "bg-zor-blue-soft text-zor-blue",
        )}
      >
        <MessageCircle aria-hidden size={23} />
      </div>
      <h3 className="mt-5 text-2xl font-semibold">
        {isHr ? "Jedna poruka je dovoljna za početak." : "One message is enough to start."}
      </h3>
      <p className={cn("mt-3 text-sm leading-6", mutedClass(tone))}>
        {isHr
          ? "Napišite prostor, okvirnu potrošnju i želite li ponudu za dom, firmu, apartman ili ustanovu."
          : "Send the space type, rough demand, and whether the offer is for a home, company, apartment, or institution."}
      </p>
      <ButtonLink className="mt-6 w-full" href={getWhatsAppHref(locale)} onDark={tone === "dark"}>
        WhatsApp
      </ButtonLink>
    </div>
  );
}
