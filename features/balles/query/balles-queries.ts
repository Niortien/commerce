"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getBalle, getBalles, type BallesListParams } from "../api/balles-api";

export const balleKeys = {
  all: ["balles"] as const,
  list: (params: BallesListParams) => ["balles", "list", params] as const,
  detail: (id: string) => ["balles", "detail", id] as const,
};

export function useBalles(params: BallesListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: balleKeys.list(params),
    queryFn: () => getBalles(params),
    enabled: !!token,
  });
}

export function useBalle(id: string | null) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: balleKeys.detail(id ?? ""),
    queryFn: () => getBalle(id ?? ""),
    enabled: !!token && !!id,
  });
}
