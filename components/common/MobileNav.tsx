"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
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
  IconX,
  IconMenu2,
  IconReportMoney,
  IconPhoto,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/mutation/auth-mutations";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";
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

function AdminBoutiqueBadge() {
  const { currentBoutiqueId } = useAdminStore();
  const { data: boutiquesRes } = useBoutiques();
  const boutiques = boutiquesRes?.data ?? [];

  const label =
    currentBoutiqueId === "all"
      ? "Toutes"
      : (boutiques.find((b) => b.id === currentBoutiqueId)?.nom ?? "...");

  return (
    <span className="max-w-[120px] truncate rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold text-accent">
      {label}
    </span>
  );
}

function NavLink({
  item,
  active,
  onPress,
}: {
  item: NavItem;
  active: boolean;
  onPress: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onPress}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
        "border-l-2 transition-all duration-150",
        active
          ? "border-accent bg-accent/[0.08] text-accent"
          : "border-transparent text-text-muted hover:border-accent/25 hover:bg-surface-high/60 hover:text-text"
      )}
    >
      <Icon size={16} className="shrink-0" />
      {item.label}
    </Link>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/logo/logo.jpeg"
            alt="Dri Valé"
            height={36}
            width={120}
            className="h-9 w-auto object-contain"
            priority
          />
          {isAdmin && <AdminBoutiqueBadge />}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-high hover:text-text"
        >
          <IconMenu2 size={20} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-[510] flex w-72 flex-col gap-3 overflow-y-auto border-r border-border bg-surface p-4 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Image
                  src="/images/logo/logo.jpeg"
                  alt="Dri Valé"
                  height={36}
                  width={120}
                  className="h-9 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer le menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text"
                >
                  <IconX size={16} />
                </button>
              </div>

              {isAdmin && <AdminBoutiqueSelect />}

              {!isAdmin && user?.boutiqueId && (
                <div className="rounded-md border border-accent/30 bg-accent/[0.07] px-3 py-1.5 text-xs font-semibold text-accent">
                  Ma boutique
                </div>
              )}

              <nav className="flex flex-col gap-0.5">
                {ITEMS.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                    onPress={() => setOpen(false)}
                  />
                ))}

                {isAdmin && (
                  <>
                    <div className="my-2 border-t border-border/50" />
                    <p className="mb-1 px-3 text-[9px] font-semibold uppercase tracking-widest text-text-dim">
                      Administration
                    </p>
                    {ADMIN_ITEMS.map((item) => (
                      <NavLink
                        key={item.href}
                        item={item}
                        active={pathname === item.href}
                        onPress={() => setOpen(false)}
                      />
                    ))}
                  </>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-1.5">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-md border border-accent/25 bg-accent/[0.07] px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/[0.12]"
                >
                  <IconWorld size={15} className="shrink-0" />
                  Voir le site
                </Link>
                <Button
                  variant="light"
                  className="w-full justify-start gap-2.5 text-sm text-text-muted hover:text-out"
                  onPress={() => { logout.mutate(); setOpen(false); }}
                  isLoading={logout.isPending}
                  startContent={!logout.isPending && <IconLogout size={15} />}
                >
                  Déconnexion
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
