# ZOR Professional Admin Notes

Admin panel je na ruti:

```txt
/admin
```

Login je na:

```txt
/admin/login
```

Admin je jednostavan operativni panel za odrzavanje deck-style web stranice. Nije klasicni CMS za duga scroll poglavlja.

## Login

Admin koristi Supabase Auth.

Za rad trebaju env varijable:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Ako env varijable ne postoje, `/admin` redirecta na `/admin/login`, a login prikazuje poruku da Supabase nije konfiguriran.

## Prvi Admin Korisnik

Ako user management nije jos izgradjen u aplikaciji, prvog admina napravi rucno u Supabaseu:

1. U Supabase dashboardu otvori Authentication.
2. Dodaj usera s emailom i lozinkom.
3. Kopiraj `auth.users.id`.
4. U tablicu `profiles` dodaj red:

```txt
id: auth.users.id
email: email korisnika
full_name: ime korisnika
role: admin
```

Dozvoljene role:

- `admin`
- `editor`
- `viewer`

## Role

Viewer:

- moze citati admin content
- ne moze spremati ni brisati

Editor:

- moze upravljati deck poglavljima
- moze upravljati deck slideovima
- moze upravljati proizvodima
- moze upravljati blogom
- moze upravljati leadovima
- moze upravljati karijerama i prijavama

Admin:

- moze sve sto editor moze
- moze mijenjati site settings
- kasnije moze dobiti user/admin konfiguraciju

## Dashboard

Dashboard prikazuje:

- broj novih leadova
- broj calculator leadova
- broj novih career applications
- published products count
- published blog posts count
- quick links za Products, Deck Slides, Leads i Careers

Nema chartova jer za ovaj projekt nisu korisni.

## Deck Chapters

Deck chapters su glavna javna poglavlja:

- Home
- Proizvodi
- Proizvodnja
- Kalkulator
- Blog
- Karijere
- Kontakt

U adminu mozes:

- filtrirati po HR/EN
- dodati poglavlje
- urediti slug
- urediti label
- urediti nav label
- urediti route path
- urediti theme
- urediti background variant
- urediti sort order
- aktivirati/deaktivirati poglavlje

Vazno: `route_path` mora odgovarati ruti koja postoji u kodu. Supabase ne smije sam izmisljati novu javnu rutu.

## Deck Slides

Deck slides su ekrani unutar poglavlja.

U adminu mozes:

- filtrirati po localeu
- filtrirati po chapteru
- dodati slide
- urediti slide
- duplicirati slide
- aktivirati/deaktivirati slide
- obrisati slide ako nije jedini u poglavlju

Polja:

- `slide_key`
- `eyebrow`
- `title`
- `body`
- CTA label/href polja
- `visual_type`
- `image_url`
- `background_variant`
- `layout_variant`
- `content_alignment`
- `sort_order`

Pravila za tekst:

- javni web je prezentacija bez normalnog page scrolla
- svaki slide treba imati jednu jasnu poruku
- title preporuka: ispod 70 znakova
- body preporuka: ispod 220 znakova
- za dugi tekst koristiti blog

Admin ima jednostavan preview koji pomaze vidjeti kad tekst postaje predug.

## Products

Products admin upravlja tablicom `products`.

Mozes:

- dodati proizvod
- urediti proizvod
- promijeniti draft/published
- obrisati proizvod
- urediti slug
- urediti HR/EN nazive
- urediti HR/EN short/full descriptions
- urediti package size
- urediti roll count
- urediti layers
- urediti price EUR
- urediti business notes
- urediti recommended for
- urediti image URL
- urediti sort order

Helper pravilo:

```txt
Cijena je javna i prikazuje se po paketu. Za firme, apartmane i redovite mjesecne kolicine koristi se posebna napomena za ponudu.
```

## Blog Posts

Blog je mjesto za duzi tekst.

Mozes:

- filtrirati po localeu
- filtrirati po statusu
- dodati post
- urediti post
- draft/published status
- urediti slug
- urediti title
- urediti excerpt
- urediti content
- urediti SEO title
- urediti SEO description
- urediti cover image URL
- urediti published_at

Ako deck slide treba vise objasnjenja, ne siriti slide nego linkati blog.

## Leads

Leads admin upravlja tablicom `leads`.

Mozes:

- filtrirati po typeu
- filtrirati po statusu
- traziti po name/company/email/phone
- otvoriti lead detail
- vidjeti poruku
- vidjeti source page
- vidjeti source slide
- vidjeti product id ako postoji
- vidjeti calculator payload u citljivijem obliku
- promijeniti status
- arhivirati lead

Statusi:

- `new`
- `contacted`
- `won`
- `lost`
- `archived`

## Career Positions

Career positions admin upravlja tablicom `career_positions`.

Mozes:

- dodati poziciju
- urediti poziciju
- draft/published/archived status
- urediti HR/EN title
- urediti location
- urediti employment type
- urediti HR/EN description
- urediti HR/EN requirements
- urediti sort order

Predlozene pozicije:

- Operater na stroju za proizvodnju toaletnog papira
- Pomocni radnik u proizvodnji
- Radnik u pakiranju i pripremi robe
- Skladisno-proizvodni radnik
- Otvorena prijava

## Career Applications

Career applications admin upravlja tablicom `career_applications`.

Mozes:

- filtrirati po statusu
- filtrirati po poziciji
- otvoriti application detail
- vidjeti ime, telefon, email
- vidjeti odabranu poziciju
- vidjeti iskustvo
- vidjeti available from
- vidjeti message
- otvoriti CV link ako postoji
- promijeniti status
- arhivirati prijavu

Statusi:

- `new`
- `reviewed`
- `contacted`
- `rejected`
- `archived`

## Site Settings

Site settings admin upravlja tablicom `site_settings`.

Samo admin moze spremati promjene.

Postavke:

- `brand_name`
- `company_name`
- `location`
- `whatsapp_number`
- `contact_email`
- `phone`
- `address`
- `shop_url`
- `social_links`
- `default_locale`
- analytics IDs kasnije

Vrijednost je JSON. Za string vrijednosti mozes upisati obican tekst u adminu; kod ce ga spremiti kao JSON string.

## Uploads

Supabase bucketi:

- `deck-images`
- `product-images`
- `blog-images`
- `career-cv`

Upload slika je implementiran za deck slideove, proizvode i blog cover slike.

U formama za slide, proizvod i blog post polje za sliku (`ImageUploadField`) ima:

- text input gdje mozes zalijepiti postojeci `image_url`
- file picker koji uploada sliku u odgovarajuci bucket (`deck-images`, `product-images`, `blog-images`)
- nakon uploada automatski upisuje public URL u polje i pokazuje preview

Upload radi samo kad je Supabase konfiguriran i kad si prijavljen kao `admin` ili `editor` (storage RLS).

TODO za kasnije:

- `career-cv` upload kroz private/signed URL workflow (jos koristi `cv_url` polje)

## Public Integration

Public deck stranice i dalje:

- citaju active chapters/slides iz Supabasea kad env postoji
- koriste fallback content kad env ne postoji
- ostaju no-scroll
- koriste DeckShell/DeckPage/DeckSlide
- ne koriste stari model dugih public page sekcija

## Provjere

Prije deploya:

```bash
npm run lint
npm run build
npm run test:e2e
```

Rucno provjeri:

- `/admin/login`
- `/admin`
- viewer role ne moze spremati
- editor role moze spremati content
- admin role moze spremati settings
- `/hr` ostaje no-scroll
- mobile bottom nav i dalje radi
