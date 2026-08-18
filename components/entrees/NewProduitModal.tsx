"use client";

import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  SelectSection,
  Spinner,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useCategoriesList } from "@/features/produits/query/produits-queries";
import type { NewProduitForEntree } from "@/features/entrees/api/entrees-api";
import {
  DEFAULT_COLORS,
  SHOE_SLUGS,
  SLUG_COULEUR_CONFIG,
  getTaillesForSlug,
  groupCategories,
} from "@/lib/categoryConfig";
import type { EntreeFormLineData } from "./EntreeFormLine";

const schema = z.object({
  nom: z.string().min(1, "Nom requis"),
  categorieId: z.string().min(1, "Catégorie requise"),
  prixVente: z.string().regex(/^\d+(\.\d{1,2})?$/, "Prix invalide"),
  prixAchat: z.string().regex(/^\d+(\.\d{1,2})?$/, "Prix invalide"),
  taille: z.string().min(1, "Taille requise"),
  couleur: z.string().min(1, "Couleur requise"),
  seuilAlerte: z.coerce.number().int().min(0).optional(),
  quantite: z.coerce.number().int().min(1, "Quantité min. 1"),
  prixUnitaire: z.string().regex(/^\d+(\.\d{1,2})?$/, "Prix invalide"),
  imageUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface NewProduitModalProps {
  isOpen: boolean;
  defaultValues?: Partial<FormValues>;
  onClose: () => void;
  onAdd: (line: EntreeFormLineData) => void;
}

export function NewProduitModal({ isOpen, defaultValues, onClose, onAdd }: NewProduitModalProps) {
  const { data: categoriesData, isLoading: catLoading } = useCategoriesList();
  const categories = categoriesData?.data ?? [];
  const categoryGroups = groupCategories(categories);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantite: 1,
      seuilAlerte: 0,
      ...defaultValues,
    },
  });

  const watchedCategorieId = useWatch({ control, name: "categorieId" });
  const watchedPrixAchat   = useWatch({ control, name: "prixAchat" });
  const watchedImageUrl    = useWatch({ control, name: "imageUrl" });
  const watchedCouleur     = useWatch({ control, name: "couleur" });

  const selectedCat   = categories.find((c) => c.id === watchedCategorieId);
  const isChaussure   = selectedCat ? SHOE_SLUGS.has(selectedCat.slug) : false;
  const tailleOptions = getTaillesForSlug(selectedCat?.slug);     // null = numeric
  const couleurConfig = selectedCat ? (SLUG_COULEUR_CONFIG[selectedCat.slug] ?? null) : null;
  const couleurLabel  = couleurConfig?.label ?? "Couleur";
  const couleurPresets = couleurConfig ? couleurConfig.presets : DEFAULT_COLORS;

  // Sync prix unitaire avec prix achat
  useEffect(() => {
    if (watchedPrixAchat) {
      setValue("prixUnitaire", watchedPrixAchat, { shouldValidate: false });
    }
  }, [watchedPrixAchat, setValue]);

  // Reset taille/couleur quand la catégorie change
  useEffect(() => {
    setValue("taille", "", { shouldValidate: false });
    setValue("couleur", "", { shouldValidate: false });
  }, [watchedCategorieId, setValue]);

  const onSubmit = handleSubmit((values) => {
    const newProduit: NewProduitForEntree = {
      nom: values.nom.trim(),
      categorieId: values.categorieId,
      prixVente: parseFloat(values.prixVente).toFixed(2),
      prixAchat: parseFloat(values.prixAchat).toFixed(2),
      taille: values.taille,
      couleur: values.couleur.trim(),
      seuilAlerte: values.seuilAlerte ?? 0,
      imageUrl: values.imageUrl?.trim() || undefined,
    };

    const line: EntreeFormLineData = {
      newProduit,
      isNew: true,
      produitNom: values.nom.trim(),
      taille: values.taille,
      couleur: values.couleur.trim(),
      quantite: values.quantite,
      prixUnitaire: parseFloat(values.prixUnitaire).toFixed(2),
    };

    onAdd(line);
    reset();
    onClose();
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) { reset(); onClose(); } }}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[20px] border border-border bg-surface",
        backdrop: "z-[900]",
        wrapper: "z-[1000]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-border/60 pb-3">
          <p className="text-xs uppercase tracking-widest text-in">Nouveau produit</p>
          <p className="text-base font-semibold text-text">Créer et ajouter un article</p>
        </ModalHeader>

        <ModalBody className="py-5">
          <div className="space-y-5">
            {/* Infos produit */}
            <div className="rounded-xl border border-border/60 bg-[color:rgba(34,81,60,0.15)] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-text-muted">Informations produit</p>
              <div className="space-y-3">
                <Input
                  label="Nom du produit"
                  variant="bordered"
                  isInvalid={!!errors.nom}
                  errorMessage={errors.nom?.message}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("nom")}
                />

                {catLoading ? (
                  <div className="flex h-10 items-center gap-2">
                    <Spinner size="sm" color="success" />
                    <span className="text-xs text-text-muted">Chargement des catégories…</span>
                  </div>
                ) : (
                  <Select
                    label="Catégorie"
                    variant="bordered"
                    isInvalid={!!errors.categorieId}
                    errorMessage={errors.categorieId?.message}
                    classNames={{ label: "text-text-muted text-xs", value: "text-text" }}
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0];
                      if (val) setValue("categorieId", String(val), { shouldValidate: true });
                    }}
                  >
                    {categoryGroups.map((group) => (
                      <SelectSection key={group.label} title={group.label} classNames={{ heading: "text-[10px] text-text-dim uppercase tracking-wider" }}>
                        {group.items.map((cat) => (
                          <SelectItem key={cat.id}>{cat.nom}</SelectItem>
                        ))}
                      </SelectSection>
                    ))}
                  </Select>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Prix de vente (FCFA)"
                    variant="bordered"
                    inputMode="decimal"
                    isInvalid={!!errors.prixVente}
                    errorMessage={errors.prixVente?.message}
                    classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                    {...register("prixVente")}
                  />
                  <Input
                    label="Prix d'achat (FCFA)"
                    variant="bordered"
                    inputMode="decimal"
                    isInvalid={!!errors.prixAchat}
                    errorMessage={errors.prixAchat?.message}
                    classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                    {...register("prixAchat")}
                  />
                </div>

                {/* Image */}
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Input
                      label="URL de l'image (optionnel)"
                      variant="bordered"
                      placeholder="https://…"
                      isInvalid={!!errors.imageUrl}
                      errorMessage={errors.imageUrl?.message}
                      classNames={{ label: "text-text-muted text-xs", input: "text-text text-xs" }}
                      {...register("imageUrl")}
                    />
                  </div>
                  <div className="mt-1 h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-[var(--color-surface-high)]">
                    {watchedImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={watchedImageUrl}
                        alt="Aperçu"
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block"; }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-dim">
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Variante */}
            <div className="rounded-xl border border-border/60 bg-[color:rgba(34,81,60,0.15)] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-text-muted">Variante</p>
              <div className="space-y-3">
                {/* Taille */}
                {isChaussure || tailleOptions === null ? (
                  <Input
                    label="Pointure"
                    variant="bordered"
                    inputMode="numeric"
                    placeholder="Ex : 42"
                    isInvalid={!!errors.taille}
                    errorMessage={errors.taille?.message}
                    classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                    {...register("taille")}
                  />
                ) : (
                  <Select
                    label="Taille"
                    variant="bordered"
                    isInvalid={!!errors.taille}
                    errorMessage={errors.taille?.message}
                    classNames={{ label: "text-text-muted text-xs", value: "text-text" }}
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0];
                      if (val) setValue("taille", String(val), { shouldValidate: true });
                    }}
                  >
                    {(tailleOptions ?? []).map((t) => (
                      <SelectItem key={t}>{t}</SelectItem>
                    ))}
                  </Select>
                )}

                {/* Couleur / label dynamique */}
                <div>
                  <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-muted">{couleurLabel}</p>
                  {/* Presets cliquables */}
                  {couleurPresets.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {couleurPresets.map((c) => (
                        <Chip
                          key={c}
                          size="sm"
                          variant="flat"
                          className={
                            watchedCouleur === c
                              ? "cursor-pointer bg-accent text-black"
                              : "cursor-pointer bg-[var(--color-surface-high)] text-text"
                          }
                          onClick={() => setValue("couleur", c, { shouldValidate: true })}
                        >
                          {c}
                        </Chip>
                      ))}
                    </div>
                  )}
                  {/* Saisie libre / Autre */}
                  <Input
                    variant="bordered"
                    placeholder={
                      couleurPresets.length > 0
                        ? `Autre ${couleurLabel.toLowerCase()}…`
                        : `${couleurLabel}…`
                    }
                    isInvalid={!!errors.couleur}
                    errorMessage={errors.couleur?.message}
                    classNames={{ input: "text-text text-sm" }}
                    {...register("couleur")}
                  />
                </div>

                <Input
                  label="Seuil d'alerte stock (optionnel)"
                  variant="bordered"
                  type="number"
                  min={0}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("seuilAlerte")}
                />
              </div>
            </div>

            {/* Entrée */}
            <div className="rounded-xl border border-in/20 bg-in/8 p-4">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-text-muted">Pour cette entrée</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantité reçue"
                  variant="bordered"
                  inputMode="numeric"
                  isInvalid={!!errors.quantite}
                  errorMessage={errors.quantite?.message}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("quantite")}
                />
                <Input
                  label="Prix unitaire d'achat (FCFA)"
                  variant="bordered"
                  inputMode="decimal"
                  isInvalid={!!errors.prixUnitaire}
                  errorMessage={errors.prixUnitaire?.message}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("prixUnitaire")}
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-border/60 pt-3">
          <Button variant="light" onPress={() => { reset(); onClose(); }}>
            Annuler
          </Button>
          <Button className="bg-in font-semibold text-black" onPress={() => void onSubmit()}>
            Ajouter au bon d&apos;entrée
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
