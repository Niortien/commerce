import {
  IconHammer,
  IconHanger,
  IconShirt,
  IconToolsKitchen2,
  type Icon,
} from "@tabler/icons-react";
import type { CSSProperties } from "react";
import { TypeCommerce } from "@/types";

/** Mots de l'interface qui changent selon le commerce. */
export interface CommerceVocab {
  /** Ce qu'on vend : « Produits », « Plats », « Articles », « Pièces ». */
  produits: string;
  /** Ce qui entre en stock : « Entrées », « Achats », « Réceptions », « Balles ». */
  entrees: string;
  /** Les familles de produits : « Catégories », « Rubriques du menu », « Rayons ». */
  categories: string;
}

export interface CommerceProfile {
  type: TypeCommerce;
  /** Nom du commerce, au singulier : « Vêtements », « Restaurant »… */
  label: string;
  /** Nom des boutiques de ce type, au pluriel, pour le Super Admin. */
  pluriel: string;
  /** Ce qu'on y gère, en quelques mots (choix à l'inscription). */
  description: string;
  /** Ligne de ticket typique : montre à l'inscription à quoi ressemblera la caisse. */
  exemple: { article: string; detail: string; prix: string };
  icon: Icon;
  /** Variable CSS de la teinte du secteur (voir app/globals.css). */
  colorVar: string;
  vocab: CommerceVocab;
  /** Groupes de catégories proposés ; la boutique peut en créer d'autres librement. */
  groupesSuggeres: string[];
}

export const COMMERCE_PROFILES: Record<TypeCommerce, CommerceProfile> = {
  [TypeCommerce.VETEMENTS]: {
    type: TypeCommerce.VETEMENTS,
    label: "Vêtements",
    pluriel: "Boutiques de vêtements",
    description: "Tailles, couleurs et collections",
    exemple: { article: "Robe wax", detail: "Taille M", prix: "8 500 F" },
    icon: IconHanger,
    colorVar: "--sector-vetements",
    vocab: { produits: "Produits", entrees: "Entrées", categories: "Catégories" },
    groupesSuggeres: ["Hauts", "Chemises & Vestes", "Tenues", "Pulls & Maillots", "Bas", "Culotte", "Chaussures", "Sacs & Divers", "Parfum & Bijoux"],
  },
  [TypeCommerce.RESTAURANT]: {
    type: TypeCommerce.RESTAURANT,
    label: "Restaurant",
    pluriel: "Restaurants",
    description: "Plats du menu et achats d'ingrédients",
    exemple: { article: "Garba poulet", detail: "× 2", prix: "3 000 F" },
    icon: IconToolsKitchen2,
    colorVar: "--sector-restaurant",
    vocab: { produits: "Plats", entrees: "Achats", categories: "Rubriques du menu" },
    groupesSuggeres: ["Menu", "Boissons", "Cuisine"],
  },
  [TypeCommerce.QUINCAILLERIE]: {
    type: TypeCommerce.QUINCAILLERIE,
    label: "Quincaillerie",
    pluriel: "Quincailleries",
    description: "Outillage, plomberie et électricité",
    exemple: { article: "Câble 2,5 mm²", detail: "12 m", prix: "6 000 F" },
    icon: IconHammer,
    colorVar: "--sector-quincaillerie",
    vocab: { produits: "Articles", entrees: "Réceptions", categories: "Rayons" },
    groupesSuggeres: ["Électricité", "Plomberie", "Construction", "Outillage"],
  },
  [TypeCommerce.FRIPERIE]: {
    type: TypeCommerce.FRIPERIE,
    label: "Friperie",
    pluriel: "Friperies",
    description: "Balles et pièces uniques",
    exemple: { article: "Veste en jean", detail: "N°14", prix: "3 000 F" },
    icon: IconShirt,
    colorVar: "--sector-friperie",
    vocab: { produits: "Pièces", entrees: "Balles", categories: "Rayons" },
    groupesSuggeres: ["Vêtements", "Accessoires", "Maison"],
  },
};

/** Ordre d'affichage des types de commerce (le premier est l'option historique). */
export const TYPES_COMMERCE: TypeCommerce[] = [
  TypeCommerce.VETEMENTS,
  TypeCommerce.RESTAURANT,
  TypeCommerce.QUINCAILLERIE,
  TypeCommerce.FRIPERIE,
];

export function isTypeCommerce(value: unknown): value is TypeCommerce {
  return typeof value === "string" && (TYPES_COMMERCE as string[]).includes(value);
}

/** Une boutique créée avant les types de commerce (champ absent ou inconnu) reste une boutique de vêtements. */
export function resolveTypeCommerce(value: unknown): TypeCommerce {
  return isTypeCommerce(value) ? value : TypeCommerce.VETEMENTS;
}

export function getCommerceProfile(value: unknown): CommerceProfile {
  return COMMERCE_PROFILES[resolveTypeCommerce(value)];
}

export type SectorStyle = CSSProperties & Record<"--sector", string>;

/**
 * Pose `--sector` sur un élément : ses enfants s'en servent via `text-[color:var(--sector)]`…
 * `onDark` prend la variante claire, lisible sur la barre latérale bleu nuit.
 */
export function sectorStyle(type: TypeCommerce, onDark = false): SectorStyle {
  const { colorVar } = COMMERCE_PROFILES[type];
  return { "--sector": `var(${colorVar}${onDark ? "-soft" : ""})` };
}
