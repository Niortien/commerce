"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useVitrineStore } from "@/stores/vitrineStore";

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/lookbook",  label: "Le Style" },
  { href: "/marque",    label: "La Marque" },
];

export function VitrineNav() {
  const pathname    = usePathname();
  const [open, setOpen] = useState(false);
  const cart        = useVitrineStore((s) => s.cart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);
  const theme       = useVitrineStore((s) => s.theme);
  const toggleTheme = useVitrineStore((s) => s.toggleTheme);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 60], [0, 1]);
  const cartCount = cart.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="absolute inset-0 border-b"
          style={{
            opacity: navBg,
            backgroundColor: "var(--v-nav-bg)",
            borderColor: "var(--v-nav-border)",
            backdropFilter: "blur(16px)",
          }}
        />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" aria-label="Dri Valé" className="shrink-0">
            <Image
              src="/images/logo/logo.jpeg"
              alt="Dri Valé"
              height={40}
              width={130}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                  style={{ color: active ? "var(--v-gold)" : "var(--v-muted)" }}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px"
                      style={{ backgroundColor: "var(--v-gold)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">

            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ color: "var(--v-muted)" }}
              aria-label="Thème"
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ color: "var(--v-muted)" }}
              aria-label="Panier"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black"
                  style={{ backgroundColor: "var(--v-hot)", color: "#fff" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center md:hidden"
              style={{ color: "var(--v-muted)" }}
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="9" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col"
            style={{ backgroundColor: "var(--v-bg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Image src="/images/logo/logo.jpeg" alt="Dri Valé" height={36} width={120} className="h-9 w-auto object-contain" />
              <button onClick={() => setOpen(false)} style={{ color: "var(--v-muted)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-6">
              {[{ href: "/", label: "Accueil" }, ...NAV_LINKS].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b py-5 font-[var(--font-display)] text-[42px] font-black leading-tight tracking-tight transition-colors hover:text-[var(--v-gold)]"
                    style={{
                      borderColor: "var(--v-border)",
                      color: pathname === l.href ? "var(--v-gold)" : "var(--v-text)",
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="border-t px-6 py-6" style={{ borderColor: "var(--v-border)" }}>
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--v-gold)" }}>★</span>
                <span className="font-[var(--font-display)] text-sm font-black uppercase tracking-wider" style={{ color: "var(--v-gold)" }}>
                  Sortez toujours bien habillé
                </span>
                <span style={{ color: "var(--v-gold)" }}>★</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--v-dim)" }}>Dri Valé · Yopougon · Abidjan · CI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
