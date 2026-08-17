import { z } from "zod";
import { ModePaiement } from "@/types";

export const transactionSchema = z.object({
  montant: z.string().regex(/^\d+(\.\d{1,2})?$/, "Montant invalide"),
  modePaiement: z.nativeEnum(ModePaiement),
  reference: z.string().optional(),
  notes: z.string().optional(),
  sortieId: z.string().uuid().optional(),
});

export const ouvertureSessionSchema = z.object({
  montantOuverture: z.string().regex(/^\d+(\.\d{1,2})?$/, "Montant invalide"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type OuvertureSessionInput = z.infer<typeof ouvertureSessionSchema>;
