/** Adresse publique du site : une seule source pour les métadonnées, le sitemap et les données structurées. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mon-djossi.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "Mon Djossi";
export const SITE_DESCRIPTION =
  "Mon Djossi : logiciel de gestion de boutiques en Côte d'Ivoire. Stock par variante, caisse en temps réel, entrées et sorties, abonnement mensuel, trimestriel ou annuel.";
