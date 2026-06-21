# Supabase Usage Guide for ZOR Professional

Ovaj dokument opisuje kako se koristi Supabase backend za ZOR Professional web stranicu.

Stranica je i dalje javni no-scroll deck. Supabase nije zamjena za UI, nego izvor podataka za poglavlja, slideove, proizvode, blog, karijere, postavke i upite.

## 1. Sto Supabase Radi U Ovom Projektu

Supabase se koristi za:

- deck poglavlja
- deck slideove
- proizvode
- blog objave
- kontakt/product/calculator leadove
- pozicije za karijere
- prijave kandidata
- site settings
- storage za slike i CV datoteke
- pripremu admin autentikacije kroz role

Javni frontend i dalje koristi ove postojece deck komponente:

- `DeckShell`
- `DeckPage`
- `DeckSlide`
- `DeckControls`
- `SlideIndicator`
- `ChapterThemeProvider`

To je vazno: Supabase smije mijenjati content, ali ne smije pretvoriti stranicu u scroll page, webshop ili katalog.

## 2. Glavna Ideja

Public stranica radi u dva moda:

1. Supabase mode
   - Supabase env varijable postoje.
   - Data helperi citaju podatke iz Supabase tablica.
   - Ako tablica ima aktivne/published podatke, oni se prikazuju na stranici.

2. Fallback mode
   - Supabase env varijable ne postoje ili query pukne.
   - Stranica koristi lokalni fallback content iz `src/content`.
   - Stranica i dalje radi lokalno bez baze.

To znaci da lokalni development ne smije puknuti samo zato sto Supabase nije spojen.

## 3. Bitni Fajlovi

