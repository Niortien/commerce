"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getMyBoutique } from "../api/boutiques-api";

export const boutiqueKeys = {
  all: ["boutiques"] as const,
  me: () => ["boutiques", "me"] as const,
};

export function useMyBoutique() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: boutiqueKeys.me(),
    queryFn: getMyBoutique,
    enabled: !!token,
    staleTime: 60_000,
    // Le Super Admin peut changer le type de commerce à tout moment : un espace déjà ouvert doit le voir
    // (menu, vocabulaire, pages métier) sans reconnexion. La barre latérale reste montée, d'où ces relectures.
    refetchOnWindowFocus: true,
    refetchInterval: 120_000,
  });
}
