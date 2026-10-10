import { z } from "zod";

/** Une catégorie et son groupe, libre (« Grillades », « Plomberie »…), facultatif. */
export const categorieSchema = z.object({
  nom: z.string().trim().min(1, "Donnez un nom à la catégorie").max(100, "100 caractères maximum"),
  groupe: z.string().trim().max(60, "60 caractères maximum"),
});

export type CategorieFormData = z.infer<typeof categorieSchema>;
