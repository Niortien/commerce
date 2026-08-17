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
}
