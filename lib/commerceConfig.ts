import {
  CATEGORY_GROUPS,
  DEFAULT_COLORS,
  SLUG_COULEUR_CONFIG,
  getTaillesForSlug,
} from "@/lib/categoryConfig";
import { TypeCommerce } from "@/types";

export interface CategoryGroup {
  label: string;
  slugs: string[];
}

/** Vocabulaire et presets de variantes d'un type de commerce. Les valeurs libres restent toujours possibles. */
export interface CommerceConfig {
  label: string;
  /** 1er axe de variante (colonne API `taille`). */
  attr1Label: string;
  /** Libellé du champ de saisie libre quand `attr1Presets` est `null` (ex. pointure). */
  attr1Presets: string[] | null;
  /** 2e axe de variante (colonne API `couleur`). */
  attr2Label: string;
  attr2Presets: string[];
  /** Unité de vente affichée (pièce, kg, litre…). */
  unite: string;
  groups: CategoryGroup[];
}

const group = (label: string): CategoryGroup => ({ label, slugs: [] });

const CONFIGS: Record<TypeCommerce, CommerceConfig> = {
  [TypeCommerce.VETEMENTS]: {
    label: "Mode & vêtements",
    attr1Label: "Taille",
    attr1Presets: ["S", "M", "L", "XL", "XXL"],
    attr2Label: "Couleur",
    attr2Presets: DEFAULT_COLORS,
    unite: "pièce",
    groups: CATEGORY_GROUPS,
  },
  [TypeCommerce.CHAUSSURES]: {
    label: "Chaussures & maroquinerie",
    attr1Label: "Pointure",
    attr1Presets: null,
    attr2Label: "Couleur",
    attr2Presets: DEFAULT_COLORS,
    unite: "paire",
    groups: [group("Chaussures"), group("Sacs"), group("Accessoires")],
  },
  [TypeCommerce.ALIMENTATION]: {
    label: "Alimentation & boissons",
    attr1Label: "Conditionnement",
    attr1Presets: ["Unité", "500 g", "1 kg", "25 kg", "50 cl", "1 L", "1,5 L", "Carton"],
    attr2Label: "Variété / Saveur",
    attr2Presets: [],
    unite: "unité",
    groups: [group("Boissons"), group("Épicerie"), group("Produits frais"), group("Surgelés"), group("Snacks")],
  },
  [TypeCommerce.SUPERMARCHE]: {
    label: "Supermarché & grande distribution",
    attr1Label: "Conditionnement",
    attr1Presets: ["Unité", "Lot de 6", "Carton", "1 kg", "1 L"],
    attr2Label: "Marque / Variété",
    attr2Presets: [],
    unite: "unité",
    groups: [group("Alimentaire"), group("Boissons"), group("Hygiène & entretien"), group("Maison"), group("Frais")],
  },
  [TypeCommerce.PHARMACIE]: {
    label: "Pharmacie & parapharmacie",
    attr1Label: "Dosage / Format",
    attr1Presets: ["Boîte", "Flacon", "Sachet", "Plaquette", "Tube", "500 mg", "1 g"],
    attr2Label: "Laboratoire / Marque",
    attr2Presets: [],
    unite: "boîte",
    groups: [group("Médicaments"), group("Parapharmacie"), group("Hygiène"), group("Matériel médical")],
  },
  [TypeCommerce.ELECTRONIQUE]: {
    label: "Électronique & téléphonie",
    attr1Label: "Capacité / Modèle",
    attr1Presets: ["32 Go", "64 Go", "128 Go", "256 Go", "512 Go", "Standard"],
    attr2Label: "Couleur",
    attr2Presets: DEFAULT_COLORS,
    unite: "pièce",
    groups: [group("Téléphones"), group("Ordinateurs"), group("Accessoires"), group("Audio"), group("Électroménager")],
  },
  [TypeCommerce.BEAUTE]: {
    label: "Beauté & cosmétiques",
    attr1Label: "Contenance",
    attr1Presets: ["10 cl", "30 cl", "50 cl", "100 g", "250 g", "500 g"],
    attr2Label: "Teinte / Parfum",
    attr2Presets: [],
    unite: "pièce",
    groups: [group("Soins"), group("Maquillage"), group("Cheveux"), group("Parfums")],
  },
  [TypeCommerce.QUINCAILLERIE]: {
    label: "Quincaillerie & matériaux",
    attr1Label: "Dimension / Format",
    attr1Presets: ["Petit", "Moyen", "Grand", "Sac 25 kg", "Sac 50 kg", "Mètre", "Lot"],
    attr2Label: "Référence / Matière",
    attr2Presets: [],
    unite: "unité",
    groups: [group("Outillage"), group("Électricité"), group("Plomberie"), group("Peinture"), group("Matériaux")],
  },
  // Restaurant et friperie vendent des produits sans taille ni couleur (variante unique).
  [TypeCommerce.RESTAURANT]: {
    label: "Restaurant",
    attr1Label: "Format",
    attr1Presets: [],
    attr2Label: "Variante",
    attr2Presets: [],
    unite: "portion",
    groups: [group("Menu"), group("Boissons"), group("Cuisine")],
  },
  [TypeCommerce.FRIPERIE]: {
    label: "Friperie",
    attr1Label: "Taille",
    attr1Presets: ["S", "M", "L", "XL", "XXL"],
    attr2Label: "Couleur",
    attr2Presets: DEFAULT_COLORS,
    unite: "pièce",
    groups: [group("Vêtements"), group("Accessoires"), group("Maison")],
  },
  [TypeCommerce.AUTRE]: {
    label: "Autre commerce",
    attr1Label: "Format",
    attr1Presets: [],
    attr2Label: "Variante",
    attr2Presets: [],
    unite: "unité",
    groups: [group("Général")],
  },
};

export const TYPE_COMMERCE_OPTIONS = Object.values(TypeCommerce).map((value) => ({
  value,
  label: CONFIGS[value].label,
}));

export function getCommerceConfig(type: TypeCommerce | null | undefined): CommerceConfig {
  return CONFIGS[type ?? TypeCommerce.VETEMENTS] ?? CONFIGS[TypeCommerce.VETEMENTS];
}

export interface VariantConfig {
  attr1Label: string;
  /** `null` = saisie libre numérique (pointures). */
  attr1Presets: string[] | null;
  attr2Label: string;
  attr2Presets: string[];
}

/**
 * Libellés et presets de variante pour une catégorie donnée.
 * En vêtements, l'ancienne logique par slug (chaussures, sacs, parfums…) est conservée ; ailleurs
 * ce sont les valeurs du type de commerce.
 */
export function getVariantConfig(type: TypeCommerce | null | undefined, slug: string | undefined): VariantConfig {
  const base = getCommerceConfig(type);
  if ((type ?? TypeCommerce.VETEMENTS) !== TypeCommerce.VETEMENTS) {
    return {
      attr1Label: base.attr1Label,
      attr1Presets: base.attr1Presets,
      attr2Label: base.attr2Label,
      attr2Presets: base.attr2Presets,
    };
  }
  const couleur = slug ? SLUG_COULEUR_CONFIG[slug] : undefined;
  return {
    attr1Label: "Taille",
    attr1Presets: getTaillesForSlug(slug),
    attr2Label: couleur?.label ?? base.attr2Label,
    attr2Presets: couleur ? couleur.presets : base.attr2Presets,
  };
}
