create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.deck_chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null check (locale in ('hr', 'en')),
  label text not null,
  nav_label text,
  route_path text not null,
  theme text,
  background_variant text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug)
);

create table if not exists public.deck_slides (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.deck_chapters(id) on delete cascade,
  locale text not null check (locale in ('hr', 'en')),
  slide_key text not null,
  eyebrow text,
  title text not null,
  body text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  visual_type text,
  image_url text,
  background_variant text,
  layout_variant text,
  content_alignment text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, locale, slide_key)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  name_hr text not null,
  name_en text not null,
  short_description_hr text,
  short_description_en text,
  description_hr text,
  description_en text,
  package_size text,
  roll_count integer,
  layers integer,
  price_eur numeric,
  business_note_hr text,
  business_note_en text,
  recommended_for_hr text,
  recommended_for_en text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  locale text not null check (locale in ('hr', 'en')),
  title text not null,
  excerpt text,
  content text,
  seo_title text,
  seo_description text,
  cover_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contact', 'product', 'calculator', 'career')),
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost', 'archived')),
  name text,
  email text,
  phone text,
  company text,
  message text,
  product_id uuid references public.products(id),
  calculator_payload jsonb,
  source_page text,
  source_slide text,
  created_at timestamptz not null default now()
);

create table if not exists public.career_positions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  title_hr text not null,
  title_en text not null,
  location text,
  employment_type text,
  description_hr text,
  description_en text,
  requirements_hr text,
  requirements_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  position_id uuid references public.career_positions(id),
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'rejected', 'archived')),
  name text,
  phone text,
  email text,
  experience text,
  available_from text,
  message text,
  cv_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists deck_chapters_locale_active_sort_idx
  on public.deck_chapters (locale, is_active, sort_order);
create index if not exists deck_slides_chapter_locale_active_sort_idx
  on public.deck_slides (chapter_id, locale, is_active, sort_order);
create index if not exists products_status_sort_idx
  on public.products (status, sort_order);
create index if not exists blog_posts_locale_status_published_idx
  on public.blog_posts (locale, status, published_at desc);
create index if not exists career_positions_status_sort_idx
  on public.career_positions (status, sort_order);
create index if not exists leads_created_status_idx
  on public.leads (created_at desc, status);
create index if not exists career_applications_created_status_idx
  on public.career_applications (created_at desc, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_deck_chapters_updated_at on public.deck_chapters;
create trigger set_deck_chapters_updated_at
  before update on public.deck_chapters
  for each row execute function public.set_updated_at();

drop trigger if exists set_deck_slides_updated_at on public.deck_slides;
create trigger set_deck_slides_updated_at
  before update on public.deck_slides
  for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists set_career_positions_updated_at on public.career_positions;
create trigger set_career_positions_updated_at
  before update on public.career_positions
  for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.deck_chapters enable row level security;
alter table public.deck_slides enable row level security;
alter table public.products enable row level security;
alter table public.blog_posts enable row level security;
alter table public.leads enable row level security;
alter table public.career_positions enable row level security;
alter table public.career_applications enable row level security;
alter table public.site_settings enable row level security;

create policy "Staff can read profiles"
  on public.profiles for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Admins can manage profiles"
  on public.profiles for all to authenticated
  using (public.current_profile_role() = 'admin')
  with check (public.current_profile_role() = 'admin');

create policy "Public can read active deck chapters"
  on public.deck_chapters for select to anon, authenticated
  using (is_active = true);
create policy "Staff can read all deck chapters"
  on public.deck_chapters for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Editors can manage deck chapters"
  on public.deck_chapters for all to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

create policy "Public can read active deck slides"
  on public.deck_slides for select to anon, authenticated
  using (is_active = true);
create policy "Staff can read all deck slides"
  on public.deck_slides for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Editors can manage deck slides"
  on public.deck_slides for all to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

create policy "Public can read published products"
  on public.products for select to anon, authenticated
  using (status = 'published');
create policy "Staff can read all products"
  on public.products for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Editors can manage products"
  on public.products for all to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

create policy "Public can read published blog posts"
  on public.blog_posts for select to anon, authenticated
  using (status = 'published');
create policy "Staff can read all blog posts"
  on public.blog_posts for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Editors can manage blog posts"
  on public.blog_posts for all to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

create policy "Public can insert leads"
  on public.leads for insert to anon, authenticated
  with check (true);
create policy "Staff can read leads"
  on public.leads for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Editors can update lead status"
  on public.leads for update to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

create policy "Public can read published career positions"
  on public.career_positions for select to anon, authenticated
  using (status = 'published');
create policy "Staff can read all career positions"
  on public.career_positions for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Editors can manage career positions"
  on public.career_positions for all to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

create policy "Public can insert career applications"
  on public.career_applications for insert to anon, authenticated
  with check (true);
create policy "Staff can read career applications"
  on public.career_applications for select to authenticated
  using (public.current_profile_role() in ('admin', 'editor', 'viewer'));
create policy "Editors can update career application status"
  on public.career_applications for update to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);
