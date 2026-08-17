"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getVitrineCategories,
  getVitrineProduit,
  getVitrineProduits,
  type VitrineProduitParams,
} from "@/lib/vitrine-api";

export const vitrineKeys = {
  all: ["vitrine"] as const,
  produits: (params: VitrineProduitParams) => ["vitrine", "produits", params] as const,
  produit: (id: string) => ["vitrine", "produit", id] as const,
  categories: () => ["vitrine", "categories"] as const,
};

export function useVitrineProduits(params: VitrineProduitParams = {}) {
  return useInfiniteQuery({
    queryKey: vitrineKeys.produits(params),
    queryFn: ({ pageParam = 1 }) =>
      getVitrineProduits({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page ?? 1;
      const totalPages = lastPage.meta.pageCount ?? 1;
      return current < totalPages ? current + 1 : undefined;
    },
    staleTime: 60_000,
  });
}

export function useVitrineProduit(id: string) {
  return useQuery({
    queryKey: vitrineKeys.produit(id),
    queryFn: () => getVitrineProduit(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useVitrineCategories() {
  return useQuery({
    queryKey: vitrineKeys.categories(),
    queryFn: getVitrineCategories,
    staleTime: 300_000,
  });
}
