"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getResumeDashboard, getStockValeur } from "@/features/rapports/api/rapports-api";
import { getResumeJour } from "@/features/caisse/api/caisse-api";
import { getStockAlertes } from "@/features/stock/api/stock-api";

/**
 * Vue Super Admin en lecture seule sur l'activité d'UNE boutique donnée
 * (peu importe laquelle) — distinct des hooks features/rapports et
 * features/caisse, qui déduisent toujours la boutique du compte connecté
 * (ADMIN/CAISSIER) via useBoutiqueId(). Ici la boutique est explicitement
 * choisie par le Super Admin, voir resolveBoutiqueId() côté backend.
 */
function useIsSuperAdmin(): boolean {
  const token = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.user?.role);
  return !!token && role === "SUPER_ADMIN";
}

export const superAdminActiviteKeys = {
  resumeJour: (boutiqueId: string) => ["super-admin", "activite", "resume-jour", boutiqueId] as const,
  dashboard: (boutiqueId: string, dateDebut: string, dateFin: string) =>
    ["super-admin", "activite", "dashboard", boutiqueId, dateDebut, dateFin] as const,
  stockValeur: (boutiqueId: string) => ["super-admin", "activite", "stock-valeur", boutiqueId] as const,
  stockAlertes: (boutiqueId: string) => ["super-admin", "activite", "stock-alertes", boutiqueId] as const,
};

export function useSuperAdminResumeJour(boutiqueId: string) {
  const enabled = useIsSuperAdmin() && !!boutiqueId;
  return useQuery({
    queryKey: superAdminActiviteKeys.resumeJour(boutiqueId),
    queryFn: () => getResumeJour(boutiqueId),
    enabled,
  });
}

export function useSuperAdminDashboard(boutiqueId: string, dateDebut: string, dateFin: string) {
  const enabled = useIsSuperAdmin() && !!boutiqueId;
  return useQuery({
    queryKey: superAdminActiviteKeys.dashboard(boutiqueId, dateDebut, dateFin),
    queryFn: () => getResumeDashboard({ boutiqueId, dateDebut, dateFin }),
    enabled,
  });
}

export function useSuperAdminStockValeur(boutiqueId: string) {
  const enabled = useIsSuperAdmin() && !!boutiqueId;
  return useQuery({
    queryKey: superAdminActiviteKeys.stockValeur(boutiqueId),
    queryFn: () => getStockValeur(boutiqueId),
    enabled,
  });
}

export function useSuperAdminStockAlertes(boutiqueId: string) {
  const enabled = useIsSuperAdmin() && !!boutiqueId;
  return useQuery({
    queryKey: superAdminActiviteKeys.stockAlertes(boutiqueId),
    queryFn: () => getStockAlertes(boutiqueId),
    enabled,
  });
}
