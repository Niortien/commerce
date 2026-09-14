import { api, apiPost } from "@/lib/api";
import type { BoutiqueSignupInput } from "@/lib/validators/boutique-signup.schema";
import type { Boutique } from "@/types";

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export interface RegisterBoutiqueResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    boutiqueId: string | null;
    boutiqueName: string | null;
  };
  boutique: Boutique;
}

/** Auto-inscription publique d'une boutique (essai gratuit 14 jours). */
export const registerBoutiquePublic = (body: BoutiqueSignupInput) =>
  apiPost<RegisterBoutiqueResponse, BoutiqueSignupInput>("/auth/inscription-boutique", body);
