import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { ModePaiement, ModeService, Sortie, TypeSortie } from "@/types";

export interface SortiesListParams {
  page?: number;
  limit?: number;
  type?: TypeSortie;
  dateDebut?: string;
  dateFin?: string;
  sortOrder?: "asc" | "desc";
  boutiqueId?: string;
}

export interface CreateSortieBody {
  type: TypeSortie;
  notes?: string;
  remiseMontant?: string;
  dateOperation?: string;
  montant?: string;
  /** Restaurant uniquement. */
  modeService?: ModeService;
  tableLabel?: string;
  lignes?: Array<{
    varianteId: string;
    quantite: number;
    prixUnitaire: string;
  }>;
  /** Vente à crédit (quincaillerie) : inscrite au compte du client ; seul l'acompte entre en caisse. */
  clientId?: string;
  echeanceJours?: number;
  acompteMontant?: string;
  acompteMode?: ModePaiement;
  /** Référence créée sur l'appareil : un renvoi de la même vente n'est pas compté deux fois. */
  clientRef?: string;
}

/** Vente faite sans internet, envoyée au retour du réseau, avec son paiement. */
export interface VenteHorsLigneBody {
  clientRef: string;
  venduLe: string;
  modePaiement: ModePaiement;
  montantPaye?: string;
  remiseMontant?: string;
  notes?: string;
  modeService?: ModeService;
  tableLabel?: string;
  lignes: Array<{ varianteId: string; quantite: number; prixUnitaire: string }>;
}

export const envoyerVenteHorsLigne = (body: VenteHorsLigneBody) =>
  apiPost<Sortie, VenteHorsLigneBody>("/sorties/hors-ligne", body);

export const getSorties = (params?: SortiesListParams) =>
  apiGet<Sortie[]>("/sorties", params as Record<string, unknown> | undefined);

// GET /sorties/:id — récupère le détail d'une sortie avec ses lignes
export const getSortieById = (id: string) =>
  apiGet<Sortie>(`/sorties/${id}`);

export const createSortie = (body: CreateSortieBody, boutiqueId?: string) =>
  apiPost<Sortie, CreateSortieBody>("/sorties", body, boutiqueId ? { boutiqueId } : undefined);

export interface UpdateSortieBody {
  notes?: string;
}

export const annulerSortie = (id: string) =>
  apiPatch<Sortie, Record<string, never>>(`/sorties/${id}/annuler`, {});

export const updateSortie = (id: string, body: UpdateSortieBody) =>
  apiPatch<Sortie, UpdateSortieBody>(`/sorties/${id}`, body);

export const deleteSortie = (id: string) =>
  apiDelete<void>(`/sorties/${id}`);
