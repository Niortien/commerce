"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getClient, getClients, type ClientsListParams } from "../api/clients-api";

export const clientKeys = {
  all: ["clients"] as const,
  list: (params: ClientsListParams) => ["clients", "list", params] as const,
  detail: (id: string) => ["clients", "detail", id] as const,
};

/** actif = false : la boutique n'est pas une quincaillerie, la liste n'existe pas pour elle. */
export function useClients(params: ClientsListParams = {}, actif = true) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => getClients(params),
    enabled: !!token && actif,
  });
}

export function useClient(id: string | null) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: clientKeys.detail(id ?? ""),
    queryFn: () => getClient(id ?? ""),
    enabled: !!token && !!id,
  });
}
