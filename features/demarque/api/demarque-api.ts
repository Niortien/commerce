import { apiGet, apiPost } from "@/lib/api";
import type { ModeDemarque, PieceADemarquer, ResultatDemarque } from "@/types";

export type DemarqueParams = {
  /** En rayon depuis au moins ce nombre de jours (ou depuis la dernière démarque). */
  joursMin?: number;
  balleId?: string;
  page?: number;
  limit?: number;
};

export interface AppliquerDemarqueBody {
  produitIds: string[];
  mode: ModeDemarque;
  /** Pourcentage de baisse (1 à 99) ou nouveau prix en FCFA. */
  valeur: number;
}

export const getDemarques = (params?: DemarqueParams) => apiGet<PieceADemarquer[]>("/demarques", params);

/** Baisse le prix des pièces choisies (ADMIN). Le prix d'origine est gardé. */
export const appliquerDemarque = (body: AppliquerDemarqueBody) =>
  apiPost<ResultatDemarque, AppliquerDemarqueBody>("/demarques", body);
