"use client";

import { useMemo, useState } from "react";
import { Calculator, Mail } from "lucide-react";
import { getWhatsAppHref, siteContact, type Locale } from "@/content/site";
import { cn } from "@/lib/utils";

export function CalculatorInputCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";
  const [people, setPeople] = useState(12);
  const [days, setDays] = useState(18);
  const [rolls, setRolls] = useState(24);

  const monthlyRolls = useMemo(() => {
    return Math.max(1, Math.round((rolls / Math.max(1, days)) * 30));
  }, [days, rolls]);

  const recommendation = monthlyRolls > 30 ? "ZOR 36 Zaliha" : "ZOR 24 Svakodnevni";

  return (
    <div className="w-full max-w-xl rounded-[1.5rem] border border-[var(--deck-line)] bg-white/86 p-5 text-zor-ink shadow-zor-soft">
      <div className="flex items-center justify-between gap-4 border-b border-zor-line pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zor-blue">
            {isHr ? "Ulazni podaci" : "Inputs"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-zor-blue-deep">
            {isHr ? "Procjena potrošnje" : "Consumption estimate"}
          </h3>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-zor-blue text-white">
          <Calculator aria-hidden size={22} />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zor-blue-deep">
            {isHr ? "Broj korisnika" : "Users"}
          </span>
          <input
            className="h-11 rounded-xl border border-zor-line bg-white px-3 text-sm font-semibold outline-none focus:border-zor-blue"
            min={1}
            onChange={(event) => setPeople(Number(event.target.value))}
            type="number"
            value={people}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-zor-blue-deep">
              {isHr ? "Role u paketu" : "Rolls in pack"}
            </span>
            <input
              className="h-11 rounded-xl border border-zor-line bg-white px-3 text-sm font-semibold outline-none focus:border-zor-blue"
              min={1}
              onChange={(event) => setRolls(Number(event.target.value))}
              type="number"
              value={rolls}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-zor-blue-deep">
              {isHr ? "Trajanje paketa" : "Pack duration"}
            </span>
            <input
              className="h-11 rounded-xl border border-zor-line bg-white px-3 text-sm font-semibold outline-none focus:border-zor-blue"
              min={1}
              onChange={(event) => setDays(Number(event.target.value))}
              type="number"
              value={days}
            />
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-[1.1rem] bg-zor-blue p-4 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
          {isHr ? "Okvirno mjesečno" : "Estimated monthly"}
        </p>
        <p className="mt-2 text-2xl font-semibold">{monthlyRolls} {isHr ? "rola" : "rolls"}</p>
        <p className="mt-1 text-sm text-white/76">{recommendation}</p>
      </div>
    </div>
  );
}

export function CalculatorResultCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";

  return (
    <div className="w-full max-w-xl rounded-[1.5rem] border border-[var(--deck-line)] bg-white/86 p-5 text-zor-ink shadow-zor-soft">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zor-blue">
        {isHr ? "Rezultat" : "Result"}
      </p>
      <h3 className="mt-3 text-3xl font-semibold text-zor-blue-deep">ZOR 36 Zaliha</h3>
      <p className="mt-3 text-sm leading-6 text-zor-muted">
        {isHr
          ? "Za veće mjesečne potrebe praktičnije je naručivati rjeđe i držati mirniju zalihu."
          : "For higher monthly demand, it is more practical to reorder less often and keep calmer stock."}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          [isHr ? "Paket" : "Pack", isHr ? "36 rola" : "36 rolls"],
          [isHr ? "Ritam" : "Rhythm", isHr ? "mjesečno" : "monthly"],
          [isHr ? "Korak" : "Step", "WhatsApp"],
        ].map(([label, value]) => (
          <div className="rounded-xl bg-zor-blue-soft p-4" key={label}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zor-blue">{label}</p>
            <p className="mt-2 text-sm font-bold text-zor-blue-deep">{value}</p>
          </div>
        ))}
      </div>
      <a
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-zor-blue px-5 text-sm font-semibold text-white transition hover:bg-zor-blue-deep"
        href={getWhatsAppHref(locale)}
        rel="noreferrer"
        target="_blank"
      >
        {isHr ? "Pošalji rezultat" : "Send result"}
      </a>
    </div>
  );
}

export function ContactFormCard({ locale }: { locale: Locale }) {
  const isHr = locale === "hr";
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(isHr ? "ZOR Professional upit" : "ZOR Professional inquiry");
    const body = encodeURIComponent(`${name}\n\n${message}`);
    return `mailto:${siteContact.email}?subject=${subject}&body=${body}`;
  }, [isHr, message, name]);

  return (
    <form
      className="w-full max-w-xl rounded-[1.5rem] border border-white/18 bg-white/10 p-5 text-white backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = mailto;
      }}
    >
      <div className="flex items-center gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-zor-blue">
          <Mail aria-hidden size={21} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/64">
            {isHr ? "Kontakt forma" : "Contact form"}
          </p>
          <h3 className="mt-1 text-2xl font-semibold">
            {isHr ? "Kratko opišite potrebu." : "Describe the need briefly."}
          </h3>
        </div>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-white/82">{isHr ? "Ime ili firma" : "Name or company"}</span>
          <input
            className="h-11 rounded-xl border border-white/24 bg-white/12 px-3 text-sm font-semibold text-white outline-none placeholder:text-white/46 focus:border-white"
            onChange={(event) => setName(event.target.value)}
            placeholder={isHr ? "npr. Apartmani Zagreb" : "e.g. Zagreb Apartments"}
            value={name}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-white/82">{isHr ? "Poruka" : "Message"}</span>
          <textarea
            className="min-h-28 resize-none rounded-xl border border-white/24 bg-white/12 px-3 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/46 focus:border-white"
            onChange={(event) => setMessage(event.target.value)}
            placeholder={isHr ? "Količina, prostor, rok..." : "Quantity, space, timing..."}
            value={message}
          />
        </label>
      </div>
      <button
        className={cn(
          "mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zor-blue-deep transition hover:bg-zor-blue-soft",
        )}
        type="submit"
      >
        {isHr ? "Pošalji email" : "Send email"}
      </button>
    </form>
  );
}
