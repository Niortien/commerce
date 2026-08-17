import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Entree } from "@/types";

export interface EntreesListParams {
  page?: number;
  limit?: number;
  dateDebut?: string;
  dateFin?: string;
  fournisseur?: string;
  sortOrder?: "asc" | "desc";
  boutiqueId?: string;
}

export interface NewProduitForEntree {
  nom: string;
  categorieId: string;
  prixVente: string;
  prixAchat: string;
  taille: string;
  couleur: string;
  seuilAlerte?: number;
  imageUrl?: string;
}

export interface CreateEntreeBody {
  fournisseur: string;
  notes?: string;
  dateOperation?: string;
  lignes: Array<{
    varianteId?: string;
    newProduit?: NewProduitForEntree;
    quantite: number;
    prixUnitaire: string;
  }>;
}

export const getEntrees = (params?: EntreesListParams) =>
  apiGet<Entree[]>("/entrees", params as Record<string, unknown> | undefined);

// GET /entrees/:id — récupère le détail d'une entrée avec ses lignes
export const getEntreeById = (id: string) =>
  apiGet<Entree>(`/entrees/${id}`);

export const createEntree = (body: CreateEntreeBody, boutiqueId?: string) =>
  apiPost<Entree, CreateEntreeBody>("/entrees", body, boutiqueId ? { boutiqueId } : undefined);

export interface UpdateEntreeBody {
  fournisseur?: string;
  notes?: string;
}

export const annulerEntree = (id: string) =>
  apiPatch<Entree, Record<string, never>>(`/entrees/${id}/annuler`, {});

export const updateEntree = (id: string, body: UpdateEntreeBody) =>
  apiPatch<Entree, UpdateEntreeBody>(`/entrees/${id}`, body);

export const deleteEntree = (id: string) =>
  apiDelete<void>(`/entrees/${id}`);
