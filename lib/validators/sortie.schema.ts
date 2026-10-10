import { z } from "zod";
import { TypeSortie } from "@/types";

export const sortieSchema = z
  .object({
    type: z.nativeEnum(TypeSortie),
    notes: z.string().optional(),
    montant: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
    lignes: z
      .array(
        z.object({
          varianteId: z.string().uuid(),
          // Décimale pour ce qui se mesure (kg, m) ; le serveur exige un entier pour ce qui se compte.
          quantite: z.number().positive(),
          prixUnitaire: z.string().regex(/^\d+(\.\d{1,2})?$/),
        })
      )
      .min(1)
      .optional(),
  })
  .refine(
    (data) => (data.type === TypeSortie.DEPENSE ? !!data.notes && !!data.montant : !!data.lignes?.length),
    { message: "Champs requis manquants pour ce type de sortie" }
  );

export type SortieInput = z.infer<typeof sortieSchema>;