Supabase client i tipovi:

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/types.ts`

Data helperi:

- `src/lib/data/deck.ts`
- `src/lib/data/products.ts`
- `src/lib/data/blog.ts`
- `src/lib/data/careers.ts`
- `src/lib/data/leads.ts`
- `src/lib/data/settings.ts`

API routeovi za javne forme:

- `src/app/api/leads/route.ts`
- `src/app/api/career-applications/route.ts`

Supabase migracija:

- `supabase/migrations/20260615130000_zor_backend.sql`

Fallback content:

- `src/content/deck.ts`
- `src/content/products.ts`
- `src/content/blog.ts`
- `src/content/site.ts`

Dokumentacija:

- `DECK_ARCHITECTURE.md`
- `CONTENT_STRUCTURE.md`
- `PROJECT_BRIEF.md`
- `README.md`

## 4. Env Varijable

Za spajanje na Supabase trebaju samo public anon env varijable:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Ne stavljati service role key u frontend.

Ako env varijable nisu postavljene:

- deck content dolazi iz fallback fajlova
- proizvodi dolaze iz fallback fajla
- blog dolazi iz fallback fajla
- karijere imaju fallback pozicije
- forme prikazuju fallback poruku

## 5. Kako Postaviti Supabase Projekt

1. Otvori Supabase dashboard.
2. Napravi novi projekt.
3. U projektu idi na SQL Editor.
4. Otvori lokalni fajl:

```txt
supabase/migrations/20260615130000_zor_backend.sql
```

5. Kopiraj cijeli SQL u Supabase SQL Editor.
6. Pokreni SQL.
7. Provjeri da su se stvorile tablice:

- `profiles`
- `deck_chapters`
- `deck_slides`
- `products`
- `blog_posts`
- `leads`
- `career_positions`
- `career_applications`
- `site_settings`

8. Provjeri Storage buckete:

- `product-images`
- `deck-images`
- `blog-images`
- `career-cv`

9. Kopiraj Supabase URL i anon key u hosting environment varijable.

## 6. Deploy / Online Koristenje

Ako je app deployan na Vercel ili slican hosting:

1. Otvori project settings na hostingu.
2. Dodaj env varijable:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

3. Redeployaj aplikaciju.
4. Otvori `/hr`.
5. Ako Supabase radi, content ce se citati iz baze.
6. Ako nesto nije dobro, stranica bi trebala pasti nazad na fallback content.

## 7. Deck Model

Supabase deck model ima dvije glavne tablice:

- `deck_chapters`
- `deck_slides`

Poglavlje je glavna ruta u navigaciji.

Slide je jedan ekran unutar poglavlja.

Primjeri poglavlja:

- `/hr`
- `/hr/proizvodi`
- `/hr/proizvodnja`
- `/hr/kalkulator`
- `/hr/blog`
- `/hr/karijere`
- `/hr/kontakt`

Engleski mirror:

- `/en`
- `/en/products`
- `/en/production`
- `/en/calculator`
- `/en/blog`
- `/en/careers`
- `/en/contact`

## 8. Vazno Pravilo Za Rute

Rute su code-owned.

To znaci:

- Supabase ne izmisljava nove javne rute sam od sebe.
- `route_path` u `deck_chapters` mora odgovarati postojecoj ruti iz koda.
- Ako `route_path` ne odgovara, helper ga ignorira ili pada na fallback.

Primjer dobrog `route_path`:

```txt
/hr/proizvodi
```

Primjer loseg `route_path`:

```txt
/hr/novo-poglavlje-koje-ne-postoji
```

Za novo poglavlje prvo treba dodati route u kod, pa tek onda seed/edit u Supabaseu.

## 9. Tablica `deck_chapters`

Ova tablica definira glavna poglavlja.

Najvaznija polja:

- `slug`
- `locale`
- `label`
- `nav_label`
- `route_path`
- `theme`
- `background_variant`
- `sort_order`
- `is_active`

### `slug`

Interni naziv poglavlja.

HR primjeri:

- `home`
- `proizvodi`
- `proizvodnja`
- `kalkulator`
- `blog`
- `karijere`
- `kontakt`

EN primjeri:

- `home`
- `products`
- `production`
- `calculator`
- `blog`
- `careers`
- `contact`

### `locale`

Mora biti:

- `hr`
- `en`

### `label`

Naziv poglavlja koji se koristi kao chapter label.

Primjer:

```txt
Proizvodi
```

### `nav_label`

Kratki naziv za navigaciju.

Primjer:

```txt
Proizvodi
```

Ako nije postavljen, koristi se `label`.

### `route_path`

Mora odgovarati postojecoj ruti.

Primjeri:

```txt
/hr/proizvodi
/en/products
```

### `theme`

U migraciji su seedani prompt theme nazivi:

- `dark-premium-blue`
- `light-product-blue`
- `industrial-neutral`
- `practical-blue`
- `editorial-white`
- `energetic-dark-blue`
- `contact-blue`

Kod ih mapira na postojece chapter theme ID-eve:

- `home`
- `products`
- `production`
- `calculator`
- `blog`
- `careers`
- `contact`

Ako je vrijednost nepoznata, app pada na theme prema ruti.

### `sort_order`

Redoslijed poglavlja.

Trenutni redoslijed:

1. Home
2. Products / Proizvodi
3. Production / Proizvodnja
4. Calculator / Kalkulator
5. Blog
6. Careers / Karijere
7. Contact / Kontakt

### `is_active`

Ako je `false`, javna stranica ne cita to poglavlje.

Za sada nemoj gasiti glavna poglavlja ako nisi siguran, jer rute i nav postoje u kodu.

## 10. Tablica `deck_slides`

Ova tablica definira slideove unutar poglavlja.

Najvaznija polja:

- `chapter_id`
- `locale`
- `slide_key`
- `eyebrow`
- `title`
- `body`
- `primary_cta_label`
- `primary_cta_href`
- `secondary_cta_label`
- `secondary_cta_href`
- `visual_type`
- `image_url`
- `background_variant`
- `layout_variant`
- `content_alignment`
- `sort_order`
- `is_active`

### `chapter_id`

Veza na `deck_chapters.id`.

Slide mora pripadati poglavlju.

### `slide_key`

Ovo je jako vazno.

`slide_key` postaje URL parametar:

```txt
/hr/proizvodi?slide=zorpro-24
```

Ako mijenjas `slide_key`, mijenjas i deep link.

Zato za postojece slideove radije mijenjaj `title` i `body`, a `slide_key` ostavi stabilan.

### `eyebrow`

Mali tekst iznad naslova.

Primjer:

```txt
Proizvodi
```

### `title`

Glavni naslov slidea.

Treba biti kratak i jasan.

Dobro:

```txt
Dva jednostavna paketa za različite potrebe.
```

Lose:

```txt
Dobrodošli na našu stranicu gdje ćete pronaći veliki izbor proizvoda...
```

Deck slide nije duga sekcija.

### `body`

Kratki opis.

Najbolje radi 1 do 2 recenice.

Ako treba puno teksta, napravi dodatni slide ili blog clanak.

### CTA polja

Primarni CTA:

- `primary_cta_label`
- `primary_cta_href`

Sekundarni CTA:

- `secondary_cta_label`
- `secondary_cta_href`

Primjeri:

```txt
primary_cta_label: Pošalji WhatsApp upit
primary_cta_href: https://wa.me/385000000000
```

```txt
secondary_cta_label: Pogledaj proizvode
secondary_cta_href: /hr/proizvodi
```

Ako label postoji bez href-a, CTA se nece prikazati kao valjan.

### `visual_type`

Ovo je opis koji govori koji visual se ocekuje.

Primjeri iz seeda:

- `hero-image`
- `audience-cards`
- `value-cards`
- `route-grid`
- `product-image`
- `product-pack`
- `product-cards`
- `production-image`
- `process-step`
- `calculator-image`
- `calculator-form`
- `calculator-result`
- `whatsapp-panel`
- `blog-cards`
- `careers-image`
- `career-cards`
- `position-cards`
- `career-form`
- `contact-form`
- `contact-details`

Trenutno kod koristi postojece visual komponente po chapteru i slideu. `visual_type` je priprema za admin/editable model i treba ostati smislen.

### `image_url`

Ako postoji, moze overrideati sliku za slide gdje se prikazuje `ImagePanel`.

Primjeri gdje je korisno:

- Home hero
- Products overview
- Production intro
- Careers intro
- Calculator intro

Slike mogu biti lokalne:

```txt
/visuals/deck/home-hero.webp
```

Ili iz Supabase storagea:

```txt
https://xxxxx.supabase.co/storage/v1/object/public/deck-images/hero.png
```

Next config dopusta `https://*.supabase.co` slike.

