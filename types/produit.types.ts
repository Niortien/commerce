import type { NatureProduit, Unite } from "./enums";

export interface ProduitImage {
  id: string;
  produitId: string;
  url: string;
  ordre: number;
  createdAt: string;
}

export interface Categorie {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
}

export interface VarianteBoutique {
  id: string;
  nom: string;
  ville: string | null;
  whatsapp: string | null;
}

export interface Variante {
  id: string;
  produitId: string;
  taille: string;
  couleur: string;
  quantiteStock: number;
  seuilAlerte: number;
  boutiqueId: string | null;
  boutique?: VarianteBoutique | null;
  createdAt: string;
  updatedAt: string;
}

export interface Produit {
  id: string;
  nom: string;
  sku: string;
  description: string | null;
  categorieId: string;
  categorie?: Categorie;
  prixVente: string;
  prixAchat: string;
  imageUrl: string | null;
  isActif: boolean;
  enPromo: boolean;
  prixPromo: string | null;
  dateDebutPromo: string | null;
  dateFinPromo: string | null;
  createdAt: string;
  updatedAt: string;
  variantes?: Variante[];
  images?: ProduitImage[];
  /** Absent sur les produits créés avant les unités : PIECE. */
  unite?: Unite;
  /** Absent sur les produits créés avant les natures : ARTICLE. */
  nature?: NatureProduit;
  /** Conditionnement d'achat, ex. CARTON de 24 pièces. */
  conditionnementUnite?: Unite | null;
  conditionnementQuantite?: number | null;
  /** Friperie : balle d'où sort la pièce, et son numéro dans la balle (étiquette « N°14 »). */
  balleId?: string | null;
  numeroPiece?: number | null;
  /** Pièce unique : un seul exemplaire, « vendue » dès qu'elle passe en caisse. */
  pieceUnique?: boolean;
  /** Friperie : qualité de la pièce, 1er (la plus belle) à 3e choix ; null = non triée. */
  choix?: number | null;
  /** Prix avant la première démarque ; null tant que la pièce n'a jamais été démarquée. */
  prixInitial?: string | null;
  derniereDemarqueAt?: string | null;
  nbDemarques?: number;
}

/** Ligne de fiche technique : quantité d'un ingrédient pour une portion du plat. */
export interface Recette {
  id: string;
  platId: string;
  ingredientVarianteId: string;
  quantite: number;
  ingredient?: Variante & { produit?: Produit };
}
