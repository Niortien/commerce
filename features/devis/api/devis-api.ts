import { apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Devis, Sortie, StatutDevis, VenteCreditOptions } from "@/types";

export type DevisListParams = {
  page?: number;
  limit?: number;
  statut?: StatutDevis;
  search?: string;
};

export interface CreateDevisBody {
  clientNom: string;
  clientTelephone?: string;
  validiteJours?: number;
  remiseMontant?: string;
  notes?: string;
  lignes: Array<{ varianteId: string; quantite: number; prixUnitaire: string }>;
}

export const getDevisList = (params?: DevisListParams) => apiGet<Devis[]>("/devis", params);

export const getDevis = (id: string) => apiGet<Devis>(`/devis/${id}`);

export const createDevis = (body: CreateDevisBody) => apiPost<Devis, CreateDevisBody>("/devis", body);

/** Accepter, annuler ou remettre en cours (un devis converti en vente ne bouge plus). */
export const changerStatutDevis = (id: string, statut: Exclude<StatutDevis, StatutDevis.CONVERTI>) =>
  apiPatch<Devis, { statut: StatutDevis }>(`/devis/${id}/statut`, { statut });

/**
 * Transforme le devis en vente : le stock sort au prix promis. Caisse ouverte requise.
 * Avec `credit`, la vente est inscrite au compte du client pro.
 */
export const convertirDevis = (id: string, credit?: VenteCreditOptions) =>
  apiPost<{ devis: Devis; sortie: Sortie }, Partial<VenteCreditOptions>>(`/devis/${id}/convertir`, credit ?? {});
