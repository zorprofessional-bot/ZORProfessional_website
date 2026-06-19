"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Calculator, Mail } from "lucide-react";
import { buildWhatsAppHref, type Locale } from "@/content/site";
import { useSiteContact } from "@/components/SiteSettingsProvider";
import type { CareerPosition } from "@/lib/data/careers";
import { cn } from "@/lib/utils";

type SubmitState = "idle" | "submitting" | "success" | "fallback" | "error";

async function postJson(url: string, payload: Record<string, unknown>): Promise<SubmitState> {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      return "error";
    }

    const result = (await response.json()) as { fallback?: boolean; ok?: boolean };

    if (result.ok) {
      return "success";
    }

    return result.fallback ? "fallback" : "error";
  } catch {
    return "fallback";
  }
}

function StatusMessage({
  error,
  fallback,
  state,
  success,
}: {
  error: string;
  fallback: string;
  state: SubmitState;
  success: string;
}) {
  if (state === "idle" || state === "submitting") {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className={cn(
        "mt-3 rounded-xl px-3 py-2 text-xs font-semibold leading-5",
        state === "success"
          ? "bg-emerald-50 text-emerald-800"
          : state === "fallback"
            ? "bg-white/14 text-white"
            : "bg-red-50 text-red-800",
      )}
      role="status"
    >
      {state === "success" ? success : state === "fallback" ? fallback : error}
    </p>
  );
}

function fieldClass() {
  return "h-9 w-full min-w-0 rounded-lg border border-white/18 bg-white/[0.08] px-3 text-sm font-semibold text-white outline-none placeholder:text-white/46 focus:border-white sm:h-10";
}

function textAreaClass() {
  return "min-h-12 w-full resize-none rounded-lg border border-white/18 bg-white/[0.08] px-3 py-2 text-sm font-semibold text-white outline-none placeholder:text-white/46 focus:border-white sm:min-h-20";
}

type SpaceType = "home" | "office" | "apartment" | "institution";

// Procijenjena potrošnja: role toaletnog papira po osobi dnevno.
// Okvirne vrijednosti — vlasnik ih može ugoditi prema stvarnim podacima.
export const consumptionRatePerPersonPerDay: Record<SpaceType, number> = {
  home: 0.34,
  office: 0.2,
  apartment: 0.45,
  institution: 0.3,
};

const packOptions = [
  { id: "ZORPro 24", size: 24 },
  { id: "ZORPro 36", size: 36 },
] as const;

const spaceTypeOrder: SpaceType[] = ["home", "office", "apartment", "institution"];

const spaceTypeLabels: Record<Locale, Record<SpaceType, string>> = {
  hr: { home: "Dom", office: "Ured", apartment: "Apartman", institution: "Ustanova" },
  en: { home: "Home", office: "Office", apartment: "Apartment", institution: "Institution" },
};

export function estimateConsumption(people: number, spaceType: SpaceType, days: number) {
  const safePeople = Math.max(1, Math.round(people) || 0);
  const safeDays = Math.max(1, Math.round(days) || 0);
  const rolls = Math.max(
    1,
    Math.round(safePeople * consumptionRatePerPersonPerDay[spaceType] * safeDays),
  );
  const pack = rolls >= packOptions[1].size ? packOptions[1] : packOptions[0];
  const packs = Math.max(1, Math.ceil(rolls / pack.size));

  return { rolls, packs, product: pack.id };
}

