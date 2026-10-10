"use client";

import type { ReactNode } from "react";
import { Accordion, AccordionItem } from "@heroui/react";

/**
 * Tout le guide en texte, replié : pour ceux qui préfèrent lire, pour l'impression et pour les moteurs
 * de recherche (le contenu reste présent dans la page même replié).
 */
export function GuideTexteComplet({ chapitres }: { chapitres: Array<{ id: string; titre: string; contenu: ReactNode }> }) {
  return (
    <Accordion
      variant="splitted"
      selectionMode="multiple"
      keepContentMounted
      className="px-0"
      itemClasses={{ base: "!rounded-xl !border !border-border !bg-surface !shadow-none" }}
    >
      {chapitres.map((c) => (
        <AccordionItem key={c.id} aria-label={c.titre} title={<span className="font-semibold text-text">{c.titre}</span>}>
          {c.contenu}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
