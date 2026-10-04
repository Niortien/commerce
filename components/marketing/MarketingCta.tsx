"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { IconArrowRight } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";

export function MarketingCta() {
  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-xl bg-sidebar px-6 py-12 text-center text-sidebar-text md:px-12">
            <div aria-hidden className="absolute inset-0 -z-10">
              <span className="aurora-blob aurora-a -left-10 -top-20 h-64 w-64 bg-[#7c3aed]/35" />
              <span className="aurora-blob aurora-b -bottom-24 right-0 h-72 w-72 bg-[#2563eb]/35" />
            </div>
            <h2
              className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl"
              style={{ textWrap: "balance" }}
            >
              Prêt à gérer votre boutique avec Mon Djossi ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-md text-sidebar-muted">
              Inscrivez votre boutique, ou connectez-vous si vous avez déjà un compte.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                as={Link}
                href="/inscription"
                size="lg"
                className="bg-accent font-semibold text-white"
                endContent={<IconArrowRight size={18} aria-hidden />}
              >
                Inscrire ma boutique
              </Button>
              <Button as={Link} href="/login" size="lg" variant="bordered" className="border-sidebar-muted font-semibold text-sidebar-text">
                Se connecter
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
