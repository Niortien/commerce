import type { LigneImportCatalogue } from "@/features/produits/api/produits-api";
import { TypeCommerce } from "@/types";

/**
 * Lecture du fichier de catalogue (CSV enregistré depuis Excel, Google Sheets ou LibreOffice).
 * Excel en français sépare par « ; », les autres par « , » : on devine le séparateur sur la 1re ligne.
 */

type Champ = keyof LigneImportCatalogue;

/** En-têtes acceptés pour chaque colonne (comparés sans accents ni majuscules). */
const ALIAS: Record<Champ, string[]> = {
  nom: ["nom", "article", "produit", "designation", "libelle", "name"],
  categorie: ["categorie", "category", "rayon", "famille"],
  prixVente: ["prix de vente", "prix vente", "prixvente", "prix", "pv", "price"],
  prixAchat: ["prix d'achat", "prix achat", "prixachat", "cout", "pa", "cost"],
  quantite: ["quantite", "stock", "qte", "qty", "quantity"],
  unite: ["unite", "unit"],
  taille: ["taille", "pointure", "size", "format"],
  couleur: ["couleur", "color", "colour", "variante"],
  codeBarre: ["code-barres", "code barres", "code barre", "codebarre", "ean", "barcode", "gencod"],
  seuilAlerte: ["seuil d'alerte", "seuil alerte", "seuil", "alerte"],
};

const COLONNES_MODELE: Array<{ champ: Champ; titre: string }> = [
  { champ: "nom", titre: "Nom" },
  { champ: "categorie", titre: "Catégorie" },
  { champ: "prixVente", titre: "Prix de vente" },
  { champ: "prixAchat", titre: "Prix d'achat" },
  { champ: "quantite", titre: "Quantité" },
  { champ: "unite", titre: "Unité" },
  { champ: "taille", titre: "Taille" },
  { champ: "couleur", titre: "Couleur" },
  { champ: "codeBarre", titre: "Code-barres" },
];

/** Deux lignes d'exemple par type, pour montrer le format attendu. */
const EXEMPLES: Record<TypeCommerce, string[][]> = {
  [TypeCommerce.VETEMENTS]: [
    ["T-shirt oversize", "T-shirts", "7000", "3500", "4", "PIECE", "M", "Noir", ""],
    ["T-shirt oversize", "T-shirts", "7000", "3500", "3", "PIECE", "L", "Noir", ""],
  ],
  [TypeCommerce.CHAUSSURES]: [
    ["Basket Air", "Sport", "25000", "15000", "2", "PIECE", "42", "Blanc", ""],
    ["Basket Air", "Sport", "25000", "15000", "1", "PIECE", "43", "Blanc", ""],
  ],
  [TypeCommerce.FRIPERIE]: [
    ["Jean Levi's 501", "Jeans", "4000", "1500", "1", "PIECE", "32", "Bleu", ""],
    ["Chemise lin", "Chemises", "3000", "1000", "1", "PIECE", "L", "Blanc", ""],
  ],
  [TypeCommerce.ALIMENTATION]: [
    ["Riz parfumé 5 kg", "Riz et céréales", "4500", "3800", "20", "SAC", "", "", "6151100000017"],
    ["Huile 1 L", "Huiles", "1500", "1200", "24", "BOUTEILLE", "", "", ""],
  ],
  [TypeCommerce.SUPERMARCHE]: [
    ["Coca-Cola 33 cl", "Sodas et jus", "500", "350", "48", "PIECE", "", "", "5449000000996"],
    ["Lait concentré", "Épicerie sucrée", "650", "500", "36", "BOITE", "", "", ""],
  ],
  [TypeCommerce.PHARMACIE]: [
    ["Paracétamol 500 mg", "Douleur et fièvre", "1000", "650", "30", "BOITE", "", "", "3400930000000"],
    ["Pansements x20", "Pansements", "1500", "900", "15", "BOITE", "", "", ""],
  ],
  [TypeCommerce.ELECTRONIQUE]: [
    ["Chargeur USB-C 20 W", "Chargeurs et câbles", "6000", "3500", "10", "PIECE", "", "", ""],
    ["Écouteurs Bluetooth", "Écouteurs", "12000", "7000", "5", "PIECE", "", "Noir", ""],
  ],
  [TypeCommerce.BEAUTE]: [
    ["Beurre de karité 250 g", "Beurres et huiles", "2500", "1500", "12", "PIECE", "", "", ""],
    ["Mèches brésiliennes", "Mèches et perruques", "15000", "9000", "6", "PAQUET", "", "", ""],
  ],
  [TypeCommerce.QUINCAILLERIE]: [
    ["Ciment 50 kg", "Ciment et liants", "5500", "4800", "40", "SAC", "", "", ""],
    ["Fer à béton 10 mm", "Fers et aciers", "4000", "3300", "100", "PIECE", "", "", ""],
  ],
  [TypeCommerce.RESTAURANT]: [
    ["Riz", "Ingrédients", "0", "600", "25", "KG", "", "", ""],
    ["Coca-Cola 33 cl", "Boissons", "700", "350", "24", "BOUTEILLE", "", "", ""],
  ],
  [TypeCommerce.AUTRE]: [
    ["Article exemple", "Articles courants", "1000", "600", "10", "PIECE", "", "", ""],
    ["Autre article", "Divers", "2500", "1500", "5", "PIECE", "", "", ""],
  ],
};

