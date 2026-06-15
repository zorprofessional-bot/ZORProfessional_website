import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/types";
import type { SubmissionResult } from "./careers";

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export type LeadInput = {
  type: "contact" | "product" | "calculator" | "career";
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  productId?: string | null;
  calculatorPayload?: Json | null;
  sourcePage?: string | null;
  sourceSlide?: string | null;
};

export async function submitLead(input: LeadInput): Promise<SubmissionResult> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, fallback: true };
  }

  const insert: LeadInsert = {
    type: input.type,
    name: input.name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    company: input.company ?? null,
    message: input.message ?? null,
    product_id: input.productId ?? null,
    calculator_payload: input.calculatorPayload ?? null,
    source_page: input.sourcePage ?? null,
    source_slide: input.sourceSlide ?? null,
  };

  const { error } = await supabase.from("leads").insert(insert);

  if (error) {
    return { ok: false, fallback: true, error: error.message };
  }

  return { ok: true, fallback: false };
}
