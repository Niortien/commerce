"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CARE_SECTIONS = [
  {
    title: "Entretien",
    content:
      "Laver à la main ou en machine à 30°C maximum. Ne pas utiliser de javel. Sécher à l'air libre, à l'abri de la lumière directe du soleil. Ne pas repasser directement.",
  },
  {
    title: "Composition",
    content:
      "Matières premium sélectionnées pour leur durabilité et leur confort. Composition disponible sur l'étiquette intérieure du produit.",
  },
  {
    title: "Origine",
    content:
      "Produits importés et sélectionnés avec soin par l'équipe Dri Valé. Chaque pièce est vérifiée pour son authenticité avant d'être mise en vente.",
  },
  {
    title: "Retours",
    content:
      "Échange possible dans les 7 jours suivant la réception, sur présentation du justificatif d'achat. Produit en parfait état, non porté. Contactez-nous via WhatsApp.",
  },
];

export function ProduitCare() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="border-t pt-6" style={{ borderColor: "var(--v-border)" }}>
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--v-muted)" }}>
        Infos produit
      </p>
      <div className="divide-y" style={{ borderColor: "var(--v-border)" }}>
        {CARE_SECTIONS.map((section, i) => (
          <div key={section.title} className="divide-[var(--v-border)]">
            <button
              className="flex w-full items-center justify-between py-4 text-left"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span className="text-sm font-bold" style={{ color: "var(--v-text)" }}>
                {section.title}
              </span>
              <motion.span
                animate={{ rotate: openIdx === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-light"
                style={{ color: "var(--v-lime)" }}
              >
                +
              </motion.span>
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
                    {section.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
