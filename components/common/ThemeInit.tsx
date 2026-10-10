"use client";

import { useEffect } from "react";
import { resoudreTheme, useThemeStore } from "@/stores/themeStore";

/**
 * Synchronise la classe light/dark sur <html> avec la préférence persistée.
 * Le script inline dans <head> (voir app/layout.tsx) évite déjà le flash au premier paint ;
 * ce composant prend le relais pour les changements ultérieurs, y compris quand l'appareil
 * passe de clair à sombre alors que la préférence est « système ».
 */
export function ThemeInit() {
  const preference = useThemeStore((s) => s.theme);

  useEffect(() => {
    const appliquer = () => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resoudreTheme(preference));
    };
    appliquer();

    if (preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", appliquer);
    // Filet de sécurité : au retour sur l'onglet, on relit le réglage de l'appareil.
    window.addEventListener("focus", appliquer);
    return () => {
      media.removeEventListener("change", appliquer);
      window.removeEventListener("focus", appliquer);
    };
  }, [preference]);

  return null;
}
