import type { TypeMouvement } from "./enums";
import type { Categorie, Produit, Variante } from "./produit.types";

export interface MouvementStock {
  id: string;
  varianteId: string;
  variante?: Variante & { produit?: Produit };
  type: TypeMouvement;
  quantite: number;
  motif: string | null;
  referenceEntree: string | null;
  referenceSortie: string | null;
  userId: string;
  user?: { email: string };
  createdAt: string;
}

export type StockItem = Variante & { produit: Produit };

// /stock/alertes retourne la même shape que /stock
export type StockAlerte = StockItem;
