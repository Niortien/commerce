"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, useScroll, useSpring } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeMenu, ThemeToggle } from "@/components/common/ThemeToggle";

// Ancres préfixées par « / » : elles mènent aussi à l'accueil depuis les pages de guides.
const LINKS = [
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/#metiers", label: "Métiers" },
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#plans", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
  { href: "/guides", label: "Guides" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-surface/90 backdrop-blur">
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-[#FFC531] via-[#2563eb] to-[#06b6d4]"
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" aria-label="Mon Djossi — accueil" className="rounded-md">
          <BrandMark className="h-11" priority />
        </Link>

        <nav aria-label="Sections de la page" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-150 hover:bg-surface-high hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeMenu />
          <Button as={Link} href="/login" variant="light" className="font-medium text-text">
            Se connecter
          </Button>
          <Button as={Link} href="/inscription?plan=ESSAI" className="h-[46px] rounded-full bg-accent px-5 font-bold text-white">
            Essai gratuit
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-text transition-colors duration-150 hover:bg-surface-high md:hidden"
        >
          {open ? <IconX size={22} aria-hidden /> : <IconMenu2 size={22} aria-hidden />}
        </button>
      </div>

      {open && (
        <div id="menu-mobile" className="border-t border-border bg-surface px-4 pb-4 pt-2 md:hidden">
          <nav aria-label="Sections de la page" className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 cursor-pointer items-center rounded-md px-3 text-md font-medium text-text hover:bg-surface-high"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button as={Link} href="/inscription" className="bg-accent font-semibold text-white">
              Inscrire ma boutique
            </Button>
            <Button as={Link} href="/login" variant="bordered" className="font-medium">
              Se connecter
            </Button>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
