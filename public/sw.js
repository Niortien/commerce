/*
 * Mon Djossi — service worker.
 * Garde de quoi rouvrir l'application sans internet (pages déjà visitées, scripts, styles, icônes).
 * Les données (API) ne passent pas par ici : la caisse hors connexion les garde elle-même sur l'appareil.
 */
const VERSION = "mon-djossi-v2"; // changer la version purge les anciennes copies (ex. ancien favicon)
const PAGES = `${VERSION}-pages`;
const STATIQUES = `${VERSION}-statiques`;
/** Pages ouvertes d'avance pour pouvoir vendre même si on ne les a jamais visitées sur cet appareil. */
const PAGES_DE_CAISSE = ["/sorties", "/caisse", "/dashboard"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((cache) =>
      Promise.allSettled(PAGES_DE_CAISSE.map((url) => cache.add(new Request(url, { credentials: "same-origin" }))))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cles) => Promise.all(cles.filter((c) => !c.startsWith(VERSION)).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

function estVersionne(url) {
  return url.pathname.startsWith("/_next/static/") || url.search.length > 1;
}

function estStatique(url) {
  return url.pathname.startsWith("/_next/static/") || /\.(?:png|svg|ico|webp|jpg|jpeg|woff2?|css|js)$/.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // API et services externes : jamais mis en cache ici.
  if (req.headers.get("RSC") || url.searchParams.has("_rsc")) return; // navigation interne de Next.js

  // Pages : le réseau d'abord (toujours à jour), la copie gardée sinon.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((rep) => {
          if (rep.ok) {
            const copie = rep.clone();
            caches.open(PAGES).then((cache) => cache.put(url.pathname, copie));
          }
          return rep;
        })
        .catch(async () => {
          const cache = await caches.open(PAGES);
          return (
            (await cache.match(url.pathname)) ||
            (await cache.match("/sorties")) ||
            new Response("<h1>Hors connexion</h1><p>Ouvre la page Sorties une fois avec internet pour pouvoir vendre sans réseau.</p>", {
              headers: { "Content-Type": "text/html; charset=utf-8" },
              status: 503,
            })
          );
        })
    );
    return;
  }

  // Scripts, styles, polices, images.
  if (estStatique(url)) {
    event.respondWith(
      caches.open(STATIQUES).then(async (cache) => {
        const garde = await cache.match(req);
        // Fichier versionné (/_next/static ou ?empreinte) : son contenu ne change jamais, la copie suffit.
        if (garde && estVersionne(url)) return garde;
        // Sinon (/favicon.ico, /icons/…) : la copie tout de suite si on l'a, et le réseau la remplace en arrière-plan.
        const reseau = fetch(req)
          .then((rep) => {
            if (rep.ok) cache.put(req, rep.clone());
            return rep;
          })
          .catch(() => garde || Response.error());
        if (garde) {
          event.waitUntil(reseau);
          return garde;
        }
        return reseau;
      })
    );
  }
});
