"use client";

import { IconArrowRight, IconLock } from "@tabler/icons-react";
import { SpotlightCard } from "@/components/common/SpotlightCard";
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
    <SpotlightCard tone={isOuverte ? "in" : "cash"} className="group">
      <button
        type="button"
        onClick={() => onClick(session)}
        className="w-full cursor-pointer p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--tone)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className={
                  isOuverte
                    ? "inline-flex items-center gap-1.5 rounded-full bg-in-dim px-2.5 py-0.5 text-xs font-semibold text-in-text"
                    : "inline-flex items-center gap-1.5 rounded-full bg-surface-high px-2.5 py-0.5 text-xs font-semibold text-text-muted"
                }
              >
                {isOuverte ? (
                  <span className="relative flex h-2 w-2">
                    <span aria-hidden className="live-ping absolute inset-0 rounded-full bg-in" />
                    <span aria-hidden className="relative h-2 w-2 rounded-full bg-in" />
                  </span>
                ) : (
                  <IconLock size={12} aria-hidden />
                )}
                {isOuverte ? "En cours" : "Clôturée"}
              </span>
              {session.user?.email && <span className="truncate text-xs text-text-muted">{session.user.email}</span>}
            </div>

            <p className="text-sm font-medium text-text">{fmt(session.dateOuverture)}</p>
            {session.dateFermeture && (
              <p className="mt-0.5 text-xs text-text-muted">
                → {fmt(session.dateFermeture)}
                <span className="ml-2">({durée(session.dateOuverture, session.dateFermeture)})</span>
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <CurrencyDisplay
              montant={session.montantFermeture ?? session.montantOuverture}
              size="md"
              tone={isOuverte ? "default" : "cash"}
              className="font-display font-extrabold"
            />
            <p className="mt-0.5 text-[11px] text-text-muted">
              Ouv. {parseFloat(session.montantOuverture).toLocaleString("fr-FR")} F
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          {txCount !== null ? (
            <span className="text-xs text-text-muted">
              <span className="font-semibold text-text">{txCount}</span> transaction{txCount !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-xs text-text-muted">— transactions</span>
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-[var(--tone-text)]">
            Voir les détails
            <IconArrowRight size={14} aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </SpotlightCard>
  );
}
