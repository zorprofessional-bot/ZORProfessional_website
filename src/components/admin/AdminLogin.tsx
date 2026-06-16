"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  return (
    <main className="grid min-h-[100svh] place-items-center overflow-y-auto bg-zor-paper px-4 py-10 text-zor-ink">
      <section className="w-full max-w-md rounded-2xl border border-zor-line bg-white p-6 shadow-zor-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-zor-blue text-white">
            <LockKeyhole aria-hidden size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zor-blue">
              ZOR Professional
            </p>
            <h1 className="text-2xl font-semibold text-zor-blue-deep">Admin login</h1>
          </div>
        </div>

        {!supabase ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Supabase nije konfiguriran. Postavi `NEXT_PUBLIC_SUPABASE_URL` i
            `NEXT_PUBLIC_SUPABASE_ANON_KEY`, zatim redeployaj aplikaciju.
          </div>
        ) : (
          <form
            className="mt-6 grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError(null);

              const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              setLoading(false);

              if (signInError) {
                setError(signInError.message);
                return;
              }

              router.replace("/admin");
              router.refresh();
            }}
          >
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zor-blue-deep">Email</span>
              <input
                autoComplete="email"
                className="h-11 rounded-xl border border-zor-line px-3 text-sm outline-none focus:border-zor-blue"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zor-blue-deep">Lozinka</span>
              <input
                autoComplete="current-password"
                className="h-11 rounded-xl border border-zor-line px-3 text-sm outline-none focus:border-zor-blue"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
                {error}
              </p>
            ) : null}
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-zor-blue px-5 text-sm font-semibold text-white transition hover:bg-zor-blue-deep disabled:cursor-wait disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              <LogIn aria-hidden size={17} />
              {loading ? "Ulazim..." : "Uđi u admin"}
            </button>
          </form>
        )}

        <p className="mt-5 text-sm leading-6 text-zor-muted">
          Prvog admin korisnika napravi u Supabase Authu i dodaj mu `profiles`
          red s rolom `admin`.
        </p>
      </section>
    </main>
  );
}