### `background_variant`

Dozvoljene vrijednosti:

- `theme`
- `light`
- `soft`
- `dark`
- `steel`
- `editorial`

Ako stavis nepoznatu vrijednost, helper ju ignorira i koristi fallback.

### `layout_variant`

Dozvoljene vrijednosti:

- `split`
- `splitReverse`
- `center`
- `visualFirst`
- `dense`

Najcesce koristiti:

- `split`
- `splitReverse`
- `center`

Ne koristiti layout kao nacin da se ugura puno teksta na jedan slide.

### `content_alignment`

Dozvoljeno:

- `left`
- `center`

Ako nije sigurno, ostavi `center`.

### `sort_order`

Redoslijed slideova unutar poglavlja.

### `is_active`

Ako je `false`, javni helper nece prikazati slide.

Pazi: ako ugasis prvi slide nekog poglavlja, deep linkovi i flow mogu izgledati cudno.

## 11. Kako Urediti Tekst Na Slideu

Primjer: zelis promijeniti Home hero naslov.

1. Otvori Supabase dashboard.
2. Idi na Table Editor.
3. Otvori `deck_chapters`.
4. Nadji:

```txt
locale = hr
slug = home
```

5. Kopiraj ili zapamti `id`.
6. Otvori `deck_slides`.
7. Filtriraj:

