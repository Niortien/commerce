"use client";

import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";

export function useBoutiqueId(): string | undefined {
  const user = useAuthStore((s) => s.user);
  const adminBoutiqueId = useAdminStore((s) => s.currentBoutiqueId);

  if (!user) return undefined;
  if (user.role === "ADMIN") {
    return adminBoutiqueId === "all" ? undefined : adminBoutiqueId;
  }
  return user.boutiqueId ?? undefined;
}
