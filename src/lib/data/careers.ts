import type { Locale } from "@/content/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type CareerPositionRow = Database["public"]["Tables"]["career_positions"]["Row"];
type CareerApplicationInsert =
  Database["public"]["Tables"]["career_applications"]["Insert"];

export type CareerPosition = {
  id: string;
  title: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
};

export type CareerApplicationInput = {
  positionId?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  experience?: string | null;
  availableFrom?: string | null;
  message?: string | null;
  cvUrl?: string | null;
};

export type SubmissionResult =
  | { ok: true; fallback: false }
  | { ok: false; fallback: true; error?: string }
  | { ok: false; fallback: false; error: string };

function fallbackPositions(locale: Locale): CareerPosition[] {
  const isHr = locale === "hr";

  return [
    {
      id: "machine-operator",
      title: isHr ? "Operater na stroju" : "Machine operator",
      location: "Robni terminali Jankomir",
      employmentType: isHr ? "Proizvodnja" : "Production",
      description: isHr
        ? "Rad na proizvodnoj liniji za toaletni papir uz ucenje kroz praksu."
        : "Work on a toilet paper production line with hands-on training.",
      requirements: isHr
        ? "Pouzdanost, urednost i spremnost na ucenje."
        : "Reliability, order, and willingness to learn.",
    },
    {
      id: "open-application",
      title: isHr ? "Otvorena prijava" : "Open application",
      location: "Robni terminali Jankomir",
      employmentType: isHr ? "Proizvodnja i skladište" : "Production and warehouse",
      description: isHr
        ? "Kratko se javite ako želite raditi u proizvodnji ili pakiranju."
        : "Send a short note if you want to work in production or packing.",
      requirements: isHr
        ? "Osnovni podaci i vrsta posla koja vas zanima."
        : "Basic details and the kind of work you are interested in.",
    },
  ];
}

function mapPosition(row: CareerPositionRow, locale: Locale): CareerPosition {
  return {
    id: row.id,
    title: locale === "hr" ? row.title_hr : row.title_en,
    location: row.location ?? "Robni terminali Jankomir",
    employmentType: row.employment_type ?? (locale === "hr" ? "Proizvodnja" : "Production"),
    description:
      (locale === "hr" ? row.description_hr : row.description_en) ??
      (locale === "hr" ? row.title_hr : row.title_en),
    requirements:
      (locale === "hr" ? row.requirements_hr : row.requirements_en) ??
      (locale === "hr" ? "Detalji u razgovoru." : "Details in conversation."),
  };
}

export async function getPublishedCareerPositions(locale: Locale) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return fallbackPositions(locale);
  }

  const { data, error } = await supabase
    .from("career_positions")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return fallbackPositions(locale);
  }

  return data.map((position) => mapPosition(position, locale));
}

export async function submitCareerApplication(
  input: CareerApplicationInput,
): Promise<SubmissionResult> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, fallback: true };
  }

  const insert: CareerApplicationInsert = {
    position_id: input.positionId ?? null,
    name: input.name ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    experience: input.experience ?? null,
    available_from: input.availableFrom ?? null,
    message: input.message ?? null,
    cv_url: input.cvUrl ?? null,
  };

  const { error } = await supabase.from("career_applications").insert(insert);

  if (error) {
    return { ok: false, fallback: true, error: error.message };
  }

  return { ok: true, fallback: false };
}
