"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import type { ResumeJour } from "@/types";

interface DashboardKpiGridProps {
  resume: ResumeJour | undefined;
  stockValeur: string;
  nombreProduits: number;
  alertesCount: number;
  isLoading: boolean;
  isError?: boolean;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  tone: "accent" | "in" | "out" | "cash";
  isMontant?: boolean;
  /** Prochaine action suggérée — rendue cliquable si `href` est fourni. */
  hint?: string;
  href?: string;
}

const TONE_CLASSES: Record<KpiCardProps["tone"], { border: string; bg: string; text: string }> = {
  accent: {
    border: "border-accent/35",
    bg: "bg-[var(--color-accent-dim)]",
    text: "text-accent",
  },
  in: {
    border: "border-[var(--color-in)]/40",
    bg: "bg-[var(--color-in-dim)]",
    text: "text-[var(--color-in)]",
  },
  out: {
    border: "border-[var(--color-out)]/40",
    bg: "bg-[var(--color-out-dim)]",
    text: "text-[var(--color-out)]",
  },
  cash: {
    border: "border-[var(--color-cash)]/40",
    bg: "bg-[var(--color-cash-dim)]",
    text: "text-[var(--color-cash)]",
  },
};

function KpiCard({ label, value, sub, tone, isMontant = false, hint, href }: KpiCardProps) {
  const t = TONE_CLASSES[tone];
  const content = (
    <>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      {isMontant ? (
        <CurrencyDisplay montant={String(value)} size="lg" tone={tone} className="mt-2" />
      ) : (
        <p className={`mt-2 font-[var(--font-display)] text-xl md:text-3xl ${t.text}`}>{value}</p>
      )}
      {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
      {hint && (
        <p className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${href ? t.text : "text-text-muted/60"}`}>
          {hint}
          {href && <IconArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />}
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`group block rounded-xl border ${t.border} ${t.bg} p-4 transition-transform hover:-translate-y-0.5 hover:shadow-md`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`rounded-xl border ${t.border} ${t.bg} p-4`}>{content}</div>;
}

export function DashboardKpiGrid({
  resume,
  stockValeur,
  nombreProduits,
  alertesCount,
  isLoading,
  isError,
}: DashboardKpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-border/40 bg-[var(--color-surface-high)]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-out/30 bg-out/5 px-4 py-3">
        <p className="text-sm font-semibold text-out">Impossible de charger les KPIs</p>
        <p className="mt-0.5 text-xs text-text-muted">Vérifie que le serveur backend est démarré et que tu es connecté.</p>
      </div>
    );
  }

  const totalVentes = resume?.totalVentes ?? "0";
  const totalTransactions = resume?.totalTransactions ?? 0;
  const beneficeNet = resume?.beneficeNet ?? "0";
  const isBenefice = parseFloat(beneficeNet) >= 0;
  const hasStock = parseFloat(stockValeur) > 0;
  const hasSession = !!resume?.session;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Ventes du jour"
          value={totalVentes}
          sub={
            totalTransactions > 0
              ? `${totalTransactions} transaction${totalTransactions !== 1 ? "s" : ""}`
              : hasSession
              ? "Aucune transaction encore"
              : "Ouvre une session caisse"
          }
          tone="cash"
          isMontant
          hint={!hasSession ? "Ouvrir une session" : undefined}
          href={!hasSession ? "/caisse" : undefined}
        />
        <KpiCard
          label="Valeur stock"
          value={stockValeur}
          sub={
            hasStock
              ? "au prix d'achat"
              : nombreProduits > 0
              ? `${nombreProduits} produit${nombreProduits > 1 ? "s" : ""} · aucun stock reçu`
              : "Aucun produit dans le catalogue"
          }
          tone="accent"
          isMontant
          hint={!hasStock && nombreProduits > 0 ? "Ajouter une entrée de stock" : undefined}
          href={!hasStock && nombreProduits > 0 ? "/entrees" : undefined}
        />
        <KpiCard
          label={isBenefice ? "Bénéfice net" : "Perte nette"}
          value={Math.abs(parseFloat(beneficeNet)).toFixed(0)}
          sub={isBenefice ? "ventes − achats du jour" : "achats > ventes du jour"}
          tone={isBenefice ? "in" : "out"}
          isMontant
        />
        <KpiCard
          label="Alertes stock"
          value={alertesCount}
          sub={alertesCount === 0 ? "Tout est OK" : "à réapprovisionner"}
          tone={alertesCount === 0 ? "in" : "out"}
          hint={alertesCount > 0 ? "Voir le stock" : undefined}
          href={alertesCount > 0 ? "/stock" : undefined}
        />
      </div>

      {/* Bannière perte si bénéfice négatif */}
      {!isBenefice && parseFloat(beneficeNet) !== 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-out)]/50 bg-[var(--color-out-dim)] px-4 py-2">
          <span className="text-sm font-semibold text-[var(--color-out)]">⚠ Perte nette aujourd&apos;hui</span>
          <span className="text-sm text-text-muted">
            Tes achats ({Number(resume?.totalAchats ?? 0).toLocaleString("fr-FR")} FCFA) dépassent tes ventes ({Number(totalVentes).toLocaleString("fr-FR")} FCFA).
          </span>
        </div>
      )}
    </div>
  );
}