create policy "Editors can manage site settings"
  on public.site_settings for all to authenticated
  using (public.current_profile_role() in ('admin', 'editor'))
  with check (public.current_profile_role() in ('admin', 'editor'));

grant usage on schema public to anon, authenticated;
grant select on public.deck_chapters, public.deck_slides, public.products, public.blog_posts, public.career_positions, public.site_settings to anon, authenticated;
grant insert on public.leads, public.career_applications to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.deck_chapters, public.deck_slides, public.products, public.blog_posts, public.career_positions, public.site_settings to authenticated;
grant select on public.leads, public.career_applications to authenticated;
grant update (status) on public.leads to authenticated;
grant update (status) on public.career_applications to authenticated;

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('deck-images', 'deck-images', true),
  ('blog-images', 'blog-images', true),
  ('career-cv', 'career-cv', false)
on conflict (id) do update set
  public = excluded.public;

create policy "Public can read ZOR public images"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('product-images', 'deck-images', 'blog-images'));
create policy "Editors can manage ZOR public images"
  on storage.objects for all to authenticated
  using (
    bucket_id in ('product-images', 'deck-images', 'blog-images')
    and public.current_profile_role() in ('admin', 'editor')
  )
  with check (
    bucket_id in ('product-images', 'deck-images', 'blog-images')
    and public.current_profile_role() in ('admin', 'editor')
  );
create policy "Staff can read career CV files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'career-cv'
    and public.current_profile_role() in ('admin', 'editor', 'viewer')
  );
create policy "Editors can manage career CV files"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'career-cv'
    and public.current_profile_role() in ('admin', 'editor')
  )
  with check (
    bucket_id = 'career-cv'
    and public.current_profile_role() in ('admin', 'editor')
  );

insert into public.deck_chapters
  (slug, locale, label, nav_label, route_path, theme, background_variant, sort_order, is_active)
values
  ('home', 'hr', 'Home', 'Početna', '/hr', 'dark-premium-blue', 'theme', 1, true),
  ('proizvodi', 'hr', 'Proizvodi', 'Proizvodi', '/hr/proizvodi', 'light-product-blue', 'theme', 2, true),
  ('proizvodnja', 'hr', 'Proizvodnja', 'Proizvodnja', '/hr/proizvodnja', 'industrial-neutral', 'theme', 3, true),
  ('kalkulator', 'hr', 'Kalkulator', 'Kalkulator', '/hr/kalkulator', 'practical-blue', 'theme', 4, true),
  ('blog', 'hr', 'Blog', 'Blog', '/hr/blog', 'editorial-white', 'theme', 5, true),
  ('karijere', 'hr', 'Karijere', 'Karijere', '/hr/karijere', 'energetic-dark-blue', 'theme', 6, true),
  ('kontakt', 'hr', 'Kontakt', 'Kontakt', '/hr/kontakt', 'contact-blue', 'theme', 7, true),
  ('home', 'en', 'Home', 'Home', '/en', 'dark-premium-blue', 'theme', 1, true),
  ('products', 'en', 'Products', 'Products', '/en/products', 'light-product-blue', 'theme', 2, true),
  ('production', 'en', 'Production', 'Production', '/en/production', 'industrial-neutral', 'theme', 3, true),
  ('calculator', 'en', 'Calculator', 'Calculator', '/en/calculator', 'practical-blue', 'theme', 4, true),
  ('blog', 'en', 'Blog', 'Blog', '/en/blog', 'editorial-white', 'theme', 5, true),
  ('careers', 'en', 'Careers', 'Careers', '/en/careers', 'energetic-dark-blue', 'theme', 6, true),
  ('contact', 'en', 'Contact', 'Contact', '/en/contact', 'contact-blue', 'theme', 7, true)
