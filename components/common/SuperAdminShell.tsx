"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import {
  IconBuildingStore,
  IconUsers,
  IconLogout,
  IconWorld,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/mutation/auth-mutations";
import { useAuthStore } from "@/stores/authStore";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}

const ITEMS: NavItem[] = [
  { href: "/super-admin/boutiques",    label: "Boutiques",    icon: IconBuildingStore },
  { href: "/super-admin/utilisateurs", label: "Utilisateurs", icon: IconUsers },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        "border-l-2 transition-all duration-150",
        active
          ? "border-accent bg-white/[0.10] text-white"
          : "border-transparent text-text-muted hover:border-accent/40 hover:bg-white/[0.05] hover:text-white"
      )}
    >
      <Icon size={16} className="shrink-0" />
      {item.label}
    </Link>
  );
}

/** Plateforme du Super Admin : gestion transverse des boutiques-locataires. */
export function SuperAdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base lg:flex-row">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_-5%,rgba(99,241,123,0.14),transparent_62%)]" />

      <aside className="flex h-full w-full flex-col gap-3 border-b border-border bg-surface p-4 lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">Plateforme</p>
          <h2 className="text-lg font-bold text-text">Super Admin</h2>
          {user?.email && <p className="truncate text-xs text-text-muted">{user.email}</p>}
        </div>

        <nav className="flex flex-col gap-0.5">
          {ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={pathname?.startsWith(item.href)} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-md border border-accent/35 bg-white/[0.07] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.12]"
          >
            <IconWorld size={15} className="shrink-0" />
            Voir le site
          </Link>
          <Button
            variant="light"
            className="w-full justify-start gap-2.5 text-sm text-text-muted hover:text-out"
            onPress={() => logout.mutate()}
            isLoading={logout.isPending}
            startContent={!logout.isPending && <IconLogout size={15} />}
          >
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="relative flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}
