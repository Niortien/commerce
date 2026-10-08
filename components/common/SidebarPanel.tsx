"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { IconLogout, IconWorld } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/mutation/auth-mutations";
import { findActiveHref, type NavSection } from "@/lib/navigation";
import { BrandMark } from "@/components/common/BrandMark";
import { useChatUnreadCount } from "@/features/chat/query/chat-queries";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface SidebarPanelProps {
  sections: NavSection[];
  /** Ligne d'identité sous le logo (nom de la boutique, ou « Super Admin »). */
  identity?: ReactNode;
  /** Bloc affiché juste au-dessus des actions du bas (ex. carte d'abonnement). */
  footerTop?: ReactNode;
  /** Ferme le tiroir mobile quand on navigue. */
  onNavigate?: () => void;
  /** Bouton de fermeture (tiroir mobile uniquement). */
  closeSlot?: ReactNode;
  /** Destination du logo (accueil de l'espace courant). */
  homeHref?: string;
  className?: string;
}

/** Contenu commun de la navigation latérale : sidebar desktop, tiroir mobile et shell super-admin. */
export function SidebarPanel({
  sections,
  identity,
  footerTop,
  onNavigate,
  closeSlot,
  homeHref = "/dashboard",
  className,
}: SidebarPanelProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const activeHref = findActiveHref(sections, pathname);
  const chatUnread = useChatUnreadCount();

  return (
    <div className={cn("flex h-full flex-col gap-3 overflow-y-auto bg-sidebar p-4 text-sidebar-text", className)}>
      <div className="flex items-start justify-between gap-2">
        <Link
          href={homeHref}
          onClick={onNavigate}
          aria-label="Mon Djossi — accueil"
          className="rounded-md focus-visible:outline-sidebar-accent"
        >
          <BrandMark onDark />
        </Link>
        {closeSlot}
      </div>

      {identity}

      <nav aria-label="Navigation principale" className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <div key={section.label ?? index} className="flex flex-col gap-0.5">
            {section.label && (
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium lg:min-h-9",
                    "transition-colors duration-150 focus-visible:outline-sidebar-accent",
                    active
                      ? "bg-sidebar-active text-sidebar-text"
                      : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text"
                  )}
                >
                  {active && (
                    <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-accent" />
                  )}
                  <Icon
                    size={18}
                    aria-hidden
                    className={cn("shrink-0", active ? "text-sidebar-accent" : "text-sidebar-muted group-hover:text-sidebar-text")}
                  />
                  {item.label}
                  {item.badge === "chat" && chatUnread > 0 && (
                    <span
                      aria-label={`${chatUnread} messages non lus`}
                      className="ml-auto rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white"
                    >
                      {chatUnread}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-sidebar-border pt-4">
        {footerTop}
        <ThemeToggle onDark />
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-muted transition-colors duration-150 hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-sidebar-accent"
        >
          <IconWorld size={16} className="shrink-0" aria-hidden />
          Voir le site
        </Link>
        <Button
          variant="light"
          className="min-h-10 w-full justify-start gap-2.5 px-3 text-sm font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-rose-300"
          onPress={() => {
            logout.mutate();
            onNavigate?.();
          }}
          isLoading={logout.isPending}
          startContent={!logout.isPending && <IconLogout size={16} aria-hidden />}
        >
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
