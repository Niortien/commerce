"use client";

import dynamic from "next/dynamic";
import type { PlageDatesPickerProps } from "./PlageDatesPicker";

// Fichier léger : le calendrier HeroUI (≈ 60 ko compressés) n'est chargé qu'après la page.
const PlageDatesPicker = dynamic(() => import("./PlageDatesPicker").then((m) => m.PlageDatesPicker), {
  ssr: false,
  loading: () => <div aria-hidden className="h-10 w-full rounded-lg border border-border bg-surface" />,
});

/** Sélecteur de plage de dates chargé à la demande ; sa place (largeur, 40px de haut) est réservée, sans saut de page. */
export function PlageDatesDifferee(props: PlageDatesPickerProps) {
  return (
    <div className={`min-h-10 ${props.largeur ?? "w-full lg:max-w-[320px]"}`}>
      <PlageDatesPicker {...props} />
    </div>
  );
}
