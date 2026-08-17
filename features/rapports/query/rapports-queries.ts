"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  exportExcel,
  exportPdf,
  getDepenses,
  getFluxTresorerie,
  getRecetteHebdomadaire,
  getResumeDashboard,
  getStockValeur,
  getTopProduits,
  getVentes,
  type DepensesParams,
  type ExportParams,
  type FluxTresorerieParams,
  type RapportVentesParams,
  type RecetteHebdomadaireParams,
  type ResumeDashboardParams,
  type TopProduitsParams,
} from "../api/rapports-api";

export const rapportKeys = {
  all: ["rapports"] as const,
  resumeDashboard: (params: ResumeDashboardParams) => ["rapports", "resume-dashboard", params] as const,
  ventes: (params: RapportVentesParams) => ["rapports", "ventes", params] as const,
  stockValeur: (boutiqueId?: string) => ["rapports", "stock-valeur", boutiqueId] as const,
  topProduits: (params: TopProduitsParams) => ["rapports", "top-produits", params] as const,
  fluxTresorerie: (params: FluxTresorerieParams) => ["rapports", "flux-tresorerie", params] as const,
  depenses: (params: DepensesParams) => ["rapports", "depenses", params] as const,
  recetteHebdomadaire: (params: RecetteHebdomadaireParams) => ["rapports", "recette-hebdomadaire", params] as const,
};

const DASHBOARD_STALE = 5 * 60 * 1000; // 5 min — données non temps-réel

export function useResumeDashboard(params: ResumeDashboardParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.resumeDashboard(effectiveParams),
    queryFn: () => getResumeDashboard(effectiveParams),
    enabled: !!token,
    staleTime: DASHBOARD_STALE,
  });
}

export function useVentes(params: RapportVentesParams) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.ventes(effectiveParams),
    queryFn: () => getVentes(effectiveParams),
    enabled: !!token,
    staleTime: DASHBOARD_STALE,
  });
}

export function useStockValeur() {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  return useQuery({
    queryKey: rapportKeys.stockValeur(boutiqueId),
    queryFn: () => getStockValeur(boutiqueId),
    enabled: !!token,
    staleTime: DASHBOARD_STALE,
  });
}

export function useTopProduits(params: TopProduitsParams) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.topProduits(effectiveParams),
    queryFn: () => getTopProduits(effectiveParams),
    enabled: !!token,
    staleTime: DASHBOARD_STALE,
  });
}

export function useFluxTresorerie(params: FluxTresorerieParams) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.fluxTresorerie(effectiveParams),
    queryFn: () => getFluxTresorerie(effectiveParams),
    enabled: !!token,
    staleTime: DASHBOARD_STALE,
  });
}

export function useDepenses(params: DepensesParams) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.depenses(effectiveParams),
    queryFn: () => getDepenses(effectiveParams),
    enabled: !!token,
    staleTime: DASHBOARD_STALE,
  });
}

export function useRecetteHebdomadaire(params: RecetteHebdomadaireParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.recetteHebdomadaire(effectiveParams),
    queryFn: () => getRecetteHebdomadaire(effectiveParams),
    enabled: !!token,
    staleTime: DASHBOARD_STALE,
  });
}

export function useExportExcel() {
  return (params?: ExportParams) => exportExcel(params);
}

export function useExportPdf() {
  return (params?: ExportParams) => exportPdf(params);
}
