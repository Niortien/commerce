"use client";

import { Chip, Spinner } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { useSessionTransactions } from "@/features/caisse/query/caisse-queries";
import type { Session } from "@/types";
import { StatutSession } from "@/types";

interface SessionDetailDrawerProps {
  session: Session | null;
  onClose: () => void;
}

const MODE_COLORS: Record<string, string> = {
  CASH: "border-[#4A7AFF]/30 bg-[#4A7AFF]/10 text-[#4A7AFF]",
  WAVE: "border-[#39d353]/30 bg-[#39d353]/10 text-[#39d353]",
  ORANGE_MONEY: "border-[#ff9a3c]/30 bg-[#ff9a3c]/10 text-[#ff9a3c]",
  CARTE: "border-[#8f7ef5]/30 bg-[#8f7ef5]/10 text-[#8f7ef5]",
  MTN_MONEY: "border-[#64a0ff]/30 bg-[#64a0ff]/10 text-[#64a0ff]",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SessionDetailDrawer({ session, onClose }: SessionDetailDrawerProps) {
  const { data, isLoading } = useSessionTransactions(session?.id ?? "", {});

  const transactions = data?.data ?? [];
  const totalVentes = transactions.reduce((s, t) => s + parseFloat(t.montant || "0"), 0);

  return (
    <AnimatePresence>
      {session && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-bg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted">Détails session</p>
                <p className="mt-0.5 text-sm font-semibold text-text">
                  {new Date(session.dateOuverture).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted hover:text-text"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Résumé session */}
            <div className="grid grid-cols-2 gap-3 border-b border-border p-4">
              <div className="rounded-xl border border-border/60 bg-surface p-3">
                <p className="text-[10px] uppercase tracking-widest text-text-dim">Ouverture</p>
                <CurrencyDisplay montant={session.montantOuverture} size="sm" tone="default" className="mt-1" />
                <p className="mt-0.5 text-[10px] text-text-dim">
                  {fmt(session.dateOuverture)}
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-surface p-3">
                <p className="text-[10px] uppercase tracking-widest text-text-dim">
                  {session.statut === StatutSession.OUVERTE ? "En cours" : "Fermeture"}
                </p>
                <CurrencyDisplay
                  montant={session.montantFermeture ?? "—"}
                  size="sm"
                  tone={session.montantFermeture ? "accent" : "default"}
                  className="mt-1"
                />
                {session.dateFermeture && (
                  <p className="mt-0.5 text-[10px] text-text-dim">{fmt(session.dateFermeture)}</p>
                )}
              </div>

              <div className="col-span-2 rounded-xl border border-in/20 bg-in/8 p-3">
                <p className="text-[10px] uppercase tracking-widest text-text-dim">Total encaissé</p>
                <CurrencyDisplay montant={String(totalVentes)} size="md" tone="in" className="mt-1" />
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Liste transactions */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Spinner color="warning" size="sm" />
                </div>
              ) : transactions.length === 0 ? (
                <p className="p-5 text-center text-sm text-text-dim">Aucune transaction</p>
              ) : (
                <div className="divide-y divide-border/50">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Chip
                            size="sm"
                            variant="flat"
                            className={`border text-[10px] font-bold ${MODE_COLORS[tx.modePaiement] ?? "border-border bg-surface text-text-muted"}`}
                          >
                            {tx.modePaiement.replace("_", " ")}
                          </Chip>
                          {tx.reference && (
                            <span className="truncate text-[11px] text-text-dim">#{tx.reference}</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-text-muted">{fmt(tx.createdAt)}</p>
                        {tx.notes && (
                          <p className="mt-0.5 truncate text-[11px] text-text-dim">{tx.notes}</p>
                        )}
                      </div>
                      <CurrencyDisplay montant={tx.montant} size="sm" tone="in" className="shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
