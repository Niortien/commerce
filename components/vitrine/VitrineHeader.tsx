import { Button } from "@heroui/react";
import { IconBrandWhatsapp, IconMapPin, IconPhone } from "@tabler/icons-react";
import { toTelHref } from "@/lib/phone";
import { lienContact } from "@/lib/vitrine";
import type { VitrineBoutique } from "@/types";

export function VitrineHeader({ boutique }: { boutique: VitrineBoutique }) {
  const lieu = [boutique.adresse, boutique.ville].filter(Boolean).join(", ");

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6">
      <div className="flex items-center gap-4">
        {boutique.logoUrl ? (
          <img
            src={boutique.logoUrl}
            alt={`Logo ${boutique.nom}`}
            className="h-16 w-16 shrink-0 rounded-2xl border border-border bg-surface object-contain"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent font-display text-2xl font-bold text-white"
          >
            {boutique.nom.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-text text-balance">{boutique.nom}</h1>
          {lieu ? (
            <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
              <IconMapPin size={16} aria-hidden />
              {lieu}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {boutique.whatsapp ? (
          <Button
            as="a"
            href={lienContact(boutique.whatsapp, boutique.nom)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1a8f4c] font-semibold text-white"
            startContent={<IconBrandWhatsapp size={18} aria-hidden />}
          >
            Écrire sur WhatsApp
          </Button>
        ) : null}
        {boutique.telephone ? (
          <Button as="a" href={toTelHref(boutique.telephone)} variant="bordered" startContent={<IconPhone size={18} aria-hidden />}>
            Appeler
          </Button>
        ) : null}
      </div>
    </header>
  );
}
