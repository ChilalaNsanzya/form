# Zanaco Explore — super app store UI

Design prototype and Figma handoff spec for the Explore section of the Zanaco
super app: a five-category marketplace where each category journey terminates in
a Zanaco banking product.

Open `prototype/index.html` in a browser — it carries the working prototype and
the design documentation, and reads on a phone as well as a desktop.
`prototype/app.html` is the same screens with no device frame, for testing on a
real handset.

The app bar carries a back control on the left and the Zanaco mark on the right,
which returns to the main banking app. The mark in this build is a placeholder —
swap it for the real logo component.

## Structure

Footer navigation carries five categories. The whole page slides horizontally
between them, and the footer tabs jump to the same frames.

| # | Category  | Second-tier treatment | Banking layer |
|---|-----------|----------------------|---------------|
| 1 | Lifestyle | 2:3 poster rail      | Split a booking, membership debit order |
| 2 | Shops     | 3-up store logo grid | Family grocery lists, AI grocery list, grocery budget wallet |
| 3 | Homes     | Buy/Rent/Sell, location-first | Per mode: home loan (buy), deposit account (rent), loan settlement (sell) |
| 4 | Travel    | Journey planner, results after a route | Toll auto-pay, travel insurance; eSIM, mobile money and forex for arrivals |
| 5 | Copper Pages | Search-first, tenders, 4-up category grid | Pay a supplier directly, pay on completion, insurance hub |

Lifestyle, Shops and Copper Pages share a browse spine:

1. Status rail — circular updates, pinned below the app bar. It scrolls
   horizontally on its own and never moves with the page or triggers the
   category swipe
2. Featured hero — one item, large 16:9 image, gold CTA, **no carousel**
3. Second tier — the horizontally scrolling row, treatment varies per category
4. Zanaco card — copper block, used nowhere else in the app
5. Icon list — the long tail, 40px icon thumbs

Homes and Travel do not use that spine. They are input-first: the user arrives
with an intent and a place, not a mood to browse, so there is nothing worth
featuring until they have said where.

**Homes** opens on Buy / Rent / Sell, then a typed location field. The segment
switches the entire view below it — different filters, different results and a
different Zanaco card per mode. Buy leads to loan pre-qualification, Rent to the
rental deposit account, Sell to a valuation and settling an existing loan.

**Travel** opens on From and To with a swap control. Before a route exists the
screen shows recent journeys and an arrivals pack (eSIM, mobile money wallet,
forex) for visitors landing in Zambia. Once both ends are set, results are drawn
from route data — distance, tolls, driving time, and the operators and prices
that actually serve that pair. An unserved pair gets an honest empty state, not
another route's numbers.

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

## Running it on a phone

Two builds from one source:

| File | For |
|------|-----|
| `prototype/index.html` | The spec page — device frame, design notes, tokens, component list |
| `prototype/app.html` | The phone build — full screen, no frame. Generated by `node scripts/build-app.mjs` |

`app.html` is generated, not hand-edited. Change the screens in `index.html`
and rebuild.

### Local server

On Windows, double-click `serve.cmd`. Or from the repo root:

```
git pull
node scripts/serve.mjs
```

It prints two addresses — `http://localhost:8000/` for this machine and
`http://<your-lan-ip>:8000/` for a phone on the same wifi. `/` serves the
phone build; the spec page is at `/index.html`. Windows Firewall will ask to
allow Node the first time — it has to be allowed or the phone cannot connect.

Requires Node.js. With Python instead: `cd prototype && python -m http.server
8000`, then `http://<your-lan-ip>:8000/app.html`.

No server is strictly needed for the laptop: opening `prototype/app.html` from
disk works, since everything except the web fonts is inline. A phone does need
the server, or one of the hosted links below.

### Hosted

Enable GitHub Pages (Settings → Pages → deploy from this branch, root folder)
and the prototype is at
`https://chilalansanzya.github.io/form/prototype/app.html`, updating on every
push. Note this makes it publicly reachable by anyone with the URL.
