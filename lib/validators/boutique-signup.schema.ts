import { z } from "zod";
import { TypeCommerce } from "@/types";

export const SIGNUP_PLANS = ["ESSAI", "MENSUEL", "TRIMESTRIEL", "ANNUEL"] as const;
export type SignupPlan = (typeof SIGNUP_PLANS)[number];

export const boutiqueSignupSchema = z
  .object({
    typeCommerce: z.nativeEnum(TypeCommerce, {
      errorMap: () => ({ message: "Choisissez le type de votre commerce" }),
    }),
    nomBoutique: z.string().min(2, "Nom de la boutique requis"),
    ville: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    plan: z.enum(SIGNUP_PLANS),
  })
  .superRefine((values, ctx) => {
    // Un plan payant se règle avant l'activation : on a besoin d'un numéro pour envoyer les instructions de paiement.
    if (values.plan !== "ESSAI" && !values.whatsapp?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["whatsapp"],
        message: "Numéro WhatsApp requis pour recevoir les instructions de paiement",
      });
    }
  });

export type BoutiqueSignupInput = z.infer<typeof boutiqueSignupSchema>;
