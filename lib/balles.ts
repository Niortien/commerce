import type { Balle, ModeDemarque, Produit } from "@/types";

/** Pièce encore en rayon : sa variante unique a du stock. */
export function estEnRayon(produit: Pick<Produit, "variantes">): boolean {
  return (produit.variantes ?? []).some((v) => v.quantiteStock > 0);
}

/** Pièce unique partie (vendue, ou sortie du rayon). */
export function estVendue(produit: Pick<Produit, "variantes" | "pieceUnique">): boolean {
  return Boolean(produit.pieceUnique) && !estEnRayon(produit);
}

/** Prix d'étiquette les plus courants en friperie, proposés d'un appui au déballage. */
export const PRIX_RONDS = [500, 1000, 1500, 2000, 2500, 3000, 5000] as const;

/** Tri par qualité : du 1er choix (la plus belle pièce) au 3e. */
export const CHOIX = [1, 2, 3] as const;
export type Choix = (typeof CHOIX)[number];

export function isChoix(n: number | null | undefined): n is Choix {
  return n === 1 || n === 2 || n === 3;
}

/** « 1er choix », « 2e choix » ; null : pièce non triée. */
export function libelleChoix(choix: number | null | undefined): string | null {
  if (!isChoix(choix)) return null;
  return choix === 1 ? "1er choix" : `${choix}e choix`;
}

/** Prix conseillé par la balle pour ce choix, en nombre ; null s'il n'y en a pas. */
export function prixConseille(
  balle: Pick<Balle, "prixChoix1" | "prixChoix2" | "prixChoix3">,
  choix: Choix
): number | null {
  const prix = { 1: balle.prixChoix1, 2: balle.prixChoix2, 3: balle.prixChoix3 }[choix];
  return prix ? Math.round(Number(prix)) : null;
}

/** Démarque : depuis combien de jours une pièce attend en rayon. */
export const DUREES_DEMARQUE = [15, 30, 60, 90] as const;
/** Baisses proposées en un appui. */
export const TAUX_DEMARQUE = [20, 30, 50] as const;
/** Les prix se rendent en pièces de 50 F. */
const ARRONDI_DEMARQUE = 50;

/** Même calcul que le serveur : arrondi aux 50 F, jamais sous 50 F. */
export function prixDemarque(actuel: number, mode: ModeDemarque, valeur: number): number {
  const brut = mode === "POURCENTAGE" ? actuel * (1 - valeur / 100) : valeur;
  return Math.max(ARRONDI_DEMARQUE, Math.round(brut / ARRONDI_DEMARQUE) * ARRONDI_DEMARQUE);
}

/** « Balle n°7 » */
export function nomBalle(balle: Pick<Balle, "numero">): string {
  return `Balle n°${balle.numero}`;
}

/** Date du jour au format AAAA-MM-JJ, en heure locale (pour un champ date). */
export function aujourdhuiIso(): string {
  const d = new Date();
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
}

export type EtatRemboursement = "VIDE" | "EN_COURS" | "RENTABILISEE";

/** Où en est la balle : pas encore déballée, en train de se rembourser, ou déjà rentabilisée. */
export function etatRemboursement(balle: Pick<Balle, "nbPieces" | "tauxRembourse">): EtatRemboursement {
  if (balle.nbPieces === 0) return "VIDE";
  return (balle.tauxRembourse ?? 0) >= 100 ? "RENTABILISEE" : "EN_COURS";
}
