# Plan: Provjera + završetak ZOR Professional (admin faza)

## Context

Pročitan cijeli ChatGPT razgovor (`chatgpt razgovor.txt`) i oba prompta davana Codexu (`prompt 3.txt`, `prompt 4.txt`).

Projekt je krenuo kao klasičan scroll web, pa je usred razvoja **zaokrenut na "no-scroll deck"** koncept (svaki ekran = jedan slide; glavna navigacija = chapter; strelice/swipe/dots mijenjaju slide). Redoslijed promptova nakon zaokreta:
- **Refactor prompt** → deck arhitektura (DeckShell, DeckPage, DeckSlide, DeckControls, SlideIndicator, ChapterThemeProvider).
- **Prompt 3** → Supabase content backend (migracije, RLS, helperi, seed). Eksplicitno: "Do not build the full admin UI yet."
- **Prompt 4** → admin panel (chapters/slides/products/blog/leads/careers/applications/settings).

Procjena "napravio sam prva 3-4 koraka, zadnji korak je admin panel" je točna: refactor + Prompt 3 + Prompt 4 su odrađeni. Admin je zadnji **veliki build korak** i — provjereno u kodu — već je ~90% gotov.

Odluka: Supabase se spaja kasnije; sada **prvo provjeriti postojeće** i naći što nije dobro odrađeno, prije dodavanja novih stvari. Faza 1 = verifikacija prema "Quality checks" iz Prompta 4; ostalo je roadmap.

> `prompt 5.txt` je nevezan (popravci "toilet paper intro" animacije koja je već maknuta) — može se obrisati.

## Stanje vs plan (provjereno u kodu)

**Prompt 3 — Supabase backend: napravljeno i ispravno.**
- Migracija `supabase/migrations/20260615130000_zor_backend.sql`: svih 9 tablica iz spec-a, RLS (public read + staff write), 4 storage bucketa + upload politike.
- `current_profile_role()` je `security definer` + `search_path=public` → izbjegnut RLS recursion bug.
- Helperi `src/lib/data/{deck,products,blog,careers,leads,settings}.ts` + Supabase/fallback dvojni mod.

**Prompt 4 — Admin panel: napravljeno (~90%).**
- `src/components/admin/AdminPanel.tsx` (1541 linija): svih 9 sekcija, role gating (`canEdit`/`canManageSettings`), dashboard KPI, duplikat slidea, slide preview s upozorenjem na duljinu.
- Login + guard preko Supabase Auth (`src/app/admin/{page,login/page}.tsx`, `AdminLogin.tsx`).

**Odstupanja od spec-a (mete za provjeru/dovršetak):**
1. **Upload slika/CV — TODO (unutar spec-a).** Prompt 4 je dao escape hatch: "If upload too complex → implement image_url first, add TODO, document." Codex je išao tim putem (TODO na `AdminPanel.tsx:1196-1197, 1275, 1342`). Backend (bucketi+policy) je spreman → ostaje samo UI. Najveći funkcionalni dug.
2. **site_settings → public: djelomično.** Prompt 4 traži "Use site_settings for WhatsApp/shop URL... do not hardcode." `SUPABASE_USAGE.md §19` priznaje da dio public UI-a još koristi statični `src/content/site.ts`. Djelomičan promašaj spec-a.
3. **User management UI: nema (unutar spec-a).** Prompt 4 dopušta ručno kreiranje u Supabaseu uz dokumentaciju — odrađeno u `ADMIN_NOTES.md`.
4. **Nije spojeno na živi Supabase.** Nema `.env.local`, migracija nije pokrenuta, nema admin usera → admin se trenutno ne može pokrenuti lokalno.

**Koraci nakon admina (iz "Novi redoslijed", razgovor) — nisu pretvoreni u promptove:**
`5. Proizvodi kao deck · 6. Kalkulator kao deck · 7. Karijere+kontakt kao deck · 8. Blog+SEO · 9. Production readiness`. Po `.audit/` screenshotovima sve te stranice **postoje kao deck**, pa su 5-7 uglavnom pokrivene refactorom. Ostaju: kalkulator compute+WhatsApp (provjeriti), Blog SEO, i cijela Faza 9 (env/SEO/deploy).

