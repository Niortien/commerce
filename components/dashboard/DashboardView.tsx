"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useResumeJour } from "@/features/caisse/query/caisse-queries";
import { useResumeDashboard, useStockValeur } from "@/features/rapports/query/rapports-queries";
import { useStockAlertes } from "@/features/stock/query/stock-queries";
import { useEntreesList } from "@/features/entrees/query/entrees-queries";
import { useSortiesList } from "@/features/sorties/query/sorties-queries";
import { useAuthStore } from "@/stores/authStore";
import { getPeriodeRange } from "@/lib/dateUtils";
import { DashboardKpiGrid } from "./DashboardKpiGrid";
import { DashboardTopProduits } from "./DashboardTopProduits";
import { DashboardActivityFeed } from "./DashboardActivityFeed";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

const DashboardSparkline = dynamic(
  () => import("./DashboardSparkline").then((m) => m.DashboardSparkline),
  { ssr: false }
);

export function DashboardView() {
  const { dateDebut, dateFin } = useMemo(() => getPeriodeRange("7j"), []);
  const boutiqueName = useAuthStore((s) => s.user?.boutiqueName);

  const { data: resumeData, isLoading: resumeLoading, isError: resumeError } = useResumeJour();
  const { data: stockValeurData, isError: stockValeurError } = useStockValeur();
  const { data: alertesData } = useStockAlertes();
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useResumeDashboard({ dateDebut, dateFin });
  const { data: entreesData, isLoading: entreesLoading } = useEntreesList({ limit: 5 });
  const { data: sortiesData, isLoading: sortiesLoading } = useSortiesList({ limit: 5 });

  const resume = resumeData?.data;
  const stockValeurRaw = stockValeurData?.data?.valeurTotaleAchat ?? "0";
  const nombreProduits = stockValeurData?.data?.nombreProduits ?? 0;
  const alertesCount = alertesData?.data?.length ?? 0;

  const dashboard = dashboardData?.data;
  const ventes7j = dashboard?.ventes ?? [];
  const topProduits = dashboard?.topProduits ?? [];
  const diagnostic = dashboard?.diagnostic;

  const entrees = entreesData?.pages.flatMap((p) => p.data) ?? [];
  const sorties = sortiesData?.pages.flatMap((p) => p.data) ?? [];

  const activityLoading = entreesLoading || sortiesLoading;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="rounded-xl border border-border bg-[linear-gradient(135deg,var(--color-accent-dim)_0%,transparent_60%)] p-4 md:p-5">
        <h1 className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-text md:text-4xl">
          {greeting()}
          {boutiqueName ? <>, <span className="text-accent">{boutiqueName}</span></> : null}
        </h1>
        <p className="mt-1 text-sm text-text-muted">Voici où en est ta boutique aujourd&apos;hui.</p>
      </div>

      {/* KPIs */}
      <DashboardKpiGrid
        resume={resume}
        stockValeur={stockValeurRaw}
        nombreProduits={nombreProduits}
        alertesCount={alertesCount}
        isLoading={resumeLoading}
        isError={resumeError || stockValeurError}
      />

      {/* Sparkline + Top produits */}
      <div className="grid gap-4 md:grid-cols-2">
        {!dashboardLoading && (
          <DashboardSparkline
            data={ventes7j}
            isError={dashboardError}
            diagnostic={diagnostic}
          />
        )}
        {dashboardLoading && (
          <div className="h-40 animate-pulse rounded-xl border border-border/40 bg-[var(--color-surface-high)]" />
        )}
        <DashboardTopProduits
          produits={topProduits}
          isLoading={dashboardLoading}
          isError={dashboardError}
          diagnostic={diagnostic}
        />
      </div>

      {/* Activity feed */}
      <DashboardActivityFeed
        entrees={entrees}
        sorties={sorties}
        isLoading={activityLoading}
      />
    </PageWrapper>
  );
}