```txt
chapter_id = taj id
slide_key = hero
locale = hr
```

8. Promijeni `title` ili `body`.
9. Spremi.
10. Refreshaj `/hr`.

Ako je aplikacija staticki prerenderana na hostingu, mozda treba redeploy ili cache refresh, ovisno o hosting konfiguraciji.

## 12. Kako Dodati Novi Slide U Postojece Poglavlje

Primjer: zelis dodati novi slide u proizvode.

1. U `deck_chapters` nadji HR proizvodi:

```txt
locale = hr
slug = proizvodi
```

2. Kopiraj `id`.
3. U `deck_slides` dodaj novi red:

```txt
chapter_id: id proizvodi poglavlja
locale: hr
slide_key: npr. poslovna-dostava
eyebrow: Dostava
title: Dostava se dogovara prema količini.
body: Za redovite količine javite nam lokaciju i ritam narudžbe.
background_variant: light
layout_variant: split
content_alignment: center
sort_order: broj između postojećih ili nakon njih
is_active: true
```

4. Dodaj i EN verziju ako treba.

Vazno: novi slide ce imati text, ali visual ce ovisiti o tome kako page komponenta mapira slideove. Za potpuno novi custom visual obicno treba mala promjena u kodu.

## 13. Kako Ne Razbiti Deck

Ne raditi ovo:

- Ne dodavati dugi body tekst od vise paragrafa u deck slide.
- Ne mijenjati `route_path` na rutu koja ne postoji u kodu.
- Ne mijenjati `slide_key` ako je slide vec linkan.
- Ne koristiti stari model dugih public page sekcija.
- Ne stvarati scroll page sekcije u public dijelu.
- Ne dodavati cart, checkout ili webshop flow.
- Ne mijenjati deck shell komponente samo da bi se promijenio tekst.

Raditi ovo:

- Uredi `title`, `body`, CTA label/href.
- Dodaj novi slide ako jedna poruka vise ne stane.
- Koristi blog reader za duzi tekst.
- Koristi proizvode kao prezentaciju, ne kao webshop.

## 14. Products

Tablica:

```txt
products
```

Trenutni seed proizvodi:

- `zorpro-24`
- `zorpro-36`

Najvaznija polja:

- `slug`
- `status`
- `name_hr`
- `name_en`
- `short_description_hr`
- `short_description_en`
- `description_hr`
- `description_en`
- `package_size`
- `roll_count`
- `layers`
- `price_eur`
- `business_note_hr`
- `business_note_en`
- `recommended_for_hr`
- `recommended_for_en`
- `image_url`
- `sort_order`

### `slug`

Slug je URL dio.

Primjer:

```txt
zorpro-24
```

URL:

```txt
/hr/proizvodi/zorpro-24
/en/products/zorpro-24
```

U ovoj fazi HR i EN koriste isti product slug.

### `status`

Dozvoljeno:

- `draft`
- `published`

Javna stranica cita samo:

```txt
status = published
```

### `price_eur`

Trenutno placeholder cijena.

Nema checkouta, nema kosarice, nema automatike cijena.

Ako cijena nije spremna, moze se ostaviti `null`, pa frontend prikazuje cijenu na upit.

### Dodavanje Proizvoda

Za novi proizvod:

1. Dodaj red u `products`.
2. Stavi `status = published` kad je spreman.
3. Dodaj `slug`.
4. Dodaj HR i EN naziv/opis.
5. Dodaj `roll_count`, `package_size`, `layers`, `price_eur`.
6. Dodaj `sort_order`.

Napomena: product listing ce prikazati proizvod, ali ako zelis poseban deck slide s custom redoslijedom, dodaj i odgovarajuci `deck_slides` red u products poglavlje.

