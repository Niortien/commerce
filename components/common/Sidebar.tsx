"use client";

import { useAuthStore } from "@/stores/authStore";
import { BOUTIQUE_ADMIN_NAV, getBoutiqueNav } from "@/lib/navigation";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { BoutiqueIdentity } from "@/components/common/BoutiqueIdentity";
import { SidebarPanel } from "@/components/common/SidebarPanel";

/** Navigation latérale desktop du back-office d'une boutique. */
export function Sidebar() {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const nav = getBoutiqueNav(useTypeCommerce());
  const sections = isAdmin ? [...nav, BOUTIQUE_ADMIN_NAV] : nav;

  return (
    <aside className="hidden h-full w-60 shrink-0 border-r border-sidebar-border lg:block">
      <SidebarPanel sections={sections} identity={<BoutiqueIdentity />} />
    </aside>
  );
}
