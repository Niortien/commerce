"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  getSortieById,
  getSorties,
  type SortiesListParams,
} from "../api/sorties-api";

export const sortieKeys = {
  all: ["sorties"] as const,
  list: (params: SortiesListParams) => ["sorties", "list", params] as const,
  detail: (id: string) => ["sorties", "detail", id] as const,
};

export function useSortiesList(params: SortiesListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useInfiniteQuery({
    queryKey: sortieKeys.list(effectiveParams),
    queryFn: ({ pageParam = 1 }) => getSorties({ ...effectiveParams, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page ?? 1;
      const total = lastPage.meta.totalPages ?? 1;
      return current < total ? current + 1 : undefined;
    },
    enabled: !!token,
    staleTime: 60_000,
  });
}

export function useSortie(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: sortieKeys.detail(id),
    queryFn: () => getSortieById(id),
    enabled: !!id && !!token,
  });
}
