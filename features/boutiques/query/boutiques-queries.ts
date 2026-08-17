"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getBoutiques, getBoutiqueById } from "../api/boutiques-api";

export const boutiqueKeys = {
  all: ["boutiques"] as const,
  list: () => ["boutiques", "list"] as const,
  detail: (id: string) => ["boutiques", "detail", id] as const,
};

export function useBoutiques(enabled = true) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: boutiqueKeys.list(),
    queryFn: getBoutiques,
    enabled: !!token && enabled,
    staleTime: 5 * 60_000,
  });
}

export function useBoutique(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: boutiqueKeys.detail(id),
    queryFn: () => getBoutiqueById(id),
    enabled: !!id && !!token,
  });
}
