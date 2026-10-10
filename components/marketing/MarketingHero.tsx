"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { MarketingPhone } from "@/components/marketing/MarketingPhone";

const FACTS = ["14 jours d'essai gratuit", "Montants en FCFA", "Plusieurs boutiques, un seul compte"];

function IvoryFlag() {
  return (
    <span aria-hidden className="inline-flex h-4 overflow-hidden rounded-[4px] border border-border">
      <i className="block h-full w-2 bg-[#F77F00]" />
      <i className="block h-full w-2 bg-white" />
      <i className="block h-full w-2 bg-[#009E60]" />
    </span>
  );
}

export function MarketingHero() {
  return (
    <header className="relative isolate overflow-x-clip bg-base">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-10 px-4 pb-10 pt-12 md:px-6 md:pb-20 md:pt-24 lg:gap-16">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
          <p className="mk-fade inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-surface py-[7px] pl-2 pr-3.5 text-sm font-semibold text-text-muted">
            <IvoryFlag />
            Pensé pour les commerces de Côte d&apos;Ivoire
          </p>
          <h1
            className="mk-fade font-brand text-[2rem] font-bold leading-[1.1] tracking-[-0.045em] text-text md:text-[2.6rem] lg:text-[3.1rem]"
            style={{ animationDelay: ".1s" }}
          >
            Sachez chaque soir combien votre commerce <span className="mk-mark">a gagné.</span>
          </h1>
          <p className="mk-fade max-w-xl text-lg leading-relaxed text-text-muted md:text-xl" style={{ animationDelay: ".8s" }}>
            Caisse, stock et rapports dans une seule application, adaptée à votre métier : boutique de vêtements, restaurant,
            quincaillerie, friperie… Vos caissiers encaissent au comptoir, vous suivez tout en FCFA, même à distance.
          </p>
          <div className="mk-fade flex flex-col gap-3 sm:flex-row" style={{ animationDelay: ".95s" }}>
            <Button
              as={Link}
              href="/inscription?plan=ESSAI"
              size="lg"
              className="h-[52px] rounded-full bg-accent px-6 font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.7)]"
              endContent={<IconArrowRight size={19} aria-hidden />}
            >
              Essayer gratuitement 14 jours
            </Button>
            <Button as={Link} href="#comment" size="lg" variant="bordered" className="h-[52px] rounded-full border-border bg-surface px-6 font-bold text-text">
              Voir comment ça marche
            </Button>
          </div>
          <ul className="mk-fade flex flex-wrap gap-x-5 gap-y-2.5 text-[15px] font-medium text-text-muted" style={{ animationDelay: "1.1s" }}>
            {FACTS.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <IconCheck size={18} strokeWidth={2.6} className="text-accent" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-[1_1_400px]">
          <MarketingPhone />
        </div>
      </div>
    </header>
  );
}
