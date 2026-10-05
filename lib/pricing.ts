/**
 * Tarifs des abonnements Mon Djossi, en FCFA : source unique pour le site de présentation, l'inscription et le Super Admin.
 * Modifier un prix = modifier une seule ligne ici.
 */
export type PlanCode = "ESSAI" | "MENSUEL" | "TRIMESTRIEL" | "ANNUEL";

export const PLAN_PRIX_FCFA: Record<PlanCode, number> = {
  ESSAI: 0,
  MENSUEL: 10_000,
  TRIMESTRIEL: 27_000,
  ANNUEL: 96_000,
};

const MOIS: Record<PlanCode, number> = { ESSAI: 0, MENSUEL: 1, TRIMESTRIEL: 3, ANNUEL: 12 };

/** « 27 000 FCFA » (espace insécable fine entre les milliers). */
export function formatFcfa(montant: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(montant)} FCFA`;
}

/** Prix d'un plan, ou « Gratuit » pour l'essai. */
export function prixPlan(plan: PlanCode): string {
  return plan === "ESSAI" ? "Gratuit" : formatFcfa(PLAN_PRIX_FCFA[plan]);
}

/** Équivalent par mois d'un plan payant (arrondi), ou null pour l'essai. */
export function prixParMois(plan: PlanCode): number | null {
  return MOIS[plan] === 0 ? null : Math.round(PLAN_PRIX_FCFA[plan] / MOIS[plan]);
}

/** Économie en % par rapport à 12 mois au tarif mensuel, ou null s'il n'y en a pas. */
export function remisePourcent(plan: PlanCode): number | null {
  if (MOIS[plan] <= 1) return null;
  const plein = PLAN_PRIX_FCFA.MENSUEL * MOIS[plan];
  return Math.round((1 - PLAN_PRIX_FCFA[plan] / plein) * 100);
}
