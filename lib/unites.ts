import { NatureProduit, Unite, type Produit, type Variante } from "@/types";

interface UniteInfo {
  /** Nom pour un choix : « Kilogramme (kg) ». */
  label: string;
  /** Après une quantité : « 12,5 m », « 3 sacs ». */
  singulier: string;
  pluriel: string;
  /** Se compte (quantité entière) ou se mesure (décimale) ? */
  entiere: boolean;
}

export const UNITES: Record<Unite, UniteInfo> = {
  [Unite.PIECE]: { label: "Pièce", singulier: "pièce", pluriel: "pièces", entiere: true },
  [Unite.PORTION]: { label: "Portion", singulier: "portion", pluriel: "portions", entiere: true },
  [Unite.SAC]: { label: "Sac", singulier: "sac", pluriel: "sacs", entiere: true },
  [Unite.CARTON]: { label: "Carton", singulier: "carton", pluriel: "cartons", entiere: true },
  [Unite.BOITE]: { label: "Boîte", singulier: "boîte", pluriel: "boîtes", entiere: true },
  [Unite.PAQUET]: { label: "Paquet", singulier: "paquet", pluriel: "paquets", entiere: true },
  [Unite.BOUTEILLE]: { label: "Bouteille", singulier: "bouteille", pluriel: "bouteilles", entiere: true },
  [Unite.KG]: { label: "Kilogramme (kg)", singulier: "kg", pluriel: "kg", entiere: false },
  [Unite.G]: { label: "Gramme (g)", singulier: "g", pluriel: "g", entiere: false },
  [Unite.L]: { label: "Litre (L)", singulier: "L", pluriel: "L", entiere: false },
  [Unite.M]: { label: "Mètre (m)", singulier: "m", pluriel: "m", entiere: false },
  [Unite.M2]: { label: "Mètre carré (m²)", singulier: "m²", pluriel: "m²", entiere: false },
};

export const UNITES_LISTE: Unite[] = Object.values(Unite);

/** Variante créée pour un produit sans taille ni couleur (tout sauf les vêtements). */
export const VARIANTE_UNIQUE = { taille: "Unique", couleur: "-" } as const;

export function isVarianteUnique(v: Pick<Variante, "taille">): boolean {
  return v.taille === VARIANTE_UNIQUE.taille;
}

export function uniteDe(produit: Pick<Produit, "unite"> | undefined | null): Unite {
  return produit?.unite ?? Unite.PIECE;
}

export function natureDe(produit: Pick<Produit, "nature"> | undefined | null): NatureProduit {
  return produit?.nature ?? NatureProduit.ARTICLE;
}

export function isUniteEntiere(unite: Unite): boolean {
  return UNITES[unite].entiere;
}

const nombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 });

/** 12.5 + M → « 12,5 m » ; 3 + SAC → « 3 sacs ». */
export function formatQuantite(quantite: number, unite: Unite): string {
  const info = UNITES[unite];
  return `${nombre.format(quantite)} ${Math.abs(quantite) > 1 ? info.pluriel : info.singulier}`;
}

/** Lit une saisie (« 12,5 » ou « 12.5 ») ; NaN si invalide. */
export function parseQuantite(saisie: string): number {
  return Number.parseFloat(saisie.replace(",", "."));
}

/** Arrondi au millième, la précision stockée en base. */
export function arrondiQuantite(quantite: number): number {
  return Math.round(quantite * 1000) / 1000;
}