on conflict (locale, slug) do update set
  label = excluded.label,
  nav_label = excluded.nav_label,
  route_path = excluded.route_path,
  theme = excluded.theme,
  background_variant = excluded.background_variant,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.deck_slides
  (chapter_id, locale, slide_key, eyebrow, title, body, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, visual_type, background_variant, layout_variant, content_alignment, sort_order, is_active)
select c.id, s.locale, s.slide_key, s.eyebrow, s.title, s.body, s.primary_cta_label, s.primary_cta_href, s.secondary_cta_label, s.secondary_cta_href, s.visual_type, s.background_variant, s.layout_variant, s.content_alignment, s.sort_order, true
from (
  values
    ('home', 'hr', 'hero', 'ZOR Professional', 'Toaletni papir iz hrvatske proizvodnje, dostupan kad vam treba.', 'Za domove, manje firme, apartmane i ustanove koje žele pouzdanu opskrbu, fer cijenu i jednostavnu narudžbu.', 'Pošalji WhatsApp upit', 'https://wa.me/385000000000', 'Pogledaj proizvode', '/hr/proizvodi', 'hero-image', 'theme', 'split', 'center', 1),
    ('home', 'hr', 'za-koga-je', 'Za koga je', 'Za svakodnevnu potrošnju bez kompliciranja.', 'Domovi, male firme, apartmani i manje zajednice trebaju jednostavnu opskrbu koja radi svaki mjesec.', null, null, null, null, 'audience-cards', 'light', 'splitReverse', 'center', 2),
    ('home', 'hr', 'zasto-zor', 'Zašto ZOR', 'Proizvodnja, dostupnost i fer cijena.', 'Hrvatska proizvodnja, stalna dostupnost i dogovor za količine bez kompliciranja.', null, null, null, null, 'value-cards', 'dark', 'split', 'center', 3),
    ('home', 'hr', 'brzi-put-dalje', 'Brzi put dalje', 'Krenite prema proizvodima, kalkulatoru ili kontaktu.', 'Pogledajte pakete, izračunajte potrošnju ili pošaljite upit odmah.', 'Izračunaj potrošnju', '/hr/kalkulator', 'Kontakt', '/hr/kontakt', 'route-grid', 'theme', 'split', 'center', 4),
    ('proizvodi', 'hr', 'pregled', 'Proizvodi', 'Dva jednostavna paketa za različite potrebe.', 'Javna cijena po paketu. Za firme, apartmane i redovite mjesečne količine šaljemo posebnu ponudu.', 'Pošalji upit za cijenu', 'https://wa.me/385000000000', 'Izračunaj potrošnju', '/hr/kalkulator', 'product-image', 'theme', 'split', 'center', 1),
    ('proizvodi', 'hr', 'zorpro-24', '24 role', 'ZORPro 24', 'Praktičan paket za domove, manje urede, apartmane i redovitu zalihu.', 'Detalji proizvoda', '/hr/proizvodi/zorpro-24', 'WhatsApp upit', 'https://wa.me/385000000000', 'product-pack', 'soft', 'splitReverse', 'center', 2),
    ('proizvodi', 'hr', 'zorpro-36', '36 rola', 'ZORPro 36', 'Za obitelji, apartmane, male firme i zajednice koje žele rjeđe naručivati.', 'Detalji proizvoda', '/hr/proizvodi/zorpro-36', 'WhatsApp upit', 'https://wa.me/385000000000', 'product-pack', 'soft', 'splitReverse', 'center', 3),
    ('proizvodi', 'hr', 'poslovne-kolicine', 'Poslovne količine', 'Za poslovne količine dogovaramo posebnu ponudu.', 'Pošaljite upit i javimo se s prijedlogom prema količini i učestalosti narudžbe.', 'Pošalji poslovni upit', 'https://wa.me/385000000000', 'Svi proizvodi', '/hr/proizvodi', 'product-cards', 'light', 'split', 'center', 4),
    ('proizvodnja', 'hr', 'hrvatska-proizvodnja', 'Proizvodnja', 'Hrvatska proizvodnja toaletnog papira.', 'ZOR Professional nastaje kroz jednostavan i kontroliran proizvodni proces.', 'Pošalji upit', 'https://wa.me/385000000000', null, null, 'production-image', 'theme', 'split', 'center', 1),
    ('proizvodnja', 'hr', 'jumbo-rola', '01', 'Jumbo rola', 'Proces počinje od velike role sirovine pripremljene za premotavanje.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 2),
    ('proizvodnja', 'hr', 'premotavanje', '02', 'Premotavanje', 'Papir se premotava u format prikladan za svakodnevnu uporabu.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 3),
    ('proizvodnja', 'hr', 'rezanje', '03', 'Rezanje', 'Logovi se režu na gotove role.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 4),
    ('proizvodnja', 'hr', 'pakiranje', '04', 'Pakiranje', 'Role se pakiraju u praktične pakete od 24 ili 36 rola.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 5),
    ('proizvodnja', 'hr', 'skladiste', '05', 'Dostupnost iz skladišta.', 'Cilj je stalna dostupnost i jednostavna opskrba za domove, firme i apartmane.', 'Pošalji upit', 'https://wa.me/385000000000', null, null, 'process-step', 'steel', 'split', 'center', 6),
    ('kalkulator', 'hr', 'intro', 'Kalkulator', 'Izračunajte koliko toaletnog papira trebate mjesečno.', 'Unesite broj ljudi i koliko vam sadašnji paket traje.', 'Pošalji okvirnu potrošnju', 'https://wa.me/385000000000', null, null, 'calculator-image', 'theme', 'split', 'center', 1),
    ('kalkulator', 'hr', 'unos', 'Unos potrošnje', 'Unos potrošnje', 'Kalkulator koristi vaše stvarne navike, ne generičku procjenu.', null, null, null, null, 'calculator-form', 'light', 'splitReverse', 'center', 2),
    ('kalkulator', 'hr', 'rezultat', 'Preporuka', 'Preporuka paketa', 'Dobit ćete procjenu mjesečne potrošnje i preporučeni ZORPro paket.', null, null, null, null, 'calculator-result', 'soft', 'split', 'center', 3),
    ('kalkulator', 'hr', 'whatsapp-upit', 'WhatsApp', 'Pošaljite izračun na WhatsApp.', 'Jednim klikom možete poslati izračun i zatražiti ponudu.', 'WhatsApp upit', 'https://wa.me/385000000000', null, null, 'whatsapp-panel', 'theme', 'splitReverse', 'center', 4),
    ('blog', 'hr', 'featured', 'Blog', 'Kratki vodiči za odluke prije upita.', 'Blog pomaže kupcu razumjeti potrošnju, zalihu i lokalnu proizvodnju.', 'Pogledaj proizvode', '/hr/proizvodi', null, null, 'blog-cards', 'theme', 'split', 'center', 1),
    ('blog', 'hr', 'vodici', 'Praktični vodiči', 'Planiranje potrošnje treba biti jednostavno.', 'Najbolji tekstovi vode prema jasnijoj količini i boljem pitanju.', null, null, null, null, 'blog-cards', 'editorial', 'splitReverse', 'center', 2),
    ('blog', 'hr', 'savjeti', 'Proizvodnja i kupnja', 'Savjeti ostaju kratki, korisni i povezani s opskrbom.', 'Ako tema traži duži tekst, članak koristi unutarnji reader panel.', null, null, null, null, 'blog-cards', 'light', 'split', 'center', 3),
    ('karijere', 'hr', 'uvod', 'Karijere', 'Nauči raditi na modernoj proizvodnoj liniji.', 'Ne tražimo savršen CV. Tražimo odgovorne ljude koji žele naučiti posao.', 'Pošalji upit za posao', 'https://wa.me/385000000000', null, null, 'careers-image', 'theme', 'split', 'center', 1),
    ('karijere', 'hr', 'operater', 'Operater na stroju', 'Rad na liniji traži pažnju, ritam i odgovornost.', 'Rad na proizvodnoj liniji za toaletni papir uz učenje kroz praksu.', null, null, null, null, 'career-cards', 'dark', 'splitReverse', 'center', 2),
    ('karijere', 'hr', 'obuka', 'Obuka', 'Obuka i jasna očekivanja', 'Bitni su dolazak na vrijeme, uredan rad i spremnost na učenje.', null, null, null, null, 'career-cards', 'theme', 'split', 'center', 3),
    ('karijere', 'hr', 'pozicije', 'Otvorene pozicije', 'Otvorene pozicije', 'Operater, pomoćni radnik, pakiranje, skladišno-proizvodni radnik i otvorena prijava.', null, null, null, null, 'position-cards', 'light', 'splitReverse', 'center', 4),
    ('karijere', 'hr', 'prijava', 'Prijava', 'Prijavite se za rad na Jankomiru.', 'Lokacija: Robni terminali Jankomir.', 'Pošalji prijavu', 'https://wa.me/385000000000', null, null, 'career-form', 'dark', 'split', 'center', 5),
    ('kontakt', 'hr', 'whatsapp', 'WhatsApp', 'Najbrži put je WhatsApp.', 'Pošaljite upit za dom, firmu, apartman ili redovitu količinu.', 'Pošalji WhatsApp upit', 'https://wa.me/385000000000', 'upit@zor-professional.hr', 'mailto:upit@zor-professional.hr', 'whatsapp-panel', 'theme', 'split', 'center', 1),
    ('kontakt', 'hr', 'forma', 'Kontakt forma', 'Kontakt forma', 'Ostavite podatke i javit ćemo se s odgovorom.', null, null, null, null, 'contact-form', 'dark', 'splitReverse', 'center', 2),
    ('kontakt', 'hr', 'lokacija', 'Lokacija', 'Robni terminali Jankomir', 'ZOR Professional by ZOR d.o.o.', null, null, null, null, 'contact-details', 'theme', 'split', 'center', 3),
    ('home', 'en', 'hero', 'ZOR Professional', 'Toilet paper from Croatian production, available when you need it.', 'For homes, smaller companies, apartments, and institutions that want reliable supply, a fair price, and simple ordering.', 'Send WhatsApp inquiry', 'https://wa.me/385000000000', 'View products', '/en/products', 'hero-image', 'theme', 'split', 'center', 1),
    ('home', 'en', 'who-it-is-for', 'Who it is for', 'For everyday demand without complication.', 'Homes, small companies, apartments, and smaller communities need simple supply that works every month.', null, null, null, null, 'audience-cards', 'light', 'splitReverse', 'center', 2),
    ('home', 'en', 'why-zor', 'Why ZOR', 'Production, availability, and a fair price.', 'Croatian production, steady availability, and quantity coordination without complication.', null, null, null, null, 'value-cards', 'dark', 'split', 'center', 3),
    ('home', 'en', 'quick-path', 'Quick path', 'Move toward products, calculator, or contact.', 'View packs, calculate demand, or send an inquiry immediately.', 'Calculate consumption', '/en/calculator', 'Contact', '/en/contact', 'route-grid', 'theme', 'split', 'center', 4),
    ('products', 'en', 'overview', 'Products', 'Two simple packs for different needs.', 'Public package price. For companies, apartments, and recurring monthly quantities, we send a dedicated offer.', 'Ask for price', 'https://wa.me/385000000000', 'Calculate consumption', '/en/calculator', 'product-image', 'theme', 'split', 'center', 1),
    ('products', 'en', 'zorpro-24', '24 rolls', 'ZORPro 24', 'A practical pack for homes, smaller offices, apartments, and regular stock.', 'Product details', '/en/products/zorpro-24', 'WhatsApp inquiry', 'https://wa.me/385000000000', 'product-pack', 'soft', 'splitReverse', 'center', 2),
    ('products', 'en', 'zorpro-36', '36 rolls', 'ZORPro 36', 'For families, apartments, small companies, and communities that want fewer reorders.', 'Product details', '/en/products/zorpro-36', 'WhatsApp inquiry', 'https://wa.me/385000000000', 'product-pack', 'soft', 'splitReverse', 'center', 3),
    ('products', 'en', 'business-quantities', 'Business quantities', 'For business quantities, we prepare a dedicated offer.', 'Send an inquiry and we will respond with a proposal based on quantity and ordering frequency.', 'Send business inquiry', 'https://wa.me/385000000000', 'All products', '/en/products', 'product-cards', 'light', 'split', 'center', 4),
    ('production', 'en', 'croatian-production', 'Production', 'Croatian toilet paper production.', 'ZOR Professional is made through a simple and controlled production process.', 'Send inquiry', 'https://wa.me/385000000000', null, null, 'production-image', 'theme', 'split', 'center', 1),
    ('production', 'en', 'jumbo-roll', '01', 'Jumbo roll', 'The process starts with a large raw material roll prepared for rewinding.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 2),
    ('production', 'en', 'rewinding', '02', 'Rewinding', 'Paper is rewound into a format suitable for everyday use.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 3),
    ('production', 'en', 'cutting', '03', 'Cutting', 'Logs are cut into finished rolls.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 4),
    ('production', 'en', 'packing', '04', 'Packing', 'Rolls are packed into practical 24-roll or 36-roll packs.', null, null, null, null, 'process-step', 'steel', 'split', 'center', 5),
    ('production', 'en', 'warehouse', '05', 'Warehouse availability.', 'The goal is steady availability and simple supply for homes, companies, and apartments.', 'Send inquiry', 'https://wa.me/385000000000', null, null, 'process-step', 'steel', 'split', 'center', 6),
    ('calculator', 'en', 'intro', 'Calculator', 'Calculate how much toilet paper you need monthly.', 'Enter the number of people and how long your current pack lasts.', 'Send estimated demand', 'https://wa.me/385000000000', null, null, 'calculator-image', 'theme', 'split', 'center', 1),
    ('calculator', 'en', 'input', 'Consumption input', 'Consumption input', 'The calculator uses your real habits, not a generic estimate.', null, null, null, null, 'calculator-form', 'light', 'splitReverse', 'center', 2),
    ('calculator', 'en', 'result', 'Recommendation', 'Pack recommendation', 'You will get an estimated monthly demand and a recommended ZORPro pack.', null, null, null, null, 'calculator-result', 'soft', 'split', 'center', 3),
    ('calculator', 'en', 'whatsapp-inquiry', 'WhatsApp', 'Send the calculation on WhatsApp.', 'With one click, you can send the estimate and request an offer.', 'WhatsApp inquiry', 'https://wa.me/385000000000', null, null, 'whatsapp-panel', 'theme', 'splitReverse', 'center', 4),
    ('blog', 'en', 'featured', 'Blog', 'Short guides for decisions before inquiry.', 'The blog helps buyers understand demand, stock, and local production.', 'View products', '/en/products', null, null, 'blog-cards', 'theme', 'split', 'center', 1),
    ('blog', 'en', 'guides', 'Practical guides', 'Consumption planning should stay simple.', 'The best posts lead to a clearer quantity and a better question.', null, null, null, null, 'blog-cards', 'editorial', 'splitReverse', 'center', 2),
    ('blog', 'en', 'advice', 'Production and buying', 'Advice stays short, useful, and connected to supply.', 'If a topic needs longer text, the article uses an internal reader panel.', null, null, null, null, 'blog-cards', 'light', 'split', 'center', 3),
    ('careers', 'en', 'intro', 'Careers', 'Learn to work on a modern production line.', 'We do not need a perfect CV. We need responsible people who want to learn the job.', 'Send job inquiry', 'https://wa.me/385000000000', null, null, 'careers-image', 'theme', 'split', 'center', 1),
    ('careers', 'en', 'operator', 'Machine operator', 'Line work requires attention, rhythm, and responsibility.', 'Work on a toilet paper production line with hands-on training.', null, null, null, null, 'career-cards', 'dark', 'splitReverse', 'center', 2),
    ('careers', 'en', 'training', 'Training', 'Training and clear expectations', 'Being on time, orderly work, and willingness to learn matter.', null, null, null, null, 'career-cards', 'theme', 'split', 'center', 3),
    ('careers', 'en', 'positions', 'Open positions', 'Open positions', 'Operator, assistant worker, packing, warehouse-production worker, and open application.', null, null, null, null, 'position-cards', 'light', 'splitReverse', 'center', 4),
    ('careers', 'en', 'application', 'Application', 'Apply for work at Jankomir.', 'Location: Robni terminali Jankomir.', 'Send application', 'https://wa.me/385000000000', null, null, 'career-form', 'dark', 'split', 'center', 5),
    ('contact', 'en', 'whatsapp', 'WhatsApp', 'The fastest path is WhatsApp.', 'Send an inquiry for a home, company, apartment, or recurring quantity.', 'Send WhatsApp inquiry', 'https://wa.me/385000000000', 'upit@zor-professional.hr', 'mailto:upit@zor-professional.hr', 'whatsapp-panel', 'theme', 'split', 'center', 1),
    ('contact', 'en', 'form', 'Contact form', 'Contact form', 'Leave your details and we will respond.', null, null, null, null, 'contact-form', 'dark', 'splitReverse', 'center', 2),
    ('contact', 'en', 'location', 'Location', 'Robni terminali Jankomir', 'ZOR Professional by ZOR d.o.o.', null, null, null, null, 'contact-details', 'theme', 'split', 'center', 3)
) as s(chapter_slug, locale, slide_key, eyebrow, title, body, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, visual_type, background_variant, layout_variant, content_alignment, sort_order)
join public.deck_chapters c on c.slug = s.chapter_slug and c.locale = s.locale
on conflict (chapter_id, locale, slide_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  body = excluded.body,
  primary_cta_label = excluded.primary_cta_label,
  primary_cta_href = excluded.primary_cta_href,
  secondary_cta_label = excluded.secondary_cta_label,
  secondary_cta_href = excluded.secondary_cta_href,
  visual_type = excluded.visual_type,
  background_variant = excluded.background_variant,
  layout_variant = excluded.layout_variant,
  content_alignment = excluded.content_alignment,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.products
  (slug, status, name_hr, name_en, short_description_hr, short_description_en, description_hr, description_en, package_size, roll_count, layers, price_eur, business_note_hr, business_note_en, recommended_for_hr, recommended_for_en, image_url, sort_order)
values
  ('zorpro-24', 'published', 'ZORPro 24', 'ZORPro 24', 'Praktičan paket za domove, manje urede, apartmane i redovitu zalihu.', 'A practical pack for homes, smaller offices, apartments, and regular stock.', 'ZORPro 24 je jednostavan izbor kada su važni dostupnost, fer cijena i narudžba bez dugog kataloga.', 'ZORPro 24 is a simple choice when availability, a fair price, and ordering without a long catalogue matter.', '24 role', 24, 2, 12.90, 'Posebna ponuda za redovite količine.', 'Dedicated offer for recurring quantities.', 'Domovi, uredi i apartmani', 'Homes, offices, and apartments', '/visuals/product-range.png', 1),
  ('zorpro-36', 'published', 'ZORPro 36', 'ZORPro 36', 'Veći paket za obitelji, apartmane, male firme i zajednice koje žele rjeđe naručivati.', 'A larger pack for families, apartments, small companies, and communities that want fewer reorders.', 'ZORPro 36 pomaže držati mirniju zalihu za prostore s većom mjesečnom potrošnjom.', 'ZORPro 36 helps keep calmer stock for spaces with higher monthly demand.', '36 rola', 36, 2, 18.90, 'Praktično za dogovorene mjesečne količine.', 'Practical for agreed monthly quantities.', 'Firme, ustanove i zajednice', 'Companies, institutions, and communities', '/visuals/product-range.png', 2)
on conflict (slug) do update set
  status = excluded.status,
  name_hr = excluded.name_hr,
  name_en = excluded.name_en,
  short_description_hr = excluded.short_description_hr,
  short_description_en = excluded.short_description_en,
  description_hr = excluded.description_hr,
  description_en = excluded.description_en,
  package_size = excluded.package_size,
  roll_count = excluded.roll_count,
  layers = excluded.layers,
  price_eur = excluded.price_eur,
  business_note_hr = excluded.business_note_hr,
  business_note_en = excluded.business_note_en,
  recommended_for_hr = excluded.recommended_for_hr,
  recommended_for_en = excluded.recommended_for_en,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

insert into public.blog_posts
  (slug, status, locale, title, excerpt, content, seo_title, seo_description, published_at)
values
  ('kako-planirati-potrosnju-toaletnog-papira', 'published', 'hr', 'Kako planirati potrošnju toaletnog papira bez prevelike zalihe', 'Kratak vodič za apartmane, manje firme i ustanove koje žele jasniju mjesečnu procjenu.', 'Dobra procjena počinje brojem korisnika, ritmom korištenja prostora i sigurnosnom zalihom.

Za apartmane je sezonalnost važnija od prosjeka, dok škole i firme češće trebaju stabilan ritam narudžbe.', 'Kako planirati potrošnju toaletnog papira', 'Vodič za planiranje potrošnje toaletnog papira.', '2026-06-14'),
  ('zasto-je-vazna-lokalna-proizvodnja', 'published', 'hr', 'Zašto je lokalna proizvodnja važna za pouzdanu opskrbu', 'Blizina proizvodnje pomaže u dostupnosti, komunikaciji i jednostavnijem dogovoru.', 'Lokalna proizvodnja skraćuje lanac dogovora i olakšava planiranje redovitih narudžbi.

Za kupce koji ne žele webshop proces, izravan upit često je najbrži način da dobiju pravi sljedeći korak.', 'Zašto je važna lokalna proizvodnja', 'Lokalna proizvodnja i pouzdana opskrba toaletnim papirom.', '2026-06-14'),
  ('toaletni-papir-za-apartmane', 'published', 'hr', 'Toaletni papir za apartmane: što je važno prije sezone', 'Apartmanska potrošnja traži jednostavnu zalihu, uredan dojam i brz dogovor.', 'Apartmani imaju neujednačen ritam potrošnje, pa je dobro planirati prema sezoni, broju ležajeva i prosječnom trajanju boravka.

Kvaliteta ne mora izgledati luksuzno, ali mora djelovati uredno, pouzdano i dovoljno dobra za gosta.', 'Toaletni papir za apartmane', 'Praktični vodič za toaletni papir za apartmane.', '2026-06-14'),
  ('how-to-plan-toilet-paper-consumption', 'published', 'en', 'How to plan toilet paper consumption without overstocking', 'A short guide for apartments, small companies, and institutions that want a clearer monthly estimate.', 'A good estimate starts with user count, the rhythm of the space, and a practical safety stock.

For apartments, seasonality matters more than averages, while schools and companies often need a steady ordering rhythm.', 'How to plan toilet paper consumption', 'A guide for planning toilet paper consumption.', '2026-06-14'),
  ('why-local-production-matters', 'published', 'en', 'Why local production matters for reliable supply', 'Production close to the market helps with availability, communication, and simpler coordination.', 'Local production shortens the coordination chain and makes repeat orders easier to plan.

For buyers who do not need a webshop process, a direct inquiry is often the fastest next step.', 'Why local production matters', 'Local production and reliable toilet paper supply.', '2026-06-14'),
  ('toilet-paper-for-apartments', 'published', 'en', 'Toilet paper for apartments: what matters before the season', 'Apartment demand needs simple stock, a neat impression, and fast coordination.', 'Apartments have uneven consumption, so planning should follow the season, bed count, and average stay length.

The product does not need to feel luxury, but it should look neat, reliable, and good enough for guests.', 'Toilet paper for apartments', 'A practical guide for toilet paper for apartments.', '2026-06-14')
on conflict (locale, slug) do update set
  status = excluded.status,
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

insert into public.career_positions
  (status, title_hr, title_en, location, employment_type, description_hr, description_en, requirements_hr, requirements_en, sort_order)
values
  ('published', 'Operater na stroju', 'Machine operator', 'Robni terminali Jankomir', 'Proizvodnja', 'Rad na proizvodnoj liniji za toaletni papir uz učenje kroz praksu.', 'Work on a toilet paper production line with hands-on training.', 'Pouzdanost, urednost i spremnost na učenje.', 'Reliability, order, and willingness to learn.', 1),
  ('published', 'Pomoćni radnik u pakiranju', 'Packing assistant', 'Robni terminali Jankomir', 'Pakiranje', 'Pomoć u pakiranju, pripremi i održavanju urednog radnog prostora.', 'Support in packing, preparation, and keeping the workspace orderly.', 'Odgovoran dolazak, pažnja i timski rad.', 'Responsible attendance, attention, and teamwork.', 2),
  ('published', 'Otvorena prijava', 'Open application', 'Robni terminali Jankomir', 'Proizvodnja i skladište', 'Javite se ako želite raditi u proizvodnji, pakiranju ili skladišno-proizvodnim poslovima.', 'Apply if you want to work in production, packing, or warehouse-production roles.', 'Osnovni podaci i vrsta posla koja vas zanima.', 'Basic details and the kind of work you are interested in.', 3);

insert into public.site_settings (key, value)
values
  ('brand_name', '"ZOR Professional"'::jsonb),
  ('company_name', '"ZOR d.o.o."'::jsonb),
  ('location', '"Robni terminali Jankomir"'::jsonb),
  ('shop_url', '"https://shop.zorpro.hr"'::jsonb),
  ('whatsapp_number', '"385000000000"'::jsonb),
  ('contact_email', '"upit@zor-professional.hr"'::jsonb),
  ('phone', '"+385 00 000 000"'::jsonb)
on conflict (key) do update set
  value = excluded.value;
