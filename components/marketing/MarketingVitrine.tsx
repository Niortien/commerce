"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { IconArrowUpRight, IconBrandWhatsapp, IconPhoto, IconShoppingBag } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const POINTS = [
  { icon: IconShoppingBag, text: "Catalogue public avec filtres, fiches produit et guide des tailles" },
  { icon: IconPhoto, text: "Lookbook et photos clients, modérées par l'admin" },
  { icon: IconBrandWhatsapp, text: "Commande envoyée directement sur le WhatsApp de la boutique" },
];

export function MarketingVitrine() {
  return (
    <section id="vitrine" className="scroll-mt-20 bg-base py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Vitrine publique"
            title="Une vitrine en ligne par boutique, alimentée par votre stock"
            description="Ce que vous saisissez dans le back-office apparaît sur la vitrine. Vos clients parcourent le catalogue, vous recevez la commande sur WhatsApp."
          />
          <div className="mt-6">
            <Button
              as={Link}
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              variant="bordered"
              className="font-semibold"
              endContent={<IconArrowUpRight size={16} aria-hidden />}
            >
              Voir un exemple de vitrine
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="flex flex-col gap-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-dim text-accent-text">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="text-sm font-medium leading-relaxed text-text">{text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
