import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type BackofficeTheme = "light" | "dark";

interface ThemeState {
  theme: BackofficeTheme;
  setTheme: (theme: BackofficeTheme) => void;
  toggleTheme: () => void;
}

/**
 * Thème du back-office (admin/staff) — distinct du thème du storefront
 * public (voir vitrineStore), qui garde son identité noir + or figée.
 * Persisté en localStorage pour survivre à la fermeture du navigateur.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "backoffice-theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
