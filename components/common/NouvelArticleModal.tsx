"use client";

import { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCategoriesList } from "@/features/produits/query/produits-queries";
import { useCreateProduit } from "@/features/produits/mutation/produits-mutations";
import type { NewProduitForEntree } from "@/features/entrees/api/entrees-api";
import { ChampCodeBarre } from "@/components/common/ChampCodeBarre";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import { UNITES, UNITES_LISTE, VARIANTE_UNIQUE, isUniteEntiere } from "@/lib/unites";
import { nouvelArticleSchema, type NouvelArticleInput } from "@/lib/validators/nouvel-article.schema";
import { NatureProduit, TypeCommerce, Unite, type AppError } from "@/types";

/** Ce qu'une entrée de stock reçoit : le produit à créer et la première quantité reçue. */
export interface NouvelArticleEntree {
  newProduit: NewProduitForEntree;
  quantite: number;
  prixUnitaire: string;
  unite: Unite;
}

interface NouvelArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * catalogue : crée le produit tout de suite (plats compris).
   * entree : prépare une ligne d'entrée ; le produit est créé avec l'entrée (pas de plat, il n'entre pas en stock).
   */
  mode: "catalogue" | "entree";
  onCreated?: (produitId: string) => void;
  onAddLine?: (line: NouvelArticleEntree) => void;
}

const NATURE_INFO: Record<NatureProduit, { label: string; description: string }> = {
  [NatureProduit.PLAT]: { label: "Plat", description: "Préparé en cuisine à partir d'ingrédients" },
  [NatureProduit.INGREDIENT]: { label: "Ingrédient", description: "Acheté pour la cuisine, jamais vendu seul" },
  [NatureProduit.ARTICLE]: { label: "Article revendu", description: "Vendu tel quel (boisson en bouteille…)" },
};

/**
 * Création d'un article hors vêtements : pas de taille ni de couleur, mais une unité (pièce, kg, mètre…),
 * une nature pour les restaurants et un conditionnement d'achat pour les quincailleries.
 */
