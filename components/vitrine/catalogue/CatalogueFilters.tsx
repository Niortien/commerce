"use client";

import type { Categorie } from "@/types";

interface CatalogueFiltersProps {
  categories: Categorie[];
  selectedCategorieId: string | null;
  inStockOnly: boolean;
  onCategorieChange: (id: string | null) => void;
  onInStockChange: (v: boolean) => void;
}

export function CatalogueFilters({
  categories,
  selectedCategorieId,
  inStockOnly,
  onCategorieChange,
  onInStockChange,
}: CatalogueFiltersProps) {
  return (
    <div
      className="sticky top-16 z-30 border-b"
      style={{
        borderColor: "var(--v-border)",
        backgroundColor: "rgba(6,6,7,0.93)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-3" style={{ scrollbarWidth: "none" }}>
        {/* Chip Tout */}
        <button
          onClick={() => onCategorieChange(null)}
          className="shrink-0 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
          style={
            !selectedCategorieId
              ? { backgroundColor: "var(--v-gold)", borderColor: "var(--v-gold)", color: "#060607" }
              : { borderColor: "var(--v-border)", color: "var(--v-muted)", backgroundColor: "transparent" }
          }
        >
          Tout
        </button>

        {/* Chips catégories */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorieChange(selectedCategorieId === cat.id ? null : cat.id)}
            className="shrink-0 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
            style={
              selectedCategorieId === cat.id
                ? { backgroundColor: "var(--v-gold)", borderColor: "var(--v-gold)", color: "#060607" }
                : { borderColor: "var(--v-border)", color: "var(--v-muted)", backgroundColor: "transparent" }
            }
          >
            {cat.nom}
          </button>
        ))}

        {/* Séparateur */}
        <div
          className="mx-1 h-5 w-px shrink-0"
          style={{ backgroundColor: "var(--v-border)" }}
        />

        {/* Toggle En stock */}
        <button
          onClick={() => onInStockChange(!inStockOnly)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
          style={
            inStockOnly
              ? { backgroundColor: "var(--v-hot)", borderColor: "var(--v-hot)", color: "#fff" }
              : { borderColor: "var(--v-border)", color: "var(--v-muted)", backgroundColor: "transparent" }
          }
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: inStockOnly ? "#fff" : "var(--v-dim)" }}
          />
          En stock
        </button>
      </div>
    </div>
  );
}
