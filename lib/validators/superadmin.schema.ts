import { z } from "zod";
import { PlanAbonnement, StatutAbonnement, StatutBoutique } from "@/types";

export const registerBoutiqueSchema = z.object({
  nom: z.string().min(2, "Nom requis"),
  ville: z.string().optional(),
  adresse: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().optional(),
  adminEmail: z.string().email("Email invalide"),
  adminPassword: z.string().min(8, "8 caractères minimum"),
  plan: z.nativeEnum(PlanAbonnement).default(PlanAbonnement.ESSAI),
  dureeJours: z.coerce.number().int().min(1).optional(),
});
export type RegisterBoutiqueInput = z.infer<typeof registerBoutiqueSchema>;

export const changerStatutBoutiqueSchema = z.object({
  statut: z.nativeEnum(StatutBoutique),
  motif: z.string().optional(),
});
export type ChangerStatutBoutiqueInput = z.infer<typeof changerStatutBoutiqueSchema>;

export const createAbonnementSchema = z.object({
  boutiqueId: z.string().min(1),
  plan: z.nativeEnum(PlanAbonnement),
  dateFin: z.string().min(1, "Date de fin requise"),
  montant: z.coerce.number().min(0).optional(),
  devise: z.string().optional(),
  notes: z.string().optional(),
});
export type CreateAbonnementInput = z.infer<typeof createAbonnementSchema>;

export const updateAbonnementSchema = z.object({
  statut: z.nativeEnum(StatutAbonnement).optional(),
  dateFin: z.string().optional(),
  montant: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});
export type UpdateAbonnementInput = z.infer<typeof updateAbonnementSchema>;

export const createSuperAdminUserSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "CAISSIER"]),
  boutiqueId: z.string().nullable().optional(),
});
export type CreateSuperAdminUserInput = z.infer<typeof createSuperAdminUserSchema>;
