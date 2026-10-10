"use client";

import { Accordion, AccordionItem } from "@heroui/react";

/** Questions fréquentes d'un guide, repliées par défaut. */
export function GuideFaq({ faq }: { faq: Array<{ q: string; r: string }> }) {
  return (
    <Accordion variant="splitted" selectionMode="multiple" className="px-0" itemClasses={{ base: "!rounded-xl !border !border-border !bg-surface !shadow-none" }}>
      {faq.map((f) => (
        <AccordionItem
          key={f.q}
          aria-label={f.q}
          title={<span className="font-semibold text-text">{f.q}</span>}
          classNames={{ content: "pb-3 leading-relaxed text-text-muted" }}
        >
          {f.r}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
