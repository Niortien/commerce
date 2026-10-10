import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Balle, BalleDetail, Produit, StatutBalle } from "@/types";

export type BallesListParams = {
  page?: number;
  limit?: number;
  statut?: StatutBalle;
  search?: string;
};

export interface CreateBalleBody {
  libelle: string;
  fournisseur?: string;
  coutAchat: number;
  frais?: number;
  dateAchat?: string;
  notes?: string;
  prixChoix1?: number | null;
  prixChoix2?: number | null;
  prixChoix3?: number | null;
}

export type UpdateBalleBody = Partial<CreateBalleBody>;

export interface PieceBody {
  nom: string;
  categorieId: string;
  prixVente: number;
  description?: string;
  /** 1er, 2e ou 3e choix ; absent = non triée. */
  choix?: number | null;
}

export const getBalles = (params?: BallesListParams) => apiGet<Balle[]>("/balles", params);

export const getBalle = (id: string) => apiGet<BalleDetail>(`/balles/${id}`);

export const createBalle = (body: CreateBalleBody) => apiPost<Balle, CreateBalleBody>("/balles", body);

export const updateBalle = (id: string, body: UpdateBalleBody) => apiPatch<Balle, UpdateBalleBody>(`/balles/${id}`, body);

/** Terminer le déballage (plus d'ajout) ou le rouvrir. */
export const changerStatutBalle = (id: string, statut: StatutBalle) =>
  apiPatch<Balle, { statut: StatutBalle }>(`/balles/${id}/statut`, { statut });

/** Pièces trouvées au déballage : chacune entre en rayon en un exemplaire, le coût de la balle se répartit. */
export const ajouterPieces = (id: string, pieces: PieceBody[]) =>
  apiPost<Produit[], { pieces: PieceBody[] }>(`/balles/${id}/pieces`, { pieces });

/** Retirer une pièce saisie par erreur (impossible une fois vendue). */
export const retirerPiece = (id: string, produitId: string) =>
  apiDelete<{ id: string }>(`/balles/${id}/pieces/${produitId}`);

/** Supprimer une balle vide (ADMIN). */
export const deleteBalle = (id: string) => apiDelete<{ id: string }>(`/balles/${id}`);
