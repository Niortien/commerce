import type { TypeCommerce } from "./enums";

/** Réponse de GET /vitrine/{slug} : seuls des champs publics, jamais de prix d'achat ni de quantité. */
export interface VitrineBoutique {
  nom: string;
  slug: string;
  typeCommerce: TypeCommerce | null;
  ville: string | null;
  adresse: string | null;
  whatsapp: string | null;
  telephone: string | null;
  logoUrl: string | null;
}

export interface VitrineCategorie {
  id: string;
  nom: string;
}

export interface VitrineVariante {
  id: string;
  taille: string;
  couleur: string;
  /** Peu de pièces restantes : la vitrine l'affiche sans donner le chiffre. */
  dernieresPieces: boolean;
}

export interface VitrineProduit {
  id: string;
  nom: string;
  description: string | null;
  categorieId: string | null;
  unite: string | null;
  prixVente: number;
  /** Présent uniquement pendant une promotion en cours. */
  prixPromo: number | null;
  images: string[];
  variantes: VitrineVariante[];
}

export interface Vitrine {
  boutique: VitrineBoutique;
  categories: VitrineCategorie[];
  produits: VitrineProduit[];
}
