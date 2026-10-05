"use client";

import { useId } from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SIGNUP_PLANS, type SignupPlan } from "@/lib/validators/boutique-signup.schema";
import { prixParMois, prixPlan } from "@/lib/pricing";

const PLAN_INFO: Record<SignupPlan, { name: string; detail: string; payant: boolean }> = {
  ESSAI: { name: "Essai", detail: "14 jours, gratuit", payant: false },
  MENSUEL: { name: "Mensuel", detail: "Renouvelé chaque mois", payant: true },
  TRIMESTRIEL: { name: "Trimestriel", detail: "Renouvelé tous les 3 mois", payant: true },
  ANNUEL: { name: "Annuel", detail: "Une année d'accès", payant: true },
};

export const isPlanPayant = (plan: SignupPlan) => PLAN_INFO[plan].payant;
export const planName = (plan: SignupPlan) => PLAN_INFO[plan].name;

interface PlanPickerProps {
  value: SignupPlan;
  onChange: (plan: SignupPlan) => void;
}

/** Choix du plan à l'inscription (radiogroup) : les plans payants indiquent qu'ils se règlent avant l'activation. */
export function PlanPicker({ value, onChange }: PlanPickerProps) {
  const labelId = useId();

  return (
    <div role="radiogroup" aria-labelledby={labelId}>
      <p id={labelId} className="mb-2 text-sm font-medium text-text">
        Votre abonnement
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SIGNUP_PLANS.map((plan) => {
          const info = PLAN_INFO[plan];
          const selected = plan === value;
          return (
            <button
              key={plan}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(plan)}
              className={cn(
                "relative flex min-h-[5.25rem] cursor-pointer flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors duration-150",
                selected ? "border-accent bg-accent-dim" : "border-border bg-surface hover:border-text-dim"
              )}
            >
              <span className="text-sm font-semibold text-text">{info.name}</span>
              <span className="text-sm font-bold text-text">{prixPlan(plan)}</span>
              <span className="text-xs text-text-muted">
                {plan === "TRIMESTRIEL" || plan === "ANNUEL"
                  ? `soit ${new Intl.NumberFormat("fr-FR").format(prixParMois(plan) ?? 0)} / mois`
                  : info.detail}
              </span>
              {selected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                  <IconCheck size={12} aria-hidden />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-text-muted">
        {isPlanPayant(value)
          ? `À régler avant l'activation : ${prixPlan(value)}. Vous recevrez les instructions de paiement sur WhatsApp.`
          : "Aucun paiement demandé pendant l'essai."}
      </p>
    </div>
  );
}
