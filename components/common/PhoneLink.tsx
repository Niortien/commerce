import { IconBrandWhatsapp, IconPhone } from "@tabler/icons-react";
import { toTelHref, toWhatsAppHref } from "@/lib/phone";

interface PhoneLinkProps {
  phone: string | null | undefined;
  /** Précise l'origine du numéro quand il ne vient pas de l'utilisateur lui-même. */
  hint?: string;
}

/** Numéro cliquable : appel direct + WhatsApp. */
export function PhoneLink({ phone, hint }: PhoneLinkProps) {
  if (!phone?.trim()) return <span className="text-text-muted">—</span>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={toTelHref(phone)}
        aria-label={`Appeler ${phone}`}
        className="inline-flex items-center gap-1 rounded-md font-mono text-sm text-text hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <IconPhone size={14} aria-hidden />
        {phone}
      </a>
      <a
        href={toWhatsAppHref(phone)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Écrire sur WhatsApp à ${phone}`}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-in hover:bg-in/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <IconBrandWhatsapp size={16} aria-hidden />
      </a>
      {hint && <span className="text-xs text-text-muted">{hint}</span>}
    </div>
  );
}
