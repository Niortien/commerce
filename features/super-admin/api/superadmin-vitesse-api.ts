import { apiGet } from "@/lib/api";
import type { VitesseSite } from "@/types";

/** Vitesse réelle du site mesurée chez les visiteurs : 75e centile par page et par appareil. */
export const getVitesseSite = (jours: number) => apiGet<VitesseSite>("/super-admin/web-vitals", { jours });
