import { z } from "zod";

export const boutiqueSignupSchema = z.object({
  nomBoutique: z.string().min(2, "Nom de la boutique requis"),
  ville: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export type BoutiqueSignupInput = z.infer<typeof boutiqueSignupSchema>;
