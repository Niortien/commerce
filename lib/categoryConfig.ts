export const STANDARD_TAILLES = ["S", "M", "L", "XL", "XXL"];
export const SAC_TAILLES = ["Petit", "Moyen", "Grand"];
export const CHOCOTO_TAILLES = ["Simple", "Away", "Autre"];
export const PARFUM_TAILLES = ["10cl", "20cl", "30cl", "Personnalisé"];
export const MONTRE_LUNETTE_TAILLES = ["Simple", "Original"];
export const SHOE_SIZES = ["34","35","36","37","38","39","40","41","42","43","44","45"];

export const SHOE_SLUGS = new Set([
  "basket", "barbouche", "cross", "soulier", "sandale", "claquette",
]);

export const SLUG_TAILLE_MAP: Record<string, string[]> = {
  sac: SAC_TAILLES,
  chocoto: CHOCOTO_TAILLES,
  parfum: PARFUM_TAILLES,
  montre: MONTRE_LUNETTE_TAILLES,
  lunette: MONTRE_LUNETTE_TAILLES,
};

export interface CouleurConfig {
  label: string;
  presets: string[];
}

export const SLUG_COULEUR_CONFIG: Record<string, CouleurConfig> = {
  "maillot-foot":   { label: "Équipe / Club", presets: [] },
  "maillot-basket": { label: "Équipe / Club", presets: [] },
  sac:              { label: "Type de sac",   presets: ["Sac de voyage", "Sac à dos", "Autre"] },
  parfum:           { label: "Marque",         presets: [] },
  montre:           { label: "Présentation",   presets: ["Avec coffret", "Sans coffret"] },
  lunette:          { label: "Présentation",   presets: ["Avec coffret", "Sans coffret"] },
};

export const DEFAULT_COLORS = [
  "Noir", "Blanc", "Gris", "Marine", "Beige",
  "Bordeaux", "Kaki", "Bleu", "Rouge", "Marron",
];

export const CATEGORY_GROUPS = [
  {
    label: "Hauts",
    slugs: ["tee-shirt", "polo", "polo-corp", "polo-sans-col", "polo-cartigan", "demanbre", "body", "debardeur"],
  },
  {
    label: "Chemises & Vestes",
    slugs: ["chemise-simple", "surchemise", "chemise-crope", "djaket", "doudoune"],
  },
  {
    label: "Tenues",
    slugs: ["complet-culotte", "complet-pantalon", "complet-pull", "complet-sky", "complet-sous-vetement"],
  },
  {
    label: "Pulls & Maillots",
    slugs: ["pull-simple", "pull-cartigan", "maillot-foot", "maillot-basket"],
  },
  {
    label: "Bas",
    slugs: ["pantalon-tissu", "pantalon-docker", "jogging", "jean-simple", "cargo"],
  },
  {
    label: "Culotte",
    slugs: ["culotte-simple", "culotte-away", "culotte-jean", "pantacourt-asake"],
  },
  {
    label: "Chaussures",
    slugs: ["basket", "barbouche", "cross", "soulier", "sandale", "claquette"],
  },
  {
    label: "Sacs & Divers",
    slugs: ["sac", "chaussettes", "chocoto"],
  },
  {
    label: "Parfum & Bijoux",
    slugs: ["parfum", "montre", "lunette"],
  },
];

/** Retourne les tailles prédéfinies pour un slug.
 *  null  → saisie numérique (chaussures)
 *  []    → pas de preset (slug inconnu avec tailles libres)
 *  [...] → liste de chips cliquables
 */
export function getTaillesForSlug(slug: string | undefined): string[] | null {
  if (!slug) return STANDARD_TAILLES;
  if (SHOE_SLUGS.has(slug)) return SHOE_SIZES;
  return SLUG_TAILLE_MAP[slug] ?? STANDARD_TAILLES;
}

/** Regroupe les catégories par groupe visuel.
 *  Priorité : champ `description` (catégories créées via admin) puis slug hardcodé.
 *  Catégories sans groupe connu → bucket "Autres".
 */
export function groupCategories<T extends { slug: string; description?: string | null }>(categories: T[]) {
  const grouped = new Set<T>();
  const groups = CATEGORY_GROUPS.map((group) => {
    const items = categories.filter(
      (c) => c.description === group.label || group.slugs.includes(c.slug)
    );
    items.forEach((c) => grouped.add(c));
    return { label: group.label, items };
  }).filter((g) => g.items.length > 0);
  const ungrouped = categories.filter((c) => !grouped.has(c));
  if (ungrouped.length > 0) groups.push({ label: "Autres", items: ungrouped });
  return groups;
}
