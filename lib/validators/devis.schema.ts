import { z } from "zod";

export const devisSchema = z.object({
  clientNom: z.string().trim().min(1, "Nom du client requis").max(150),
  clientTelephone: z.string().trim().max(40).optional(),
  validiteJours: z.coerce.number().int().min(1).max(365),
  remiseMontant: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d+$/.test(v), "Montant entier en FCFA")
    .optional(),
  notes: z.string().trim().optional(),
});

export type DevisInput = z.infer<typeof devisSchema>;
