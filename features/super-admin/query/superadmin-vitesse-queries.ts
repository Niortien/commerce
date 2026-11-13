"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getVitesseSite } from "../api/superadmin-vitesse-api";

export function useVitesseSite(jours: number) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["super-admin", "web-vitals", jours] as const,
    queryFn: () => getVitesseSite(jours),
    enabled: !!token,
  });
}
