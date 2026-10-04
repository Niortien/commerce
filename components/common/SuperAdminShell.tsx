"use client";

import type { ReactNode } from "react";
import { IconShieldCheck } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";
import { SUPER_ADMIN_NAV } from "@/lib/navigation";
import { SidebarPanel } from "@/components/common/SidebarPanel";

function SuperAdminIdentity() {
  const email = useAuthStore((s) => s.user?.email);
  return (
    <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-hover px-3 py-2">
      <IconShieldCheck size={16} className="shrink-0 text-sidebar-accent" aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-sidebar-text">Super Admin</p>
        {email && <p className="truncate text-xs text-sidebar-muted">{email}</p>}
      </div>
    </div>
  );
}

/** Plateforme du Super Admin : gestion transverse des boutiques-locataires et de leurs abonnements. */
export function SuperAdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base lg:flex-row">
      <aside className="w-full shrink-0 border-b border-sidebar-border lg:h-full lg:w-60 lg:border-b-0 lg:border-r">
        <SidebarPanel
          sections={SUPER_ADMIN_NAV}
          homeHref="/super-admin/boutiques"
          identity={<SuperAdminIdentity />}
          className="max-h-[60vh] lg:max-h-none"
        />
      </aside>
      <main className="relative flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}
