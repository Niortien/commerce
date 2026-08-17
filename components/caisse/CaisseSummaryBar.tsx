import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import type { ResumeJour } from "@/types";

interface CaisseSummaryBarProps {
  resume: ResumeJour;
}

export function CaisseSummaryBar({ resume }: CaisseSummaryBarProps) {
  return (
    <div className="sticky bottom-3 grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-5">
      <div>
        <p className="text-xs text-text-muted">Ventes</p>
        <CurrencyDisplay montant={resume.totalVentes} />
      </div>
      <div>
        <p className="text-xs text-text-muted">Achats</p>
        <CurrencyDisplay montant={resume.totalAchats} />
      </div>
      <div>
        <p className="text-xs text-text-muted">Dépenses</p>
        <CurrencyDisplay montant={resume.totalDepenses} tone="out" />
      </div>
      <div>
        <p className="text-xs text-text-muted">Bénéfice</p>
        <CurrencyDisplay montant={resume.beneficeNet} tone={parseFloat(resume.beneficeNet) >= 0 ? "in" : "out"} />
      </div>
      <div>
        <p className="text-xs text-text-muted">À déposer</p>
        <CurrencyDisplay montant={resume.montantADeposer} tone="cash" />
      </div>
    </div>
  );
}
