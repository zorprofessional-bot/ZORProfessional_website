"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Archive,
  BriefcaseBusiness,
  Copy,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  PanelsTopLeft,
  Plus,
  Save,
  Search,
  Settings,
  SquarePen,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database, Json } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Tables = Database["public"]["Tables"];
type Chapter = Tables["deck_chapters"]["Row"];
type Slide = Tables["deck_slides"]["Row"];
type Product = Tables["products"]["Row"];
type BlogPost = Tables["blog_posts"]["Row"];
type Lead = Tables["leads"]["Row"];
type CareerPosition = Tables["career_positions"]["Row"];
type CareerApplication = Tables["career_applications"]["Row"];
type SiteSetting = Tables["site_settings"]["Row"];
type Role = "admin" | "editor" | "viewer";
type Locale = "hr" | "en";
type Section =
  | "dashboard"
  | "chapters"
  | "slides"
  | "products"
  | "blog"
  | "leads"
  | "positions"
  | "applications"
  | "settings";

type AdminPanelProps = {
  initialEmail: string;
  initialName: string | null;
  initialRole: Role | null;
};

const sections: Array<{ id: Section; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chapters", label: "Deck Chapters", icon: PanelsTopLeft },
  { id: "slides", label: "Deck Slides", icon: SquarePen },
  { id: "products", label: "Products", icon: Package },
  { id: "blog", label: "Blog Posts", icon: FileText },
  { id: "leads", label: "Leads", icon: MessageSquare },
  { id: "positions", label: "Career Positions", icon: BriefcaseBusiness },
  { id: "applications", label: "Applications", icon: Users },
  { id: "settings", label: "Site Settings", icon: Settings },
];

const localeOptions: Locale[] = ["hr", "en"];
const chapterThemes = [
  "dark-premium-blue",
  "light-product-blue",
  "industrial-neutral",
  "practical-blue",
  "editorial-white",
  "energetic-dark-blue",
  "contact-blue",
];
const backgrounds = ["theme", "light", "soft", "dark", "steel", "editorial"];
const layouts = ["split", "splitReverse", "center", "visualFirst", "dense"];
const alignments = ["center", "left"];
const productStatuses = ["draft", "published"];
const blogStatuses = ["draft", "published"];
const leadTypes = ["contact", "product", "calculator", "career"];
const leadStatuses = ["new", "contacted", "won", "lost", "archived"];
const positionStatuses = ["draft", "published", "archived"];
const applicationStatuses = ["new", "reviewed", "contacted", "rejected", "archived"];

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNullableText(value: unknown) {
  const text = asText(value).trim();
  return text ? text : null;
}

function asNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asNullableNumber(value: unknown) {
  const text = asText(value).trim();
  if (!text) {
    return null;
  }

  const number = Number(text.replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function asBoolean(value: unknown) {
  return value === "on" || value === true;
}

function parseSettingValue(value: string): Json {
  try {
    return JSON.parse(value) as Json;
  } catch {
    return value;
  }
}

function settingValueToText(value: Json) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function statusTone(status: string) {
  if (["published", "won", "contacted", "reviewed"].includes(status)) {
    return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  }

  if (["new"].includes(status)) {
    return "bg-sky-50 text-sky-800 ring-sky-200";
  }

  if (["draft"].includes(status)) {
    return "bg-slate-50 text-slate-700 ring-slate-200";
  }

  if (["lost", "rejected", "archived"].includes(status)) {
    return "bg-zinc-100 text-zinc-700 ring-zinc-200";
  }

  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function getChapterName(chapters: Chapter[], id: string | null) {
  if (!id) {
    return "Bez poglavlja";
  }

  const chapter = chapters.find((item) => item.id === id);
  return chapter ? `${chapter.label} (${chapter.locale})` : id;
}

function getPositionName(positions: CareerPosition[], id: string | null) {
  if (!id) {
    return "Otvorena prijava";
  }

  const position = positions.find((item) => item.id === id);
  return position ? position.title_hr : id;
}

function jsonPreview(value: Json | null) {
  if (!value) {
    return "Nema podataka.";
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    if (entries.length > 0) {
      return entries
        .map(([key, item]) => `${key}: ${String(item)}`)
        .join("\n");
    }
  }

  return JSON.stringify(value, null, 2);
}

function Badge({ children, value }: { children?: React.ReactNode; value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
        statusTone(value),
      )}
    >
      {children ?? value}
    </span>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-zor-line bg-white p-4 shadow-sm", className)}>
      {children}
    </section>
  );
}

function SectionHeader({
  action,
  children,
  description,
  title,
}: {
  action?: React.ReactNode;
  children?: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 border-b border-zor-line pb-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-zor-blue-deep">{title}</h2>
        {description ? <p className="mt-1 max-w-3xl text-sm leading-6 text-zor-muted">{description}</p> : null}
        {children}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function AdminButton({
  children,
  disabled,
  onClick,
  tone = "primary",
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  tone?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        tone === "primary" && "bg-zor-blue text-white hover:bg-zor-blue-deep",
        tone === "secondary" && "border border-zor-line bg-white text-zor-blue hover:bg-zor-blue-soft",
        tone === "danger" && "bg-red-600 text-white hover:bg-red-700",
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function Field({
  defaultValue,
  label,
  name,
  required,
  type = "text",
}: {
  defaultValue?: string | number | null;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-zor-blue-deep">{label}</span>
      <input
        className="h-10 rounded-xl border border-zor-line px-3 text-sm outline-none focus:border-zor-blue"
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function TextArea({
  defaultValue,
  label,
  name,
  rows = 4,
}: {
  defaultValue?: string | null;
  label: string;
  name: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-zor-blue-deep">{label}</span>
      <textarea
        className="rounded-xl border border-zor-line px-3 py-2 text-sm leading-6 outline-none focus:border-zor-blue"
        defaultValue={defaultValue ?? ""}
        name={name}
        rows={rows}
      />
    </label>
  );
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue?: string | null;
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-zor-blue-deep">{label}</span>
      <select
        className="h-10 rounded-xl border border-zor-line bg-white px-3 text-sm outline-none focus:border-zor-blue"
        defaultValue={defaultValue ?? options[0]}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  defaultChecked,
  label,
  name,
}: {
  defaultChecked?: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="flex min-h-10 items-center gap-3 rounded-xl border border-zor-line px-3 text-sm font-bold text-zor-blue-deep">
      <input className="h-4 w-4 accent-zor-blue" defaultChecked={defaultChecked} name={name} type="checkbox" />
      {label}
    </label>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-xl bg-zor-blue-soft p-4 text-sm font-semibold text-zor-blue">{text}</p>;
}

function LoadingState({ loading }: { loading: boolean }) {
  if (!loading) {
    return null;
  }

  return <p className="rounded-xl bg-white p-4 text-sm font-semibold text-zor-blue shadow-sm">Ucitavam admin podatke...</p>;
}

export function AdminPanel({ initialEmail, initialName, initialRole }: AdminPanelProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [role, setRole] = useState<Role | null>(initialRole);
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [settingsRows, setSettingsRows] = useState<SiteSetting[]>([]);

  const [chapterLocale, setChapterLocale] = useState<"all" | Locale>("all");
  const [slideLocale, setSlideLocale] = useState<"all" | Locale>("all");
  const [slideChapter, setSlideChapter] = useState("all");
  const [blogLocale, setBlogLocale] = useState<"all" | Locale>("all");
  const [blogStatus, setBlogStatus] = useState("all");
  const [leadType, setLeadType] = useState("all");
  const [leadStatus, setLeadStatus] = useState("new");
  const [leadSearch, setLeadSearch] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("new");
  const [applicationPosition, setApplicationPosition] = useState("all");

  const [chapterDraft, setChapterDraft] = useState<Partial<Chapter> | null>(null);
  const [slideDraft, setSlideDraft] = useState<Partial<Slide> | null>(null);
  const [productDraft, setProductDraft] = useState<Partial<Product> | null>(null);
  const [postDraft, setPostDraft] = useState<Partial<BlogPost> | null>(null);
  const [positionDraft, setPositionDraft] = useState<Partial<CareerPosition> | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);

  const canEdit = role === "admin" || role === "editor";
  const canManageSettings = role === "admin";

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3200);
  }, []);

  const loadData = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError("Supabase nije konfiguriran.");
      return;
    }

    setLoading(true);
    setError(null);

    const [
      userResult,
      chaptersResult,
      slidesResult,
      productsResult,
      postsResult,
      leadsResult,
      positionsResult,
      applicationsResult,
      settingsResult,
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("deck_chapters").select("*").order("locale").order("sort_order"),
      supabase.from("deck_slides").select("*").order("locale").order("sort_order"),
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("blog_posts").select("*").order("locale").order("published_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(250),
      supabase.from("career_positions").select("*").order("sort_order"),
      supabase.from("career_applications").select("*").order("created_at", { ascending: false }).limit(250),
      supabase.from("site_settings").select("*").order("key"),
    ]);

    const user = userResult.data.user;
    if (user) {
      setEmail(user.email ?? initialEmail);
      const { data: profile } = await supabase
        .from("profiles")
        .select("email,full_name,role")
        .eq("id", user.id)
        .maybeSingle();
      setRole(profile?.role ?? initialRole);
      setName(profile?.full_name ?? initialName);
    }

    const queryError =
      chaptersResult.error ??
      slidesResult.error ??
      productsResult.error ??
      postsResult.error ??
      leadsResult.error ??
      positionsResult.error ??
      applicationsResult.error ??
      settingsResult.error;

    if (queryError) {
      setError(queryError.message);
    }

    setChapters(chaptersResult.data ?? []);
    setSlides(slidesResult.data ?? []);
    setProducts(productsResult.data ?? []);
    setPosts(postsResult.data ?? []);
    setLeads(leadsResult.data ?? []);
    setPositions(positionsResult.data ?? []);
    setApplications(applicationsResult.data ?? []);
    setSettingsRows(settingsResult.data ?? []);
    setLoading(false);
  }, [initialEmail, initialName, initialRole, supabase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadData]);

  const dashboardStats = useMemo(
    () => ({
      calculatorLeads: leads.filter((lead) => lead.type === "calculator").length,
      careerApplications: applications.filter((application) => application.status === "new").length,
      newLeads: leads.filter((lead) => lead.status === "new").length,
      publishedPosts: posts.filter((post) => post.status === "published").length,
      publishedProducts: products.filter((product) => product.status === "published").length,
    }),
    [applications, leads, posts, products],
  );

  const filteredChapters = chapters.filter((chapter) => chapterLocale === "all" || chapter.locale === chapterLocale);
  const filteredSlides = slides.filter(
    (slide) =>
      (slideLocale === "all" || slide.locale === slideLocale) &&
      (slideChapter === "all" || slide.chapter_id === slideChapter),
  );
  const filteredPosts = posts.filter(
    (post) =>
      (blogLocale === "all" || post.locale === blogLocale) &&
      (blogStatus === "all" || post.status === blogStatus),
  );
  const filteredLeads = leads.filter((lead) => {
    const haystack = [lead.name, lead.company, lead.email, lead.phone].join(" ").toLowerCase();
    return (
      (leadType === "all" || lead.type === leadType) &&
      (leadStatus === "all" || lead.status === leadStatus) &&
      (!leadSearch || haystack.includes(leadSearch.toLowerCase()))
    );
  });
  const filteredApplications = applications.filter(
    (application) =>
      (applicationStatus === "all" || application.status === applicationStatus) &&
      (applicationPosition === "all" || application.position_id === applicationPosition),
  );

  async function saveChapter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !canEdit || !chapterDraft) {
      return;
    }

    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      background_variant: asNullableText(form.get("background_variant")),
      is_active: asBoolean(form.get("is_active")),
      label: asText(form.get("label")),
      locale: asText(form.get("locale")) as Locale,
      nav_label: asNullableText(form.get("nav_label")),
      route_path: asText(form.get("route_path")),
      slug: asText(form.get("slug")),
      sort_order: asNumber(form.get("sort_order")),
      theme: asNullableText(form.get("theme")),
    };
    const result = chapterDraft.id
      ? await supabase.from("deck_chapters").update(payload).eq("id", chapterDraft.id)
      : await supabase.from("deck_chapters").insert(payload);
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setChapterDraft(null);
    showNotice("Poglavlje je spremljeno.");
    await loadData();
  }

  async function saveSlide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !canEdit || !slideDraft) {
      return;
    }

    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      background_variant: asNullableText(form.get("background_variant")),
      body: asNullableText(form.get("body")),
      chapter_id: asText(form.get("chapter_id")),
      content_alignment: asNullableText(form.get("content_alignment")),
      eyebrow: asNullableText(form.get("eyebrow")),
      image_url: asNullableText(form.get("image_url")),
      is_active: asBoolean(form.get("is_active")),
      layout_variant: asNullableText(form.get("layout_variant")),
      locale: asText(form.get("locale")) as Locale,
      primary_cta_href: asNullableText(form.get("primary_cta_href")),
      primary_cta_label: asNullableText(form.get("primary_cta_label")),
      secondary_cta_href: asNullableText(form.get("secondary_cta_href")),
      secondary_cta_label: asNullableText(form.get("secondary_cta_label")),
      slide_key: asText(form.get("slide_key")),
      sort_order: asNumber(form.get("sort_order")),
      title: asText(form.get("title")),
      visual_type: asNullableText(form.get("visual_type")),
    };
    const result = slideDraft.id
      ? await supabase.from("deck_slides").update(payload).eq("id", slideDraft.id)
      : await supabase.from("deck_slides").insert(payload);
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setSlideDraft(null);
    showNotice("Slide je spremljen.");
    await loadData();
  }

  async function duplicateSlide(slide: Slide) {
    if (!supabase || !canEdit) {
      return;
    }

    const result = await supabase.from("deck_slides").insert({
      background_variant: slide.background_variant,
      body: slide.body,
      chapter_id: slide.chapter_id,
      content_alignment: slide.content_alignment,
      eyebrow: slide.eyebrow,
      image_url: slide.image_url,
      is_active: false,
      layout_variant: slide.layout_variant,
      locale: slide.locale,
      primary_cta_href: slide.primary_cta_href,
      primary_cta_label: slide.primary_cta_label,
      secondary_cta_href: slide.secondary_cta_href,
      secondary_cta_label: slide.secondary_cta_label,
      slide_key: `${slide.slide_key}-copy`,
      sort_order: slide.sort_order + 1,
      title: `${slide.title} copy`,
      visual_type: slide.visual_type,
    });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    showNotice("Slide je dupliciran kao inactive copy.");
    await loadData();
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !canEdit || !productDraft) {
      return;
    }

    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      business_note_en: asNullableText(form.get("business_note_en")),
      business_note_hr: asNullableText(form.get("business_note_hr")),
      description_en: asNullableText(form.get("description_en")),
      description_hr: asNullableText(form.get("description_hr")),
      image_url: asNullableText(form.get("image_url")),
      layers: asNullableNumber(form.get("layers")),
      name_en: asText(form.get("name_en")),
      name_hr: asText(form.get("name_hr")),
      package_size: asNullableText(form.get("package_size")),
      price_eur: asNullableNumber(form.get("price_eur")),
      recommended_for_en: asNullableText(form.get("recommended_for_en")),
      recommended_for_hr: asNullableText(form.get("recommended_for_hr")),
      roll_count: asNullableNumber(form.get("roll_count")),
      short_description_en: asNullableText(form.get("short_description_en")),
      short_description_hr: asNullableText(form.get("short_description_hr")),
      slug: asText(form.get("slug")),
      sort_order: asNumber(form.get("sort_order")),
      status: asText(form.get("status")) as "draft" | "published",
    };
    const result = productDraft.id
      ? await supabase.from("products").update(payload).eq("id", productDraft.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setProductDraft(null);
    showNotice("Proizvod je spremljen.");
    await loadData();
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !canEdit || !postDraft) {
      return;
    }

    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      content: asNullableText(form.get("content")),
      cover_image_url: asNullableText(form.get("cover_image_url")),
      excerpt: asNullableText(form.get("excerpt")),
      locale: asText(form.get("locale")) as Locale,
      published_at: asNullableText(form.get("published_at")),
      seo_description: asNullableText(form.get("seo_description")),
      seo_title: asNullableText(form.get("seo_title")),
      slug: asText(form.get("slug")),
      status: asText(form.get("status")) as "draft" | "published",
      title: asText(form.get("title")),
    };
    const result = postDraft.id
      ? await supabase.from("blog_posts").update(payload).eq("id", postDraft.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setPostDraft(null);
    showNotice("Blog post je spremljen.");
    await loadData();
  }

  async function savePosition(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !canEdit || !positionDraft) {
      return;
    }

    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      description_en: asNullableText(form.get("description_en")),
      description_hr: asNullableText(form.get("description_hr")),
      employment_type: asNullableText(form.get("employment_type")),
      location: asNullableText(form.get("location")),
      requirements_en: asNullableText(form.get("requirements_en")),
      requirements_hr: asNullableText(form.get("requirements_hr")),
      sort_order: asNumber(form.get("sort_order")),
      status: asText(form.get("status")) as "draft" | "published" | "archived",
      title_en: asText(form.get("title_en")),
      title_hr: asText(form.get("title_hr")),
    };
    const result = positionDraft.id
      ? await supabase.from("career_positions").update(payload).eq("id", positionDraft.id)
      : await supabase.from("career_positions").insert(payload);
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setPositionDraft(null);
    showNotice("Pozicija je spremljena.");
    await loadData();
  }

  async function updateLeadStatus(id: string, status: Lead["status"]) {
    if (!supabase || !canEdit) {
      return;
    }

    const { error: updateError } = await supabase.from("leads").update({ status }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    showNotice("Lead status je promijenjen.");
    await loadData();
  }

  async function updateApplicationStatus(id: string, status: CareerApplication["status"]) {
    if (!supabase || !canEdit) {
      return;
    }

    const { error: updateError } = await supabase.from("career_applications").update({ status }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    showNotice("Status prijave je promijenjen.");
    await loadData();
  }

  async function deleteRow(table: "deck_slides" | "products", id: string) {
    if (!supabase || !canEdit) {
      return;
    }

    const confirmed = window.confirm("Obrisati zapis? Ovo radi samo ako je stvarno sigurno.");
    if (!confirmed) {
      return;
    }

    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    showNotice("Zapis je obrisan.");
    await loadData();
  }

  async function saveSetting(event: FormEvent<HTMLFormElement>, setting: SiteSetting) {
    event.preventDefault();
    if (!supabase || !canManageSettings) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const value = parseSettingValue(asText(form.get("value")));
    const { error: updateError } = await supabase.from("site_settings").update({ value }).eq("id", setting.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    showNotice("Postavka je spremljena.");
    await loadData();
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (!supabase) {
    return (
      <main className="grid h-[100svh] place-items-center overflow-y-auto bg-zor-paper p-6">
        <Panel className="max-w-xl">
          <h1 className="text-2xl font-semibold text-zor-blue-deep">Admin nije konfiguriran</h1>
          <p className="mt-3 text-sm leading-6 text-zor-muted">
            Postavi `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_ANON_KEY`, zatim redeployaj aplikaciju.
          </p>
        </Panel>
      </main>
    );
  }

  return (
    <div className="h-[100svh] overflow-y-auto bg-zor-paper text-zor-ink" data-admin-root>
      <div className="grid min-h-full lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="border-b border-zor-line bg-zor-blue-deep p-4 text-white lg:sticky lg:top-0 lg:h-[100svh] lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/58">ZOR Professional</p>
              <h1 className="mt-1 text-xl font-semibold">Admin</h1>
            </div>
            <Badge value={role ?? "viewer"} />
          </div>
          <div className="mt-4 rounded-xl border border-white/12 bg-white/8 p-3 text-sm leading-6 text-white/78">
            <p className="font-semibold text-white">{name ?? email}</p>
            <p className="truncate">{email}</p>
          </div>
          <nav className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
            {sections.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeSection;

              return (
                <button
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition",
                    active ? "bg-white text-zor-blue-deep" : "text-white/72 hover:bg-white/10 hover:text-white",
                  )}
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  type="button"
                >
                  <Icon aria-hidden size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <button
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/18 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            onClick={signOut}
            type="button"
          >
            <LogOut aria-hidden size={17} />
            Logout
          </button>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {notice ? (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {notice}
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              <span>{error}</span>
              <button onClick={() => setError(null)} type="button">
                <X aria-hidden size={18} />
              </button>
            </div>
          ) : null}
          {!role ? (
            <Panel>
              <h2 className="text-2xl font-semibold text-zor-blue-deep">Nema admin profila</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zor-muted">
                User je loginan, ali nema `profiles` red s rolom. U Supabaseu dodaj profil za ovaj email i rolom
                `admin`, `editor` ili `viewer`.
              </p>
            </Panel>
          ) : null}
          {role === "viewer" ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
              Viewer mode: mozes pregledavati podatke, ali spremanje i brisanje je onemoguceno.
            </div>
          ) : null}
          <LoadingState loading={loading} />
          {!loading && activeSection === "dashboard" ? renderDashboard() : null}
          {!loading && activeSection === "chapters" ? renderChapters() : null}
          {!loading && activeSection === "slides" ? renderSlides() : null}
          {!loading && activeSection === "products" ? renderProducts() : null}
          {!loading && activeSection === "blog" ? renderBlog() : null}
          {!loading && activeSection === "leads" ? renderLeads() : null}
          {!loading && activeSection === "positions" ? renderPositions() : null}
          {!loading && activeSection === "applications" ? renderApplications() : null}
          {!loading && activeSection === "settings" ? renderSettings() : null}
        </main>
      </div>
    </div>
  );

  function renderDashboard() {
    const cards = [
      { label: "New leads", value: dashboardStats.newLeads, section: "leads" as Section },
      { label: "Calculator leads", value: dashboardStats.calculatorLeads, section: "leads" as Section },
      { label: "New career applications", value: dashboardStats.careerApplications, section: "applications" as Section },
      { label: "Published products", value: dashboardStats.publishedProducts, section: "products" as Section },
      { label: "Published blog posts", value: dashboardStats.publishedPosts, section: "blog" as Section },
    ];

    return (
      <div className="grid gap-4">
        <SectionHeader
          description="Brzi pregled upita i contenta. Bez grafova i buke, samo stvari koje treba pratiti."
          title="Dashboard"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <button
              className="rounded-2xl border border-zor-line bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-zor-soft"
              key={card.label}
              onClick={() => setActiveSection(card.section)}
              type="button"
            >
              <p className="text-sm font-bold text-zor-muted">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold text-zor-blue-deep">{card.value}</p>
            </button>
          ))}
        </div>
        <Panel>
          <h3 className="text-lg font-semibold text-zor-blue-deep">Quick links</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              ["Products", "products"],
              ["Deck Slides", "slides"],
              ["Leads", "leads"],
              ["Careers", "positions"],
            ].map(([label, section]) => (
              <AdminButton key={section} onClick={() => setActiveSection(section as Section)} tone="secondary">
                {label}
              </AdminButton>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  function renderChapters() {
    return (
      <Panel>
        <SectionHeader
          action={
            <AdminButton
              disabled={!canEdit}
              onClick={() =>
                setChapterDraft({
                  background_variant: "theme",
                  is_active: true,
                  locale: "hr",
                  sort_order: chapters.length + 1,
                  theme: "dark-premium-blue",
                })
              }
            >
              <Plus aria-hidden size={16} />
              New chapter
            </AdminButton>
          }
          description="Poglavlja su glavne navigacijske stavke kao Home, Proizvodi, Proizvodnja, Kalkulator, Blog, Karijere i Kontakt."
          title="Deck Chapters"
        >
          <div className="mt-3 flex flex-wrap gap-2">
            {(["all", ...localeOptions] as Array<"all" | Locale>).map((locale) => (
              <AdminButton key={locale} onClick={() => setChapterLocale(locale)} tone={chapterLocale === locale ? "primary" : "secondary"}>
                {locale.toUpperCase()}
              </AdminButton>
            ))}
          </div>
        </SectionHeader>
        {chapterDraft ? renderChapterForm() : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-zor-muted">
              <tr>
                <th className="p-3">Locale</th>
                <th className="p-3">Label</th>
                <th className="p-3">Route</th>
                <th className="p-3">Theme</th>
                <th className="p-3">Order</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChapters.map((chapter) => (
                <tr className="border-t border-zor-line" key={chapter.id}>
                  <td className="p-3 font-bold">{chapter.locale.toUpperCase()}</td>
                  <td className="p-3">
                    <p className="font-semibold text-zor-blue-deep">{chapter.label}</p>
                    <p className="text-xs text-zor-muted">{chapter.slug}</p>
                  </td>
                  <td className="p-3">{chapter.route_path}</td>
                  <td className="p-3">{chapter.theme ?? "-"}</td>
                  <td className="p-3">{chapter.sort_order}</td>
                  <td className="p-3"><Badge value={chapter.is_active ? "published" : "draft"}>{chapter.is_active ? "active" : "inactive"}</Badge></td>
                  <td className="p-3">
                    <AdminButton disabled={!canEdit} onClick={() => setChapterDraft(chapter)} tone="secondary">
                      Edit
                    </AdminButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    );
  }

  function renderChapterForm() {
    if (!chapterDraft) {
      return null;
    }

    return (
      <form className="mb-5 grid gap-4 rounded-2xl border border-zor-line bg-zor-paper p-4" onSubmit={saveChapter}>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField defaultValue={chapterDraft.locale} label="Locale" name="locale" options={localeOptions} />
          <Field defaultValue={chapterDraft.slug} label="Slug" name="slug" required />
          <Field defaultValue={chapterDraft.label} label="Label" name="label" required />
          <Field defaultValue={chapterDraft.nav_label} label="Nav label" name="nav_label" />
          <Field defaultValue={chapterDraft.route_path} label="Route path" name="route_path" required />
          <SelectField defaultValue={chapterDraft.theme} label="Theme" name="theme" options={chapterThemes} />
          <SelectField defaultValue={chapterDraft.background_variant} label="Background" name="background_variant" options={backgrounds} />
          <Field defaultValue={chapterDraft.sort_order} label="Sort order" name="sort_order" type="number" />
          <ToggleField defaultChecked={chapterDraft.is_active ?? true} label="Active" name="is_active" />
        </div>
        {renderFormActions(() => setChapterDraft(null))}
      </form>
    );
  }

  function renderSlides() {
    return (
      <Panel>
        <SectionHeader
          action={
            <AdminButton
              disabled={!canEdit || chapters.length === 0}
              onClick={() =>
                setSlideDraft({
                  background_variant: "theme",
                  chapter_id: chapters[0]?.id,
                  content_alignment: "center",
                  is_active: true,
                  layout_variant: "split",
                  locale: chapters[0]?.locale ?? "hr",
                  sort_order: slides.length + 1,
                })
              }
            >
              <Plus aria-hidden size={16} />
              New slide
            </AdminButton>
          }
          description="Javni web je prezentacija bez skrolanja. Svaki slajd treba imati jednu jasnu poruku i kratak tekst. Za duži tekst koristite blog."
          title="Deck Slides"
        >
          <div className="mt-3 flex flex-wrap gap-2">
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setSlideLocale(event.target.value as "all" | Locale)} value={slideLocale}>
              <option value="all">All locales</option>
              <option value="hr">HR</option>
              <option value="en">EN</option>
            </select>
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setSlideChapter(event.target.value)} value={slideChapter}>
              <option value="all">All chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.label} ({chapter.locale})
                </option>
              ))}
            </select>
          </div>
        </SectionHeader>
        {slideDraft ? renderSlideForm() : null}
        <div className="grid gap-3">
          {filteredSlides.map((slide) => {
            const canDelete = slides.filter((item) => item.chapter_id === slide.chapter_id).length > 1;
            return (
              <article className="rounded-xl border border-zor-line p-4" key={slide.id}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge value={slide.is_active ? "published" : "draft"}>{slide.is_active ? "active" : "inactive"}</Badge>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-zor-muted">{slide.locale}</span>
                      <span className="text-xs font-semibold text-zor-muted">{getChapterName(chapters, slide.chapter_id)}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-zor-blue-deep">{slide.title}</h3>
                    <p className="mt-1 text-sm text-zor-muted">{slide.slide_key}</p>
                    {slide.body ? <p className="mt-2 max-w-3xl text-sm leading-6 text-zor-muted">{slide.body}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AdminButton disabled={!canEdit} onClick={() => setSlideDraft(slide)} tone="secondary">Edit</AdminButton>
                    <AdminButton disabled={!canEdit} onClick={() => duplicateSlide(slide)} tone="secondary"><Copy aria-hidden size={15} /> Duplicate</AdminButton>
                    <AdminButton disabled={!canEdit || !canDelete} onClick={() => deleteRow("deck_slides", slide.id)} tone="danger"><Trash2 aria-hidden size={15} /> Delete</AdminButton>
                  </div>
                </div>
              </article>
            );
          })}
          {filteredSlides.length === 0 ? <EmptyState text="Nema slideova za odabrani filter." /> : null}
        </div>
      </Panel>
    );
  }

  function renderSlideForm() {
    if (!slideDraft) {
      return null;
    }

    const titleLength = slideDraft.title?.length ?? 0;
    const bodyLength = slideDraft.body?.length ?? 0;

    return (
      <form className="mb-5 grid gap-4 rounded-2xl border border-zor-line bg-zor-paper p-4" onSubmit={saveSlide}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField defaultValue={slideDraft.locale} label="Locale" name="locale" options={localeOptions} />
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-zor-blue-deep">Chapter</span>
                <select className="h-10 rounded-xl border border-zor-line bg-white px-3 text-sm outline-none focus:border-zor-blue" defaultValue={slideDraft.chapter_id} name="chapter_id">
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.label} ({chapter.locale})
                    </option>
                  ))}
                </select>
              </label>
              <Field defaultValue={slideDraft.slide_key} label="Slide key" name="slide_key" required />
              <Field defaultValue={slideDraft.eyebrow} label="Eyebrow" name="eyebrow" />
              <Field defaultValue={slideDraft.title} label="Title" name="title" required />
              <Field defaultValue={slideDraft.sort_order} label="Sort order" name="sort_order" type="number" />
            </div>
            <TextArea defaultValue={slideDraft.body} label="Body" name="body" rows={4} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field defaultValue={slideDraft.primary_cta_label} label="Primary CTA label" name="primary_cta_label" />
              <Field defaultValue={slideDraft.primary_cta_href} label="Primary CTA href" name="primary_cta_href" />
              <Field defaultValue={slideDraft.secondary_cta_label} label="Secondary CTA label" name="secondary_cta_label" />
              <Field defaultValue={slideDraft.secondary_cta_href} label="Secondary CTA href" name="secondary_cta_href" />
              <Field defaultValue={slideDraft.visual_type} label="Visual type" name="visual_type" />
              <Field defaultValue={slideDraft.image_url} label="Image URL" name="image_url" />
              <SelectField defaultValue={slideDraft.background_variant} label="Background" name="background_variant" options={backgrounds} />
              <SelectField defaultValue={slideDraft.layout_variant} label="Layout" name="layout_variant" options={layouts} />
              <SelectField defaultValue={slideDraft.content_alignment} label="Alignment" name="content_alignment" options={alignments} />
              <ToggleField defaultChecked={slideDraft.is_active ?? true} label="Active" name="is_active" />
            </div>
            <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              Title preporuka: ispod 70 znakova. Body preporuka: ispod 220 znakova. Upload UI za bucket
              `deck-images` je dokumentiran kao TODO; zasad zalijepi `image_url`.
            </p>
            {renderFormActions(() => setSlideDraft(null))}
          </div>
          <div className="rounded-2xl border border-zor-line bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zor-blue">Preview</p>
            <div className="mt-3 rounded-2xl bg-[linear-gradient(135deg,#061a3d,#0b3b75)] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/64">{slideDraft.eyebrow || "Eyebrow"}</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight">{slideDraft.title || "Slide title"}</h3>
              <p className="mt-3 text-sm leading-6 text-white/78">{slideDraft.body || "Short slide body goes here."}</p>
            </div>
            <div className="mt-3 grid gap-2 text-xs font-semibold">
              <p className={titleLength > 70 ? "text-amber-700" : "text-zor-muted"}>Title: {titleLength}/70</p>
              <p className={bodyLength > 220 ? "text-amber-700" : "text-zor-muted"}>Body: {bodyLength}/220</p>
            </div>
          </div>
        </div>
      </form>
    );
  }

  function renderProducts() {
    return (
      <Panel>
        <SectionHeader
          action={<AdminButton disabled={!canEdit} onClick={() => setProductDraft({ status: "draft", sort_order: products.length + 1 })}><Plus aria-hidden size={16} /> New product</AdminButton>}
          description="Cijena je javna i prikazuje se po paketu. Za firme, apartmane i redovite mjesečne količine koristi se posebna napomena za ponudu."
          title="Products"
        />
        {productDraft ? renderProductForm() : null}
        <div className="grid gap-3">
          {products.map((product) => (
            <article className="flex flex-col gap-3 rounded-xl border border-zor-line p-4 lg:flex-row lg:items-center lg:justify-between" key={product.id}>
              <div>
                <div className="flex flex-wrap gap-2"><Badge value={product.status} /><span className="text-xs font-bold text-zor-muted">{product.slug}</span></div>
                <h3 className="mt-2 text-lg font-semibold text-zor-blue-deep">{product.name_hr} / {product.name_en}</h3>
                <p className="mt-1 text-sm text-zor-muted">{product.package_size ?? "pakiranje"} · {product.price_eur ?? "cijena na upit"} EUR</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminButton disabled={!canEdit} onClick={() => setProductDraft(product)} tone="secondary">Edit</AdminButton>
                <AdminButton disabled={!canEdit} onClick={() => deleteRow("products", product.id)} tone="danger"><Trash2 aria-hidden size={15} /> Delete</AdminButton>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    );
  }

  function renderProductForm() {
    if (!productDraft) {
      return null;
    }

    return (
      <form className="mb-5 grid gap-4 rounded-2xl border border-zor-line bg-zor-paper p-4" onSubmit={saveProduct}>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField defaultValue={productDraft.status} label="Status" name="status" options={productStatuses} />
          <Field defaultValue={productDraft.slug} label="Slug" name="slug" required />
          <Field defaultValue={productDraft.sort_order} label="Sort order" name="sort_order" type="number" />
          <Field defaultValue={productDraft.name_hr} label="Name HR" name="name_hr" required />
          <Field defaultValue={productDraft.name_en} label="Name EN" name="name_en" required />
          <Field defaultValue={productDraft.package_size} label="Package size" name="package_size" />
          <Field defaultValue={productDraft.roll_count} label="Roll count" name="roll_count" type="number" />
          <Field defaultValue={productDraft.layers} label="Layers" name="layers" type="number" />
          <Field defaultValue={productDraft.price_eur} label="Price EUR" name="price_eur" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea defaultValue={productDraft.short_description_hr} label="Short description HR" name="short_description_hr" />
          <TextArea defaultValue={productDraft.short_description_en} label="Short description EN" name="short_description_en" />
          <TextArea defaultValue={productDraft.description_hr} label="Full description HR" name="description_hr" rows={5} />
          <TextArea defaultValue={productDraft.description_en} label="Full description EN" name="description_en" rows={5} />
          <TextArea defaultValue={productDraft.business_note_hr} label="Business note HR" name="business_note_hr" />
          <TextArea defaultValue={productDraft.business_note_en} label="Business note EN" name="business_note_en" />
          <TextArea defaultValue={productDraft.recommended_for_hr} label="Recommended for HR" name="recommended_for_hr" />
          <TextArea defaultValue={productDraft.recommended_for_en} label="Recommended for EN" name="recommended_for_en" />
          <Field defaultValue={productDraft.image_url} label="Image URL" name="image_url" />
        </div>
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Upload UI za `product-images` bucket je TODO. Za sada zalijepi public image URL.</p>
        {renderFormActions(() => setProductDraft(null))}
      </form>
    );
  }

  function renderBlog() {
    return (
      <Panel>
        <SectionHeader
          action={<AdminButton disabled={!canEdit} onClick={() => setPostDraft({ locale: "hr", status: "draft" })}><Plus aria-hidden size={16} /> New post</AdminButton>}
          description="Blog smije imati duži tekst. Detaljna objašnjenja idu u blog, a public deck slideovi linkaju dalje."
          title="Blog Posts"
        >
          <div className="mt-3 flex flex-wrap gap-2">
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setBlogLocale(event.target.value as "all" | Locale)} value={blogLocale}>
              <option value="all">All locales</option>
              <option value="hr">HR</option>
              <option value="en">EN</option>
            </select>
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setBlogStatus(event.target.value)} value={blogStatus}>
              <option value="all">All statuses</option>
              {blogStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </SectionHeader>
        {posts.length === 0 ? (
          <EmptyState text="Suggested HR topics: Kako izračunati koliko toaletnog papira treba maloj firmi? Koliko toaletnog papira trebaju apartmani tijekom sezone? Toaletni papir 24 role ili 36 rola: što se više isplati?" />
        ) : null}
        {postDraft ? renderPostForm() : null}
        <div className="grid gap-3">
          {filteredPosts.map((post) => (
            <article className="flex flex-col gap-3 rounded-xl border border-zor-line p-4 lg:flex-row lg:items-start lg:justify-between" key={post.id}>
              <div>
                <div className="flex flex-wrap gap-2"><Badge value={post.status} /><span className="text-xs font-bold text-zor-muted">{post.locale.toUpperCase()} · {post.slug}</span></div>
                <h3 className="mt-2 text-lg font-semibold text-zor-blue-deep">{post.title}</h3>
                <p className="mt-1 max-w-3xl text-sm text-zor-muted">{post.excerpt}</p>
              </div>
              <AdminButton disabled={!canEdit} onClick={() => setPostDraft(post)} tone="secondary">Edit</AdminButton>
            </article>
          ))}
        </div>
      </Panel>
    );
  }

  function renderPostForm() {
    if (!postDraft) {
      return null;
    }

    return (
      <form className="mb-5 grid gap-4 rounded-2xl border border-zor-line bg-zor-paper p-4" onSubmit={savePost}>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField defaultValue={postDraft.locale} label="Locale" name="locale" options={localeOptions} />
          <SelectField defaultValue={postDraft.status} label="Status" name="status" options={blogStatuses} />
          <Field defaultValue={postDraft.slug} label="Slug" name="slug" required />
          <Field defaultValue={postDraft.title} label="Title" name="title" required />
          <Field defaultValue={postDraft.seo_title} label="SEO title" name="seo_title" />
          <Field defaultValue={postDraft.published_at?.slice(0, 16)} label="Published at" name="published_at" type="datetime-local" />
        </div>
        <TextArea defaultValue={postDraft.excerpt} label="Excerpt" name="excerpt" />
        <TextArea defaultValue={postDraft.content} label="Content" name="content" rows={9} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea defaultValue={postDraft.seo_description} label="SEO description" name="seo_description" />
          <Field defaultValue={postDraft.cover_image_url} label="Cover image URL" name="cover_image_url" />
        </div>
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Upload UI za `blog-images` bucket je TODO. Za sada zalijepi public cover image URL.</p>
        {renderFormActions(() => setPostDraft(null))}
      </form>
    );
  }

  function renderLeads() {
    return (
      <Panel>
        <SectionHeader description="Lead detail prikazuje poruku, izvor, proizvod i calculator payload ako postoji." title="Leads">
          <div className="mt-3 flex flex-wrap gap-2">
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setLeadType(event.target.value)} value={leadType}>
              <option value="all">All types</option>
              {leadTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setLeadStatus(event.target.value)} value={leadStatus}>
              <option value="all">All statuses</option>
              {leadStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <label className="flex h-10 items-center gap-2 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold">
              <Search aria-hidden size={16} />
              <input className="outline-none" onChange={(event) => setLeadSearch(event.target.value)} placeholder="Search" value={leadSearch} />
            </label>
          </div>
        </SectionHeader>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="grid gap-3">
            {filteredLeads.map((lead) => (
              <button className="rounded-xl border border-zor-line p-4 text-left transition hover:bg-zor-blue-soft" key={lead.id} onClick={() => setSelectedLead(lead)} type="button">
                <div className="flex flex-wrap items-center gap-2"><Badge value={lead.status} /><span className="text-xs font-bold uppercase text-zor-muted">{lead.type}</span></div>
                <h3 className="mt-2 font-semibold text-zor-blue-deep">{lead.name ?? lead.company ?? lead.email ?? lead.phone ?? "Bez imena"}</h3>
                <p className="mt-1 text-sm text-zor-muted">{lead.message ?? lead.source_page ?? "Nema poruke"}</p>
              </button>
            ))}
          </div>
          <Panel>
            {selectedLead ? (
              <div className="grid gap-3 text-sm">
                <h3 className="text-xl font-semibold text-zor-blue-deep">{selectedLead.name ?? "Lead detail"}</h3>
                <p><strong>Status:</strong> <Badge value={selectedLead.status} /></p>
                <p><strong>Company:</strong> {selectedLead.company ?? "-"}</p>
                <p><strong>Email:</strong> {selectedLead.email ?? "-"}</p>
                <p><strong>Phone:</strong> {selectedLead.phone ?? "-"}</p>
                <p><strong>Source:</strong> {selectedLead.source_page ?? "-"} {selectedLead.source_slide ? `· ${selectedLead.source_slide}` : ""}</p>
                <p><strong>Product:</strong> {products.find((product) => product.id === selectedLead.product_id)?.name_hr ?? selectedLead.product_id ?? "-"}</p>
                <pre className="whitespace-pre-wrap rounded-xl bg-zor-paper p-3 text-xs leading-5">{selectedLead.message ?? "Nema poruke."}</pre>
                {selectedLead.calculator_payload ? <pre className="whitespace-pre-wrap rounded-xl bg-zor-blue-soft p-3 text-xs leading-5">{jsonPreview(selectedLead.calculator_payload)}</pre> : null}
                <select className="h-10 rounded-xl border border-zor-line bg-white px-3" disabled={!canEdit} onChange={(event) => updateLeadStatus(selectedLead.id, event.target.value as Lead["status"])} value={selectedLead.status}>
                  {leadStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <AdminButton disabled={!canEdit} onClick={() => updateLeadStatus(selectedLead.id, "archived")} tone="secondary"><Archive aria-hidden size={15} /> Archive</AdminButton>
              </div>
            ) : (
              <EmptyState text="Odaberi lead za detalje." />
            )}
          </Panel>
        </div>
      </Panel>
    );
  }

  function renderPositions() {
    return (
      <Panel>
        <SectionHeader
          action={<AdminButton disabled={!canEdit} onClick={() => setPositionDraft({ status: "draft", sort_order: positions.length + 1 })}><Plus aria-hidden size={16} /> New position</AdminButton>}
          description="Pozicije se prikazuju u Careers poglavlju i koriste u prijavama kandidata."
          title="Career Positions"
        />
        {positionDraft ? renderPositionForm() : null}
        <div className="grid gap-3">
          {positions.map((position) => (
            <article className="flex flex-col gap-3 rounded-xl border border-zor-line p-4 lg:flex-row lg:items-center lg:justify-between" key={position.id}>
              <div>
                <div className="flex flex-wrap gap-2"><Badge value={position.status} /><span className="text-xs font-bold text-zor-muted">{position.employment_type ?? "type"}</span></div>
                <h3 className="mt-2 text-lg font-semibold text-zor-blue-deep">{position.title_hr}</h3>
                <p className="text-sm text-zor-muted">{position.location}</p>
              </div>
              <AdminButton disabled={!canEdit} onClick={() => setPositionDraft(position)} tone="secondary">Edit</AdminButton>
            </article>
          ))}
        </div>
      </Panel>
    );
  }

  function renderPositionForm() {
    if (!positionDraft) {
      return null;
    }

    return (
      <form className="mb-5 grid gap-4 rounded-2xl border border-zor-line bg-zor-paper p-4" onSubmit={savePosition}>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField defaultValue={positionDraft.status} label="Status" name="status" options={positionStatuses} />
          <Field defaultValue={positionDraft.title_hr} label="Title HR" name="title_hr" required />
          <Field defaultValue={positionDraft.title_en} label="Title EN" name="title_en" required />
          <Field defaultValue={positionDraft.location} label="Location" name="location" />
          <Field defaultValue={positionDraft.employment_type} label="Employment type" name="employment_type" />
          <Field defaultValue={positionDraft.sort_order} label="Sort order" name="sort_order" type="number" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea defaultValue={positionDraft.description_hr} label="Description HR" name="description_hr" />
          <TextArea defaultValue={positionDraft.description_en} label="Description EN" name="description_en" />
          <TextArea defaultValue={positionDraft.requirements_hr} label="Requirements HR" name="requirements_hr" />
          <TextArea defaultValue={positionDraft.requirements_en} label="Requirements EN" name="requirements_en" />
        </div>
        {renderFormActions(() => setPositionDraft(null))}
      </form>
    );
  }

  function renderApplications() {
    return (
      <Panel>
        <SectionHeader description="Pregled prijava kandidata, CV linkova i promjena statusa." title="Career Applications">
          <div className="mt-3 flex flex-wrap gap-2">
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setApplicationStatus(event.target.value)} value={applicationStatus}>
              <option value="all">All statuses</option>
              {applicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select className="h-10 rounded-full border border-zor-line bg-white px-3 text-sm font-semibold" onChange={(event) => setApplicationPosition(event.target.value)} value={applicationPosition}>
              <option value="all">All positions</option>
              {positions.map((position) => <option key={position.id} value={position.id}>{position.title_hr}</option>)}
            </select>
          </div>
        </SectionHeader>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="grid gap-3">
            {filteredApplications.map((application) => (
              <button className="rounded-xl border border-zor-line p-4 text-left transition hover:bg-zor-blue-soft" key={application.id} onClick={() => setSelectedApplication(application)} type="button">
                <div className="flex flex-wrap gap-2"><Badge value={application.status} /><span className="text-xs font-bold text-zor-muted">{getPositionName(positions, application.position_id)}</span></div>
                <h3 className="mt-2 font-semibold text-zor-blue-deep">{application.name ?? "Bez imena"}</h3>
                <p className="text-sm text-zor-muted">{application.email ?? application.phone ?? application.available_from ?? "Nema kontakta"}</p>
              </button>
            ))}
          </div>
          <Panel>
            {selectedApplication ? (
              <div className="grid gap-3 text-sm">
                <h3 className="text-xl font-semibold text-zor-blue-deep">{selectedApplication.name ?? "Application"}</h3>
                <p><strong>Status:</strong> <Badge value={selectedApplication.status} /></p>
                <p><strong>Position:</strong> {getPositionName(positions, selectedApplication.position_id)}</p>
                <p><strong>Email:</strong> {selectedApplication.email ?? "-"}</p>
                <p><strong>Phone:</strong> {selectedApplication.phone ?? "-"}</p>
                <p><strong>Available from:</strong> {selectedApplication.available_from ?? "-"}</p>
                <pre className="whitespace-pre-wrap rounded-xl bg-zor-paper p-3 text-xs leading-5">{selectedApplication.experience ?? selectedApplication.message ?? "Nema poruke."}</pre>
                {selectedApplication.cv_url ? <a className="font-bold text-zor-blue" href={selectedApplication.cv_url} rel="noreferrer" target="_blank">Open CV</a> : null}
                <select className="h-10 rounded-xl border border-zor-line bg-white px-3" disabled={!canEdit} onChange={(event) => updateApplicationStatus(selectedApplication.id, event.target.value as CareerApplication["status"])} value={selectedApplication.status}>
                  {applicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <AdminButton disabled={!canEdit} onClick={() => updateApplicationStatus(selectedApplication.id, "archived")} tone="secondary"><Archive aria-hidden size={15} /> Archive</AdminButton>
              </div>
            ) : (
              <EmptyState text="Odaberi prijavu za detalje." />
            )}
          </Panel>
        </div>
      </Panel>
    );
  }

  function renderSettings() {
    return (
      <Panel>
        <SectionHeader
          description="Admin moze mijenjati brand, WhatsApp, shop URL i druge JSON settings vrijednosti. Editor/viewer ovdje samo citaju."
          title="Site Settings"
        />
        <div className="grid gap-3">
          {settingsRows.map((setting) => (
            <form className="grid gap-3 rounded-xl border border-zor-line p-4 lg:grid-cols-[14rem_minmax(0,1fr)_auto] lg:items-start" key={setting.id} onSubmit={(event) => saveSetting(event, setting)}>
              <div>
                <p className="text-sm font-bold text-zor-blue-deep">{setting.key}</p>
                <p className="mt-1 text-xs text-zor-muted">JSON vrijednost</p>
              </div>
              <textarea className="min-h-20 rounded-xl border border-zor-line px-3 py-2 text-sm outline-none focus:border-zor-blue" defaultValue={settingValueToText(setting.value)} name="value" />
              <AdminButton disabled={!canManageSettings} type="submit"><Save aria-hidden size={15} /> Save</AdminButton>
            </form>
          ))}
        </div>
      </Panel>
    );
  }

  function renderFormActions(cancel: () => void) {
    return (
      <div className="flex flex-wrap gap-2">
        <AdminButton disabled={saving || !canEdit} type="submit">
          <Save aria-hidden size={16} />
          {saving ? "Saving..." : "Save"}
        </AdminButton>
        <AdminButton onClick={cancel} tone="secondary">
          Cancel
        </AdminButton>
      </div>
    );
  }
}
