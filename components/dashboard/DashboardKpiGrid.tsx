"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBoxSeam,
  IconCoin,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
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

type Tone = "accent" | "in" | "out" | "cash";

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  tone: Tone;
  icon: ComponentType<IconProps>;
  isMontant?: boolean;
  /** Prochaine action suggérée — rendue cliquable si `href` est fourni. */
  hint?: string;
  href?: string;
}

// Pastille d'icône = aplat teinté ; texte de la valeur = variante « text » (contraste ≥ 4.5:1).
const TONE_CLASSES: Record<Tone, { chip: string; text: string }> = {
  accent: { chip: "bg-accent-dim text-accent-text", text: "text-accent-text" },
  in: { chip: "bg-in-dim text-in-text", text: "text-in-text" },
  out: { chip: "bg-out-dim text-out-text", text: "text-out-text" },
  cash: { chip: "bg-cash-dim text-cash-text", text: "text-cash-text" },
};

function KpiCard({ label, value, sub, tone, icon: Icon, isMontant = false, hint, href }: KpiCardProps) {
  const t = TONE_CLASSES[tone];
  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${t.chip}`}>
          <Icon size={16} aria-hidden />
        </span>
      </div>
      {isMontant ? (
        <CurrencyDisplay montant={String(value)} size="lg" className="tabular mt-2 block font-medium text-text" />
      ) : (
        <p className="tabular mt-2 font-display text-2xl font-extrabold text-text">{value}</p>
      )}
      {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
      {hint && (
        <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${href ? t.text : "text-text-muted"}`}>
          {hint}
          {href && <IconArrowRight size={12} aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5" />}
        </p>
      )}
    </>
  );

  const base = "rounded-lg border border-border bg-surface p-4 shadow-card";
  if (href) {
    return (
      <Link
        href={href}
        className={`group block cursor-pointer ${base} transition-colors duration-150 hover:border-border-active`}
      >
        {content}
      </Link>
    );
  }

  return <div className={base}>{content}</div>;
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-busy="true">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg border border-border bg-surface-high" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-lg border border-out-line bg-out-dim px-4 py-3">
        <p className="text-sm font-semibold text-out-text">Impossible de charger les indicateurs</p>
        <p className="mt-0.5 text-xs text-text-muted">Vérifiez que le serveur backend est démarré et que vous êtes connecté.</p>
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Ventes du jour"
          value={totalVentes}
          icon={IconCoin}
          sub={
            totalTransactions > 0
              ? `${totalTransactions} transaction${totalTransactions !== 1 ? "s" : ""}`
              : hasSession
              ? "Aucune transaction encore"
              : "Aucune session ouverte"
          }
          tone="cash"
          isMontant
          hint={!hasSession ? "Ouvrir une session" : undefined}
          href={!hasSession ? "/caisse" : undefined}
        />
        <KpiCard
          label="Valeur du stock"
          value={stockValeur}
          icon={IconBoxSeam}
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
          icon={isBenefice ? IconTrendingUp : IconTrendingDown}
          sub={isBenefice ? "ventes − achats du jour" : "achats > ventes du jour"}
          tone={isBenefice ? "in" : "out"}
          isMontant
        />
        <KpiCard
          label="Alertes stock"
          value={alertesCount}
          icon={IconAlertTriangle}
          sub={alertesCount === 0 ? "Tout est en ordre" : "à réapprovisionner"}
          tone={alertesCount === 0 ? "in" : "out"}
          hint={alertesCount > 0 ? "Voir le stock" : undefined}
          href={alertesCount > 0 ? "/stock" : undefined}
        />
      </div>

      {/* Bannière perte si bénéfice négatif */}
      {!isBenefice && parseFloat(beneficeNet) !== 0 && (
        <div role="status" className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-out-line bg-out-dim px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-out-text">
            <IconAlertTriangle size={16} aria-hidden /> Perte nette aujourd&apos;hui
          </span>
          <span className="text-sm text-text-muted">
            Vos achats ({Number(resume?.totalAchats ?? 0).toLocaleString("fr-FR")} FCFA) dépassent vos ventes ({Number(totalVentes).toLocaleString("fr-FR")} FCFA).
          </span>
        </div>
      )}
    </div>
  );
}
