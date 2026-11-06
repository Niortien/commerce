"use client";

import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { IconShoppingBag } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  nombre: number;
  total: number;
  /** Change à chaque ajout : fait rebondir la barre pour confirmer l'ajout. */
  signalAjout: number;
  onOuvrir: () => void;
}

/** Barre flottante en bas de l'écran, visible dès qu'il y a un article dans le panier. */
export function PanierBar({ nombre, total, signalAjout, onOuvrir }: Props) {
  const reduit = useReducedMotion();

  return (
    <AnimatePresence>
      {nombre > 0 ? (
        <motion.div
          initial={reduit ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduit ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <motion.div
            key={signalAjout}
            animate={reduit ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto mx-auto max-w-md"
          >
            {/* La barre flotte au-dessus de la page : c'est la seule ombre de la vitrine. */}
            <Button
              size="lg"
              radius="full"
              onPress={onOuvrir}
              className={/* taste-skill-ignore */ "h-14 w-full justify-between bg-[color:var(--sector)] px-5 font-semibold text-white shadow-xl"}
              aria-label={`Voir le panier : ${nombre} article${nombre > 1 ? "s" : ""}, ${formatCurrency(total)}`}
            >
              <span className="flex items-center gap-2">
                <span className="relative">
                  <IconShoppingBag size={22} aria-hidden />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-[color:var(--sector)]">
                    {nombre}
                  </span>
                </span>
                <span className="ml-1">Voir le panier</span>
              </span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </Button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
