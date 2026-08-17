"use client";

import { ModePaiement } from "@/types";
import type { ResumeJour } from "@/types";

const MODE_LABELS: Record<ModePaiement, string> = {
  CASH: "Cash",
  WAVE: "Wave",
  ORANGE_MONEY: "Orange Money",
  CARTE: "Carte",
  MTN_MONEY: "MTN Money",
};

const MODE_COLORS: Record<ModePaiement, string> = {
  CASH: "#4A7AFF",
  WAVE: "#39d353",
  ORANGE_MONEY: "#ff9a3c",
  CARTE: "#8f7ef5",
  MTN_MONEY: "#64a0ff",
};

interface ActivitePaiementBreakdownProps {
  resume: ResumeJour | null;
}

export function ActivitePaiementBreakdown({ resume }: ActivitePaiementBreakdownProps) {
  if (!resume) {
    return (
      <p className="py-4 text-center text-sm text-text-muted">Session non disponible</p>
    );
  }

  const entries = Object.entries(resume.parModePaiement) as [ModePaiement, string][];
  const total = entries.reduce((sum, [, v]) => sum + parseFloat(v || "0"), 0);

  if (entries.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-text-muted">Aucun paiement enregistré aujourd&apos;hui</p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Barre de répartition */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {entries.map(([mode, montant]) => {
          const pct = total > 0 ? (parseFloat(montant) / total) * 100 : 0;
          return (
            <div
              key={mode}
              className="h-full transition-all"
              style={{
                width: `${pct}%`,
                backgroundColor: MODE_COLORS[mode],
              }}
            />
          );
        })}
      </div>

      {/* Détail par mode */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {entries.map(([mode, montant]) => {
          const pct = total > 0 ? Math.round((parseFloat(montant) / total) * 100) : 0;
          return (
            <div
              key={mode}
              className="flex items-center gap-2 rounded-lg border border-border/40 bg-[var(--color-surface-high)] px-3 py-2"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: MODE_COLORS[mode] }}
              />
              <div className="min-w-0">
                <p className="text-[11px] text-text-muted">{MODE_LABELS[mode]}</p>
                <p className="font-[var(--font-mono)] text-sm font-semibold text-text">
                  {Math.round(parseFloat(montant)).toLocaleString("fr-FR")}
                  <span className="ml-1 text-[10px] text-text-dim">FCFA</span>
                </p>
                <p className="text-[10px] text-text-dim">{pct}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
