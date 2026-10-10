"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getDevis, getDevisList, type DevisListParams } from "../api/devis-api";

export const devisKeys = {
  all: ["devis"] as const,
  list: (params: DevisListParams) => ["devis", "list", params] as const,
  detail: (id: string) => ["devis", "detail", id] as const,
};

export function useDevisList(params: DevisListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: devisKeys.list(params),
    queryFn: () => getDevisList(params),
    enabled: !!token,
  });
}

export function useDevis(id: string | null) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: devisKeys.detail(id ?? ""),
    queryFn: () => getDevis(id ?? ""),
    enabled: !!token && !!id,
  });
}