export function CalculatorInputCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";
  const contact = useSiteContact();
  const [people, setPeople] = useState(12);
  const [spaceType, setSpaceType] = useState<SpaceType>("home");
  const [days, setDays] = useState(30);

  const estimate = useMemo(
    () => estimateConsumption(people, spaceType, days),
    [people, spaceType, days],
  );

  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    isHr
      ? `Pozdrav, prema kalkulatoru trebam ~${estimate.rolls} rola u ${days} dana (preporuka: ${estimate.product}, ${estimate.packs} paketa).`
      : `Hello, the calculator suggests ~${estimate.rolls} rolls in ${days} days (recommended: ${estimate.product}, ${estimate.packs} packs).`,
  )}`;

  return (
    <div className="w-full max-w-xl rounded-[1.4rem] border border-white/12 bg-white/[0.06] p-3.5 text-white shadow-zor-soft backdrop-blur sm:p-5">
      <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-2.5 sm:pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/66 sm:text-xs">
            {isHr ? "Ulazni podaci" : "Inputs"}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold text-white sm:mt-2 sm:text-2xl">
            {isHr ? "Procjena potrošnje" : "Consumption estimate"}
          </h3>
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-zor-blue sm:h-11 sm:w-11">
          <Calculator aria-hidden size={20} />
        </div>
      </div>

      <div className="mt-2.5 grid gap-2 sm:mt-5 sm:gap-4">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-bold text-white/86">
            {isHr ? "Broj korisnika" : "Users"}
          </span>
          <input
            className={fieldClass()}
            min={1}
            onChange={(event) => setPeople(Number(event.target.value))}
            type="number"
            value={people}
          />
        </label>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <label className="grid min-w-0 gap-2">
            <span className="text-sm font-bold text-white/86">
              {isHr ? "Tip prostora" : "Space type"}
            </span>
            <select
              className={fieldClass()}
              onChange={(event) => setSpaceType(event.target.value as SpaceType)}
              value={spaceType}
            >
              {spaceTypeOrder.map((option) => (
                <option key={option} value={option}>
                  {spaceTypeLabels[locale][option]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid min-w-0 gap-2">
            <span className="text-sm font-bold text-white/86">
              {isHr ? "Razdoblje (dana)" : "Period (days)"}
            </span>
            <input
              className={fieldClass()}
              min={1}
              onChange={(event) => setDays(Number(event.target.value))}
              type="number"
              value={days}
            />
          </label>
        </div>
      </div>

      <div className="mt-2.5 rounded-[1.1rem] bg-white p-2.5 text-zor-blue-deep sm:mt-5 sm:p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zor-blue sm:text-xs">
          {isHr ? `Procjena za ${days} dana` : `Estimate for ${days} days`}
        </p>
        <p className="mt-0.5 text-xl font-semibold sm:mt-2 sm:text-3xl">
          {estimate.rolls} {isHr ? "rola" : "rolls"}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
          <div className="rounded-xl bg-zor-blue-soft p-2.5 sm:p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zor-blue sm:text-xs">
              {isHr ? "Preporuka" : "Recommended"}
            </p>
            <p className="mt-1 text-sm font-bold text-zor-blue-deep sm:text-base">{estimate.product}</p>
          </div>
          <div className="rounded-xl bg-zor-blue-soft p-2.5 sm:p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zor-blue sm:text-xs">
              {isHr ? "Paketa" : "Packs"}
            </p>
            <p className="mt-1 text-sm font-bold text-zor-blue-deep sm:text-base">
              {estimate.packs} {isHr ? (estimate.packs === 1 ? "paket" : "paketa") : estimate.packs === 1 ? "pack" : "packs"}
            </p>
          </div>
        </div>
      </div>

      <a
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft sm:mt-5"
        href={whatsappHref}
        rel="noreferrer"
        target="_blank"
      >
        {isHr ? "Pošalji izračun na WhatsApp" : "Send estimate via WhatsApp"}
      </a>
    </div>
  );
}

export function ContactFormCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";
  const contactInfo = useSiteContact();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(isHr ? "ZOR Professional upit" : "ZOR Professional inquiry");
    const body = encodeURIComponent(`${name}\n${contact}\n\n${message}`);
    return `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
  }, [contact, contactInfo.email, isHr, message, name]);

  const submitting = submitState === "submitting";

  return (
    <form
      className="w-full max-w-xl rounded-[1.4rem] border border-white/12 bg-white/[0.06] p-3.5 text-white backdrop-blur sm:p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setSubmitState(
          await postJson("/api/leads", {
            contact,
            message,
            name,
            sourcePage: locale === "hr" ? "/hr/kontakt" : "/en/contact",
            sourceSlide: locale === "hr" ? "forma" : "form",
            type: "contact",
          }),
        );
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-zor-blue sm:h-11 sm:w-11">
          <Mail aria-hidden size={21} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/64">
            {isHr ? "Kontakt forma" : "Contact form"}
          </p>
          <h3 className="mt-1 text-xl font-semibold sm:text-2xl">
            {isHr ? "Kratko opišite potrebu." : "Describe the need briefly."}
          </h3>
        </div>
      </div>
      <div className="mt-2.5 grid gap-2 sm:mt-5 sm:gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-white/82">
              {isHr ? "Ime ili firma" : "Name or company"}
            </span>
            <input
              className={fieldClass()}
              onChange={(event) => setName(event.target.value)}
              placeholder={isHr ? "npr. Apartmani Zagreb" : "e.g. Zagreb Apartments"}
              value={name}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-white/82">
              {isHr ? "Email ili telefon" : "Email or phone"}
            </span>
            <input
              className={fieldClass()}
              onChange={(event) => setContact(event.target.value)}
              placeholder={isHr ? "kontakt" : "contact"}
              value={contact}
            />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-white/82">{isHr ? "Poruka" : "Message"}</span>
          <textarea
            className={textAreaClass()}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={isHr ? "Količina, prostor, rok..." : "Quantity, space, timing..."}
            value={message}
          />
        </label>
      </div>
      <button
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft disabled:cursor-wait disabled:opacity-70 sm:mt-5"
        disabled={submitting}
        type="submit"
      >
        {submitting
          ? isHr
            ? "Šaljem..."
            : "Sending..."
          : isHr
            ? "Pošalji upit"
            : "Send inquiry"}
      </button>
      <StatusMessage
        error={isHr ? "Slanje trenutno nije uspjelo." : "Sending failed for now."}
        fallback={
          isHr
            ? "Supabase nije konfiguriran lokalno. Email fallback je i dalje dostupan."
            : "Supabase is not configured locally. The email fallback is still available."
        }
        state={submitState}
        success={isHr ? "Upit je zaprimljen." : "The inquiry was received."}
      />
      {submitState === "fallback" ? (
        <a
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-white/24 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          href={mailto}
        >
          {isHr ? "Otvori email" : "Open email"}
        </a>
      ) : null}
    </form>
  );
}

