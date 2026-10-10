import type { StatutBalle } from "./enums";
import type { Produit } from "./produit.types";

/** Friperie : lot acheté en bloc puis déballé pièce par pièce, avec son bilan calculé par le serveur. */
export interface Balle {
  id: string;
  boutiqueId: string;
  /** « Balle n°7 », repris dans le code des pièces (B7-014). */
  numero: number;
  libelle: string;
  fournisseur: string | null;
  fournisseurId: string | null;
  coutAchat: string;
  /** Transport, dédouanement… */
  frais: string;
  /** Prix conseillés par choix, proposés au déballage. */
  prixChoix1: string | null;
  prixChoix2: string | null;
  prixChoix3: string | null;
  /** AAAA-MM-JJ */
  dateAchat: string;
  statut: StatutBalle;
  entreeId: string | null;
  notes: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  /** Achat + frais. */
  coutTotal: string;
  nbPieces: number;
  nbEnRayon: number;
  nbVendues: number;
  /** Coût total ÷ nombre de pièces ; null tant que la balle est vide. */
  coutParPiece: string | null;
  /** Ventes encaissées sur ses pièces (remises déduites, ventes annulées exclues). */
  recetteVentes: string;
  /** Prix affiché des pièces encore en rayon. */
  valeurEnRayon: string;
  /** Recette − coût : négative tant que la balle n'est pas remboursée. */
  marge: string;
  /** Part du coût revenue en caisse, en % (peut dépasser 100). */
  tauxRembourse: number | null;
}

/** Bilan d'un choix (null = pièces non triées). */
export interface BilanChoix {
  choix: number | null;
  nbPieces: number;
  nbEnRayon: number;
  nbVendues: number;
  recette: string;
}

export interface BalleDetail extends Balle {
  pieces: Produit[];
  parChoix: BilanChoix[];
}

/** Pièce en rayon depuis longtemps, proposée à la démarque. */
export interface PieceADemarquer extends Produit {
  joursEnRayon: number;
  /** Depuis la mise en rayon, ou depuis la dernière démarque. */
  joursSansDemarque: number;
  balle?: Pick<Balle, "id" | "numero" | "libelle"> | null;
}

export type ModeDemarque = "POURCENTAGE" | "PRIX";

export interface ResultatDemarque {
  nbDemarquees: number;
  /** Pièces vendues entre-temps, ou dont le prix ne baisserait pas. */
  nbIgnorees: number;
  totalAvant: string;
  totalApres: string;
  produitIds: string[];
}
