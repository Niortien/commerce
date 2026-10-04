import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import type { ResumeJour } from "@/types";

interface CaisseSummaryBarProps {
  resume: ResumeJour;
}

type Tone = "default" | "out" | "in" | "cash";

export function CaisseSummaryBar({ resume }: CaisseSummaryBarProps) {
  const benefice = parseFloat(resume.beneficeNet) >= 0;
  const cells: { label: string; montant: string; tone: Tone }[] = [
    { label: "Ventes", montant: resume.totalVentes, tone: "default" },
    { label: "Achats", montant: resume.totalAchats, tone: "default" },
    { label: "Dépenses", montant: resume.totalDepenses, tone: "out" },
    { label: "Bénéfice", montant: resume.beneficeNet, tone: benefice ? "in" : "out" },
    { label: "À déposer", montant: resume.montantADeposer, tone: "cash" },
  ];

  return (
    <dl
      aria-label="Résumé de la journée"
      className="sticky bottom-3 z-sticky grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-md sm:grid-cols-5"
    >
      {cells.map((c) => (
        <div key={c.label} className="bg-surface px-3.5 py-3 last:col-span-2 sm:last:col-span-1">
          <dt className="text-xs font-medium text-text-muted">{c.label}</dt>
          <dd>
            <CurrencyDisplay montant={c.montant} tone={c.tone} size="md" className="font-semibold tabular-nums" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
