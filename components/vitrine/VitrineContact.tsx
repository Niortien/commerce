import { IconBrandWhatsapp, IconPhone } from "@tabler/icons-react";
import { toTelHref } from "@/lib/phone";
import { lienContact } from "@/lib/vitrine";
import type { VitrineBoutique } from "@/types";

/** La fin de la vitrine : une phrase, le logo, et les deux façons de joindre la boutique. */
export function VitrineContact({ boutique }: { boutique: VitrineBoutique }) {
  if (!boutique.whatsapp && !boutique.telephone) return null;
  const lieu = [boutique.adresse, boutique.ville].filter(Boolean).join(", ");

  return (
    <section aria-label="Contacter la boutique" className="bg-surface-high">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[96px_1fr] gap-x-5 gap-y-8 px-5 py-20 sm:grid-cols-12 sm:gap-x-6 sm:px-8 sm:py-32">
        <p className="vitrine-entre col-span-2 max-w-[34ch] font-display text-2xl font-semibold leading-[1.15] tracking-[-0.01em] text-text sm:col-span-6 sm:text-[clamp(1.5rem,2.2vw,2rem)]">
          Une question sur une taille, une couleur ou la livraison ? {boutique.nom} vous répond sur WhatsApp.
        </p>

        <div className="vitrine-entre aspect-square w-24 overflow-hidden sm:col-span-2 sm:col-start-8 sm:w-full sm:max-w-[170px]">
          {boutique.logoUrl ? (
            <img src={boutique.logoUrl} alt={`Logo ${boutique.nom}`} width={170} height={170} loading="lazy" className="h-full w-full bg-white object-contain p-3" />
          ) : (
            <span aria-hidden className="flex h-full w-full items-center justify-center bg-[color:var(--sector)] font-display text-5xl font-bold text-white">
              {boutique.nom.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="vitrine-entre flex flex-col gap-3 sm:col-span-3 sm:col-start-10">
          <p className="text-lg font-medium text-text">Joindre la boutique</p>
          {boutique.whatsapp ? (
            <a
              href={lienContact(boutique.whatsapp, boutique.nom)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-lg text-text underline underline-offset-4 hover:text-[color:var(--sector)]"
            >
              <IconBrandWhatsapp size={20} aria-hidden />
              {boutique.whatsapp}
            </a>
          ) : null}
          {boutique.telephone ? (
            <a
              href={toTelHref(boutique.telephone)}
              className="inline-flex min-h-11 items-center gap-2 text-lg text-text underline underline-offset-4 hover:text-[color:var(--sector)]"
            >
              <IconPhone size={20} aria-hidden />
              Appeler
            </a>
          ) : null}
          {lieu ? <p className="text-sm text-text-muted">{lieu}</p> : null}
        </div>
      </div>
    </section>
  );
}
