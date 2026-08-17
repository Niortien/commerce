import { z } from "zod";

export const entreeSchema = z.object({
  fournisseur: z.string().min(1, "Fournisseur requis"),
  notes: z.string().optional(),
  lignes: z
    .array(
      z.object({
        varianteId: z.string().uuid("ID variante invalide"),
        quantite: z.number().int().positive("Quantite > 0"),
        prixUnitaire: z.string().regex(/^\d+(\.\d{1,2})?$/, "Montant invalide"),
      })
    )
    .min(1, "Au moins une ligne requise"),
});

export type EntreeInput = z.infer<typeof entreeSchema>;
