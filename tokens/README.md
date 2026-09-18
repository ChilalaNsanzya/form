# Getting the Zanaco library into this repo

Claude runs in a cloud container. It can read this GitHub repo, but it cannot
reach Figma, your OneDrive, or your local drive. So the library has to arrive
here. Two files do it: a token export and a folder of SVGs.

## 1. Colour, type and spacing tokens

Either route produces a file this repo can consume.

**Tokens Studio (recommended — it syncs by itself)**

1. In Figma, open the Tokens Studio plugin on the component library file.
2. Settings → Sync → **GitHub**. Repo `ChilalaNsanzya/form`, branch
   `claude/epic-pascal-tcw0ad`, file path `tokens/zanaco.tokens.json`.
3. Push. From then on every token change lands in this repo on its own.

**Figma variables export (one-off)**

Use any variables-to-JSON plugin and save the result as
`tokens/zanaco.tokens.json`. Both the W3C format (`$value`) and the Tokens
Studio format (`value`) are understood, and aliases like
`{color.brand.red}` are resolved.

Then apply them:

```
node scripts/build-tokens.mjs
```

This rewrites the token block inside `prototype/index.html`. Any CSS variable
whose token path is missing keeps its current value and is listed in the
output — fix those by editing `tokens/mapping.json`, which maps the
prototype's CSS variables to paths in your export.

## 2. Icons

1. In Figma, select the icon set (node `3396-35698`) and export as **SVG**.
2. Drop the files in `assets/icons/`.
3. If the filenames don't match the names the prototype uses, map them in
   `assets/icons/mapping.json` — e.g. `{ "cart": "ic-shopping-cart.svg" }`.
   Files already named `cart.svg`, `home.svg` and so on need no entry.
4. Run:

```
node scripts/import-icons.mjs
```

Stroked and filled icons are both handled, each icon keeps its own viewBox,
and colours are rewritten to `currentColor` so they inherit from the surface
they sit on. Anything unresolved keeps the drawn placeholder and is named in
the output.

## Current state

`tokens/zanaco.tokens.json` holds values inferred from a screenshot, not the
real library. Replacing it is the whole point of this directory.
