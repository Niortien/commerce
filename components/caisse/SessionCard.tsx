"use client";

import { Chip } from "@heroui/react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import type { Session } from "@/types";
import { StatutSession } from "@/types";

interface SessionCardProps {
  session: Session;
  onClick: (session: Session) => void;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function durée(ouverture: string, fermeture: string | null): string {
  const fin = fermeture ? new Date(fermeture) : new Date();
  const ms = fin.getTime() - new Date(ouverture).getTime();
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  const isOuverte = session.statut === StatutSession.OUVERTE;
  const txCount = session.transactions?.length ?? null;

  return (
    <button
      onClick={() => onClick(session)}
      className="group w-full rounded-xl border border-border/60 bg-surface p-4 text-left transition-all hover:border-accent/40 hover:bg-surface/80"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Statut + date */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Chip
              size="sm"
              variant="flat"
              className={
                isOuverte
                  ? "border border-in/30 bg-in/10 text-in"
                  : "border border-border/50 bg-surface text-text-muted"
              }
            >
              {isOuverte ? "● En cours" : "Clôturée"}
            </Chip>
            {session.user?.email && (
              <span className="truncate text-xs text-text-muted">{session.user.email}</span>
            )}
          </div>

          <p className="text-sm font-medium text-text">{fmt(session.dateOuverture)}</p>
          {session.dateFermeture && (
            <p className="mt-0.5 text-xs text-text-muted">
              → {fmt(session.dateFermeture)}
              <span className="ml-2 text-text-dim">({durée(session.dateOuverture, session.dateFermeture)})</span>
            </p>
          )}
        </div>

        {/* Montants */}
        <div className="shrink-0 text-right">
          <CurrencyDisplay
            montant={session.montantFermeture ?? session.montantOuverture}
            size="sm"
            tone={isOuverte ? "default" : "accent"}
          />
          <p className="mt-0.5 text-[11px] text-text-dim">
            Ouv. <span className="text-text-muted">{parseFloat(session.montantOuverture).toLocaleString("fr-FR")} F</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
        {txCount !== null ? (
          <span className="text-xs text-text-muted">
            <span className="font-semibold text-text">{txCount}</span> transaction{txCount !== 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-xs text-text-dim">— transactions</span>
        )}
        <span className="text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
          Voir détails →
        </span>
      </div>
    </button>
  );
}