export function NouvelArticleModal({ isOpen, onClose, mode, onCreated, onAddLine }: NouvelArticleModalProps) {
  const type = useTypeCommerce();
  const profile = COMMERCE_PROFILES[type];
  const restaurant = type === TypeCommerce.RESTAURANT;
  const quincaillerie = type === TypeCommerce.QUINCAILLERIE;
  const natures = mode === "catalogue"
    ? [NatureProduit.PLAT, NatureProduit.INGREDIENT, NatureProduit.ARTICLE]
    : [NatureProduit.INGREDIENT, NatureProduit.ARTICLE];

  const { data: categoriesData } = useCategoriesList();
  const categories = categoriesData?.data ?? [];
  const createProduit = useCreateProduit();

  const defaults: Partial<NouvelArticleInput> = {
    nature: restaurant ? natures[0] : NatureProduit.ARTICLE,
    unite: restaurant && mode === "catalogue" ? Unite.PORTION : Unite.PIECE,
    quantite: mode === "entree" ? 1 : 0,
    seuilAlerte: 0,
  };
  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<NouvelArticleInput>({
    resolver: zodResolver(nouvelArticleSchema),
    defaultValues: defaults,
  });
  const nature = useWatch({ control, name: "nature" });
  const unite = useWatch({ control, name: "unite" });
  const conditionnementUnite = useWatch({ control, name: "conditionnementUnite" });
  const codeBarre = useWatch({ control, name: "codeBarre" });
  const plat = nature === NatureProduit.PLAT;
  const ingredient = nature === NatureProduit.INGREDIENT;

  useEffect(() => {
    if (isOpen) reset(defaults);
    // Réinitialise à chaque ouverture seulement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Un plat se vend à la portion.
  useEffect(() => {
    if (plat) setValue("unite", Unite.PORTION);
  }, [plat, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    const prixVente = ingredient ? "0.00" : Number(values.prixVente).toFixed(2);
    const prixAchat = plat ? "0.00" : Number(values.prixAchat).toFixed(2);
    const conditionnement = quincaillerie && values.conditionnementUnite && values.conditionnementQuantite
      ? { conditionnementUnite: values.conditionnementUnite, conditionnementQuantite: values.conditionnementQuantite }
      : {};

    if (mode === "entree") {
      onAddLine?.({
        newProduit: {
          nom: values.nom.trim(),
          categorieId: values.categorieId,
          prixVente,
          prixAchat,
          taille: VARIANTE_UNIQUE.taille,
          couleur: VARIANTE_UNIQUE.couleur,
          seuilAlerte: values.seuilAlerte,
          unite: values.unite,
          nature: values.nature,
          codeBarre: values.codeBarre || undefined,
        },
        quantite: values.quantite,
        prixUnitaire: prixAchat,
        unite: values.unite,
      });
      onClose();
      return;
    }

    try {
      const res = await createProduit.mutateAsync({
        nom: values.nom.trim(),
        categorieId: values.categorieId,
        prixVente,
        prixAchat,
        unite: values.unite,
        nature: values.nature,
        ...conditionnement,
        variantes: [
          {
            ...VARIANTE_UNIQUE,
            quantiteStock: plat ? 0 : values.quantite,
            seuilAlerte: plat ? 0 : values.seuilAlerte,
            codeBarre: plat ? undefined : values.codeBarre || undefined,
          },
        ],
      });
      toast.success(plat ? "Plat créé — ajoutez sa fiche technique" : `${values.nom.trim()} ajouté au catalogue`);
      onCreated?.(res.data.id);
      onClose();
    } catch (error) {
      toast.error((error as AppError)?.message ?? "Création impossible");
    }
  });

  const titre = mode === "entree" ? "Nouvel article reçu" : `Nouveau : ${profile.vocab.produits.toLowerCase()}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      // Ouvert depuis le panneau des entrées (z-800) : il doit passer devant.
      classNames={{ wrapper: "z-[1000]", backdrop: "z-[950]" }}
    >
      <ModalContent>
        <ModalHeader>{titre}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {restaurant && (
              <Controller
                name="nature"
                control={control}
                render={({ field }) => (
                  <fieldset className="sm:col-span-2">
                    <legend className="mb-2 text-sm font-medium text-text">C&apos;est…</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {natures.map((n) => (
                        <label
                          key={n}
                          className={
                            "flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-sm transition-colors duration-150 " +
                            (field.value === n ? "border-accent bg-accent-dim" : "border-border hover:border-text-dim")
                          }
                        >
                          <span className="flex items-center gap-2 font-semibold text-text">
                            <input
                              type="radio"
                              name="nature"
                              value={n}
                              checked={field.value === n}
                              onChange={() => field.onChange(n)}
                              className="accent-[var(--color-accent)]"
                            />
                            {NATURE_INFO[n].label}
                          </span>
                          <span className="text-xs text-text-muted">{NATURE_INFO[n].description}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              />
            )}

            <Input
              label="Nom"
              variant="bordered"
              className="sm:col-span-2"
              isInvalid={Boolean(errors.nom)}
              errorMessage={errors.nom?.message}
              {...register("nom")}
            />

            <Controller
              name="categorieId"
              control={control}
              render={({ field }) => (
                <Select
                  label={profile.vocab.categories === "Catégories" ? "Catégorie" : profile.vocab.categories}
                  variant="bordered"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => field.onChange(String(Array.from(keys)[0] ?? ""))}
                  isInvalid={Boolean(errors.categorieId)}
                  errorMessage={errors.categorieId?.message ?? (categories.length === 0 ? "Créez d'abord une catégorie" : undefined)}
                >
                  {categories.map((c) => (
                    <SelectItem key={c.id} textValue={c.nom}>
                      {c.nom}
                      {c.description && <span className="ml-1.5 text-xs text-text-muted">· {c.description}</span>}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="unite"
              control={control}
              render={({ field }) => (
                <Select
                  label="Se vend à…"
                  variant="bordered"
                  isDisabled={plat}
                  selectedKeys={[field.value]}
                  disallowEmptySelection
                  onSelectionChange={(keys) => {
                    const u = Array.from(keys)[0];
                    if (typeof u === "string" && (UNITES_LISTE as string[]).includes(u)) field.onChange(u);
                  }}
                  description={isUniteEntiere(unite) ? "Quantités entières" : "Quantités décimales possibles (ex. 12,5)"}
                >
                  {UNITES_LISTE.map((u) => (
                    <SelectItem key={u}>{UNITES[u].label}</SelectItem>
                  ))}
                </Select>
              )}
            />

            {!ingredient && (
              <Input
                label={`Prix de vente (par ${UNITES[unite].singulier})`}
                variant="bordered"
                inputMode="decimal"
                endContent={<span className="text-xs text-text-muted">FCFA</span>}
                isInvalid={Boolean(errors.prixVente)}
                errorMessage={errors.prixVente?.message}
                {...register("prixVente")}
              />
            )}
            {!plat && (
              <Input
                label={`Prix d'achat (par ${UNITES[unite].singulier})`}
                variant="bordered"
                inputMode="decimal"
                endContent={<span className="text-xs text-text-muted">FCFA</span>}
                isInvalid={Boolean(errors.prixAchat)}
                errorMessage={errors.prixAchat?.message}
                {...register("prixAchat")}
              />
            )}

            {!plat && (
              <>
                <Input
                  label={mode === "entree" ? `Quantité reçue (${UNITES[unite].pluriel})` : `Stock actuel (${UNITES[unite].pluriel})`}
                  variant="bordered"
                  inputMode="decimal"
                  isInvalid={Boolean(errors.quantite)}
                  errorMessage={errors.quantite?.message}
                  {...register("quantite")}
                />
                <Input
                  label="Alerte quand il reste"
                  variant="bordered"
                  inputMode="decimal"
                  description="Vous êtes prévenu quand le stock descend à ce niveau"
                  isInvalid={Boolean(errors.seuilAlerte)}
                  errorMessage={errors.seuilAlerte?.message}
                  {...register("seuilAlerte")}
                />
                <div className="sm:col-span-2">
                  <ChampCodeBarre
                    valeur={codeBarre ?? ""}
                    onChange={(v) => setValue("codeBarre", v, { shouldValidate: true })}
                    erreur={errors.codeBarre?.message}
                  />
                </div>
              </>
            )}

            {quincaillerie && (
              <fieldset className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 sm:col-span-2">
                <legend className="px-1 text-sm font-medium text-text">Acheté en gros ? (facultatif)</legend>
                <Controller
                  name="conditionnementUnite"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Acheté par"
                      variant="bordered"
                      size="sm"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const u = Array.from(keys)[0];
                        field.onChange(typeof u === "string" && (UNITES_LISTE as string[]).includes(u) ? u : undefined);
                      }}
                    >
                      {[Unite.CARTON, Unite.BOITE, Unite.PAQUET, Unite.SAC].map((u) => (
                        <SelectItem key={u}>{UNITES[u].label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
                <Input
                  label={conditionnementUnite ? `1 ${UNITES[conditionnementUnite].singulier} contient` : "Contient"}
                  variant="bordered"
                  size="sm"
                  inputMode="decimal"
                  endContent={<span className="text-xs text-text-muted">{UNITES[unite].pluriel}</span>}
                  isDisabled={!conditionnementUnite}
                  isInvalid={Boolean(errors.conditionnementQuantite)}
                  errorMessage={errors.conditionnementQuantite?.message}
                  {...register("conditionnementQuantite")}
                />
                <p className="col-span-2 text-xs text-text-muted">
                  Exemple : un carton de 24 pièces. À la réception, vous saisirez des cartons ; à la caisse, vous vendrez à la pièce.
                </p>
              </fieldset>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Annuler
          </Button>
          <Button className="bg-accent font-semibold text-white" isLoading={createProduit.isPending} onPress={() => void onSubmit()}>
            {mode === "entree" ? "Ajouter à l'entrée" : plat ? "Créer le plat" : "Ajouter au catalogue"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
