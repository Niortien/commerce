"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RapportGroupBy } from "@/stores/uiStore";

interface FluxPoint {
  periode: string;
  entrees: string;
  sorties: string;
  solde: string;
}

interface ActiviteFluxChartProps {
  data: FluxPoint[];
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

export function ActiviteFluxChart({ data, groupBy }: ActiviteFluxChartProps) {
  const chartData = data.map((d) => ({
    label: formatLabel(d.periode, groupBy),
    "Cash entrant": Math.round(parseFloat(d.sorties || "0")),
    "Cash sortant": Math.round(parseFloat(d.entrees || "0")),
    Solde: Math.round(parseFloat(d.solde || "0")),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-muted">
        Aucune donnée sur cette période
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(64,96,138,0.3)" />
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
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: "#0C1628",
            border: "1px solid #1A2A50",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#FAFAFA",
          }}
          formatter={(value: number) => [`${value.toLocaleString("fr-FR")} FCFA`]}
        />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#9A9088", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="Cash entrant"
          stroke="#39d353"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Cash sortant"
          stroke="#ff4d6d"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Solde"
          stroke="#4A7AFF"
          strokeWidth={2}
          strokeDasharray="4 2"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
