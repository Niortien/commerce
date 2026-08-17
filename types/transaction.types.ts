import type { ModePaiement, TypeSortie } from "./enums";
import type { Produit, Variante } from "./produit.types";

export interface LigneEntree {
  id: string;
  entreeId: string;
  varianteId: string;
  variante?: Variante & { produit?: Produit };
  quantite: number;
  prixUnitaire: string;
}

export interface Entree {
  id: string;
  reference: string;
  fournisseur: string;
  totalCout: string;
  notes: string | null;
  userId: string;
  lignes?: LigneEntree[];
  createdAt: string;
}

export interface LigneSortie {
  id: string;
  sortieId: string;
  varianteId: string;
  variante?: Variante & { produit?: Produit };
  quantite: number;
  prixUnitaire: string;
}

export interface Sortie {
  id: string;
  reference: string;
  type: TypeSortie;
  totalAvantRemise?: string | null;
  remiseMontant?: string | null;
  totalMontant: string;
  notes: string | null;
  userId: string;
  lignes?: LigneSortie[];
  transactionId: string | null;
  transaction?: { modePaiement: ModePaiement; reference: string | null } | null;
  createdAt: string;
}
