import { apiGet } from "@/lib/api";
import type { RevenusPlateforme } from "@/types";

/** Revenus des abonnements par secteur pour une année. */
export const getRevenus = (annee: number) => apiGet<RevenusPlateforme>("/super-admin/revenus", { annee });
