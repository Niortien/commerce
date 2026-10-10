"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getAuditActions, getAuditLogs, type AuditParams } from "../api/superadmin-audit-api";

const PAR_PAGE = 30;

export const auditKeys = {
  all: ["super-admin", "audit"] as const,
  list: (filtres: Omit<AuditParams, "page" | "limit">) => ["super-admin", "audit", "list", filtres] as const,
  actions: () => ["super-admin", "audit", "actions"] as const,
};

/** Journal d'audit page par page (« Afficher plus »). */
export function useAuditLogs(filtres: Omit<AuditParams, "page" | "limit">) {
  const token = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: auditKeys.list(filtres),
    queryFn: ({ pageParam }) => getAuditLogs({ ...filtres, page: pageParam, limit: PAR_PAGE }),
    initialPageParam: 1,
    getNextPageParam: (dernier, pages) => {
      const total = dernier.meta.total ?? 0;
      return pages.length * PAR_PAGE < total ? pages.length + 1 : undefined;
    },
    enabled: !!token,
  });
}

export function useAuditActions() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: auditKeys.actions(),
    queryFn: getAuditActions,
    enabled: !!token,
    staleTime: 5 * 60_000,
  });
}
