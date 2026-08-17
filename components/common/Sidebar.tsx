"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import {
  IconLayoutDashboard,
  IconActivity,
  IconBoxSeam,
  IconCoin,
  IconPackageImport,
  IconPackageExport,
  IconHanger,
  IconRosetteDiscount,
  IconBuildingStore,
  IconUsers,
  IconCategory2,
  IconWorld,
  IconLogout,
  IconReportMoney,
  IconPhoto,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/mutation/auth-mutations";
import { useAuthStore } from "@/stores/authStore";
import { AdminBoutiqueSelect } from "./AdminBoutiqueSelect";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}

const ITEMS: NavItem[] = [
  { href: "/dashboard",             label: "Dashboard",     icon: IconLayoutDashboard },
  { href: "/activite",              label: "Activité",      icon: IconActivity },
  { href: "/activite/hebdomadaire", label: "Recette hebdo", icon: IconReportMoney },
  { href: "/stock",      label: "Stock",        icon: IconBoxSeam },
  { href: "/caisse",     label: "Caisse",       icon: IconCoin },
  { href: "/entrees",    label: "Entrées",      icon: IconPackageImport },
  { href: "/sorties",    label: "Sorties",      icon: IconPackageExport },
  { href: "/produits",   label: "Produits",     icon: IconHanger },
  { href: "/promotions", label: "Promotions",   icon: IconRosetteDiscount },
];

const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin/boutiques",      label: "Boutiques",     icon: IconBuildingStore },
  { href: "/admin/utilisateurs",   label: "Utilisateurs",  icon: IconUsers },
  { href: "/admin/categories",     label: "Catégories",    icon: IconCategory2 },
  { href: "/admin/photos-clients", label: "Photos clients", icon: IconPhoto },
];

function StarMotif() {
  return (
    <div className="flex items-center gap-1.5 px-1 mt-0.5">
      {[0.35, 0.65, 0.35].map((opacity, i) => (
        <svg
          key={i}
          width="7"
          height="7"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-accent shrink-0"
          style={{ opacity }}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        "border-l-2 transition-all duration-150",
        active
          ? "border-accent bg-accent/[0.08] text-accent"
          : "border-transparent text-text-muted hover:border-accent/25 hover:bg-surface-high/60 hover:text-text"
      )}
    >
      <Icon size={15} className="shrink-0" />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="hidden h-full w-56 flex-col gap-3 overflow-y-auto border-r border-border bg-surface p-4 lg:flex">
      {/* Logo + étoiles */}
      <div className="flex flex-col gap-1">
        <Link href="/" tabIndex={-1}>
          <Image
            src="/images/logo/logo.jpeg"
            alt="Dri Valé"
            height={48}
            width={160}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
        <StarMotif />
      </div>

      {/* Sélecteur boutique admin */}
      {isAdmin && <AdminBoutiqueSelect />}

      {/* Badge boutique vendeur */}
      {!isAdmin && user?.boutiqueId && (
        <div className="rounded-md border border-accent/30 bg-accent/[0.07] px-3 py-1.5 text-xs font-semibold text-accent">
          Ma boutique
        </div>
      )}

      <nav className="flex flex-col gap-0.5">
        {ITEMS.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}

        {isAdmin && (
          <>
            <div className="my-2 border-t border-border/50" />
            <p className="mb-1 px-3 text-[9px] font-semibold uppercase tracking-widest text-text-dim">
              Administration
            </p>
            {ADMIN_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-1.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-md border border-accent/25 bg-accent/[0.07] px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/[0.12]"
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
  );
}
