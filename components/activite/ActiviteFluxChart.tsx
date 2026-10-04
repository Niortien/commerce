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
import { axisTick, chartColors, formatAxisAmount, legendStyle, tooltipLabelStyle, tooltipStyle } from "@/lib/chartTheme";
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
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatAxisAmount}
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          formatter={(value: number) => [`${value.toLocaleString("fr-FR")} FCFA`]}
        />
        <Legend wrapperStyle={legendStyle} />
        <Line
          type="monotone"
          dataKey="Cash entrant"
          stroke={chartColors.in}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Cash sortant"
          stroke={chartColors.out}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Solde"
          stroke={chartColors.accent}
          strokeWidth={2}
          strokeDasharray="4 2"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
