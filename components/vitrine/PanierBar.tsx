"use client";

import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { articles, prixCourt } from "@/lib/vitrine";
import { boutonFacade } from "./facade";

interface Props {
  nombre: number;
  total: number;
  /** Change à chaque ajout : le total fait un petit saut pour confirmer l'ajout. */
  signalAjout: number;
  onOuvrir: () => void;
}

const TIROIR = [0.32, 0.72, 0, 1] as const;
const SORTIE = [0.22, 1, 0.36, 1] as const;

/**
 * La barre de commande : elle monte du bas au premier article et y reste. Le seul aplat sombre
 * de la vitrine, avec le nombre d'articles, le total et « Voir ma commande ».
 */
export function PanierBar({ nombre, total, signalAjout, onOuvrir }: Props) {
  const reduit = useReducedMotion();

  return (
    <AnimatePresence>
      {nombre > 0 ? (
        <motion.div
          initial={reduit ? { opacity: 0 } : { y: "100%" }}
          animate={reduit ? { opacity: 1 } : { y: 0, transition: { duration: 0.32, ease: TIROIR } }}
          exit={reduit ? { opacity: 0 } : { y: "100%", transition: { duration: 0.22, ease: SORTIE } }}
          className="fixed inset-x-0 bottom-0 z-30 bg-fa-encre text-fa-sol shadow-fa-flottant"
        >
          <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-5 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 min-[900px]:px-8">
            <p className="flex min-w-0 flex-1 flex-col leading-tight" aria-live="polite">
              <span className="text-sm">{articles(nombre)}</span>
              <span key={signalAjout} className="fa-change inline-block self-start text-[22px] font-semibold tabular-nums tracking-[-0.01em]">
                {prixCourt(total)}
              </span>
            </p>
            <Button radius="none" disableRipple onPress={onOuvrir} className={boutonFacade.action}>
              Voir ma commande
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
