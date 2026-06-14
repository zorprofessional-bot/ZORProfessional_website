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

## Homepage Slides

- Hero: Croatian production, availability, WhatsApp inquiry, and products CTA.
- For whom: homes, small firms/offices, apartments, and institutions.
- Why ZOR: Croatian production, steady availability, fair price, and quantity coordination.
- Quick path: products, calculator, careers, and contact.

## Product Content

Product data lives in `src/content/products.ts`. Current mock products:

- ZOR 24 Svakodnevni
- ZOR 24 Mekši
- ZOR 36 Zaliha

Product pages remain presentation slides, not webshop pages. Use inquiry CTAs, not cart controls.

## Blog Content

Blog data lives in `src/content/blog.ts`. Blog listing pages are deck-style. Blog article details may use an internal scrollable reader panel while the outer deck shell stays fixed.

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

When adding a public page, first decide the chapter and slide list. Add concise content to typed content modules, then compose the page with `DeckPage` and `DeckSlide` variants. Add a new visual component only when the existing deck visuals cannot express the content clearly.
