import type { Categorie } from "@/types";

export interface GroupeCategories {
  /** null = catégories rangées dans aucun groupe. */
  groupe: string | null;
  items: Categorie[];
}

const normaliser = (g: string | null | undefined) => (g && g.trim() ? g.trim() : null);

/** Les groupes réellement utilisés par la boutique (sans doublon, triés). */
export function groupesUtilises(categories: Categorie[]): string[] {
  const set = new Set<string>();
  categories.forEach((c) => {
    const g = normaliser(c.description);
    if (g) set.add(g);
  });
  return [...set].sort((a, b) => a.localeCompare(b, "fr"));
}

/**
 * Range les catégories par groupe : d'abord les groupes suggérés pour le métier (dans leur ordre),
 * puis ceux que la boutique a inventés (ordre alphabétique), et enfin celles sans groupe.
 */
export function grouperCategories(categories: Categorie[], ordreSuggere: string[]): GroupeCategories[] {
  const parGroupe = new Map<string | null, Categorie[]>();
  categories.forEach((c) => {
    const g = normaliser(c.description);
    parGroupe.set(g, [...(parGroupe.get(g) ?? []), c]);
  });

  const libres = [...parGroupe.keys()]
    .filter((g): g is string => g !== null && !ordreSuggere.includes(g))
    .sort((a, b) => a.localeCompare(b, "fr"));
  const ordre: Array<string | null> = [...ordreSuggere.filter((g) => parGroupe.has(g)), ...libres];
  if (parGroupe.has(null)) ordre.push(null);

  return ordre.map((groupe) => ({
    groupe,
    items: [...(parGroupe.get(groupe) ?? [])].sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
  }));
}
