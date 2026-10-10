import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Thème appliqué à l'écran. */
export type BackofficeTheme = "light" | "dark";
/** Choix de l'utilisateur : un thème fixe, ou celui de son appareil. */
export type ThemePreference = BackofficeTheme | "system";

interface ThemeState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

/**
 * Thème du site et du back-office, partagé, persisté en localStorage.
 * Par défaut « system » : on suit le réglage clair/sombre du téléphone ou de l'ordinateur.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "backoffice-theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** Thème réellement affiché pour une préférence, d'après le réglage de l'appareil. */
export function resoudreTheme(preference: ThemePreference): BackofficeTheme {
  if (preference !== "system") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