## Što nije bilo dobro isplanirano (rizici za provjeru u Fazi 1)

1. **page_sections ostaci.** Zaokret je išao iz `page_sections` → `deck_slides`. Prompt 4 Quality check traži "no page_sections references remain" → grepati i potvrditi.
2. **Product shape mismatch.** Fallback `src/content/products.ts` je ugniježđen (`name:{hr,en}`, `specs[]`, `highlights[]`), a DB `products` plosnat (`name_hr`, `roll_count`...). Potvrditi da `src/lib/data/products.ts` mapira DB→frontend i da `ProductDetailPage`/`ProductsIndexPage` ne puknu na Supabase podatku. Najvjerojatnije mjesto tihog buga.
3. **Naming drift seed-a.** Prompt 3 traži 3 proizvoda (ZOR 24 Svakodnevni / 24 Mekši / 36 Zaliha); migracija seeda 2 (`zorpro-24`, `zorpro-36`). Provjeriti je li namjerno i konzistentno HR/EN.
4. **Cijena `price_eur` null** → potvrditi da frontend prikaže "na upit" umjesto da padne.

## FAZA 1 — Provjera postojećeg

Cilj: dokazati da postojeći deck + Supabase wiring + admin + fallback drže vodu na razini koda; naći i popraviti bugove; ostaviti čistu checklistu za spajanje.

1. Spremi ovaj plan u projekt kao `PLAN.md`.
2. Statička provjera: `npm run lint`, `npm run build`, `npm run test:e2e`. Popraviti greške.
3. Grep: nema `page_section`; public ostaje no-scroll (`overflow:hidden`/`100svh`).
4. Schema↔kod audit: migracija ↔ `types.ts` ↔ `AdminPanel.tsx` ↔ `select(...)` u `lib/data/*`. Posebno product mapiranje i `price_eur` null.
5. Funkcionalni smoke (fallback, bez env): `/hr`, `/en`, mobile nav, kalkulator+WhatsApp link, `/admin/login` poruka.
6. Popravi samo stvarne bugove.
7. Upiši nalaze + connect-later checklistu (dolje).

## Connect-later checklist (kad spajaš Supabase)

