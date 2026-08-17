import { z } from "zod";

export const categorieSchema = z.object({
  nom:         z.string().min(1, "Requis"),
  slug:        z.string().min(1, "Requis").regex(/^[a-z0-9-]+$/, "Minuscules, chiffres et tirets uniquement"),
  description: z.string().min(1, "Requis"),
});

export type CategorieFormData = z.infer<typeof categorieSchema>;
