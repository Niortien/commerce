/** Mesures de vitesse réelle suivies (Web Vitals). */
export type MetriqueWebVital = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";

/** Note donnée par le navigateur à une mesure, selon les seuils de Google. */
export type NoteWebVital = "good" | "needs-improvement" | "poor";

export type AppareilWebVital = "mobile" | "ordinateur";

/** Corps de POST /web-vitals : les mesures d'une visite, envoyées en quittant la page. */
export interface EnvoiWebVitals {
  page: string;
  appareil: AppareilWebVital;
  connexion: string | null;
  mesures: Array<{ metrique: MetriqueWebVital; valeur: number; note: NoteWebVital }>;
}

/** Une mesure résumée sur la période : son 75e centile, le nombre de mesures et la part « bonne ». */
export interface ResumeMetrique {
  metrique: MetriqueWebVital;
  p75: number;
  nb: number;
  /** Entre 0 et 1. */
  partBonne: number;
}

export interface VitessePage {
  /** Route sans identifiant : « /boutique/[slug] », « /produits/[id] ». */
  page: string;
  appareil: AppareilWebVital;
  nbVisites: number;
  metriques: ResumeMetrique[];
}

/** Réponse de GET /super-admin/web-vitals. */
export interface VitesseSite {
  jours: number;
  totalMesures: number;
  parPage: VitessePage[];
}