export function CareerApplicationCard({
  locale,
  positions,
}: {
  locale: Locale;
  positions: CareerPosition[];
}) {
  const isHr = locale === "hr";
  const contactInfo = useSiteContact();
  const [positionId, setPositionId] = useState(positions[0]?.id ?? "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [experience, setExperience] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const submitting = submitState === "submitting";

  return (
    <form
      className="w-full max-w-xl rounded-[1.4rem] border border-white/12 bg-white/[0.06] p-3.5 text-white backdrop-blur sm:p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setSubmitState(
          await postJson("/api/career-applications", {
            availableFrom,
            contact,
            experience,
            name,
            positionId,
          }),
        );
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-zor-blue sm:h-11 sm:w-11">
          <BriefcaseBusiness aria-hidden size={21} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/64">
            {isHr ? "Kratka prijava" : "Short application"}
          </p>
          <h3 className="mt-1 text-xl font-semibold sm:text-2xl">
            {isHr ? "Javite se za rad na Jankomiru." : "Apply for work at Jankomir."}
          </h3>
        </div>
      </div>
      <div className="mt-2.5 grid gap-2 sm:mt-5 sm:gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-white/82">
            {isHr ? "Pozicija" : "Position"}
          </span>
          <select
            className={fieldClass()}
            onChange={(event) => setPositionId(event.target.value)}
            value={positionId}
          >
            <option value="">{isHr ? "Otvorena prijava" : "Open application"}</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.title}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-white/82">{isHr ? "Ime" : "Name"}</span>
            <input
              className={fieldClass()}
              onChange={(event) => setName(event.target.value)}
              placeholder={isHr ? "Ime i prezime" : "Full name"}
              value={name}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-white/82">
              {isHr ? "Email ili telefon" : "Email or phone"}
            </span>
            <input
              className={fieldClass()}
              onChange={(event) => setContact(event.target.value)}
              placeholder={isHr ? "kontakt" : "contact"}
              value={contact}
            />
          </label>
        </div>
        <label className="grid gap-2 max-sm:hidden">
          <span className="text-sm font-bold text-white/82">
            {isHr ? "Dostupan od" : "Available from"}
          </span>
          <input
            className={fieldClass()}
            onChange={(event) => setAvailableFrom(event.target.value)}
            placeholder={isHr ? "npr. odmah" : "e.g. immediately"}
            value={availableFrom}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-white/82">
            {isHr ? "Iskustvo ili poruka" : "Experience or message"}
          </span>
          <textarea
            className={textAreaClass()}
            onChange={(event) => setExperience(event.target.value)}
            placeholder={isHr ? "Ukratko napišite što znate raditi..." : "Briefly describe your experience..."}
            value={experience}
          />
        </label>
      </div>
      <button
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft disabled:cursor-wait disabled:opacity-70 sm:mt-5"
        disabled={submitting}
        type="submit"
      >
        {submitting
          ? isHr
            ? "Šaljem..."
            : "Sending..."
          : isHr
            ? "Pošalji prijavu"
            : "Send application"}
      </button>
      <StatusMessage
        error={isHr ? "Slanje trenutno nije uspjelo." : "Sending failed for now."}
        fallback={
          isHr
            ? "Supabase nije konfiguriran lokalno. Prijavu možete poslati preko WhatsAppa."
            : "Supabase is not configured locally. You can send the application over WhatsApp."
        }
        state={submitState}
        success={isHr ? "Prijava je zaprimljena." : "The application was received."}
      />
      {submitState === "fallback" ? (
        <a
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-white/24 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          href={buildWhatsAppHref(contactInfo.whatsappNumber, locale)}
          rel="noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
      ) : null}
    </form>
  );
}
