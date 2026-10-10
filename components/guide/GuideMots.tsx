"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Les mots à connaître : on touche un mot, son sens apparaît. Pas de liste à lire d'une traite. */
export function GuideMots({ mots }: { mots: Array<{ mot: string; sens: string }> }) {
  const reduit = useReducedMotion();
  const [ouverts, setOuverts] = useState<string[]>([]);
  const basculer = (mot: string) => setOuverts((o) => (o.includes(mot) ? o.filter((m) => m !== mot) : [...o, mot]));

  return (
    <ul className="flex flex-wrap items-start gap-2.5">
      {mots.map(({ mot, sens }) => {
        const ouvert = ouverts.includes(mot);
        const idSens = `mot-${mot.replace(/\W+/g, "-")}`;
        return (
          <motion.li key={mot} layout={!reduit} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className={ouvert ? "w-full sm:w-auto sm:max-w-sm" : ""}>
            <Button
              disableRipple
              aria-expanded={ouvert}
              aria-controls={idSens}
              onPress={() => basculer(mot)}
              className={[
                "h-auto w-full flex-col items-stretch gap-0 whitespace-normal rounded-2xl border px-4 py-3 text-left transition-colors duration-200 data-[focus-visible=true]:outline-[color:var(--sector)]",
                ouvert
                  ? "border-transparent bg-[color-mix(in_srgb,var(--sector)_12%,var(--color-surface))]"
                  : "border-border bg-surface hover:border-[color:var(--sector)]",
              ].join(" ")}
            >
              <span className="flex items-center justify-between gap-3 font-semibold text-text">
                {mot}
                <motion.span aria-hidden animate={{ rotate: ouvert ? 45 : 0 }} transition={{ duration: reduit ? 0 : 0.2 }} className="text-[color:var(--sector)]">
                  <IconPlus size={18} />
                </motion.span>
              </span>
              <AnimatePresence initial={false}>
                {ouvert && (
                  <motion.span
                    id={idSens}
                    initial={reduit ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="mt-1.5 block text-sm font-normal leading-relaxed text-text-muted"
                  >
                    {sens}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.li>
        );
      })}
    </ul>
  );
}
