"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Calculator, Mail } from "lucide-react";
import { getWhatsAppHref, siteContact, type Locale } from "@/content/site";
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
  return "h-10 w-full min-w-0 rounded-xl border border-white/24 bg-white/12 px-3 text-sm font-semibold text-white outline-none placeholder:text-white/46 focus:border-white sm:h-11";
}

function textAreaClass() {
  return "min-h-20 w-full resize-none rounded-xl border border-white/24 bg-white/12 px-3 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/46 focus:border-white";
}

export function CalculatorInputCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";
  const [people, setPeople] = useState(12);
  const [days, setDays] = useState(18);
  const [rolls, setRolls] = useState(24);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const monthlyRolls = useMemo(() => {
    return Math.max(1, Math.round((rolls / Math.max(1, days)) * 30));
  }, [days, rolls]);

  const recommendation = monthlyRolls > 30 ? "ZORPro 36" : "ZORPro 24";
  const submitting = submitState === "submitting";

  return (
    <form
      className="w-full max-w-xl rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-zor-soft backdrop-blur sm:p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitState("submitting");
        setSubmitState(
          await postJson("/api/leads", {
            calculatorPayload: {
              days,
              monthlyRolls,
              people,
              recommendation,
              rolls,
            },
            contact,
            message: `${recommendation} / ${monthlyRolls} ${isHr ? "rola mjesecno" : "rolls monthly"}`,
            name,
            sourcePage: locale === "hr" ? "/hr/kalkulator" : "/en/calculator",
            sourceSlide: "unos",
            type: "calculator",
          }),
        );
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/18 pb-3 sm:pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/66">
            {isHr ? "Ulazni podaci" : "Inputs"}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white sm:mt-2 sm:text-2xl">
            {isHr ? "Procjena potrosnje" : "Consumption estimate"}
          </h3>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-zor-blue sm:h-11 sm:w-11">
          <Calculator aria-hidden size={22} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
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
              {isHr ? "Role u paketu" : "Rolls in pack"}
            </span>
            <input
              className={fieldClass()}
              min={1}
              onChange={(event) => setRolls(Number(event.target.value))}
              type="number"
              value={rolls}
            />
          </label>
          <label className="grid min-w-0 gap-2">
            <span className="text-sm font-bold text-white/86">
              {isHr ? "Trajanje paketa" : "Pack duration"}
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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid min-w-0 gap-2">
            <span className="text-sm font-bold text-white/86">
              {isHr ? "Ime ili firma" : "Name or company"}
            </span>
            <input
              className={fieldClass()}
              onChange={(event) => setName(event.target.value)}
              placeholder={isHr ? "npr. Apartmani Zagreb" : "e.g. Zagreb Apartments"}
              value={name}
            />
          </label>
          <label className="grid min-w-0 gap-2">
            <span className="text-sm font-bold text-white/86">
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
      </div>

      <div className="mt-4 rounded-[1.1rem] bg-white p-3 text-zor-blue-deep sm:mt-5 sm:p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zor-blue">
          {isHr ? "Okvirno mjesecno" : "Estimated monthly"}
        </p>
        <p className="mt-1 text-xl font-semibold sm:mt-2 sm:text-2xl">
          {monthlyRolls} {isHr ? "rola" : "rolls"}
        </p>
        <p className="mt-1 text-sm text-zor-muted">{recommendation}</p>
      </div>

      <button
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft disabled:cursor-wait disabled:opacity-70 sm:mt-5"
        disabled={submitting}
        type="submit"
      >
        {submitting
          ? isHr
            ? "Saljem..."
            : "Sending..."
          : isHr
            ? "Posalji izracun"
            : "Send estimate"}
      </button>
      <StatusMessage
        error={isHr ? "Slanje trenutno nije uspjelo." : "Sending failed for now."}
        fallback={
          isHr
            ? "Supabase nije konfiguriran lokalno. Mozete poslati izracun preko WhatsApp gumba."
            : "Supabase is not configured locally. You can send the estimate with the WhatsApp button."
        }
        state={submitState}
        success={isHr ? "Izracun je zaprimljen." : "The estimate was received."}
      />
    </form>
  );
}

