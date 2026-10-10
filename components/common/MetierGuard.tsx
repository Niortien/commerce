"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { IconLock } from "@tabler/icons-react";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { COMMERCE_PROFILES, metierRequis } from "@/lib/commerce";

/**
 * Les pages d'un métier (devis et clients en quincaillerie, balles et démarque en friperie) ne s'ouvrent pas
 * dans une boutique d'un autre type, même en tapant l'adresse. Le serveur refuse aussi leurs données.
 */
export function MetierGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const type = useTypeCommerce();
  const requis = metierRequis(pathname);

  if (!requis || requis.includes(type)) return <>{children}</>;

  const pour = requis.map((t) => COMMERCE_PROFILES[t].pluriel.toLowerCase()).join(" et ");
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-xl border border-border bg-surface px-6 py-10 text-center">
      <IconLock size={28} aria-hidden className="text-text-muted" />
      <h1 className="text-lg font-semibold text-text">Page réservée aux {pour}</h1>
      <p className="text-sm text-text-muted">
        Elle ne fait pas partie de l&apos;espace d&apos;un commerce de type « {COMMERCE_PROFILES[type].label} ». Pour changer de type, contactez le
        support Mon Djossi.
      </p>
      <Button as={Link} href="/dashboard" variant="bordered" className="min-h-11">
        Retour au tableau de bord
      </Button>
    </div>
  );
}
