"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Chip, Spinner } from "@heroui/react";
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { StockBadge } from "@/components/common/StockBadge";
import { useSuperAdminBoutique } from "@/features/super-admin/query/superadmin-queries";
import {
  useSuperAdminDashboard,
  useSuperAdminResumeJour,
  useSuperAdminStockAlertes,
  useSuperAdminStockValeur,
} from "@/features/super-admin/query/superadmin-activite-queries";
import { getPeriodeRange } from "@/lib/dateUtils";
import { StatutBoutique } from "@/types";

interface BoutiqueActiviteViewProps {
  boutiqueId: string;
}

const STATUT_COLOR: Record<StatutBoutique, "success" | "warning" | "danger" | "default"> = {
  [StatutBoutique.EN_ATTENTE]: "default",
  [StatutBoutique.ESSAI]: "warning",
  [StatutBoutique.ACTIF]: "success",
  [StatutBoutique.SUSPENDU]: "danger",
  [StatutBoutique.ARCHIVE]: "default",
};

function Kpi({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** Vue Super Admin — activité en lecture seule d'une boutique donnée, quelle qu'elle soit. */
export function BoutiqueActiviteView({ boutiqueId }: BoutiqueActiviteViewProps) {
  const { dateDebut, dateFin } = useMemo(() => getPeriodeRange("7j"), []);

  const { data: boutiqueRes, isLoading: boutiqueLoading } = useSuperAdminBoutique(boutiqueId);
  const boutique = boutiqueRes?.data;

  const { data: resumeRes, isLoading: resumeLoading } = useSuperAdminResumeJour(boutiqueId);
  const resume = resumeRes?.data;

  const { data: dashboardRes, isLoading: dashboardLoading } = useSuperAdminDashboard(boutiqueId, dateDebut, dateFin);
  const dashboard = dashboardRes?.data;

  const { data: stockValeurRes } = useSuperAdminStockValeur(boutiqueId);
  const stockValeur = stockValeurRes?.data;

  const { data: alertesRes } = useSuperAdminStockAlertes(boutiqueId);
  const alertes = alertesRes?.data ?? [];

  if (boutiqueLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!boutique) {
    return (
      <div className="p-6">
        <p className="text-sm text-text-muted">Boutique introuvable.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link href="/super-admin/boutiques" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <IconArrowLeft size={15} />
        Retour aux boutiques
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text">{boutique.nom}</h1>
            <Chip size="sm" color={STATUT_COLOR[boutique.statut]} variant="flat">{boutique.statut}</Chip>
          </div>
          <p className="text-sm text-text-muted">
            {boutique.ville ?? "—"} · Activité en lecture seule (vue Super Admin)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Ventes du jour">
          {resumeLoading ? (
            <Spinner size="sm" />
          ) : (
            <CurrencyDisplay montant={resume?.totalVentes ?? "0"} size="lg" tone="cash" />
          )}
          <p className="mt-1 text-xs text-text-muted">
            {resume?.session ? `${resume.totalTransactions} transaction${resume.totalTransactions !== 1 ? "s" : ""}` : "Aucune session ouverte"}
          </p>
        </Kpi>
        <Kpi label="Valeur du stock">
          <CurrencyDisplay montant={stockValeur?.valeurTotaleAchat ?? "0"} size="lg" tone="accent" />
          <p className="mt-1 text-xs text-text-muted">
            {stockValeur ? `${stockValeur.nombreProduits} produits · ${stockValeur.nombreVariantes} variantes` : "—"}
          </p>
        </Kpi>
        <Kpi label="Bénéfice net du jour">
          <CurrencyDisplay
            montant={resume ? String(Math.abs(parseFloat(resume.beneficeNet))) : "0"}
            size="lg"
            tone={resume && parseFloat(resume.beneficeNet) < 0 ? "out" : "in"}
          />
        </Kpi>
        <Kpi label="Alertes stock">
          <p className={`font-[var(--font-display)] text-xl md:text-3xl ${alertes.length > 0 ? "text-out" : "text-in"}`}>
            {alertes.length}
          </p>
          <p className="mt-1 text-xs text-text-muted">{alertes.length === 0 ? "Tout est OK" : "à réapprovisionner"}</p>
        </Kpi>
      </div>

      {alertes.length > 0 && (
        <div className="mt-4 rounded-xl border border-out/60 bg-[var(--color-out-dim)] p-4">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-out">
            <IconAlertTriangle size={14} />
            {alertes.length} article{alertes.length > 1 ? "s" : ""} sous le seuil d&apos;alerte
          </p>
          <ul className="flex flex-wrap gap-2">
            {alertes.slice(0, 20).map((item) => (
              <li key={item.id} className="flex items-center gap-1.5 rounded-lg border border-out/30 bg-[var(--color-surface)] px-2.5 py-1 text-xs">
                <span className="font-medium text-text">{item.produit?.nom ?? "—"}</span>
                <span className="text-text-muted">{item.taille} · {item.couleur}</span>
                <StockBadge value={item.quantiteStock} isAlert />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-border/60 bg-[var(--color-surface-high)] p-4">
        <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Top 5 produits — 7 derniers jours</p>
        {dashboardLoading ? (
          <Spinner size="sm" />
        ) : dashboard && dashboard.topProduits.length > 0 ? (
          <ol className="space-y-2">
            {dashboard.topProduits.map((p, i) => (
              <li
                key={p.produitId}
                className="flex items-center justify-between rounded-md border border-border/60 bg-[var(--color-surface)] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-[var(--font-mono)] text-xs text-text-muted">{i + 1}</span>
                  <span className="text-sm font-medium text-text">{p.nom}</span>
                </div>
                <div className="text-right">
                  <p className="font-[var(--font-mono)] text-xs text-accent">
                    {Number(p.montantTotal).toLocaleString("fr-FR")} FCFA
                  </p>
                  <p className="text-[10px] text-text-muted">{p.quantiteTotale} vendus</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-text-muted">Aucune vente sur les 7 derniers jours.</p>
        )}
      </div>
    </div>
  );
}
