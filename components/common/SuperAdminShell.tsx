"use client";

import type { ReactNode } from "react";
import { IconShieldCheck } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";
import { useSectorStore } from "@/stores/sectorStore";
import { getSuperAdminNav } from "@/lib/navigation";
import { SidebarPanel } from "@/components/common/SidebarPanel";
import { SectorSwitcher } from "@/components/superadmin/SectorSwitcher";

function SuperAdminIdentity() {
  const email = useAuthStore((s) => s.user?.email);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-hover px-3 py-2">
        <IconShieldCheck size={16} className="shrink-0 text-sidebar-accent" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sidebar-text">Super Admin</p>
          {email && <p className="truncate text-xs text-sidebar-muted">{email}</p>}
        </div>
      </div>
      <SectorSwitcher />
    </div>
  );
}

/** Plateforme du Super Admin : gestion transverse des boutiques-locataires, secteur par secteur. */
export function SuperAdminShell({ children }: { children: ReactNode }) {
  const secteur = useSectorStore((s) => s.secteur);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base lg:flex-row">
      <aside className="w-full shrink-0 border-b border-sidebar-border lg:h-full lg:w-60 lg:border-b-0 lg:border-r">
        <SidebarPanel
          sections={getSuperAdminNav(secteur)}
          homeHref="/super-admin/boutiques"
          identity={<SuperAdminIdentity />}
          className="max-h-[60vh] lg:max-h-none"
        />
      </aside>
      <main className="relative flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}
