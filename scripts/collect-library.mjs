/* Copies the Zanaco component library into this repo so Claude can read it.
   Claude runs in a cloud container: it cannot see your C: drive, your OneDrive
   or anything on your localhost. This repo is the bridge — run this on YOUR
   machine, commit, push.

   From a folder (OneDrive, a local export, anywhere):
     node scripts/collect-library.mjs "C:\\Users\\you\\...\\Component Library"

   From a dev server you have running (Vite, Storybook, a design-token API):
     node scripts/collect-library.mjs http://localhost:5180/tokens.json
     node scripts/collect-library.mjs http://localhost:5180/icons/cart.svg

   Then:  git add -A && git commit -m "Add component library" && git push   */
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, extname, basename, resolve } from "node:path";

const SRC = process.argv[2];
const ICONS = "assets/icons";
const TOKENS = "tokens";

if (!SRC) {
  console.error("Give me a folder path or a URL. See the comment at the top of this file.");
  process.exit(1);
}

await mkdir(ICONS, { recursive: true });
await mkdir(TOKENS, { recursive: true });

const saveIcon = async (name, text) => {
  const clean = name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
  await writeFile(join(ICONS, clean), text);
  return clean;
};

if (/^https?:\/\//i.test(SRC)) {
  const res = await fetch(SRC).catch(e => { console.error(`Could not reach ${SRC} — is the server running?\n  ${e.message}`); process.exit(1); });
  if (!res.ok) { console.error(`${SRC} returned ${res.status}`); process.exit(1); }
  const body = await res.text();
  const name = basename(new URL(SRC).pathname) || "library.json";

  if (/\.svg$/i.test(name) || body.trimStart().startsWith("<svg")) {
    console.log(`Saved ${ICONS}/${await saveIcon(name.endsWith(".svg") ? name : name + ".svg", body)}`);
  } else {
    try { JSON.parse(body); } catch {
      console.error(`${SRC} returned neither SVG nor JSON — it is probably an app page, not a file.`);
      console.error(`Point this at a specific asset, e.g. http://localhost:5180/tokens.json, or use the folder form.`);
      process.exit(1);
    }
    await writeFile(join(TOKENS, name.endsWith(".json") ? name : name + ".json"), body);
    console.log(`Saved ${TOKENS}/${name}`);
  }
} else {
  const root = resolve(SRC);
  if (!(await stat(root).catch(() => null))?.isDirectory()) {
    console.error(`${root} is not a folder I can read.`);
    process.exit(1);
  }
  let svgs = 0, jsons = 0, skipped = 0;
  const walk = async (dir, depth = 0) => {
    if (depth > 6) return;
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { await walk(path, depth + 1); continue; }
      const ext = extname(entry.name).toLowerCase();
      if (ext === ".svg") { await saveIcon(entry.name, await readFile(path, "utf8")); svgs++; }
      else if (ext === ".json") { await writeFile(join(TOKENS, entry.name), await readFile(path, "utf8")); jsons++; }
      else skipped++;
    }
  };
  await walk(root);
  console.log(`Copied ${svgs} SVG${svgs === 1 ? "" : "s"} into ${ICONS}/ and ${jsons} JSON file${jsons === 1 ? "" : "s"} into ${TOKENS}/.`);
  if (skipped) console.log(`Ignored ${skipped} other file${skipped === 1 ? "" : "s"} (.fig files cannot be read outside Figma — export SVG instead).`);
  if (!svgs && !jsons) console.log(`Nothing usable found. If the library is a .fig file, export the icons as SVG first.`);
}

console.log(`\nNow:  git add -A && git commit -m "Add component library" && git push`);
console.log(`Then tell Claude, and it will run import-icons and build-tokens against them.`);
