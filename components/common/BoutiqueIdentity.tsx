"use client";

import { IconBuildingStore } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";
import { SubscriptionStatusCard } from "@/components/common/SubscriptionStatusCard";
import { CommerceBadge } from "@/components/common/CommerceBadge";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";

/**
 * En-tête de la navigation d'une boutique : nom de la boutique du compte connecté (la plateforme Mon Djossi reste la
 * marque principale) + état de son abonnement, toujours visible sans défiler.
 */
export function BoutiqueIdentity() {
  const boutiqueName = useAuthStore((s) => s.user?.boutiqueName);
  const typeCommerce = useTypeCommerce();

  return (
    <div className="flex flex-col gap-2">
      {boutiqueName && (
        <div className="flex flex-col items-start gap-1.5 rounded-md border border-sidebar-border bg-sidebar-hover px-3 py-2">
          <span className="flex w-full min-w-0 items-center gap-2">
            <IconBuildingStore size={16} className="shrink-0 text-sidebar-accent" aria-hidden />
            <span className="truncate text-sm font-semibold text-sidebar-text" title={boutiqueName}>
              {boutiqueName}
            </span>
          </span>
          <CommerceBadge type={typeCommerce} onDark />
        </div>
      )}
      <SubscriptionStatusCard />
    </div>
  );
}
