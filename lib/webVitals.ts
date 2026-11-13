import { getApiBaseUrl } from "@/lib/apiBase";
import type { AppareilWebVital, EnvoiWebVitals, MetriqueWebVital, NoteWebVital } from "@/types";

/**
 * Seuils de Google pour chaque mesure : « bon » jusqu'au premier, « mauvais » au-delà du second.
 * Millisecondes, sauf CLS (sans unité).
 */
export const SEUILS_WEB_VITALS: Record<MetriqueWebVital, { bon: number; mauvais: number; libelle: string; unite: "ms" | "" }> = {
  LCP: { bon: 2500, mauvais: 4000, libelle: "Affichage principal", unite: "ms" },
  INP: { bon: 200, mauvais: 500, libelle: "Réaction au toucher", unite: "ms" },
  CLS: { bon: 0.1, mauvais: 0.25, libelle: "Stabilité de la page", unite: "" },
  FCP: { bon: 1800, mauvais: 3000, libelle: "Premier affichage", unite: "ms" },
  TTFB: { bon: 800, mauvais: 1800, libelle: "Réponse du serveur", unite: "ms" },
};

const METRIQUES = new Set<string>(Object.keys(SEUILS_WEB_VITALS));
const NOTES = new Set<string>(["good", "needs-improvement", "poor"]);

export function estMetrique(nom: string): nom is MetriqueWebVital {
  return METRIQUES.has(nom);
}

function estNote(note: string | undefined): note is NoteWebVital {
  return note !== undefined && NOTES.has(note);
}

/** Note d'une valeur (ex. le 75e centile) selon les seuils de Google. */
export function noteDe(metrique: MetriqueWebVital, valeur: number): NoteWebVital {
  const { bon, mauvais } = SEUILS_WEB_VITALS[metrique];
  if (valeur <= bon) return "good";
  return valeur <= mauvais ? "needs-improvement" : "poor";
}

/** « 2,1 s », « 180 ms », « 0,08 ». */
export function formaterMesure(metrique: MetriqueWebVital, valeur: number): string {
  if (metrique === "CLS") return valeur.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  if (valeur >= 1000) return `${(valeur / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} s`;
  return `${Math.round(valeur)} ms`;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SEGMENT_SUR = /^[A-Za-z0-9_.-]+$/;
/** Routes dont le 2e segment est un paramètre (le nom de la boutique, le type de guide…). */
const PARAMETRES: Record<string, string> = { boutique: "[slug]", guides: "[type]" };

/**
 * La page sans rien qui identifie une boutique ou un enregistrement : les mesures se regroupent
 * par route (« /boutique/[slug] », « /clients/[id] ») et aucune donnée privée ne part avec.
 */
export function pageSansIdentifiant(chemin: string): string {
  const segments = chemin.split("/").filter(Boolean);
  const propres = segments.map((s, i) => {
    if (i === 1 && PARAMETRES[segments[0]]) return PARAMETRES[segments[0]];
    if (UUID.test(s) || /^\d+$/.test(s)) return "[id]";
    return SEGMENT_SUR.test(s) ? s : "[x]";
  });
  return `/${propres.join("/")}`.slice(0, 120);
}

/** Ce que le navigateur transmet pour une mesure (forme du `Metric` de web-vitals, réduite à l'utile). */
export interface MesureNavigateur {
  name: string;
  value: number;
  rating?: string;
}

const enAttente: EnvoiWebVitals["mesures"] = [];

export function ajouterMesure(m: MesureNavigateur): void {
  if (!estMetrique(m.name) || !Number.isFinite(m.value) || m.value < 0) return;
  const note = estNote(m.rating) ? m.rating : noteDe(m.name, m.value);
  // Une mesure reprise (ex. INP après un retour sur l'onglet) remplace la précédente.
  const i = enAttente.findIndex((x) => x.metrique === m.name);
  const ligne = { metrique: m.name, valeur: Math.round(m.value * 1000) / 1000, note };
  if (i >= 0) enAttente[i] = ligne;
  else enAttente.push(ligne);
}

function appareil(): AppareilWebVital {
  return window.matchMedia("(max-width: 899px)").matches ? "mobile" : "ordinateur";
}

/**
 * Envoie les mesures en attente, en une requête qui survit à la fermeture de la page
 * (sendBeacon, JSON en text/plain : pas d'aller-retour CORS préalable).
 */
export function envoyerMesures(): void {
  if (enAttente.length === 0 || typeof navigator.sendBeacon !== "function") return;
  const corps: EnvoiWebVitals = {
    page: pageSansIdentifiant(window.location.pathname),
    appareil: appareil(),
    connexion: navigator.connection?.effectiveType?.slice(0, 10) ?? null,
    mesures: enAttente.splice(0, enAttente.length),
  };
  navigator.sendBeacon(`${getApiBaseUrl()}/api/v1/web-vitals`, new Blob([JSON.stringify(corps)], { type: "text/plain;charset=UTF-8" }));
}
