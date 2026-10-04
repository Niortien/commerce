"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconPlus, IconRosetteDiscount, IconShirt, IconStack2 } from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { StatTile } from "@/components/common/StatTile";
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
  const nbPromos = produits.filter((p) => p.enPromo && !!p.prixPromo).length;
  const unites = produits.reduce((sum, p) => sum + (p.variantes?.reduce((s, v) => s + v.quantiteStock, 0) ?? 0), 0);

  return (
    <PageWrapper>
      <PageHero
        tone="accent"
        icon={IconShirt}
        eyebrow="Catalogue"
        title="Produits"
        description="Votre catalogue : fiches, variantes, prix et promotions. Touchez un produit pour l'ouvrir."
        actions={
          <Button
            className="min-h-11 bg-accent font-semibold text-white"
            startContent={<IconPlus size={18} aria-hidden />}
            onPress={() => setPanelId("new")}
          >
            Nouveau produit
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile
            tone="accent"
            icon={IconShirt}
            label={isFiltering ? "Produits trouvés" : "Produits"}
            value={isLoading ? "—" : <CountUp value={produits.length} />}
          />
          <StatTile
            tone="in"
            icon={IconStack2}
            label="Unités en stock"
            value={isLoading ? "—" : <CountUp value={unites} />}
            delay={0.05}
          />
          <StatTile
            tone="return"
            icon={IconRosetteDiscount}
            label="En promotion"
            value={isLoading ? "—" : <CountUp value={nbPromos} />}
            delay={0.1}
          />
        </div>
      </PageHero>

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

      {isLoading && (
        <div role="status" aria-label="Chargement des produits" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="aspect-[4/5] animate-pulse bg-surface-high" />
              <div className="space-y-2 p-3.5">
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-surface-high" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-surface-high" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-out-line bg-out-dim p-4 text-sm text-out-text">
          <IconAlertCircle size={20} aria-hidden className="mt-0.5 shrink-0" />
          {errorLabel}
        </div>
      )}

      {!isLoading && !error && produits.length === 0 && (
        <EmptyRiver
          message={isFiltering ? "Aucun produit ne correspond à votre recherche" : "Aucun produit pour l'instant"}
          hint={isFiltering ? "Essayez un autre mot-clé ou retirez un filtre." : "Créez votre premier produit pour remplir le catalogue."}
          action={
            !isFiltering && (
              <Button size="sm" className="bg-accent font-semibold text-white" onPress={() => setPanelId("new")}>
                Créer un produit
              </Button>
            )
          }
        />
      )}

      {!isLoading && produits.length > 0 && (
        <>
          <ProduitMasonry
            items={produits}
            onSelect={(id) => router.push(`/produits/${id}`)}
            grouped={showGrouped}
          />
          {showGrouped && <ProduitAlphaIndex produits={produits} />}
        </>
      )}

      {panelId === "new" ? (
        <ProduitDetailPanel produit={undefined} onClose={() => setPanelId(null)} />
      ) : null}
    </PageWrapper>
  );
}
