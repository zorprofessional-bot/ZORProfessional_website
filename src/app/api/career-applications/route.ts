import { NextResponse } from "next/server";
import { submitCareerApplication } from "@/lib/data/careers";

function optionalText(value: unknown, maxLength = 600) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
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
  const contact = optionalText(input.contact, 160);
  const email = optionalText(input.email, 160) ?? (contact?.includes("@") ? contact : null);
  const phone = optionalText(input.phone, 80) ?? (!contact?.includes("@") ? contact : null);

  const result = await submitCareerApplication({
    positionId: optionalText(input.positionId, 80),
    name: optionalText(input.name, 160),
    email,
    phone,
    experience: optionalText(input.experience, 1200),
    availableFrom: optionalText(input.availableFrom, 120),
    message: optionalText(input.message, 1200),
    cvUrl: optionalText(input.cvUrl, 500),
  });

  return NextResponse.json(result, { status: result.ok ? 201 : 200 });
}
