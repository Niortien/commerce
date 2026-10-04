import { differenceInCalendarDays } from "date-fns";
import {
  IconAlertTriangle,
  IconArchive,
  IconCircleCheck,
  IconClockHour4,
  IconHourglassHigh,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";
import { PlanAbonnement, StatutBoutique } from "@/types";

export type StatusTone = "in" | "return" | "out" | "neutral";

interface StatutMeta {
  label: string;
  tone: StatusTone;
  icon: ComponentType<IconProps>;
}

/** Statut d'une boutique → libellé, rôle couleur et icône (la couleur ne porte jamais le sens seule). */
export const STATUT_BOUTIQUE_META: Record<StatutBoutique, StatutMeta> = {
  [StatutBoutique.EN_ATTENTE]: { label: "En attente", tone: "neutral", icon: IconHourglassHigh },
  [StatutBoutique.ESSAI]: { label: "Période d'essai", tone: "return", icon: IconClockHour4 },
  [StatutBoutique.ACTIF]: { label: "Abonnement actif", tone: "in", icon: IconCircleCheck },
  [StatutBoutique.SUSPENDU]: { label: "Suspendue", tone: "out", icon: IconAlertTriangle },
  [StatutBoutique.ARCHIVE]: { label: "Archivée", tone: "neutral", icon: IconArchive },
};

export const PLAN_LABEL: Record<PlanAbonnement, string> = {
  [PlanAbonnement.ESSAI]: "Essai",
  [PlanAbonnement.MENSUEL]: "Mensuel",
  [PlanAbonnement.TRIMESTRIEL]: "Trimestriel",
  [PlanAbonnement.ANNUEL]: "Annuel",
};

/** Classes statiques (Tailwind doit les voir en clair) par rôle couleur. */
export const TONE_CLASSES: Record<StatusTone, { chip: string; text: string; solid: string }> = {
  in: { chip: "bg-in-dim text-in-text", text: "text-in-text", solid: "bg-in" },
  return: { chip: "bg-return-dim text-return-text", text: "text-return-text", solid: "bg-return" },
  out: { chip: "bg-out-dim text-out-text", text: "text-out-text", solid: "bg-out" },
  neutral: { chip: "bg-surface-high text-text-muted", text: "text-text-muted", solid: "bg-text-dim" },
};

/** Jours calendaires restants avant `dateFin` (négatif si dépassée). */
export function daysUntil(dateFin: string, now: Date = new Date()): number {
  return differenceInCalendarDays(new Date(dateFin), now);
}

export function formatDaysLeft(days: number): string {
  if (days < 0) return "Expiré";
  if (days === 0) return "Expire aujourd'hui";
  if (days === 1) return "1 jour restant";
  return `${days} jours restants`;
}
