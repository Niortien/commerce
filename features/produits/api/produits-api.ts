import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Categorie, MouvementStock, Produit, ProduitImage, Variante } from "@/types";

export interface ProduitListParams {
  page?: number;
  limit?: number;
  categorieId?: string;
  search?: string;
  isActif?: boolean;
  enPromo?: boolean;
  sortOrder?: "asc" | "desc";
  boutiqueId?: string;
}

export interface ProduitMouvementsParams {
  page?: number;
  limit?: number;
}

export interface CreateProduitBody {
  nom: string;
  sku?: string;
  description?: string;
  categorieId: string;
  prixVente: string;
  prixAchat: string;
  imageUrl?: string;
  variantes?: Array<{
    taille: string;
    couleur: string;
    quantiteStock: number;
    seuilAlerte: number;
  }>;
}

export interface UpdateProduitBody {
  nom?: string;
  description?: string;
  categorieId?: string;
  prixVente?: string;
  prixAchat?: string;
  imageUrl?: string | null;
  isActif?: boolean;
  enPromo?: boolean;
  prixPromo?: string | null;
  dateDebutPromo?: string | null;
  dateFinPromo?: string | null;
}

export interface AddVarianteBody {
  taille: string;
  couleur: string;
  quantiteStock?: number;
  seuilAlerte?: number;
  boutiqueId?: string;
}

export interface UpdateVarianteBody {
  taille?: string;
  couleur?: string;
  seuilAlerte?: number;
  boutiqueId?: string | null;
}

export interface ReassignBoutiqueConflict {
  varianteId: string;
  taille: string;
  couleur: string;
}

export interface ReassignBoutiqueResult {
  movedCount: number;
  conflicts: ReassignBoutiqueConflict[];
  produit: Produit;
}

export interface AdjustStockBody {
  motif: string;
  variation: number;
}

export const getProduits = (params?: ProduitListParams) =>
  apiGet<Produit[]>("/produits", params as Record<string, unknown> | undefined);

export const getProduitById = (id: string) =>
  apiGet<Produit>(`/produits/${id}`);

// GET /produits/:id/mouvements — liste les mouvements de stock d'un produit
export const getProduitMouvements = (id: string, params?: ProduitMouvementsParams) =>
  apiGet<MouvementStock[]>(`/produits/${id}/mouvements`, params as Record<string, unknown> | undefined);

export const createProduit = (body: CreateProduitBody, boutiqueIds?: string[]) =>
  apiPost<Produit, CreateProduitBody>(
    "/produits",
    body,
    boutiqueIds && boutiqueIds.length > 0 ? { boutiqueIds: boutiqueIds.join(",") } : undefined,
  );

export const updateProduit = (id: string, body: UpdateProduitBody) =>
  apiPatch<Produit, UpdateProduitBody>(`/produits/${id}`, body);

// Réattribue toutes les variantes du produit à une boutique (ou null = catalogue global)
export const reassignProduitBoutique = (id: string, boutiqueId: string | null) =>
  apiPatch<ReassignBoutiqueResult, { boutiqueId: string | null }>(`/produits/${id}/boutique`, { boutiqueId });

export const addVarianteToProduit = (produitId: string, body: AddVarianteBody) =>
  apiPost<Variante, AddVarianteBody>(`/produits/${produitId}/variantes`, body);

export const deleteProduit = (id: string) =>
  apiDelete<{ success: boolean }>(`/produits/${id}`);

export const updateVariante = (id: string, body: UpdateVarianteBody) =>
  apiPatch<unknown, UpdateVarianteBody>(`/variantes/${id}`, body);

// variation: delta positif ou négatif (Swagger: AdjustVarianteStockDto)
export const adjustVarianteStock = (id: string, body: AdjustStockBody) =>
  apiPatch<unknown, AdjustStockBody>(`/variantes/${id}/stock`, body);

export const getCategories = () =>
  apiGet<Categorie[]>("/produits/categories");

export const addProduitImage = (produitId: string, url: string) =>
  apiPost<ProduitImage, { url: string }>(`/produits/${produitId}/images`, { url });

export const removeProduitImage = (produitId: string, imageId: string) =>
  apiDelete<void>(`/produits/${produitId}/images/${imageId}`);

export const deleteVariante = (id: string) =>
  apiDelete<void>(`/variantes/${id}`);