1. Supabase → SQL Editor → zalijepi `supabase/migrations/20260615130000_zor_backend.sql` → Run.
2. Provjeri 9 tablica + 4 bucketa.
3. Auth → dodaj usera → kopiraj `auth.users.id` → u `profiles` red s `role=admin`.
4. `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. `npm run dev` → `/admin/login` → uđi → potvrdi CRUD i da viewer ne može spremati.

## Roadmap (kasnije faze)

- **Faza 2 — Upload slika** ✅ NAPRAVLJENO (vidi dolje).
- **Faza 3 — site_settings → public** ✅ NAPRAVLJENO (vidi dolje).
- **Faza 4 — CV upload** (`career-cv`, private + signed URL).
- **Faza 5 — Production readiness**: SEO metadata/sitemap/robots, performance, env na hostingu, deploy provjera.
- **Faza 6 — User management UI** (opcionalno).

Redoslijed po vrijednosti 2→3→5→4→6.

---

## Nalazi Faze 1 (audit) — 2026-06-19

**Statičke provjere**
- ✓ `npm run lint` — čisto, bez grešaka.
- ✓ `npm run build` — prolazi (exit 0). TypeScript prolazi. Generirano svih 30 ruta: HR/EN deck, product SSG (`zorpro-24`, `zorpro-36`), blog SSG, `/admin` (dynamic), API rute.
- ✓ `npm run test:e2e` — nakon popravka: **18 prošlo, 1 skip, exit 0** (1 test "flaky" — padne jednom, prođe na retryju). Vidi "Popravak" niže.

**Grep / no-scroll**
- ✓ Nema nijedne `page_sections` reference u `src/` (Prompt 4 quality check zadovoljen — refactor čist).
- ✓ Public deck je no-scroll: `DeckShell` koristi `h-[100svh] overflow-hidden`; slide frame na mobitelu dopušta interni `overflow-y-auto overscroll-contain`, desktop `md:overflow-hidden` (namjerno).

**Schema ↔ kod**
- ✓ Migracija `CREATE TABLE` kolone === `src/lib/supabase/types.ts` === Prompt 3 spec, za svih 9 tablica (imena, nullability, enumi). Nema drifta → admin insert/update neće tiho pucati kad se baza spoji.
- ✓ Rizik #2 (product shape) **riješen**: `src/lib/data/products.ts:mapProduct()` mapira plosnati DB red → ugniježđeni `Product` tip; build to type-checka.
- ✓ Rizik #4 (`price_eur` null) **riješen**: `formatPrice()` vraća "Cijena na upit" / "Price on request". Podržava i `numeric` kao string iz Supabasea.
- ✓ Deck helper (`lib/data/deck.ts`) ima fallback na svakoj razini + validira `route_path`/`slug` protiv code-owned ruta (Supabase ne može izmisliti rutu).
- ⓘ Rizik #3 (naming drift): migracija seeda 2 proizvoda (`zorpro-24`, `zorpro-36`); Prompt 3 je tražio 3 (24 Svakodnevni / 24 Mekši / 36 Zaliha). Fallback `src/content/products.ts` je također 2 → **seed i fallback su međusobno konzistentni**, samo se razlikuju od originalnog prompta. Nije bug; sadržajna odluka. (e2e test "products use ZORPro fallback slugs" to i očekuje.)

**Funkcionalno (fallback mod, bez env — pokriveno e2e + čitanjem koda)**
- ✓ `/hr`, `/en` deck radi; mobile bottom nav drži aktivni item (e2e); contact forma ima fallback put bez Supabasea (e2e); blog koristi interni reader dok shell ostaje fiksan (e2e); `/admin` zaštićen kad Supabase nije konfiguriran (e2e).
- ✓ Kalkulator: `estimateConsumption()` računa role po tipu prostora, preporučuje 24/36 paket i gradi WhatsApp deep link s popunjenom porukom.

**Popravak napravljen u ovoj fazi**
- `playwright.config.ts`: dodan `retries: process.env.CI ? 2 : 1`. e2e ide protiv `next dev` (Turbopack) s 8 paralelnih workera, bez retryja → krhko. Uočena dva tranzijentna flakea, oba samo na `mobile-chrome` home testu i oba prolaze u izolaciji / na retryju: (1) dev-server SSR chunk error "Unexpected end of JSON input"; (2) `ArrowRight` ne pomakne slide jer keydown handler još nije hidriran kad test pritisne tipku. Oba su timing/flake, ne bugovi aplikacije; retries ih apsorbiraju bez skrivanja stvarnih padova. (Trajniji fix za kasnije: e2e protiv `next build`+`next start`; opcionalno čekati hydration prije keypressa u testu.)

**Potvrđeni dugovi (za kasnije faze — NISU bugovi, planirani izostanci)**
- Upload UI za slike/CV — TODO (Faza 2). Backend (bucketi+policy) spreman.
- `site_settings` → public: potvrđeno da `getWhatsAppHref`/`siteContact` dolaze iz statičnog `src/content/site.ts`, ne iz baze (Faza 3).
- User management UI — nema; ručno u Supabaseu (Faza 6).

**Zaključak:** postojeći deck + Supabase wiring + admin + fallback su zdravi na razini koda. Jedini nađeni problem bio je flaky e2e (popravljen). Spreman za spajanje Supabasea po checklisti gore.

---

## Status Faze 2 — Upload slika (NAPRAVLJENO 2026-06-19)

Dodan reusable upload field u admin; briše 3 TODO-a iz Prompta 4. Backend (bucketi + storage RLS za admin/editor) je već postojao, pa je trebao samo UI.

**Što je dodano**
- `ImageUploadField` u [src/components/admin/AdminPanel.tsx](src/components/admin/AdminPanel.tsx): text input (`name` ostaje isti, FormData save netaknut) + file picker → `supabase.storage.from(bucket).upload()` → `getPublicUrl()` → upiše URL u polje, prikaže preview i status (uploadam / uspjeh / greška).
- Spojen u 3 forme: slide → `deck-images`, proizvod → `product-images`, blog cover → `blog-images`.
- Sva 3 amber "TODO" upozorenja maknuta; slide guidance (title/body limiti) zadržan.
- `key={draft.id ?? "new"}` na slide/product/blog formama → čist remount pri promjeni drafta (popravlja i latentni stale-`defaultValue` na svim uncontrolled poljima, ne samo upload field).
- Upload radi samo uz konfiguriran Supabase + rolu admin/editor (storage RLS); inače field pokaže poruku i ostaje ručni URL paste.

**Usput popravljeno**
- `eslint.config.mjs`: dodani `playwright-report/**` i `test-results/**` u `globalIgnores` (bili git-ignored ali ne eslint-ignored → `npm run lint` je padao na generiranim trace fajlovima čim e2e jednom prođe).
- `ADMIN_NOTES.md`: ažurirana Uploads sekcija.

**Verifikacija:** `npm run lint` exit 0, `npm run build` exit 0 (TypeScript prolazi), `npm run test:e2e` zeleno. Stvarni upload se testira tek kad se spoji Supabase (vidi connect-later checklistu) — e2e ide u fallback modu gdje je admin redirectan.

**Ostaje (kasnije faze):** Faza 4 (CV upload, private bucket), Faza 5 (production readiness/SEO), Faza 6 (user management UI).

---

## Status Faze 3 — site_settings → public (NAPRAVLJENO 2026-06-19)

Dovršen Prompt 4 zahtjev: "Use site_settings for WhatsApp number and shop URL... do not hardcode." Javni web sad čita kontakt iz baze, s fallbackom identičnim dosadašnjem (pa je ponašanje bez Supabasea nepromijenjeno).

**Arhitektura (jedan izvor istine)**
- `getSiteContact()` u [src/lib/data/settings.ts](src/lib/data/settings.ts): request-cached (`react/cache`) razrješava `SiteContact` iz `site_settings` s fallbackom na `fallbackSiteContact`.
- `SiteContact` tip + `fallbackSiteContact` + `buildWhatsAppHref(number, locale)` u [src/content/site.ts](src/content/site.ts).
- [src/components/SiteSettingsProvider.tsx](src/components/SiteSettingsProvider.tsx): client context; root [layout.tsx](src/app/layout.tsx) (sad async) ga puni iz `getSiteContact()`.

**Tko što koristi**
- Server stranice (Home, Products, ProductDetail, Careers, Calculator, Production, Contact) → sad async, čitaju `getSiteContact()` i grade WhatsApp/email linkove iz njega (umjesto `getWhatsAppHref`/`siteContact`).
- Client islands (`Navbar`, `CalculatorInputCard`, `ContactFormCard`, `CareerApplicationCard`) → `useSiteContact()`.

**Napomene / odluke**
- `getWhatsAppHref()` i `siteContact` ostaju eksportani u `site.ts` (koriste ih legacy/neaktivne komponente `PresentationBlocks`, `ContactDetailsVisual`, `WhatsAppPanel`, `Footer/PageShell` — nisu na public decku, pa ih nisam dirao).
- `Navbar` je dobio `"use client"` (već je de facto bio client kroz `DeckShell`; sad koristi hook).
- Async server-komponente kao djeca (`<HomePage/>`) rade na React 19.2 + Next 16 (build potvrdio).

**Verifikacija:** `npm run build` exit 0 (svih 30 ruta i dalje prerenderano), `npm run lint` exit 0, `npm run test:e2e` 19 prošlo / 1 skip / exit 0. Promjena vrijednosti u bazi vidljiva tek po spajanju Supabasea (connect-later checklista).

**Ostaje:** Faza 4 (CV upload), Faza 5 (production readiness/SEO), Faza 6 (user management UI).
