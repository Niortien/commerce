"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { RecetteHebdomadaire } from "@/features/rapports/api/rapports-api";
import { formatSemaineLabel } from "./formatSemaine";

interface RecetteHebdomadaireChartProps {
  data: RecetteHebdomadaire[];
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return String(v);
}

export function RecetteHebdomadaireChart({ data }: RecetteHebdomadaireChartProps) {
  const chartData = data.map((d) => ({
    label: formatSemaineLabel(d.semaine),
    Ventes: Math.round(parseFloat(d.totalVentes || "0")),
    Dépenses: Math.round(parseFloat(d.totalDepenses || "0")),
    "Recette nette": Math.round(parseFloat(d.recetteNette || "0")),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-text-muted">
        Aucune donnée sur cette période
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
        <Bar dataKey="Ventes" fill="#39d353" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Dépenses" fill="#ff4d6d" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Recette nette" fill="#4A7AFF" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
