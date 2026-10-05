import type { ReactNode } from "react";
import Link from "next/link";
import { IconArrowLeft, IconBoxSeam, IconCoin, IconRosetteDiscountCheck } from "@tabler/icons-react";
import { BrandMark } from "@/components/common/BrandMark";

const HIGHLIGHTS = [
  { icon: IconBoxSeam, text: "Stock par taille et par variante, entrées et sorties tracées" },
  { icon: IconCoin, text: "Caisse en temps réel pour toute l'équipe" },
  { icon: IconRosetteDiscountCheck, text: "Abonnement géré boutique par boutique" },
];

/** Cadre commun des pages d'authentification : panneau de marque (desktop) + formulaire. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-text lg:flex">
        <BrandMark onDark className="h-12" priority />
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
            Pilotez vos boutiques, un abonnement à la fois.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-sidebar-muted">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-active text-sidebar-accent">
                  <Icon size={16} aria-hidden />
                </span>
                <span className="pt-1">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/"
          className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-sidebar-muted transition-colors duration-150 hover:text-sidebar-text"
        >
          <IconArrowLeft size={16} aria-hidden /> Découvrir Mon Djossi
        </Link>
      </aside>

      <main className="flex flex-col items-center justify-center gap-6 px-4 py-10 md:px-8">
        <div className="lg:hidden">
          <BrandMark />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
