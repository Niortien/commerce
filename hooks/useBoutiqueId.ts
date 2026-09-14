"use client";

import { useAuthStore } from "@/stores/authStore";

/**
 * Chaque ADMIN et CAISSIER appartient désormais à une seule boutique
 * (modèle multi-tenant) : il n'existe plus de vue "toutes les boutiques"
 * — le backend force de toute façon la boutique du JWT sur ces endpoints.
 */
export function useBoutiqueId(): string | undefined {
  const user = useAuthStore((s) => s.user);
  return user?.boutiqueId ?? undefined;
}
