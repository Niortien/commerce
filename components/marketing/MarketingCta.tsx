"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { IconArrowRight } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";

export function MarketingCta() {
  return (
    <section className="bg-base pb-[clamp(56px,8vw,96px)] pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-[36px] bg-accent px-6 py-16 text-center text-white md:px-16 md:py-24">
            <span aria-hidden className="mk-spin-slow absolute -left-8 -top-8 -z-10 h-[120px] w-[120px] rounded-full border-2 border-dashed border-white/30" />
            <span aria-hidden className="mk-spin-slow absolute -bottom-10 -right-5 -z-10 h-[180px] w-[180px] rounded-full border-2 border-dashed border-white/30 [animation-direction:reverse]" />
            <h2 className="max-w-3xl font-brand text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.04em] md:text-[2.1rem] lg:text-[2.8rem]" style={{ textWrap: "balance" }}>
              Prêt à savoir ce que rapporte votre boutique ?
            </h2>
            <p className="max-w-lg text-lg text-[#EAEFF6]">Inscrivez votre boutique aujourd&apos;hui et profitez de 14 jours d&apos;essai gratuit.</p>
            <div className="mt-2 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                as={Link}
                href="/inscription"
                size="lg"
                className="h-[52px] rounded-full bg-white px-6 font-bold text-[#0F172A]"
                endContent={<IconArrowRight size={19} aria-hidden />}
              >
                Inscrire ma boutique
              </Button>
              <Button as={Link} href="/login" size="lg" variant="bordered" className="h-[52px] rounded-full border-white/70 px-6 font-bold text-white">
                Se connecter
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
