import { ModePaiement, type EtatCompte } from "@/types";
import type { StatusTone } from "@/lib/subscription";

/** Délais de paiement proposés pour une vente à crédit, en jours. */
export const ECHEANCES_JOURS = [15, 30, 60] as const;

export const MODE_PAIEMENT_LABELS: Record<ModePaiement, string> = {
  [ModePaiement.CASH]: "Espèces",
  [ModePaiement.WAVE]: "Wave",
  [ModePaiement.ORANGE_MONEY]: "Orange Money",
  [ModePaiement.MTN_MONEY]: "MTN Money",
  [ModePaiement.CARTE]: "Carte",
};

export const MODES_PAIEMENT: ModePaiement[] = Object.values(ModePaiement);

export function isModePaiement(valeur: string): valeur is ModePaiement {
  return MODES_PAIEMENT.some((m) => m === valeur);
}

export type EtatClient = "EN_RETARD" | "DOIT" | "A_JOUR" | "AVOIR";

/** Où en est le compte : en retard passe avant tout, puis une dette, rien, ou un avoir en faveur du client. */
export function etatClient(compte: Pick<EtatCompte, "solde" | "enRetard">): EtatClient {
  if (Number(compte.enRetard) > 0) return "EN_RETARD";
  const solde = Number(compte.solde);
  if (solde > 0) return "DOIT";
  return solde < 0 ? "AVOIR" : "A_JOUR";
}

export const ETAT_CLIENT_META: Record<EtatClient, { label: string; tone: StatusTone }> = {
  EN_RETARD: { label: "En retard", tone: "out" },
  DOIT: { label: "Crédit en cours", tone: "return" },
  A_JOUR: { label: "À jour", tone: "in" },
  AVOIR: { label: "Avoir", tone: "neutral" },
};

/** Encore disponible sous le plafond ; null quand le client n'a pas de limite. */
export function creditDisponible(compte: Pick<EtatCompte, "solde"> & { plafondCredit: string | null }): number | null {
  if (compte.plafondCredit === null) return null;
  return Math.max(0, Number(compte.plafondCredit) - Number(compte.solde));
}

/** Date d'échéance (AAAA-MM-JJ) d'une vente faite aujourd'hui. */
export function echeanceDans(jours: number): string {
  const d = new Date();
  d.setDate(d.getDate() + jours);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Lien WhatsApp vers le client, à partir d'un numéro saisi librement ; null si inexploitable. */
export function lienWhatsApp(telephone: string | null): string | null {
  const chiffres = (telephone ?? "").replace(/\D/g, "");
  if (chiffres.length < 8) return null;
  // Numéro local ivoirien (10 chiffres) : on ajoute l'indicatif 225.
  const international = chiffres.length === 10 ? `225${chiffres}` : chiffres;
  return `https://wa.me/${international}`;
}