export function CalculatorResultCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";

  return (
    <div className="w-full max-w-xl rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-zor-soft backdrop-blur sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/66">
        {isHr ? "Rezultat" : "Result"}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-white sm:mt-3 sm:text-3xl">
        ZORPro 36
      </h3>
      <p className="mt-3 text-sm leading-6 text-white/74">
        {isHr
          ? "Za vece mjesecne potrebe prakticnije je narucivati rjede i drzati mirniju zalihu."
          : "For higher monthly demand, it is more practical to reorder less often and keep calmer stock."}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
        {[
          [isHr ? "Paket" : "Pack", isHr ? "36 rola" : "36 rolls"],
          [isHr ? "Ritam" : "Rhythm", isHr ? "mjesecno" : "monthly"],
          [isHr ? "Korak" : "Step", "WhatsApp"],
        ].map(([label, value]) => (
          <div className="rounded-xl bg-white/12 p-3 sm:p-4" key={label}>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/62 sm:text-xs sm:tracking-[0.16em]">
              {label}
            </p>
            <p className="mt-1 text-xs font-bold text-white sm:mt-2 sm:text-sm">{value}</p>
          </div>
        ))}
      </div>
      <a
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft"
        href={getWhatsAppHref(locale)}
        rel="noreferrer"
        target="_blank"
      >
        {isHr ? "Posalji rezultat" : "Send result"}
      </a>
    </div>
  );
}

export function ContactFormCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(isHr ? "ZOR Professional upit" : "ZOR Professional inquiry");
    const body = encodeURIComponent(`${name}\n${contact}\n\n${message}`);
    return `mailto:${siteContact.email}?subject=${subject}&body=${body}`;
  }, [contact, isHr, message, name]);

  const submitting = submitState === "submitting";

  return (
    <form
      className="w-full max-w-xl rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white backdrop-blur sm:p-5"
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
            {isHr ? "Kratko opisite potrebu." : "Describe the need briefly."}
          </h3>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2">
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
          <label className="grid gap-2">
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
            placeholder={isHr ? "Kolicina, prostor, rok..." : "Quantity, space, timing..."}
            value={message}
          />
        </label>
      </div>
      <button
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft disabled:cursor-wait disabled:opacity-70 sm:mt-5"
        disabled={submitting}
        type="submit"
      >
        {submitting
          ? isHr
            ? "Saljem..."
            : "Sending..."
          : isHr
            ? "Posalji upit"
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
  const [positionId, setPositionId] = useState(positions[0]?.id ?? "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [experience, setExperience] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const submitting = submitState === "submitting";

  return (
    <form
      className="w-full max-w-xl rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white backdrop-blur sm:p-5"
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
      <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-white/82">{isHr ? "Ime" : "Name"}</span>
            <input
              className={fieldClass()}
              onChange={(event) => setName(event.target.value)}
              placeholder={isHr ? "Ime i prezime" : "Full name"}
              value={name}
            />
          </label>
          <label className="grid gap-2">
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
            placeholder={isHr ? "Ukratko napisite sto znate raditi..." : "Briefly describe your experience..."}
            value={experience}
          />
        </label>
      </div>
      <button
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft disabled:cursor-wait disabled:opacity-70 sm:mt-5"
        disabled={submitting}
        type="submit"
      >
        {submitting
          ? isHr
            ? "Saljem..."
            : "Sending..."
          : isHr
            ? "Posalji prijavu"
            : "Send application"}
      </button>
      <StatusMessage
        error={isHr ? "Slanje trenutno nije uspjelo." : "Sending failed for now."}
        fallback={
          isHr
            ? "Supabase nije konfiguriran lokalno. Prijavu mozete poslati preko WhatsAppa."
            : "Supabase is not configured locally. You can send the application over WhatsApp."
        }
        state={submitState}
        success={isHr ? "Prijava je zaprimljena." : "The application was received."}
      />
      {submitState === "fallback" ? (
        <a
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-white/24 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          href={getWhatsAppHref(locale)}
          rel="noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
      ) : null}
    </form>
  );
}
