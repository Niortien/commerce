"use client";

import { useRef } from "react";
import { IconSearch, IconX, IconLoader2, IconTag } from "@tabler/icons-react";
import { useCategoriesList } from "@/features/produits/query/produits-queries";
import type { Categorie } from "@/types";

interface ProduitSearchBarProps {
  search: string;
  onSearch: (v: string) => void;
  categorieId: string | undefined;
  onCategorie: (id: string | undefined) => void;
  enPromo: boolean;
  onPromo: (v: boolean) => void;
  count: number;
  isLoading: boolean;
}

export function ProduitSearchBar({
  search,
  onSearch,
  categorieId,
  onCategorie,
  enPromo,
  onPromo,
  count,
  isLoading,
}: ProduitSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: catData } = useCategoriesList();
  const categories: Categorie[] = catData?.data ?? [];

  return (
    <div className="space-y-2">
      {/* Barre de recherche */}
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-text-muted">
          {isLoading ? (
            <IconLoader2 size={16} className="animate-spin text-accent" />
          ) : (
            <IconSearch size={16} />
          )}
        </span>

        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={[
            "w-full rounded-xl border bg-[var(--color-surface)] py-2.5 pl-9 pr-20 text-sm text-text placeholder:text-text-dim",
            "outline-none transition-all",
            "focus:border-accent/60 focus:ring-2 focus:ring-accent/20",
            search ? "border-accent/40" : "border-border/60",
          ].join(" ")}
        />

        {/* Count + clear */}
        <div className="absolute right-3 flex items-center gap-2">
          {search && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-[var(--font-mono)] text-[11px] text-accent">
              {count}
            </span>
          )}
          {search && (
            <button
              onClick={() => { onSearch(""); inputRef.current?.focus(); }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-surface-high)] text-text-dim hover:text-text"
              aria-label="Effacer la recherche"
            >
              <IconX size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Pills — catégories + promo */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
        {/* Tous */}
        <button
          onClick={() => onCategorie(undefined)}
          className={[
            "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
            !categorieId && !enPromo
              ? "border-accent/60 bg-accent/15 text-accent"
              : "border-border/50 bg-[var(--color-surface-high)] text-text-muted hover:border-accent/30",
          ].join(" ")}
        >
          Tous
        </button>

        {/* Catégories */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorie(cat.id === categorieId ? undefined : cat.id)}
            className={[
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
              categorieId === cat.id
                ? "border-accent/60 bg-accent/15 text-accent"
                : "border-border/50 bg-[var(--color-surface-high)] text-text-muted hover:border-accent/30",
            ].join(" ")}
          >
            {cat.nom}
          </button>
        ))}

        {/* Promo */}
        <button
          onClick={() => onPromo(!enPromo)}
          className={[
            "shrink-0 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all",
            enPromo
              ? "border-[var(--color-return)]/60 bg-[var(--color-return)]/15 text-[var(--color-return)]"
              : "border-border/50 bg-[var(--color-surface-high)] text-text-muted hover:border-[var(--color-return)]/30",
          ].join(" ")}
        >
          <IconTag size={11} />
          Promo
        </button>
      </div>
    </div>
  );
}
