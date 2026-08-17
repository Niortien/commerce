"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RapportGroupBy } from "@/stores/uiStore";

interface VentesPoint {
  periode: string;
  totalVentes: string;
  nombreTransactions: number;
  nombreSorties: number;
}

interface ActiviteVentesChartProps {
  data: VentesPoint[];
  groupBy: RapportGroupBy;
}

function formatLabel(iso: string, groupBy: RapportGroupBy): string {
  try {
    const d = new Date(iso);
    if (groupBy === "mois") return format(d, "MMM yy", { locale: fr });
    if (groupBy === "semaine") return format(d, "'S'ww", { locale: fr });
    return format(d, "dd MMM", { locale: fr });
  } catch {
    return iso;
  }
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return String(v);
}

export function ActiviteVentesChart({ data, groupBy }: ActiviteVentesChartProps) {
  const chartData = data.map((d) => ({
    label: formatLabel(d.periode, groupBy),
    Ventes: Math.round(parseFloat(d.totalVentes || "0")),
    transactions: d.nombreTransactions,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-muted">
        Aucune vente sur cette période
      </div>
    );
  }

  const max = Math.max(...chartData.map((d) => d.Ventes), 1);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(64,96,138,0.3)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#9A9088", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={fmt}
          tick={{ fill: "#9A9088", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          contentStyle={{
            background: "#0C1628",
            border: "1px solid #1A2A50",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#FAFAFA",
          }}
          formatter={(value: number, name: string) => [
            name === "Ventes"
              ? `${value.toLocaleString("fr-FR")} FCFA`
              : `${value} transaction${value !== 1 ? "s" : ""}`,
            name,
          ]}
        />
        <Bar dataKey="Ventes" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, idx) => (
            <Cell
              key={idx}
              fill={
                entry.Ventes === max
                  ? "#4A7AFF"
                  : `rgba(74,122,255,${0.3 + (entry.Ventes / max) * 0.5})`
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
