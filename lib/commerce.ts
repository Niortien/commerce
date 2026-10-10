import {
  IconBasket,
  IconBuildingStore,
  IconDeviceMobile,
  IconHammer,
  IconHanger,
  IconPerfume,
  IconPill,
  IconShirt,
  IconShoe,
  IconShoppingCart,
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
  /** Restaurant, quincaillerie et friperie ont des pages métier ; les autres types, les pages standard. */
  moduleMetier: boolean;
}

/** Vocabulaire des commerces sans module métier. */
const VOCAB_STANDARD: CommerceVocab = { produits: "Produits", entrees: "Entrées", categories: "Catégories" };

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
    moduleMetier: false,
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
    moduleMetier: true,
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
    moduleMetier: true,
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
    moduleMetier: true,
  },
  [TypeCommerce.CHAUSSURES]: {
    type: TypeCommerce.CHAUSSURES,
    label: "Chaussures",
    pluriel: "Boutiques de chaussures",
    description: "Pointures, couleurs et maroquinerie",
    exemple: { article: "Baskets cuir", detail: "Pointure 42", prix: "18 000 F" },
    icon: IconShoe,
    colorVar: "--sector-vetements",
    vocab: VOCAB_STANDARD,
    groupesSuggeres: ["Chaussures", "Sacs", "Accessoires"],
    moduleMetier: false,
  },
  [TypeCommerce.ALIMENTATION]: {
    type: TypeCommerce.ALIMENTATION,
    label: "Alimentation",
    pluriel: "Commerces d'alimentation",
    description: "Épicerie, boissons et produits frais",
    exemple: { article: "Riz parfumé", detail: "Sac 25 kg", prix: "15 500 F" },
    icon: IconBasket,
    colorVar: "--sector-alimentation",
    vocab: VOCAB_STANDARD,
    groupesSuggeres: ["Boissons", "Épicerie", "Produits frais", "Surgelés", "Snacks"],
    moduleMetier: false,
  },
  [TypeCommerce.SUPERMARCHE]: {
    type: TypeCommerce.SUPERMARCHE,
    label: "Supermarché",
    pluriel: "Supermarchés",
    description: "Rayons alimentaires, hygiène et maison",
    exemple: { article: "Huile 1 L", detail: "Lot de 6", prix: "7 800 F" },
    icon: IconShoppingCart,
    colorVar: "--sector-alimentation",
    vocab: VOCAB_STANDARD,
    groupesSuggeres: ["Alimentaire", "Boissons", "Hygiène & entretien", "Maison", "Frais"],
    moduleMetier: false,
  },
  [TypeCommerce.PHARMACIE]: {
    type: TypeCommerce.PHARMACIE,
    label: "Pharmacie",
    pluriel: "Pharmacies",
    description: "Médicaments et parapharmacie",
    exemple: { article: "Paracétamol 500 mg", detail: "Boîte", prix: "1 200 F" },
    icon: IconPill,
    colorVar: "--sector-sante",
    vocab: VOCAB_STANDARD,
    groupesSuggeres: ["Médicaments", "Parapharmacie", "Hygiène", "Matériel médical"],
    moduleMetier: false,
  },
  [TypeCommerce.ELECTRONIQUE]: {
    type: TypeCommerce.ELECTRONIQUE,
    label: "Électronique",
    pluriel: "Boutiques d'électronique",
    description: "Téléphones, ordinateurs et accessoires",
    exemple: { article: "Écouteurs Bluetooth", detail: "Noir", prix: "9 000 F" },
    icon: IconDeviceMobile,
    colorVar: "--sector-tech",
    vocab: VOCAB_STANDARD,
    groupesSuggeres: ["Téléphones", "Ordinateurs", "Accessoires", "Audio", "Électroménager"],
    moduleMetier: false,
  },
  [TypeCommerce.BEAUTE]: {
    type: TypeCommerce.BEAUTE,
    label: "Beauté",
    pluriel: "Boutiques de beauté",
    description: "Soins, maquillage et parfums",
    exemple: { article: "Beurre de karité", detail: "250 g", prix: "2 500 F" },
    icon: IconPerfume,
    colorVar: "--sector-beaute",
    vocab: VOCAB_STANDARD,
    groupesSuggeres: ["Soins", "Maquillage", "Cheveux", "Parfums"],
    moduleMetier: false,
  },
  [TypeCommerce.AUTRE]: {
    type: TypeCommerce.AUTRE,
    label: "Autre commerce",
    pluriel: "Autres commerces",
    description: "Tout autre type de boutique",
    exemple: { article: "Article", detail: "× 1", prix: "5 000 F" },
    icon: IconBuildingStore,
    colorVar: "--sector-autre",
    vocab: VOCAB_STANDARD,
    groupesSuggeres: ["Général"],
    moduleMetier: false,
  },
};

/** Ordre d'affichage des types de commerce : l'option historique, les métiers à modules, puis les autres. */
export const TYPES_COMMERCE: TypeCommerce[] = [
  TypeCommerce.VETEMENTS,
  TypeCommerce.RESTAURANT,
  TypeCommerce.QUINCAILLERIE,
  TypeCommerce.FRIPERIE,
  TypeCommerce.CHAUSSURES,
  TypeCommerce.ALIMENTATION,
  TypeCommerce.SUPERMARCHE,
  TypeCommerce.PHARMACIE,
  TypeCommerce.ELECTRONIQUE,
  TypeCommerce.BEAUTE,
  TypeCommerce.AUTRE,
];

export function isTypeCommerce(value: unknown): value is TypeCommerce {
  return typeof value === "string" && TYPES_COMMERCE.some((t) => t === value);
}

/**
 * Une boutique créée avant les types de commerce (champ absent ou inconnu) reste une boutique de vêtements.
 * « MODE » est l'ancien nom de ce type (avant la migration côté serveur).
 */
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
