"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  getActiveSession,
  getResumeJour,
  listSessionTransactions,
  listSessions,
  type SessionsListParams,
  type SessionTransactionsParams,
} from "../api/caisse-api";

export const caisseKeys = {
  all: ["caisse"] as const,
  sessions: (params: SessionsListParams) => ["caisse", "sessions", params] as const,
  activeSession: (boutiqueId?: string) => ["caisse", "active-session", boutiqueId] as const,
  resumeJour: (boutiqueId?: string) => ["caisse", "resume-jour", boutiqueId] as const,
  transactions: (sessionId: string, params: SessionTransactionsParams) =>
    ["caisse", "transactions", sessionId, params] as const,
};

export function useActiveSession() {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  return useQuery({
    queryKey: caisseKeys.activeSession(boutiqueId),
    queryFn: () => getActiveSession(boutiqueId),
    enabled: !!token,
    refetchInterval: 60_000,
    staleTime: 55_000,
  });
}

export function useResumeJour() {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  return useQuery({
    queryKey: caisseKeys.resumeJour(boutiqueId),
    queryFn: () => getResumeJour(boutiqueId),
    enabled: !!token,
    refetchInterval: 60_000,
    staleTime: 55_000,
  });
}

// GET /caisse/sessions — liste paginée de toutes les sessions
export function useSessionsList(params: SessionsListParams = {}) {
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useInfiniteQuery({
    queryKey: caisseKeys.sessions(effectiveParams),
    queryFn: ({ pageParam = 1 }) => listSessions({ ...effectiveParams, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page ?? 1;
      const total = lastPage.meta.totalPages ?? 1;
      return current < total ? current + 1 : undefined;
    },
  });
}

// GET /caisse/sessions/:id/transactions — liste les transactions d'une session
export function useSessionTransactions(
  sessionId: string,
  params: SessionTransactionsParams = {}
) {
  return useQuery({
    queryKey: caisseKeys.transactions(sessionId, params),
    queryFn: () => listSessionTransactions(sessionId, params),
    enabled: !!sessionId,
  });
}
