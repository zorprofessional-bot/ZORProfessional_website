# Deck Architecture

## Concept

The public ZOR Professional website is a no-scroll deck website. It behaves like a premium interactive product presentation: one chapter route, one visible slide, and deliberate slide navigation.

## Chapter vs. Slide

A chapter is a main public route:

- `/hr`
- `/hr/proizvodi`
- `/hr/proizvodnja`
- `/hr/kalkulator`
- `/hr/blog`
- `/hr/karijere`
- `/hr/kontakt`

English routes mirror the same model under `/en`.

A slide is one full-screen message inside a chapter. Slides are defined as data passed to `DeckPage`, rendered by `DeckSlide`, and controlled by `DeckShell`.

## Core Components

- `DeckShell`: global public shell with fixed nav, viewport, controls, indicator, mobile nav, keyboard/wheel/touch handling, and URL slide state.
- `DeckPage`: chapter wrapper that receives locale, theme, active route key, and slide definitions.
- `DeckSlide`: one screen of content with eyebrow, title, body, visual, actions, layout, background, and tone.
- `DeckControls`: accessible previous/next buttons.
- `SlideIndicator`: current slide position and direct slide navigation.
- `ChapterThemeProvider`: per-chapter visual identity through CSS variables.

## Route Behavior

The route identifies the chapter. The current slide is stored in a query param:

```txt
/hr/proizvodi?slide=zor-24-svakodnevni
```

Controls push slide changes into browser history. Back and forward navigation update the active slide from the URL.

## Slide State Behavior

Inside a chapter:

- ArrowRight and ArrowDown move forward.
- ArrowLeft and ArrowUp move backward.
- Mouse wheel movement changes slides with throttling.
- Escape is ignored.
- Hidden slides are visually hidden and do not receive pointer interaction.

## Mobile Behavior

Mobile users get:

- fixed bottom chapter rail
- compact previous/next controls above the rail
- horizontal swipe for previous/next slide
- the same `?slide=...` URL behavior

Slides must be written and designed to fit in the remaining mobile viewport.

## Accessibility Rules

- Controls are real buttons.
- CTAs are links.
- Forms use real inputs, labels, and buttons.
- Focus states must remain visible.
- Slides use `aria-roledescription="slide"` and labelled headings.
- Slide indicator buttons have accessible names.
- Long article text uses a focusable internal reader panel.

## Internal Scrolling

Normal document scrolling is disabled on public deck pages. Internal scrolling is allowed only when the content itself is a reader or tool panel that cannot reasonably fit on one slide.

Allowed:

- Blog article reader panel.
- Future admin pages with forms and tables, if they use a separate non-deck shell.

Not allowed:

- Public chapter pages that stack sections vertically.
- Slides that require page scroll to understand the message.

## Adding Future Pages

1. Add or update the route in `src/content/site.ts`.
2. Define concise slide copy in `src/content/deck.ts` or a typed content module.
3. Compose slides with `DeckPage`.
4. Use an existing deck visual before creating a new one.
5. Keep each slide to one message, one visual, and one clear next action.
