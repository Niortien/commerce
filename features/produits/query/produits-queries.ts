"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  getCategories,
  getProduitById,
  getProduitMouvements,
  getProduits,
  type ProduitListParams,
  type ProduitMouvementsParams,
} from "../api/produits-api";

export const produitKeys = {
  all: ["produits"] as const,
  list: (params: ProduitListParams) => ["produits", "list", params] as const,
  detail: (id: string) => ["produits", "detail", id] as const,
  mouvements: (id: string, params: ProduitMouvementsParams) =>
    ["produits", "mouvements", id, params] as const,
  categories: () => ["categories"] as const,
};

export function useProduitsList(params: ProduitListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const mergedParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: produitKeys.list(mergedParams),
    queryFn: () => getProduits(mergedParams),
    enabled: !!token,
    retry: 1,
  });
}

export function useProduit(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: produitKeys.detail(id),
    queryFn: () => getProduitById(id),
    enabled: !!id && !!token,
    retry: 1,
  });
}

export function useProduitMouvements(id: string, params: ProduitMouvementsParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: produitKeys.mouvements(id, params),
    queryFn: () => getProduitMouvements(id, params),
    enabled: !!id && !!token,
  });
}

export function useCategoriesList() {
  return useQuery({
    queryKey: produitKeys.categories(),
    queryFn: getCategories,
    staleTime: 300_000,
  });
}
