import { NextResponse } from "next/server";
import { submitLead, type LeadInput } from "@/lib/data/leads";
import type { Json } from "@/lib/supabase/types";

const leadTypes = new Set<LeadInput["type"]>([
  "contact",
  "product",
  "calculator",
  "career",
]);

function optionalText(value: unknown, maxLength = 600) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function optionalJson(value: unknown): Json | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Json;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const input = payload as Record<string, unknown>;
  const type = optionalText(input.type, 30) as LeadInput["type"] | null;

  if (!type || !leadTypes.has(type)) {
    return NextResponse.json({ ok: false, error: "Invalid lead type" }, { status: 400 });
  }

  const contact = optionalText(input.contact, 160);
  const email = optionalText(input.email, 160) ?? (contact?.includes("@") ? contact : null);
  const phone = optionalText(input.phone, 80) ?? (!contact?.includes("@") ? contact : null);

  const result = await submitLead({
    type,
    name: optionalText(input.name, 160),
    email,
    phone,
    company: optionalText(input.company, 160),
    message: optionalText(input.message, 1200),
    productId: optionalText(input.productId, 80),
    calculatorPayload: optionalJson(input.calculatorPayload),
    sourcePage: optionalText(input.sourcePage, 160),
    sourceSlide: optionalText(input.sourceSlide, 160),
  });

  return NextResponse.json(result, { status: result.ok ? 201 : 200 });
}
