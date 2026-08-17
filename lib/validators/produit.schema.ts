import { z } from "zod";

export const createProduitSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  sku: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  categorieId: z.string().min(1, "Categorie requise"),
  prixVente: z.string().regex(/^\d+(\.\d{1,2})?$/, "Montant invalide"),
  prixAchat: z.string().regex(/^\d+(\.\d{1,2})?$/, "Montant invalide"),
  imageUrl: z.string().optional().or(z.literal("")),
});

export const updateProduitSchema = createProduitSchema.partial();

export type CreateProduitInput = z.infer<typeof createProduitSchema>;
export type UpdateProduitInput = z.infer<typeof updateProduitSchema>;
