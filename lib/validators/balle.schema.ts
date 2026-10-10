import { z } from "zod";

const montant = (message: string) =>
  z.string().trim().min(1, message).regex(/^\d+$/, "Montant entier en FCFA");

const montantFacultatif = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d+$/.test(v), "Montant entier en FCFA")
  .optional();

export const balleSchema = z.object({
  libelle: z.string().trim().min(1, "Décrivez la balle (ex. Jeans femme 45 kg)").max(150),
  fournisseur: z.string().trim().max(150).optional(),
  coutAchat: montant("Prix d'achat requis"),
  frais: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d+$/.test(v), "Montant entier en FCFA")
    .optional(),
  dateAchat: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date requise"),
  notes: z.string().trim().optional(),
  prixChoix1: montantFacultatif,
  prixChoix2: montantFacultatif,
  prixChoix3: montantFacultatif,
});

export type BalleInput = z.infer<typeof balleSchema>;

export const pieceSchema = z.object({
  nom: z.string().trim().min(1, "Nom de la pièce requis").max(150),
  categorieId: z.string().min(1, "Choisissez un rayon"),
  prixVente: montant("Prix requis"),
});

export type PieceInput = z.infer<typeof pieceSchema>;