## 15. Blog

Tablica:

```txt
blog_posts
```

Najvaznija polja:

- `slug`
- `status`
- `locale`
- `title`
- `excerpt`
- `content`
- `seo_title`
- `seo_description`
- `cover_image_url`
- `published_at`

### Locale

Svaki blog post je zaseban po jeziku:

```txt
locale = hr
```

ili

```txt
locale = en
```

Trenutno nema translation-pair tablice. Zato language switch za Supabase blog objavu moze ici na blog index drugog jezika ako nema poznatog prijevoda.

### Content

`content` je plain text s paragrafima odvojenima praznim redom.

Primjer:

```txt
Prvi paragraf.

Drugi paragraf.
```

Frontend to pretvara u paragrafe u internom reader panelu.

Blog detail stranica smije imati unutarnji scroll reader panel. Vanjski deck shell ostaje fixed/no-scroll.

## 16. Careers

Tablice:

- `career_positions`
- `career_applications`

### `career_positions`

Koristi se za otvorene pozicije.

Najvaznija polja:

- `status`
- `title_hr`
- `title_en`
- `location`
- `employment_type`
- `description_hr`
- `description_en`
- `requirements_hr`
- `requirements_en`
- `sort_order`

Javna stranica prikazuje:

```txt
status = published
```

Ako nema Supabase podataka, frontend koristi fallback pozicije:

- Operater na stroju
- Otvorena prijava

### `career_applications`

Kratka javna prijava ide u ovu tablicu.

Polja:

- `position_id`
- `status`
- `name`
- `phone`
- `email`
- `experience`
- `available_from`
- `message`
- `cv_url`
- `created_at`

Javni korisnik moze insertati prijavu.

Samo admin/editor/viewer mogu citati prijave.

Samo admin/editor mogu mijenjati status.

## 17. Leads

Tablica:

```txt
leads
```

U nju idu:

- kontakt forma
- proizvodni upit
- kalkulator upit
- career lead ako se koristi kao lead

Polja:

- `type`
- `status`
- `name`
- `email`
- `phone`
- `company`
- `message`
- `product_id`
- `calculator_payload`
- `source_page`
- `source_slide`
- `created_at`

### `type`

Dozvoljeno:

- `contact`
- `product`
- `calculator`
- `career`

### `status`

Dozvoljeno:

- `new`
- `contacted`
- `won`
- `lost`
- `archived`

Novi lead default:

```txt
new
```

### `calculator_payload`

Za kalkulator se sprema JSON.

Primjer:

```json
{
  "people": 12,
  "rolls": 24,
  "days": 18,
  "monthlyRolls": 40,
  "recommendation": "ZORPro 36"
}
```

## 18. Public Forme

Postoje dva API routea.

### Leads API

```txt
POST /api/leads
```

Koristi se za:

- kontakt formu
- kalkulator formu

Primjer payload:

```json
{
  "type": "contact",
  "name": "Apartmani Zagreb",
  "contact": "test@example.com",
  "message": "Trebamo ponudu za ZORPro 36.",
  "sourcePage": "/hr/kontakt",
  "sourceSlide": "forma"
}
```

Ako `contact` sadrzi `@`, backend ga tretira kao email. Ako ne, tretira ga kao phone.

### Career Applications API

```txt
POST /api/career-applications
```

Primjer payload:

```json
{
  "positionId": "uuid-pozicije",
  "name": "Ime Prezime",
  "contact": "0910000000",
  "availableFrom": "odmah",
  "experience": "Radio sam u proizvodnji."
}
```

Ako Supabase nije konfiguriran ili insert pukne, API vraca fallback rezultat. UI tada pokazuje poruku i nudi WhatsApp/email fallback.

## 19. Site Settings

Tablica:

```txt
site_settings
```

Seedani keyevi:

- `brand_name`
- `company_name`
- `location`
- `shop_url`
- `whatsapp_number`
- `contact_email`
- `phone`

