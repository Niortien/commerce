"use client";

import { useState } from "react";
import { useVitrineCategories, useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { CatalogueHero } from "./CatalogueHero";
import { CatalogueFilters } from "./CatalogueFilters";
import { CatalogueGrid } from "./CatalogueGrid";
import { CatalogueWhatsappBanner } from "./CatalogueWhatsappBanner";

export function CatalogueView() {
  const [search, setSearch]         = useState("");
  const [categorieId, setCategorieId] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: categoriesData } = useVitrineCategories();
  const categories = categoriesData?.data ?? [];

  const { data: produitData } = useVitrineProduits({
    limit: 12,
    ...(categorieId  ? { categorieId }  : {}),
    ...(search       ? { search }       : {}),
    ...(inStockOnly  ? { inStockOnly }  : {}),
  });
  const total = produitData?.pages[0]?.meta.total ?? 0;

  return (
    <>
      <CatalogueHero total={total} search={search} onSearch={setSearch} />
      <CatalogueFilters
        categories={categories}
        selectedCategorieId={categorieId}
        inStockOnly={inStockOnly}
        onCategorieChange={setCategorieId}
        onInStockChange={setInStockOnly}
      />
      <CatalogueGrid categorieId={categorieId} taille={null} search={search} inStockOnly={inStockOnly} />
      <CatalogueWhatsappBanner />
    </>
  );
}
