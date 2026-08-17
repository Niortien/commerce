"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  getEntreeById,
  getEntrees,
  type EntreesListParams,
} from "../api/entrees-api";

export const entreeKeys = {
  all: ["entrees"] as const,
  list: (params: EntreesListParams) => ["entrees", "list", params] as const,
  detail: (id: string) => ["entrees", "detail", id] as const,
};

export function useEntreesList(params: EntreesListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useInfiniteQuery({
    queryKey: entreeKeys.list(effectiveParams),
    queryFn: ({ pageParam = 1 }) => getEntrees({ ...effectiveParams, page: pageParam as number }),
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

export function useEntree(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: entreeKeys.detail(id),
    queryFn: () => getEntreeById(id),
    enabled: !!id && !!token,
  });
}
