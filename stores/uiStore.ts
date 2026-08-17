import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Taille, TypeSortie } from "@/types";

export type SortiePeriode = "7j" | "30j" | "90j";
type FeedDensity = "compact" | "cozy";
export type RapportGroupBy = "jour" | "semaine" | "mois";

interface UiState {
  produitPanelId: string | null;
  stockFiltre: {
    categorieId?: string;
    taille?: Taille;
    alerte?: boolean;
  };
  sortiePeriode: SortiePeriode;
  entreePeriode: SortiePeriode;
  sortieTypeFilter: TypeSortie | null;
  feedDensity: FeedDensity;
  rapportPeriode: {
    debut: string;
    fin: string;
    groupBy: RapportGroupBy;
  };
  activitePeriode: SortiePeriode;
  activiteGroupBy: RapportGroupBy;
  setProduitPanelId: (id: string | null) => void;
  setStockFiltre: (filtre: UiState["stockFiltre"]) => void;
  setSortiePeriode: (periode: SortiePeriode) => void;
  setEntreePeriode: (periode: SortiePeriode) => void;
  setSortieTypeFilter: (type: TypeSortie | null) => void;
  setFeedDensity: (density: FeedDensity) => void;
  setRapportPeriode: (periode: UiState["rapportPeriode"]) => void;
  setActivitePeriode: (periode: SortiePeriode) => void;
  setActiviteGroupBy: (groupBy: RapportGroupBy) => void;
}

const now = new Date();
const start = new Date(now);
start.setDate(now.getDate() - 30);

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      produitPanelId: null,
      stockFiltre: {},
      sortiePeriode: "30j",
      entreePeriode: "30j",
      sortieTypeFilter: null,
      feedDensity: "cozy",
      rapportPeriode: {
        debut: start.toISOString(),
        fin: now.toISOString(),
        groupBy: "jour",
      },
      activitePeriode: "30j",
      activiteGroupBy: "jour",
      setProduitPanelId: (id) => set({ produitPanelId: id }),
      setStockFiltre: (filtre) => set({ stockFiltre: filtre }),
      setSortiePeriode: (periode) => set({ sortiePeriode: periode }),
      setEntreePeriode: (periode) => set({ entreePeriode: periode }),
      setSortieTypeFilter: (type) => set({ sortieTypeFilter: type }),
      setFeedDensity: (feedDensity) => set({ feedDensity }),
      setRapportPeriode: (periode) => set({ rapportPeriode: periode }),
      setActivitePeriode: (activitePeriode) => set({ activitePeriode }),
      setActiviteGroupBy: (activiteGroupBy) => set({ activiteGroupBy }),
    }),
  {
    name: "ui-store",
    storage: createJSONStorage(() => sessionStorage),
    partialize: (state) => ({ feedDensity: state.feedDensity }),
  }
));
