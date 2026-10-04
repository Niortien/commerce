"use client";

import { IconBuildingStore } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";
import { SubscriptionStatusCard } from "@/components/common/SubscriptionStatusCard";

/**
 * En-tête de la navigation d'une boutique : nom de la boutique du compte connecté (la plateforme Mon Djossi reste la
 * marque principale) + état de son abonnement, toujours visible sans défiler.
 */
export function BoutiqueIdentity() {
  const boutiqueName = useAuthStore((s) => s.user?.boutiqueName);

  return (
    <div className="flex flex-col gap-2">
      {boutiqueName && (
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-hover px-3 py-2">
          <IconBuildingStore size={16} className="shrink-0 text-sidebar-accent" aria-hidden />
          <span className="truncate text-sm font-semibold text-sidebar-text" title={boutiqueName}>
            {boutiqueName}
          </span>
        </div>
      )}
      <SubscriptionStatusCard />
    </div>
  );
}
