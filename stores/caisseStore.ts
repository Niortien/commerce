import { create } from "zustand";
import type { Session, Transaction } from "@/types";

interface CaisseState {
  sessionActive: Session | null;
  soldeLocal: string;
  transactionsLive: Transaction[];
  setSession: (session: Session | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateSolde: (solde: string) => void;
  clearSession: () => void;
}

export const useCaisseStore = create<CaisseState>((set) => ({
  sessionActive: null,
  soldeLocal: "0",
  transactionsLive: [],
  setSession: (session) => set({ sessionActive: session }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactionsLive: [transaction, ...state.transactionsLive],
    })),
  updateSolde: (solde) => set({ soldeLocal: solde }),
  clearSession: () =>
    set({
      sessionActive: null,
      soldeLocal: "0",
      transactionsLive: [],
    }),
}));
