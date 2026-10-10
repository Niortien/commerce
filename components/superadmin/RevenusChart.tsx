"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COMMERCE_PROFILES, isTypeCommerce } from "@/lib/commerce";
import { formatCurrency } from "@/lib/formatCurrency";
import type { RevenusPlateforme, TypeCommerce } from "@/types";

interface RevenusChartProps {
  parMois: RevenusPlateforme["parMois"];
  /** Secteurs ayant rapporté dans l'année, du plus gros au plus petit. */
  secteurs: TypeCommerce[];
}

const libelle = (nom: string) => (isTypeCommerce(nom) ? COMMERCE_PROFILES[nom].pluriel : nom);

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** Revenus de chaque mois, empilés par secteur aux couleurs des secteurs. Chargé à la demande (Recharts). */
export default function RevenusChart({ parMois, secteurs }: RevenusChartProps) {
  // Les teintes des secteurs sont des variables CSS : on les lit pour le SVG (thème clair ou sombre).
  const [couleurs, setCouleurs] = useState<Partial<Record<TypeCommerce, string>>>({});
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setCouleurs(Object.fromEntries(secteurs.map((t) => [t, style.getPropertyValue(COMMERCE_PROFILES[t].colorVar).trim() || "#64748B"])));
  }, [secteurs]);

  const donnees = parMois.map((m, i) => ({
    mois: MOIS[i] ?? m.mois,
    ...Object.fromEntries(m.parSecteur.map((s) => [s.typeCommerce, s.montant])),
  }));

  return (
    <div className="h-72 w-full" role="img" aria-label="Revenus des abonnements par mois et par secteur">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={donnees} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="mois" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "currentColor" }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tick={{ fontSize: 12, fill: "currentColor" }}
            tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)} k` : String(v))}
          />
          <Tooltip
            formatter={(valeur: number, nom: string) => [formatCurrency(valeur), libelle(nom)]}
            cursor={{ fill: "var(--color-surface-high)" }}
          />
          <Legend formatter={(nom: string) => libelle(nom)} />
          {secteurs.map((t, i) => (
            <Bar key={t} dataKey={t} stackId="revenus" isAnimationActive={false} fill={couleurs[t] ?? "#64748B"} radius={i === secteurs.length - 1 ? [4, 4, 0, 0] : 0} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
