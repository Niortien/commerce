"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BOUTIQUE_ADMIN_NAV, getBoutiqueNav } from "@/lib/navigation";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { BoutiqueIdentity } from "@/components/common/BoutiqueIdentity";
import { BrandMark } from "@/components/common/BrandMark";
import { SidebarPanel } from "@/components/common/SidebarPanel";

/** Barre haute + tiroir de navigation sous `lg`. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const boutiqueName = useAuthStore((s) => s.user?.boutiqueName);
  const nav = getBoutiqueNav(useTypeCommerce());
  const sections = isAdmin ? [...nav, BOUTIQUE_ADMIN_NAV] : nav;

  // Le tiroir se ferme à chaque changement de page, et avec Échap.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-sidebar-border bg-sidebar px-4 py-2.5 lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark onDark className="h-8" />
          {boutiqueName && (
            <span className="max-w-[40vw] truncate rounded-full bg-sidebar-hover px-2.5 py-1 text-xs font-semibold text-sidebar-text">
              {boutiqueName}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-sidebar-text transition-colors duration-150 hover:bg-sidebar-hover focus-visible:outline-sidebar-accent"
        >
          <IconMenu2 size={22} aria-hidden />
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
              transition={{ duration: reduced ? 0 : 0.18 }}
              className="fixed inset-0 z-overlay bg-brand-950/60 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              initial={reduced ? { opacity: 0 } : { x: "-100%" }}
              animate={reduced ? { opacity: 1 } : { x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: "-100%" }}
              transition={reduced ? { duration: 0 } : { type: "spring", damping: 30, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-modal w-72 max-w-[85vw] shadow-lg lg:hidden"
            >
              <SidebarPanel
                sections={sections}
                identity={<BoutiqueIdentity />}
                onNavigate={() => setOpen(false)}
                closeSlot={
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Fermer le menu"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sidebar-muted transition-colors duration-150 hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-sidebar-accent"
                  >
                    <IconX size={20} aria-hidden />
                  </button>
                }
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
