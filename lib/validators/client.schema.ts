import { z } from "zod";

export const clientSchema = z.object({
  nom: z.string().trim().min(1, "Nom du client ou de l'entreprise requis").max(150),
  telephone: z.string().trim().max(40).optional(),
  plafondCredit: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d+$/.test(v), "Montant entier en FCFA")
    .optional(),
  notes: z.string().trim().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