function sansAccents(texte: string): string {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function champDeLEnTete(entete: string): Champ | null {
  const cle = sansAccents(entete);
  for (const champ of Object.keys(ALIAS) as Champ[]) {
    if (ALIAS[champ].some((a) => sansAccents(a) === cle)) return champ;
  }
  return null;
}

function deviner(premiereLigne: string): string {
  const compte = (sep: string) => premiereLigne.split(sep).length;
  return [";", "\t", ","].reduce((meilleur, sep) => (compte(sep) > compte(meilleur) ? sep : meilleur), ";");
}

/** Découpe le texte en cellules en respectant les guillemets ("Jean, slim" reste une cellule). */
export function lireCsv(texte: string): string[][] {
  const propre = texte.replace(/^﻿/, "");
  const sep = deviner(propre.split(/\r?\n/, 1)[0] ?? "");
  const lignes: string[][] = [];
  let cellule = "";
  let ligne: string[] = [];
  let entreGuillemets = false;

  for (let i = 0; i < propre.length; i++) {
    const c = propre[i];
    if (entreGuillemets) {
      if (c === '"' && propre[i + 1] === '"') {
        cellule += '"';
        i++;
      } else if (c === '"') {
        entreGuillemets = false;
      } else {
        cellule += c;
      }
    } else if (c === '"') {
      entreGuillemets = true;
    } else if (c === sep) {
      ligne.push(cellule);
      cellule = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && propre[i + 1] === "\n") i++;
      ligne.push(cellule);
      lignes.push(ligne);
      ligne = [];
      cellule = "";
    } else {
      cellule += c;
    }
  }
  if (cellule !== "" || ligne.length > 0) {
    ligne.push(cellule);
    lignes.push(ligne);
  }
  return lignes.filter((l) => l.some((c) => c.trim() !== ""));
}

export interface LectureCatalogue {
  lignes: LigneImportCatalogue[];
  /** En-têtes du fichier que l'on n'a pas su rattacher à une colonne (ignorés). */
  colonnesIgnorees: string[];
  /** Colonnes obligatoires absentes : le fichier ne peut pas être importé tel quel. */
  colonnesManquantes: string[];
}

/** « 4 500 » ou « 4500,50 » écrits par Excel deviennent « 4500 » et « 4500.50 ». */
function nombre(valeur: string): string {
  const v = valeur.replace(/[\s  ]/g, "").replace(/(f\s*cfa|fcfa|cfa|f)$/i, "");
  return /^-?\d+(,\d+)?$/.test(v) ? v.replace(",", ".") : v;
}

const CHAMPS_NOMBRES: Champ[] = ["prixVente", "prixAchat", "quantite", "seuilAlerte"];

export function lireCatalogue(texte: string): LectureCatalogue {
  return lireTableau(lireCsv(texte));
}

/** Même lecture, à partir des lignes d'une feuille Excel (.xlsx) déjà découpées en cellules. */
export function lireTableau(tableau: string[][]): LectureCatalogue {
  const [entetes = [], ...donnees] = tableau.filter((l) => l.some((c) => c.trim() !== ""));
  const champs = entetes.map(champDeLEnTete);
  const colonnesIgnorees = entetes.filter((e, i) => champs[i] === null && e.trim() !== "");
  const titres: Record<string, string> = { nom: "Nom", categorie: "Catégorie", prixVente: "Prix de vente" };
  const colonnesManquantes = (["nom", "categorie", "prixVente"] as const)
    .filter((c) => !champs.includes(c))
    .map((c) => titres[c]);

  const lignes = donnees.map((cellules) => {
    const ligne: LigneImportCatalogue = { nom: "", categorie: "", prixVente: "" };
    champs.forEach((champ, i) => {
      if (!champ) return;
      const brut = (cellules[i] ?? "").trim();
      ligne[champ] = CHAMPS_NOMBRES.includes(champ) ? nombre(brut) : brut;
    });
    return ligne;
  });

  return { lignes, colonnesIgnorees, colonnesManquantes };
}

function cellule(valeur: string): string {
  return /[";\n]/.test(valeur) ? `"${valeur.replace(/"/g, '""')}"` : valeur;
}

/** Modèle à ouvrir dans Excel : séparateur « ; » et BOM pour que les accents s'affichent bien. */
export function modeleCatalogue(type: TypeCommerce): string {
  const lignes = [COLONNES_MODELE.map((c) => c.titre), ...EXEMPLES[type]];
  return "﻿" + lignes.map((l) => l.map(cellule).join(";")).join("\r\n") + "\r\n";
}
