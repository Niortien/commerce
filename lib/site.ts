/** Adresse publique du site : une seule source pour les métadonnées, le sitemap et les données structurées. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mon-djossi.shop").replace(/\/$/, "");
export const SITE_NAME = "Mon Djossi";
/** Titre de la page d'accueil : vise « logiciel de gestion de stock » et « caisse », les recherches les plus fréquentes en Côte d'Ivoire. */
export const SITE_TITLE = "Logiciel de gestion de stock et de caisse — Mon Djossi";
/** Titre affiché quand le lien est partagé (WhatsApp, Facebook…). */
export const SITE_SOCIAL_TITLE = "Mon Djossi — Gestion de stock et caisse pour les commerces en Côte d'Ivoire";
export const SITE_DESCRIPTION =
  "Mon Djossi : logiciel de gestion de stock et de caisse pour les boutiques en Côte d'Ivoire. Stock par variante, caisse en temps réel, paiements Wave, Orange Money et MTN Money.";
