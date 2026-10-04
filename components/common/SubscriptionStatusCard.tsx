"use client";

import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { StatusChip } from "@/components/common/StatusChip";
import { PLAN_LABEL, STATUT_BOUTIQUE_META, daysUntil, formatDaysLeft } from "@/lib/subscription";

/** Résumé de l'abonnement de la boutique connectée, affiché au bas de la navigation. */
export function SubscriptionStatusCard() {
  const { data } = useMyBoutique();
  const boutique = data?.data;
  if (!boutique) return null;

  const meta = STATUT_BOUTIQUE_META[boutique.statut];
  const abonnement = boutique.abonnementActif;
  const days = abonnement ? daysUntil(abonnement.dateFin) : null;
  const urgent = days !== null && days <= 7;

  return (
    <section
      aria-label="Abonnement de la boutique"
      className="rounded-lg border border-sidebar-border bg-sidebar-hover p-3"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">Abonnement</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-sidebar-text">
          {abonnement ? PLAN_LABEL[abonnement.plan] : "Aucun plan"}
        </span>
        <StatusChip label={meta.label} tone={meta.tone} icon={meta.icon} onDark />
      </div>
      {days !== null && (
        <p className={urgent ? "mt-1.5 text-xs font-semibold text-amber-300" : "mt-1.5 text-xs text-sidebar-muted"}>
          {formatDaysLeft(days)}
        </p>
      )}
    </section>
  );
}
