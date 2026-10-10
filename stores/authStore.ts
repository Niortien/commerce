import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Role, StatutBoutique } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  boutiqueId: string | null;
  boutiqueName: string | null;
  boutiqueStatut?: StatutBoutique | null;
}

/**
 * Le Super Admin regarde l'espace d'un admin ou d'un caissier, en lecture seule.
 * Sa propre session est mise de côté pour y revenir.
 */
export interface SessionConsultation {
  retour: { accessToken: string; refreshToken: string | null; user: AuthUser };
  /** Fin de validité du jeton de consultation (ms depuis 1970). */
  expireA: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  consultation: SessionConsultation | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
  /** Passe dans l'espace consulté ; renvoie false si aucune session Super Admin n'est ouverte. */
  demarrerConsultation: (accessToken: string, user: AuthUser, expireDansSecondes: number) => boolean;
  /** Revient à la session du Super Admin. */
  terminerConsultation: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      consultation: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null, consultation: null }),
      demarrerConsultation: (accessToken, user, expireDansSecondes) => {
        const { accessToken: actuel, refreshToken, user: superAdmin, consultation } = get();
        // Déjà en consultation : on garde la session Super Admin d'origine.
        const retour = consultation?.retour ?? (actuel && superAdmin ? { accessToken: actuel, refreshToken, user: superAdmin } : null);
        if (!retour) return false;
        set({
          consultation: { retour, expireA: Date.now() + expireDansSecondes * 1000 },
          accessToken,
          // Pas de rafraîchissement : la consultation s'arrête à l'expiration de son jeton.
          refreshToken: null,
          user,
        });
        return true;
      },
      terminerConsultation: () => {
        const { consultation } = get();
        if (!consultation) return;
        set({
          accessToken: consultation.retour.accessToken,
          refreshToken: consultation.retour.refreshToken,
          user: consultation.retour.user,
          consultation: null,
        });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        consultation: state.consultation,
      }),
    }
  )
);
