"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

/**
 * Synchronise la classe light/dark sur <html> avec le store persisté.
 * Le script inline dans <head> (voir app/layout.tsx) évite déjà le flash
 * au premier paint ; ce composant prend le relais pour les changements
 * ultérieurs (toggle en cours de session, autre onglet, etc.).
 */
export function ThemeInit() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return null;
}
