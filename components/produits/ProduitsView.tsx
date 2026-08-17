"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useProduitsList } from "@/features/produits/query/produits-queries";
import type { AppError } from "@/types";
import { useUiStore } from "@/stores/uiStore";
import { ProduitDetailPanel } from "./ProduitDetailPanel";
import { ProduitMasonry } from "./ProduitMasonry";
import { ProduitSearchBar } from "./ProduitSearchBar";
import { ProduitAlphaIndex } from "./ProduitAlphaIndex";

export function ProduitsView() {
  const router = useRouter();
  const panelId = useUiStore((state) => state.produitPanelId);
  const setPanelId = useUiStore((state) => state.setProduitPanelId);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categorieId, setCategorieId] = useState<string | undefined>(undefined);
  const [enPromo, setEnPromo] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val.trim()), 300);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const { data, isLoading, error } = useProduitsList({
    limit: 100,
    sortOrder: "asc",
    search: search || undefined,
    categorieId,
    enPromo: enPromo || undefined,
  });

  const produits = Array.isArray(data?.data) ? data.data : [];
  const appError = error as AppError | null;
  const errorLabel = appError
    ? `[${appError.code}] ${appError.message}`
    : "Impossible de charger la liste des produits.";

  const isFiltering = !!search || !!categorieId || enPromo;
  const showGrouped = !isFiltering && produits.length > 0;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(74,122,255,0.14),rgba(143,126,245,0.14))] p-4 md:p-5">
        <div className="flex items-end justify-between">
          <h1 className="font-[var(--font-display)] text-2xl md:text-4xl">Produits</h1>
          {!isLoading && (
            <span className="rounded-full border border-accent/40 bg-[color:rgba(240,180,41,0.16)] px-3 py-1 font-[var(--font-mono)] text-xs text-accent">
              {produits.length} article{produits.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Barre de recherche + filtres */}
      <ProduitSearchBar
        search={searchInput}
        onSearch={handleSearch}
        categorieId={categorieId}
        onCategorie={setCategorieId}
        enPromo={enPromo}
        onPromo={setEnPromo}
        count={produits.length}
        isLoading={isLoading}
      />

      {/* États */}
      {isLoading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-border/40 bg-[var(--color-surface-high)]" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-dashed border-out/40 bg-surface p-4 text-sm text-out">
          {errorLabel}
        </div>
      )}

      {!isLoading && !error && produits.length === 0 && (
        <div className="rounded-lg border border-dashed border-border/80 bg-surface p-4 text-center text-sm text-text-muted">
          {isFiltering ? "Aucun produit ne correspond à ta recherche." : "Aucun produit disponible."}
        </div>
      )}

      {/* Résultats */}
      {!isLoading && produits.length > 0 && (
        <>
          <ProduitMasonry
            items={produits}
            onSelect={(id) => router.push(`/produits/${id}`)}
            grouped={showGrouped}
          />
          {/* Index A-Z (mode non-filtré seulement) */}
          {showGrouped && <ProduitAlphaIndex produits={produits} />}
        </>
      )}

      {/* FAB nouveau produit */}
      <Button
        isIconOnly
        className="fixed bottom-6 right-6 z-[1000] h-12 w-12 rounded-full border border-accent/70 bg-[linear-gradient(135deg,#4A7AFF,#1d3b7c)] text-white shadow-glow-yellow"
        onPress={() => setPanelId("new")}
      >
        +
      </Button>

      {panelId === "new" ? (
        <ProduitDetailPanel produit={undefined} onClose={() => setPanelId(null)} />
      ) : null}
    </PageWrapper>
  );
}
