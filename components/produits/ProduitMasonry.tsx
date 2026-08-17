import { useMemo } from "react";
import type { Produit } from "@/types";
import { ProduitCard } from "./ProduitCard";

interface ProduitMasonryProps {
  items: Produit[];
  onSelect: (id: string) => void;
  grouped?: boolean;
}

export function ProduitMasonry({ items, onSelect, grouped = false }: ProduitMasonryProps) {
  const groups = useMemo(() => {
    if (!grouped) return null;
    const map = new Map<string, Produit[]>();
    for (const p of items) {
      const key = p.nom.trim()[0]?.toUpperCase() ?? "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [items, grouped]);

  if (grouped && groups) {
    return (
      <div className="space-y-4 pr-6">
        {groups.map(([letter, produits]) => (
          <section key={letter}>
            <div
              id={`alpha-${letter}`}
              className="sticky top-0 z-10 -mx-1 mb-2 flex items-center gap-2 bg-[var(--color-base)]/90 px-1 py-1 backdrop-blur-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-[var(--font-mono)] text-xs font-bold text-accent">
                {letter}
              </span>
              <span className="text-xs text-text-dim">{produits.length} produit{produits.length > 1 ? "s" : ""}</span>
            </div>
            <div className="columns-1 gap-3 md:columns-2 xl:columns-3">
              {produits.map((produit) => (
                <ProduitCard key={produit.id} produit={produit} onPress={() => onSelect(produit.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="columns-1 gap-3 md:columns-2 xl:columns-3">
      {items.map((produit) => (
        <ProduitCard key={produit.id} produit={produit} onPress={() => onSelect(produit.id)} />
      ))}
    </div>
  );
}
