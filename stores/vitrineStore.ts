import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Produit, Variante } from "@/types";

export interface CartItem {
  produit: Produit;
  variante: Variante;
  quantite: number;
}

interface VitrineState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (varianteId: string) => void;
  updateQuantite: (varianteId: string, quantite: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const useVitrineStore = create<VitrineState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((c) => c.variante.id === item.variante.id);
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.variante.id === item.variante.id
                  ? { ...c, quantite: Math.min(c.quantite + item.quantite, 10) }
                  : c
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),

      removeFromCart: (varianteId) =>
        set((state) => ({ cart: state.cart.filter((c) => c.variante.id !== varianteId) })),

      updateQuantite: (varianteId, quantite) =>
        set((state) => ({
          cart:
            quantite <= 0
              ? state.cart.filter((c) => c.variante.id !== varianteId)
              : state.cart.map((c) =>
                  c.variante.id === varianteId ? { ...c, quantite } : c
                ),
        })),

      clearCart: () => set({ cart: [] }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
    }),
    {
      name: "drivale-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
      partialize: (state) => ({ cart: state.cart, theme: state.theme }),
    }
  )
);
