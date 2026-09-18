/* Serves prototype/ over the local network so a phone on the same wifi can
   open it. No dependencies. Run from the repo root:

     node scripts/serve.mjs          → port 8000
     node scripts/serve.mjs 3000     → a different port                      */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { join, normalize, extname, resolve } from "node:path";

const PORT = Number(process.argv[2]) || 8000;
const ROOT = resolve("prototype");
const DEFAULT = "app.html";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/") rel = "/" + DEFAULT;

    // Never serve outside prototype/, whatever the path claims.
    const path = join(ROOT, normalize(rel).replace(/^(\.\.[/\\])+/, ""));
    if (!path.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }

    const info = await stat(path).catch(() => null);
    if (!info?.isFile()) { res.writeHead(404).end("Not found"); return; }

    res.writeHead(200, {
      "Content-Type": TYPES[extname(path).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",       // always serve the latest build
    });
    res.end(await readFile(path));
  } catch {
    res.writeHead(500).end("Server error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  const lan = Object.values(networkInterfaces()).flat()
    .filter(i => i && i.family === "IPv4" && !i.internal).map(i => i.address);

  console.log(`\n  Zanaco Explore prototype\n`);
  console.log(`  On this machine   http://localhost:${PORT}/`);
  for (const ip of lan) console.log(`  On your phone     http://${ip}:${PORT}/`);
  if (!lan.length) console.log(`  No network address found — is wifi connected?`);
  console.log(`\n  The phone must be on the same wifi. Windows will ask to allow`);
  console.log(`  Node through the firewall — say yes, or the phone cannot connect.`);
  console.log(`\n  Spec page at /index.html.  Ctrl+C to stop.\n`);
});
