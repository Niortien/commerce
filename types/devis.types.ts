import type { StatutDevis } from "./enums";
import type { Produit, Variante } from "./produit.types";
import type { Sortie } from "./transaction.types";

export interface LigneDevis {
  id: string;
  devisId: string;
  varianteId: string;
  /** Nom du produit au moment du devis : le document reste lisible si le produit change. */
  designation: string;
  quantite: number;
  prixUnitaire: string;
  variante?: Variante & { produit?: Produit };
}

/** Devis / facture proforma : prix promis à un client, sans mouvement de stock avant sa conversion en vente. */
export interface Devis {
  id: string;
  boutiqueId: string;
  reference: string;
  clientNom: string;
  clientTelephone: string | null;
  statut: StatutDevis;
  /** AAAA-MM-JJ */
  valableJusquAu: string;
  totalAvantRemise: string;
  remiseMontant: string;
  totalMontant: string;
  notes: string | null;
  sortieId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lignes?: LigneDevis[];
  sortie?: Sortie | null;
  user?: { id: string; email: string } | null;
}
