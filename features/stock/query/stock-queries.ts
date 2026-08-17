"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  getStock,
  getStockAlertes,
  getStockMouvements,
  type StockListParams,
  type StockMouvementsParams,
} from "../api/stock-api";

export const stockKeys = {
  all: ["stock"] as const,
  list: (params: StockListParams) => ["stock", "list", params] as const,
  alertes: (boutiqueId?: string) => ["stock", "alertes", boutiqueId] as const,
  mouvements: (params: StockMouvementsParams) => ["stock", "mouvements", params] as const,
};

export function useStockList(params: StockListParams = {}) {
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useInfiniteQuery({
    queryKey: stockKeys.list(effectiveParams),
    queryFn: ({ pageParam = 1 }) => getStock({ ...effectiveParams, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page ?? 1;
      const total = lastPage.meta.totalPages ?? 1;
      return current < total ? current + 1 : undefined;
    },
  });
}

export function useStockAlertes() {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  return useQuery({
    queryKey: stockKeys.alertes(boutiqueId),
    queryFn: () => getStockAlertes(boutiqueId),
    enabled: !!token,
    staleTime: 5 * 60_000,
  });
}

export function useStockMouvements(params: StockMouvementsParams = {}) {
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: stockKeys.mouvements(effectiveParams),
    queryFn: () => getStockMouvements(effectiveParams),
  });
}
