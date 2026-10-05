"use client";

import { useId } from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { PLAN_DETAIL, PLAN_LABEL } from "@/lib/subscription";
import { PlanAbonnement } from "@/types";

const PLANS = Object.values(PlanAbonnement);

interface PlanCardsProps {
  label?: string;
  value: PlanAbonnement | undefined;
  onChange: (plan: PlanAbonnement) => void;
}

/** Choix du plan en cartes (au lieu d'une liste de codes bruts) : libellé lisible, durée, cible de 44 px minimum. */
export function PlanCards({ label = "Plan", value, onChange }: PlanCardsProps) {
  const labelId = useId();

  return (
    <div role="radiogroup" aria-labelledby={labelId}>
      <p id={labelId} className="mb-2 text-sm font-medium text-text">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PLANS.map((plan) => {
          const selected = plan === value;
          return (
            <button
              key={plan}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(plan)}
              className={cn(
                "relative flex min-h-14 cursor-pointer flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors duration-150",
                selected ? "border-accent bg-accent-dim" : "border-border bg-surface hover:border-text-dim"
              )}
            >
              <span className="text-sm font-semibold text-text">{PLAN_LABEL[plan]}</span>
              <span className="text-xs text-text-muted">{PLAN_DETAIL[plan]}</span>
              {selected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                  <IconCheck size={12} aria-hidden />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
