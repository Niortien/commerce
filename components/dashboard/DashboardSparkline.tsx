"use client";

import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { axisTick, chartColors, tooltipLabelStyle, tooltipStyle } from "@/lib/chartTheme";
import { formatDateShort } from "@/lib/dateUtils";
import type { ResumeDashboardData } from "@/features/rapports/api/rapports-api";

interface SparklinePoint {
  periode: string;
  totalVentes: string;
}

interface DashboardSparklineProps {
  data: SparklinePoint[];
  isError?: boolean;
  diagnostic?: ResumeDashboardData["diagnostic"];
}

export function DashboardSparkline({ data, isError, diagnostic }: DashboardSparklineProps) {
  if (isError) {
    return (
      <div role="alert" className="flex h-52 flex-col items-center justify-center gap-1 rounded-lg border border-out-line bg-out-dim">
        <p className="text-xs font-semibold text-out-text">Impossible de charger les ventes</p>
        <p className="text-xs text-text-muted">Vérifiez la connexion au serveur</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: formatDateShort(d.periode),
    value: Number(d.totalVentes),
  }));

  if (chartData.length === 0) {
    const hasProducts = (diagnostic?.totalProduits ?? 0) > 0;
    const hasEntrees = (diagnostic?.totalEntrees ?? 0) > 0;
    const hasVentesAllTime = (diagnostic?.totalVentesAllTime ?? 0) > 0;

    return (
      <div className="flex min-h-[208px] flex-col justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-sm font-semibold text-text">Ventes — 7 derniers jours</h2>
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-muted">Aucune vente sur 7 jours</p>
          {diagnostic && (
            <div className="rounded-md bg-surface-high p-3 text-xs text-text-muted">
              {!hasProducts && <p>Commencez par créer des <span className="font-semibold text-accent-text">produits</span>.</p>}
              {hasProducts && !hasEntrees && <p>Créez une <span className="font-semibold text-in-text">entrée de stock</span> (fournisseur).</p>}
              {hasEntrees && !hasVentesAllTime && <p>Créez une <span className="font-semibold text-cash-text">sortie de type VENTE</span>.</p>}
              {hasVentesAllTime && <p>Des ventes existent ({diagnostic.totalVentesAllTime} au total) mais pas dans les 7 derniers jours.</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-text">Ventes — 7 derniers jours</h2>
        <p className="font-mono text-xs font-semibold text-cash-text">{total.toLocaleString("fr-FR")} FCFA</p>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
          <defs>
            <linearGradient id="ventes-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.cash} stopOpacity={0.35} />
              <stop offset="100%" stopColor={chartColors.cash} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(v: number) => [`${v.toLocaleString("fr-FR")} FCFA`, "Ventes"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColors.cash}
            strokeWidth={2.5}
            fill="url(#ventes-fill)"
            dot={false}
            activeDot={{ r: 4, fill: chartColors.cash, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
