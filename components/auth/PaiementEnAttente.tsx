import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { IconHourglassHigh } from "@tabler/icons-react";

const MOYENS = [
  { label: "Wave", image: "/images/paiement/wave.jpg" },
  { label: "Orange Money", image: "/images/paiement/orange-money.jpg" },
  { label: "MTN Money", image: "/images/paiement/mtn.jpg" },
];

interface PaiementEnAttenteProps {
  boutique: string;
  plan: string;
  montant: string;
  whatsapp?: string;
}

/** Écran affiché après l'inscription à un plan payant : la boutique n'est activée qu'une fois le paiement confirmé. */
export function PaiementEnAttente({ boutique, plan, montant, whatsapp }: PaiementEnAttenteProps) {
  return (
    <section className="w-full rounded-lg border border-border bg-surface p-6 shadow-card md:p-8" aria-live="polite">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-return-dim text-return-text">
        <IconHourglassHigh size={22} aria-hidden />
      </span>
      <h1 className="mt-4 font-display text-2xl md:text-3xl">Plus qu&apos;un paiement</h1>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        La demande de <strong className="text-text">{boutique}</strong> pour le plan{" "}
        <strong className="text-text">{plan}</strong> ({montant}) est enregistrée. L&apos;accès est activé dès que le paiement est
        confirmé.
      </p>

      <ol className="mt-5 space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">1</span>
          <span className="pt-0.5 text-text">
            Vous recevez les instructions de paiement
            {whatsapp ? (
              <>
                {" "}sur WhatsApp au <strong>{whatsapp}</strong>
              </>
            ) : (
              " sur WhatsApp"
            )}
            .
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">2</span>
          <span className="pt-0.5 text-text">Vous réglez <strong>{montant}</strong> par Mobile Money.</span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">3</span>
          <span className="pt-0.5 text-text">Votre boutique est activée, vous vous connectez et commencez.</span>
        </li>
      </ol>

      <ul className="mt-5 flex items-center gap-3" aria-label="Moyens de paiement acceptés">
        {MOYENS.map((m) => (
          <li key={m.label}>
            <Image src={m.image} alt={m.label} width={64} height={40} className="h-10 w-16 rounded-md border border-border object-cover" />
          </li>
        ))}
      </ul>

      <Button as={Link} href="/login" variant="bordered" className="mt-6 w-full font-semibold">
        Aller à la connexion
      </Button>
    </section>
  );
}
