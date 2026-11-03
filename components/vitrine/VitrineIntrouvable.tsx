import Link from "next/link";
import { IconBuildingStore } from "@tabler/icons-react";
import { SITE_URL } from "@/lib/site";

/** Lien d'une vitrine retirée, mal tapé ou d'une boutique dont l'accès a expiré. */
export function VitrineIntrouvable() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-base px-6 text-center">
      <IconBuildingStore size={44} className="text-text-dim" aria-hidden />
      <h1 className="font-display text-xl font-bold text-text">Cette vitrine n&apos;est pas disponible</h1>
      <p className="max-w-sm text-sm text-text-muted">
        La boutique l&apos;a peut-être retirée, ou le lien contient une faute. Demandez le bon lien à la boutique.
      </p>
      <Link href={SITE_URL} className="mt-2 text-sm font-semibold text-accent-text underline-offset-2 hover:underline">
        Découvrir Mon Djossi
      </Link>
    </main>
  );
}
