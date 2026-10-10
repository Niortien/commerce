"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getRevenus } from "../api/superadmin-revenus-api";

export function useRevenus(annee: number) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["super-admin", "revenus", annee] as const,
    queryFn: () => getRevenus(annee),
    enabled: !!token,
  });
}
