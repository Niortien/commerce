import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AdminState {
  currentBoutiqueId: string | "all";
  setCurrentBoutique: (id: string | "all") => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      currentBoutiqueId: "all",
      setCurrentBoutique: (id) => set({ currentBoutiqueId: id }),
    }),
    {
      name: "admin-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ currentBoutiqueId: state.currentBoutiqueId }),
    }
  )
);
