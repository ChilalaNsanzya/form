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
| 2 | Shops     | 3-up store logo grid | Grocery budget wallet, agri input financing |
| 3 | Homes     | 2-up property cards  | Rental deposit savings account, home loan, home insurance |
| 4 | Travel    | 4-up mode tiles      | Travel insurance, smart toll auto-pay, traveller wallet |
| 5 | Services  | 4-up category grid, search-first | Insurance hub, pay on completion |

Every screen shares the same vertical spine:

1. Promo rail (circular campaign shortcuts)
2. Featured hero — one item, large 16:9 image, gold CTA, **no carousel**
3. Second tier — the horizontally scrolling row, treatment varies per category
4. Banking layer — navy block, used nowhere else in the app
5. Icon list — the long tail, 40px icon thumbs

## Design decisions

- **The hero does not carousel.** Horizontal swipe already moves between
  categories; a swiping hero would capture those gestures. Horizontal motion
  lives one level down, where cards are narrower than the screen.
- **Navy is reserved for the bank.** Red is footer chrome only, gold is the
  merchant CTA, navy means Zanaco is transacting.
- **Banking follows content.** You see the house before you see the home loan.
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