Vrijednost je `jsonb`.

Primjer:

```json
"ZOR Professional"
```

ili:

```json
"385000000000"
```

Trenutno kod ima helper:

- `getSiteSettings()`
- `getWhatsAppNumber()`
- `getShopUrl()`
- `getSiteContact()` — request-cached, vraca razrijesen kontakt (whatsapp broj, email, telefon, lokacija, brand, company, shop URL)

Public UI cita kontakt iz `site_settings` preko `getSiteContact()`:

- server stranice (Home, Proizvodi, Proizvodnja, Kalkulator, Karijere, Kontakt, detalj proizvoda) grade WhatsApp/email linkove iz razrijesenog kontakta.
- client komponente (`Navbar`, kalkulator/kontakt/karijere kartice) citaju isti objekt kroz `SiteSettingsProvider` + `useSiteContact()`.

Ako Supabase nije konfiguriran ili kljuc fali, `getSiteContact()` pada na `src/content/site.ts` (`fallbackSiteContact`), pa je ponasanje identicno kao prije. Promjena WhatsApp broja / emaila u `site_settings` mijenja ih na cijelom javnom webu (uz rebuild/revalidate ako je stranica staticki prerenderana).

## 20. Storage Buckets

Migracija kreira buckete:

- `product-images`
- `deck-images`
- `blog-images`
- `career-cv`

### Public Buckets

Ovi su public:

- `product-images`
- `deck-images`
- `blog-images`

Koriste se za slike koje smiju biti javno dostupne.

### Private Bucket

Ovaj je private:

- `career-cv`

Koristi se za CV datoteke.

Pristup CV datotekama smije imati samo staff kroz RLS/storage policy.

## 21. RLS Pravila

Migracija ukljucuje Row Level Security.

Public korisnici mogu:

- citati active deck chapters
- citati active deck slides
- citati published products
- citati published blog posts
- citati published career positions
- insertati leads
- insertati career applications
- citati public settings
- citati public storage slike

Authenticated staff moze:

- viewer: citati admin content, leadove i prijave
- editor: mijenjati content i statuse
- admin: sve kao editor plus upravljanje profilima

## 22. Roles

Role su u tablici:

```txt
profiles
```

Dozvoljene role:

- `admin`
- `editor`
- `viewer`

Supabase Auth user treba imati povezani `profiles` red.

Primjer:

```txt
id = auth.users.id
email = osoba@example.com
role = admin
```

Bez profila user nema staff ovlasti.

## 23. Kako Dodati Admin Korisnika

Za kasniju admin fazu:

1. Kreiraj usera u Supabase Auth.
2. Kopiraj `auth.users.id`.
3. U `profiles` dodaj:

```txt
id: user id iz auth.users
email: email usera
full_name: ime
role: admin
```

Admin UI je dostupan na `/admin`. User management ekran jos nije izgradjen, pa se prvi admin user i dalje kreira rucno u Supabase dashboardu.

## 24. Kako Provjeriti Da Supabase Radi

Nakon deploya:

1. Promijeni neki `deck_slides.title` u Supabaseu.
2. Refreshaj odgovarajucu stranicu.
3. Ako se tekst promijenio, Supabase radi.
4. Ako se nije promijenio:
   - provjeri env varijable
   - provjeri da je slide `is_active = true`
   - provjeri da je chapter `is_active = true`
   - provjeri `locale`
   - provjeri `route_path`
   - provjeri deployment cache

## 25. Lokalno Testiranje

Bez Supabase env varijabli:

```bash
npm run dev
```

Otvori:

```txt
http://localhost:3000/hr
```

Stranica mora raditi iz fallbacka.

Za provjeru:

```bash
npm run lint
npm run build
npm run test:e2e
```

## 26. Kada Treba Mijenjati Kod

Supabase je dovoljan za:

