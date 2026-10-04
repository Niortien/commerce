"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
      <div role="alert" className="flex h-40 flex-col items-center justify-center gap-1 rounded-lg border border-out-line bg-out-dim">
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
      <div className="flex min-h-[168px] flex-col justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Ventes — 7 derniers jours</h2>
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

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Ventes — 7 derniers jours</h2>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v.toLocaleString("fr-FR")} FCFA`, "Ventes"]}
            labelStyle={{ color: "var(--color-text-muted)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
