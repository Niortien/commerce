"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { IconCheck } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

// Reflète l'enum PlanAbonnement du backend. Aucun prix n'est affiché : le montant est fixé par le Super Admin
// à la création de chaque abonnement.
const PLANS = [
  { code: "ESSAI", name: "Essai", text: "Pour découvrir Mon Djossi avec votre vraie boutique avant de vous engager.", cta: "Démarrer l'essai" },
  { code: "MENSUEL", name: "Mensuel", text: "Un abonnement renouvelé chaque mois, pour garder la main sur votre budget.", cta: "Choisir le mensuel" },
  { code: "TRIMESTRIEL", name: "Trimestriel", text: "Un renouvellement tous les trois mois, pour moins de démarches.", cta: "Choisir le trimestriel" },
  { code: "ANNUEL", name: "Annuel", text: "Une année d'accès d'un coup, pour une boutique installée.", cta: "Choisir l'annuel" },
];

export function MarketingPlans() {
  return (
    <section id="plans" className="scroll-mt-20 bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Plans"
            title="Quatre durées d'abonnement"
            description="Les plans définissent la durée d'accès de la boutique. Le tarif vous est communiqué lors de l'inscription."
          />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <li key={plan.code}>
              <Reveal delay={i * 0.05} className="h-full">
                <article className="flex h-full flex-col rounded-lg border border-border bg-base p-5">
                  <p className="font-mono text-xs tracking-wide text-text-muted">{plan.code}</p>
                  <h3 className="mt-1 font-display text-xl font-extrabold text-text">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{plan.text}</p>
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium text-text">
                    <IconCheck size={16} className="shrink-0 text-in-text" aria-hidden />
                    Tarif communiqué à l&apos;inscription
                  </p>
                  <div className="mt-auto pt-6">
                    <Button as={Link} href={`/inscription?plan=${plan.code}`} variant="bordered" className="w-full font-semibold">
                      {plan.cta}
                    </Button>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
