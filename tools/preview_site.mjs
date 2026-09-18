import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "public");
const PORT = Number(process.env.PORT || 8789);

const PAGES = {
  "/": "index.html",
  "/urunler": "urunler.html",
  "/siparis": "siparis.html",
  "/hakkimizda": "hakkimizda.html",
  "/referanslar": "referanslar.html",
  "/kvkk": "kvkk.html",
};

const REDIRECTS = {
  "/katalog": "/urunler",
  "/katalog/": "/urunler",
  "/sepet": "/siparis",
  "/sepet/": "/siparis",
  "/urun": "/urunler",
  "/urun/": "/urunler",
};

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "cache-control": "no-store", ...headers });
  res.end(body);
}

function safeFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const rel = decoded.replace(/^\/+/, "").replace(/\\/g, "/");
  const abs = normalize(join(ROOT, rel));
  const fromRoot = relative(ROOT, abs);
  if (!fromRoot || fromRoot.startsWith("..") || fromRoot.startsWith(`..${sep}`)) return null;
  return abs;
}

function serveFile(res, file) {
  if (!existsSync(file) || !statSync(file).isFile()) {
    send(res, 404, "Not found", { "content-type": "text/plain; charset=utf-8" });
    return;
  }
  const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
  createReadStream(file).pipe(res);
}

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
  let path = url.pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

  if (path.startsWith("/panel") || path.startsWith("/api/")) {
    send(res, 404, "Not found", { "content-type": "text/plain; charset=utf-8" });
    return;
  }

  if (REDIRECTS[url.pathname] || REDIRECTS[path]) {
    const next = new URL(REDIRECTS[url.pathname] || REDIRECTS[path], url);
    next.search = url.search;
    res.writeHead(301, { location: next.pathname + next.search });
    res.end();
    return;
  }

  if (PAGES[path]) {
    serveFile(res, join(ROOT, PAGES[path]));
    return;
  }

  const file = safeFile(path);
  if (!file) {
    send(res, 404, "Not found", { "content-type": "text/plain; charset=utf-8" });
    return;
  }
  serveFile(res, file);
});

server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`FerraPro site önizleme: http://127.0.0.1:${PORT}/\n`);
});
