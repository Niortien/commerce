"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { prixParMois, prixPlan, remisePourcent, formatFcfa, type PlanCode } from "@/lib/pricing";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

// Reflète l'enum PlanAbonnement du backend ; les prix viennent de lib/pricing.ts.
const PLANS: { code: PlanCode; name: string; text: string; cta: string }[] = [
  { code: "ESSAI", name: "Essai", text: "Pour découvrir Mon Djossi avec votre vraie boutique avant de vous engager.", cta: "Démarrer l'essai" },
  { code: "MENSUEL", name: "Mensuel", text: "Un abonnement renouvelé chaque mois, pour garder la main sur votre budget.", cta: "Choisir le mensuel" },
  { code: "TRIMESTRIEL", name: "Trimestriel", text: "Un renouvellement tous les trois mois, pour moins de démarches.", cta: "Choisir le trimestriel" },
  { code: "ANNUEL", name: "Annuel", text: "Une année d'accès d'un coup, pour une boutique installée.", cta: "Choisir l'annuel" },
];

export function MarketingPlans() {
  return (
    <section id="plans" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Plans"
            title="Des prix simples, en FCFA."
            description="Un prix par boutique, tout inclus. Plus vous vous engagez, moins vous payez par mois. Essai gratuit de 14 jours, sans carte."
          />
        </Reveal>
        <ul className="mt-14 grid items-stretch gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => {
            const best = plan.code === "ANNUEL";
            const remise = remisePourcent(plan.code);
            return (
            <li key={plan.code}>
              <Reveal delay={i * 0.05} className="h-full">
                <article className={`relative flex h-full flex-col rounded-[26px] border px-6 py-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_36px_60px_-40px_rgba(15,29,51,0.5)] ${best ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-border bg-surface"}`}>
                  {remise !== null && (
                    <span className={`absolute -top-[13px] right-5 rounded-full px-3 py-[5px] text-[13px] font-extrabold ${best ? "mk-wiggle bg-[#FFC531] text-[#0F172A]" : "bg-surface-high text-accent-text"}`}>
                      −{remise} %{best ? " · Le plus avantageux" : ""}
                    </span>
                  )}
                  <h3 className={`text-[15px] font-extrabold uppercase tracking-[0.04em] ${best ? "text-[#B6C3D8]" : "text-text-muted"}`}>{plan.name}</h3>
                  <p className="mt-4 whitespace-nowrap font-brand text-[22px] font-semibold leading-[1.05] tracking-[-0.04em] xl:text-[24px]">{prixPlan(plan.code)}</p>
                  <p className={`mt-2 min-h-6 text-[15px] ${best ? "text-[#C0CCDD]" : "text-text-muted"}`}>
                    {plan.code === "ESSAI"
                      ? "14 jours, sans paiement"
                      : plan.code === "MENSUEL"
                        ? "par mois"
                        : `soit ${formatFcfa(prixParMois(plan.code) ?? 0)} par mois`}
                  </p>
                  <p className={`mt-4 text-sm leading-relaxed ${best ? "text-[#C0CCDD]" : "text-text-muted"}`}>{plan.text}</p>
                  <div className="mt-auto pt-6">
                    <Button
                      as={Link}
                      href={`/inscription?plan=${plan.code}`}
                      variant={best ? "solid" : "bordered"}
                      className={`h-12 w-full rounded-full font-bold ${best ? "bg-[#FFC531] text-[#0F172A]" : "border-border text-text"}`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </article>
              </Reveal>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
