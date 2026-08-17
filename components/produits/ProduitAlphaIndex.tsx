"use client";

import { useMemo } from "react";
import type { Produit } from "@/types";

interface ProduitAlphaIndexProps {
  produits: Produit[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function ProduitAlphaIndex({ produits }: ProduitAlphaIndexProps) {
  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    for (const p of produits) {
      const first = p.nom.trim()[0]?.toUpperCase();
      if (first && /[A-Z]/.test(first)) set.add(first);
    }
    return set;
  }, [produits]);

  if (produits.length === 0) return null;

  function jumpTo(letter: string) {
    const el = document.getElementById(`alpha-${letter}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="fixed right-1 top-1/2 z-[200] -translate-y-1/2 flex flex-col items-center gap-px rounded-full border border-border/40 bg-[var(--color-surface)]/80 px-1 py-2 backdrop-blur-sm"
      role="navigation"
      aria-label="Index alphabétique"
    >
      {ALPHABET.map((letter) => {
        const active = activeLetters.has(letter);
        return (
          <button
            key={letter}
            onClick={() => active && jumpTo(letter)}
            disabled={!active}
            aria-label={`Aller à ${letter}`}
            className={[
              "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold transition-all leading-none",
              active
                ? "cursor-pointer text-accent hover:bg-accent/20 active:scale-90"
                : "cursor-default text-text-dim/30",
            ].join(" ")}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
