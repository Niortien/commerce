"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { IconArrowRight } from "@tabler/icons-react";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { Reveal } from "@/components/marketing/Reveal";

const FACTS = ["Multi-boutiques", "3 rôles : plateforme, admin, caissier", "Montants en FCFA"];

export function MarketingHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-base">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <span className="aurora-blob aurora-a -left-24 -top-28 h-80 w-80 bg-[#7c3aed]/25" />
        <span className="aurora-blob aurora-b right-0 top-10 h-96 w-96 bg-[#2563eb]/25" />
        <span className="aurora-blob aurora-c bottom-[-6rem] left-1/3 h-72 w-72 bg-[#06b6d4]/20" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-dim px-3 py-1 text-xs font-semibold text-accent-text">
            ERP de gestion de boutiques
          </p>
          <h1
            className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-text md:text-5xl lg:text-[3.5rem]"
            style={{ textWrap: "balance" }}
          >
            Gérez chaque boutique <span className="text-shimmer-gradient">selon son abonnement.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-muted">
            Mon Djossi réunit le stock, la caisse, les entrées et sorties et la vitrine en ligne dans un seul outil. Vous
            activez, suspendez et renouvelez l&apos;accès de chaque boutique selon son abonnement.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              as={Link}
              href="/inscription"
              size="lg"
              className="bg-accent font-semibold text-white"
              endContent={<IconArrowRight size={18} aria-hidden />}
            >
              Inscrire ma boutique
            </Button>
            <Button as={Link} href="/login" size="lg" variant="bordered" className="font-semibold">
              Se connecter
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-muted">
            {FACTS.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="float-slow">
            <ProductPreview />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
