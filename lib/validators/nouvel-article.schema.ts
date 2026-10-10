import { z } from "zod";
import { NatureProduit, Unite } from "@/types";
import { isUniteEntiere } from "@/lib/unites";

const montant = z
  .string()
  .trim()
  .transform((v) => v.replace(",", "."))
  .refine((v) => v === "" || /^\d+(\.\d{1,2})?$/.test(v), "Montant invalide");

const quantite = z.preprocess(
  (v) => (typeof v === "string" ? Number(v.replace(",", ".") || 0) : v),
  z.number({ invalid_type_error: "Nombre invalide" }).min(0, "Doit être positif")
);

/** Article hors vêtements : unité, nature (restaurant), conditionnement (quincaillerie). */
export const nouvelArticleSchema = z
  .object({
    nom: z.string().trim().min(1, "Nom requis"),
    categorieId: z.string().min(1, "Choisissez une catégorie"),
    nature: z.nativeEnum(NatureProduit),
    unite: z.nativeEnum(Unite),
    prixVente: montant.optional(),
    prixAchat: montant.optional(),
    quantite,
    seuilAlerte: quantite,
    conditionnementUnite: z.nativeEnum(Unite).optional(),
    conditionnementQuantite: z.preprocess(
      (v) => (v === "" || v === undefined || v === null ? undefined : typeof v === "string" ? Number(v.replace(",", ".")) : v),
      z.number({ invalid_type_error: "Nombre invalide" }).positive("Doit être positif").optional()
    ),
  })
  .superRefine((v, ctx) => {
    if (v.nature !== NatureProduit.INGREDIENT && !v.prixVente) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["prixVente"], message: "Prix de vente requis" });
    }
    if (v.nature !== NatureProduit.PLAT && !v.prixAchat) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["prixAchat"], message: "Prix d'achat requis" });
    }
    if (isUniteEntiere(v.unite) && !Number.isInteger(v.quantite)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["quantite"], message: "Se compte à l'unité : nombre entier" });
    }
    if (v.conditionnementUnite && !v.conditionnementQuantite) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["conditionnementQuantite"], message: "Combien en contient-il ?" });
    }
  });

export type NouvelArticleInput = z.infer<typeof nouvelArticleSchema>;
