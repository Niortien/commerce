import { IconCheck, IconClock, IconHourglassEmpty, IconReceipt, IconX, type Icon } from "@tabler/icons-react";
import type { StatusTone } from "@/lib/subscription";
import { StatutDevis, type Devis } from "@/types";

export type EtatDevis = StatutDevis | "EXPIRE";

export const ETAT_DEVIS_META: Record<EtatDevis, { label: string; tone: StatusTone; icon: Icon }> = {
  [StatutDevis.EN_COURS]: { label: "En cours", tone: "neutral", icon: IconClock },
  [StatutDevis.ACCEPTE]: { label: "Accepté", tone: "in", icon: IconCheck },
  [StatutDevis.CONVERTI]: { label: "Devenu vente", tone: "in", icon: IconReceipt },
  [StatutDevis.ANNULE]: { label: "Annulé", tone: "out", icon: IconX },
  EXPIRE: { label: "Expiré", tone: "return", icon: IconHourglassEmpty },
};

/** Un devis en cours dont la date de validité est passée est « expiré » (il reste convertible si le client revient). */
export function etatDevis(devis: Pick<Devis, "statut" | "valableJusquAu">, aujourdHui = new Date()): EtatDevis {
  if (devis.statut !== StatutDevis.EN_COURS) return devis.statut;
  const jour = aujourdHui.toISOString().slice(0, 10);
  return devis.valableJusquAu < jour ? "EXPIRE" : StatutDevis.EN_COURS;
}

export function formatDateCourte(iso: string): string {
  return new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const VALIDITES_JOURS = [7, 15, 30] as const;
