"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Produit, Taille } from "@/types";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { CatalogueProductCard } from "./CatalogueProductCard";

interface CatalogueGridProps {
  categorieId: string | null;
  taille: Taille | null;
  search: string;
  inStockOnly?: boolean;
}

export function CatalogueGrid({ categorieId, taille, search, inStockOnly }: CatalogueGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useVitrineProduits({
      limit: 12,
      ...(categorieId  ? { categorieId }  : {}),
      ...(search       ? { search }       : {}),
      ...(inStockOnly  ? { inStockOnly }  : {}),
    });

  const allProduits: Produit[] = (data?.pages ?? []).flatMap((p) => p.data);

  const filtered = taille
    ? allProduits.filter((p) =>
        (p.variantes ?? []).some((v) => v.taille === taille && v.quantiteStock > 0)
      )
    : allProduits;

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-xl" style={{ backgroundColor: "var(--v-s2)" }} />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-3/4 rounded" style={{ backgroundColor: "var(--v-s2)" }} />
                <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--v-s2)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-5xl opacity-20">⚠️</span>
        <p className="text-sm font-bold" style={{ color: "var(--v-muted)" }}>
          Impossible de charger les produits.
        </p>
        <p className="text-xs" style={{ color: "var(--v-dim)" }}>
          Vérifie ta connexion ou réessaie dans quelques secondes.
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-5xl opacity-20">🔍</span>
        <p className="text-sm" style={{ color: "var(--v-muted)" }}>
          Aucun produit ne correspond à ces filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((produit, i) => (
          <motion.div
            key={produit.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
          >
            <CatalogueProductCard produit={produit} priority={i === 0} />
          </motion.div>
        ))}
      </div>

      {/* Sentinel infinite scroll */}
      <div ref={loadMoreRef} className="mt-10 flex justify-center pb-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--v-muted)" }}>
            <span className="animate-spin">◌</span>
            Chargement...
          </div>
        )}
      </div>
    </div>
  );
}