- promjenu naslova
- promjenu body teksta
- promjenu CTA labela
- promjenu CTA linkova
- promjenu redoslijeda slideova
- paljenje/gasenje slideova
- promjenu proizvoda
- promjenu blog objava
- promjenu career pozicija
- pregled leadova i prijava u Supabase dashboardu

Kod treba mijenjati za:

- novu javnu rutu
- novi chapter koji ne postoji
- novi custom visual
- novi tip forme
- admin UI
- novi storage workflow
- checkout/webshop
- kompleksnu logiku cijena

## 27. Najcesce Greske

### Stranica ne cita Supabase content

Provjeri:

- env varijable postoje
- Supabase URL je ispravan
- anon key je ispravan
- migracija je pokrenuta
- RLS policy dopusta public read
- `status` ili `is_active` je ispravan

### Slide se ne prikazuje

Provjeri:

- `deck_slides.is_active = true`
- `deck_chapters.is_active = true`
- `locale` odgovara stranici
- `chapter_id` je ispravan
- `sort_order` nije neocekivan

### Deep link ne radi

Provjeri:

- URL koristi tocni `slide_key`
- `slide_key` nije promijenjen
- slide pripada pravom chapteru

Primjer:

```txt
/hr/proizvodi?slide=zorpro-24
```

### Proizvod se ne prikazuje

Provjeri:

- `products.status = published`
- `slug` je unikatni
- `name_hr` i `name_en` postoje
- product helper ne pada na fallback zbog Supabase greske

### Forma ne sprema lead

Provjeri:

- env varijable
- RLS insert policy na `leads`
- RLS insert policy na `career_applications`
- network tab u browseru
- response od `/api/leads`
- response od `/api/career-applications`

### Slika iz Supabase storagea se ne prikazuje

Provjeri:

- bucket je public ako je javna slika
- URL je public URL
- host zavrsava na `.supabase.co`
- `next.config.ts` ima remote pattern za Supabase

## 28. Preporuceni Workflow Za Content

Za svaku vecu promjenu:

1. Prvo odluci poruku.
2. Ako poruka ne stane u jedan slide, napravi vise slideova.
3. Uredi `deck_slides`.
4. Provjeri desktop.
5. Provjeri mobile.
6. Provjeri da body ne trazi normalan page scroll.
7. Provjeri CTA.
8. Provjeri HR i EN.

Za proizvode:

1. Uredi `products`.
2. Uredi product slide u `deck_slides` ako treba.
3. Provjeri listing.
4. Provjeri detail rutu.

Za blog:

1. Dodaj `blog_posts` red.
2. Stavi `status = draft` dok nije spremno.
3. Kad je spremno, `published`.
4. Provjeri reader panel.

Za karijere:

1. Dodaj poziciju u `career_positions`.
2. Stavi `published`.
3. Testiraj prijavu.
4. Pregledaj `career_applications`.

## 29. Sto Je Namjerno Izostavljeno

Ova faza ne ukljucuje:

- Shopify
- cart
- checkout
- automatizirano slanje emailova
- CRM integraciju
- pricing engine
- upload CV-a kroz public formu
- upload UI za admin slike i CV datoteke
- user management ekran za kreiranje admin/editor/viewer korisnika

Sve to se moze dodati kasnije, ali nije dio ove faze.

## 30. Kratki Sažetak Za Buduceg Developera

Ne rebuildaj javni site kao scroll stranicu.

Supabase content treba uci u postojeci deck model:

```txt
deck_chapters -> public route/chapter
deck_slides -> one full-screen slide
```

Ako Supabase ne radi, fallback mora raditi.

Ako se dodaje novo javno poglavlje, prvo route i deck page u kodu, zatim Supabase seed.

Ako se mijenja samo tekst, proizvodi, blog ili karijere, prvo probaj kroz Supabase.

Ako content postane dugacak, ne gurati ga u jedan slide. Napravi novi slide ili blog reader.
