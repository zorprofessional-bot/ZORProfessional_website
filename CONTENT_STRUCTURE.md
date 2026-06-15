# ZOR Professional Content Structure

## Locales

The site uses explicit Croatian and English routes:

- Croatian routes live under `/hr`.
- English routes live under `/en`.
- `/` redirects to `/hr`.

Croatian is the primary language. English should be a clear equivalent, not a separate campaign.

## Public Page Model

Public pages use a deck model:

- A route is a chapter.
- A chapter contains short slides.
- Each slide carries one message.
- The URL stores the current slide with `?slide=slide-id`.
- The user moves through slides with controls, keyboard arrows, wheel throttling, or mobile swipe.

Normal window scrolling is not part of the public presentation experience.

## Supabase Content Backend

Supabase uses the same public content language:

- `deck_chapters` are main navigation chapters.
- `deck_slides` are full-screen deck slides inside a chapter.
- There is no `page_sections` model.
- Products, blog posts, career positions, leads, applications, settings, and storage assets live in separate Supabase tables.

Local typed content remains the fallback for development and for builds without Supabase env variables.

## Homepage Slides

- Hero: Croatian production, availability, WhatsApp inquiry, and products CTA.
- For whom: homes, small firms/offices, apartments, and institutions.
- Why ZOR: Croatian production, steady availability, fair price, and quantity coordination.
- Quick path: products, calculator, careers, and contact.

## Product Content

Product data can come from Supabase `products`. Fallback product data lives in `src/content/products.ts`. Current fallback products:

- ZORPro 24
- ZORPro 36

Product pages remain presentation slides, not webshop pages. Use inquiry CTAs, not cart controls.

## Blog Content

Blog data can come from Supabase `blog_posts`. Fallback blog data lives in `src/content/blog.ts`. Blog listing pages are deck-style. Blog article details may use an internal scrollable reader panel while the outer deck shell stays fixed.

## SEO Strategy

Croatian copy should naturally include:

- toaletni papir
- wc papir
- toaletni papir cijena
- toaletni papir za firme
- toaletni papir za apartmane
- toaletni papir 24 role
- toaletni papir 36 rola
- hrvatska proizvodnja toaletnog papira
- proizvođač toaletnog papira Hrvatska, when it reads naturally

Use these phrases only where they read naturally. Avoid keyword stuffing, repeated footer blocks, and hidden SEO text.

## Future Workflow

When adding a public page, first decide the chapter and slide list. Add concise fallback content to typed content modules, add matching Supabase chapter/slide seed data if it should be editable, then compose the page with `DeckPage` and `DeckSlide` variants. Add a new visual component only when the existing deck visuals cannot express the content clearly.
