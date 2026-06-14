# ZOR Professional Design System

## Direction

The visual language is a premium no-scroll presentation deck adapted to a practical Croatian production brand. It should feel composed, visual, direct, and easy to operate. It must not look like a webshop, old catalogue, generic corporate site, or cheap green eco brand.

## Deck Layout

Public chapters render inside `DeckShell` with:

- fixed top navigation
- fixed mobile bottom chapter rail
- one active `DeckSlide` per viewport
- visible previous/next controls
- slide indicator with dots/labels
- route-level chapter theme

Slides must fit inside one screen. Do not stack long sections vertically. If content cannot fit, split it into another slide or link to an article/detail route.

## Chapter Themes

- Home: dark premium blue
- Products: light clean product blue
- Production: industrial neutral and steel blue
- Calculator: bright practical blue
- Blog: white/editorial
- Careers: dark blue with energetic cyan accent
- Contact: deep blue and white

## Typography

Use the system sans-serif stack. Headlines are large only on slide-level presentation surfaces. Body copy stays short, readable, and calm. Avoid cramped text blocks and long paragraphs.

## Component Rules

Use deck components for public pages:

- `DeckShell`
- `DeckPage`
- `DeckSlide`
- `DeckControls`
- `SlideIndicator`
- `ChapterThemeProvider`

Cards and controls should be compact enough for mobile. Interactive controls must be real buttons, links, inputs, or form elements with visible focus states.

## Visual Rules

Use strong product, production, calculator, careers, and contact visuals. Product slides can use clean CSS-built packaging/roll representations until final photography is available. Avoid cart controls, discount badges, urgency patterns, and webshop metaphors.

## Motion

Use fast fade/slide transitions only. Mouse wheel slide movement must be throttled. Respect `prefers-reduced-motion`.
