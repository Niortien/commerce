import type { CSSProperties } from "react";

/**
 * Thème Recharts basé sur les variables CSS du design system : les graphiques suivent le thème clair/sombre
 * sans valeur hexadécimale en dur.
 */
export const chartColors = {
  accent: "var(--color-accent)",
  in: "var(--color-in)",
  out: "var(--color-out)",
  cash: "var(--color-cash)",
  return: "var(--color-return)",
  grid: "var(--color-border)",
  axis: "var(--color-text-muted)",
} as const;

export const axisTick = { fill: chartColors.axis, fontSize: 11 } as const;

export const tooltipStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  boxShadow: "var(--shadow-md)",
  fontSize: 12,
  color: "var(--color-text)",
};

export const tooltipLabelStyle: CSSProperties = { color: "var(--color-text-muted)", marginBottom: 2 };

export const legendStyle: CSSProperties = { fontSize: 12, color: "var(--color-text-muted)", paddingTop: 8 };

/** Montant compact pour les axes : 1 500 000 → « 1,5M », 12 000 → « 12k ». */
export function formatAxisAmount(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return String(v);
}
