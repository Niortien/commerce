"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getDemarques, type DemarqueParams } from "../api/demarque-api";

export const demarqueKeys = {
  all: ["demarques"] as const,
  list: (params: DemarqueParams) => ["demarques", "list", params] as const,
};

export function useDemarques(params: DemarqueParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: demarqueKeys.list(params),
    queryFn: () => getDemarques(params),
    enabled: !!token,
  });
}
