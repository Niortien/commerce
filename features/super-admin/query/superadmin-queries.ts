"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getSuperAdminBoutique, getSuperAdminBoutiques } from "../api/superadmin-boutiques-api";
import { getAbonnements } from "../api/superadmin-abonnements-api";
import { getSuperAdminUsers } from "../api/superadmin-users-api";
import type { StatutAbonnement, StatutBoutique } from "@/types";

export const superAdminKeys = {
  boutiques: (filters?: { statut?: StatutBoutique; search?: string }) => ["super-admin", "boutiques", filters ?? {}] as const,
  boutique: (id: string) => ["super-admin", "boutiques", id] as const,
  abonnements: (filters?: { boutiqueId?: string; statut?: StatutAbonnement }) => ["super-admin", "abonnements", filters ?? {}] as const,
  users: (filters?: { boutiqueId?: string; role?: string }) => ["super-admin", "users", filters ?? {}] as const,
};

function useIsSuperAdmin(): boolean {
  const token = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.user?.role);
  return !!token && role === "SUPER_ADMIN";
}

export function useSuperAdminBoutiques(filters?: { statut?: StatutBoutique; search?: string }) {
  const enabled = useIsSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.boutiques(filters),
    queryFn: () => getSuperAdminBoutiques(filters),
    enabled,
    staleTime: 30_000,
  });
}

export function useSuperAdminBoutique(id: string) {
  const enabled = useIsSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.boutique(id),
    queryFn: () => getSuperAdminBoutique(id),
    enabled: enabled && !!id,
  });
}

export function useAbonnements(filters?: { boutiqueId?: string; statut?: StatutAbonnement }) {
  const enabled = useIsSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.abonnements(filters),
    queryFn: () => getAbonnements(filters),
    enabled,
  });
}

export function useSuperAdminUsers(filters?: { boutiqueId?: string; role?: string }) {
  const enabled = useIsSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.users(filters),
    queryFn: () => getSuperAdminUsers(filters),
    enabled,
  });
}
