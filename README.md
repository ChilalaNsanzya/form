# Zanaco Explore — super app store UI

Design prototype and Figma handoff spec for the Explore section of the Zanaco
super app: a five-category marketplace where each category journey terminates in
a Zanaco banking product.

Open `prototype/index.html` in a browser.

## Structure

Footer navigation carries five categories. The whole page slides horizontally
between them, and the footer tabs jump to the same frames.

| # | Category  | Second-tier treatment | Banking layer |
|---|-----------|----------------------|---------------|
| 1 | Lifestyle | 2:3 poster rail      | Split a booking, membership debit order |
| 2 | Shops     | 3-up store logo grid | Family grocery lists, AI grocery list, grocery budget wallet |
| 3 | Homes     | 2-up property cards  | Rental deposit savings account, home loan, home insurance |
| 4 | Travel    | 4-up mode tiles      | Travel insurance, smart toll auto-pay, traveller wallet |
| 5 | Copper Pages | Search-first, tenders, 4-up category grid | Pay a supplier directly, pay on completion, insurance hub |

Every screen shares the same vertical spine:

1. Promo rail (circular campaign shortcuts)
2. Featured hero — one item, large 16:9 image, gold CTA, **no carousel**
3. Second tier — the horizontally scrolling row, treatment varies per category
4. Zanaco card — copper block, used nowhere else in the app
5. Icon list — the long tail, 40px icon thumbs

## Design decisions

- **The hero does not carousel.** Horizontal swipe already moves between
  categories; a swiping hero would capture those gestures. Horizontal motion
  lives one level down, where cards are narrower than the screen.
- **Copper is reserved for Zanaco.** Red is footer chrome only, gold is the
  merchant CTA, copper means Zanaco is transacting. Copper sits darker than the
  gold CTA so the two warm tones separate by value rather than hue.
- **The Zanaco card follows content.** You see the house before the home loan,
  the shops before the grocery list.
- **Grocery lists are a feature, not a shop.** They live in the Zanaco card on
  the Shops screen. A user can hold several lists, each shared with a different
  set of people, and add items to any of them from any store in Explore.
- **Full-screen horizontal swipe is an accelerator, not the primary nav.** It
  works at five pages and would break at seven. Two build requirements: a swipe
  starting on a horizontal rail scrolls the rail rather than the page, so keep
  enough full-bleed non-scrolling surface to page from; and each page must keep
  its own vertical scroll position across swipes.
- **Layout varies by content shape.** Posters for cinema, marks for retailers,
  price-led cards for property, mode tiles for transport, search for a directory.

## Tokens and components

Section 02 of the prototype lists the colour, radius, spacing and type tokens to
create as Figma variables. Section 04 lists the eleven components that cover all
five screens. Section 05 has the Figma build and prototype-wiring steps.

## Note on the Figma source

The referenced Figma library could not be read from the build environment —
`api.figma.com` is blocked by the environment network policy (403 at the egress
proxy), independent of any access token. Tokens and components here were built
from the reference screenshot and will need reconciling against the real
library.
