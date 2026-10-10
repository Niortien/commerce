"use client";

import { useEffect } from "react";

/**
 * Installe le service worker (public/sw.js) qui permet de rouvrir l'application sans internet.
 * En développement on ne l'installe pas : il garderait d'anciennes versions des pages en cache.
 */
export function ServiceWorkerInit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const enregistrer = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Navigateur qui refuse (navigation privée…) : l'application marche quand même en ligne.
      });
    };
    if (document.readyState === "complete") enregistrer();
    else window.addEventListener("load", enregistrer, { once: true });
  }, []);

  return null;
}
