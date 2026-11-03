import Link from "next/link";
import { lienMonDjossi } from "@/lib/vitrine";

/** Chaque vitrine partagée fait connaître Mon Djossi aux autres commerçants. */
export function VitrineFooter({ slug }: { slug: string }) {
  return (
    <footer className="border-t border-border bg-surface px-4 py-6 text-center">
      <p className="text-sm text-text-muted">
        Boutique propulsée par{" "}
        <Link href={lienMonDjossi(slug)} className="font-semibold text-accent-text underline-offset-2 hover:underline">
          Mon Djossi
        </Link>
      </p>
      <p className="mt-1 text-xs text-text-dim">
        Vous aussi, mettez votre boutique en ligne et gérez votre stock · Essai gratuit 14 jours
      </p>
    </footer>
  );
}
