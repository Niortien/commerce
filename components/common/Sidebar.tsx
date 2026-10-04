"use client";

import { useAuthStore } from "@/stores/authStore";
import { BOUTIQUE_ADMIN_NAV, BOUTIQUE_NAV } from "@/lib/navigation";
import { BoutiqueIdentity } from "@/components/common/BoutiqueIdentity";
import { SidebarPanel } from "@/components/common/SidebarPanel";

/** Navigation latérale desktop du back-office d'une boutique. */
export function Sidebar() {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const sections = isAdmin ? [...BOUTIQUE_NAV, BOUTIQUE_ADMIN_NAV] : BOUTIQUE_NAV;

  return (
    <aside className="hidden h-full w-60 shrink-0 border-r border-sidebar-border lg:block">
      <SidebarPanel sections={sections} identity={<BoutiqueIdentity />} />
    </aside>
  );
}
