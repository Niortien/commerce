import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TypeCommerce } from "@/types";

/** Secteur affiché par le Super Admin : un type de commerce, ou toute la plateforme. */
export type Secteur = TypeCommerce | "TOUS";

interface SectorState {
  secteur: Secteur;
  setSecteur: (secteur: Secteur) => void;
}

export const useSectorStore = create<SectorState>()(
  persist(
    (set) => ({
      secteur: "TOUS",
      setSecteur: (secteur) => set({ secteur }),
    }),
    { name: "super-admin-secteur", storage: createJSONStorage(() => localStorage) }
  )
);
