import { StatusChip } from "@/components/common/StatusChip";
import { STATUT_BOUTIQUE_META, daysUntil } from "@/lib/subscription";
import { StatutBoutique, type Boutique } from "@/types";

interface BoutiquesSummaryProps {
  boutiques: Boutique[];
  isLoading: boolean;
}

const SUMMARY_STATUTS: StatutBoutique[] = [
  StatutBoutique.ACTIF,
  StatutBoutique.ESSAI,
  StatutBoutique.SUSPENDU,
];

/** Vue d'ensemble de la plateforme : boutiques par statut + abonnements arrivant à échéance sous 7 jours. */
export function BoutiquesSummary({ boutiques, isLoading }: BoutiquesSummaryProps) {
  const expiringSoon = boutiques.filter((b) => {
    if (!b.abonnementActif) return false;
    const days = daysUntil(b.abonnementActif.dateFin);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-busy={isLoading}>
      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">Boutiques</dt>
        <dd className="tabular mt-2 font-display text-2xl font-extrabold text-text">
          {isLoading ? "–" : boutiques.length}
        </dd>
      </div>
      {SUMMARY_STATUTS.map((statut) => {
        const meta = STATUT_BOUTIQUE_META[statut];
        const count = boutiques.filter((b) => b.statut === statut).length;
        return (
          <div key={statut} className="rounded-lg border border-border bg-surface p-4 shadow-card">
            <dt>
              <StatusChip label={meta.label} tone={meta.tone} icon={meta.icon} />
            </dt>
            <dd className="tabular mt-2 font-display text-2xl font-extrabold text-text">
              {isLoading ? "–" : count}
            </dd>
          </div>
        );
      })}
      <div className="col-span-2 rounded-lg border border-border bg-surface p-4 shadow-card lg:col-span-1">
        <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">Échéance &lt; 7 j</dt>
        <dd className="tabular mt-2 font-display text-2xl font-extrabold text-text">
          {isLoading ? "–" : expiringSoon}
        </dd>
      </div>
    </dl>
  );
}
