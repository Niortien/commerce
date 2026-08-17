"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Chip, Input, Select, SelectItem, Skeleton, Slider, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import { createProduitSchema, type CreateProduitInput } from "@/lib/validators/produit.schema";
import {
  DEFAULT_COLORS,
  SLUG_COULEUR_CONFIG,
  getTaillesForSlug,
  groupCategories,
} from "@/lib/categoryConfig";
import { getMotionVariant, panelSlide } from "@/lib/motionVariants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCategoriesList, produitKeys } from "@/features/produits/query/produits-queries";
import { useCreateProduit, useUpdateProduit, useReassignProduitBoutique } from "@/features/produits/mutation/produits-mutations";
import { addVarianteToProduit, adjustVarianteStock, deleteVariante, updateVariante } from "@/features/produits/api/produits-api";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";
import { useAuthStore } from "@/stores/authStore";
import type { Produit } from "@/types";

interface ProduitDetailPanelProps {
  produit?: Produit;
  onClose: () => void;
}

export function ProduitDetailPanel({ produit, onClose }: ProduitDetailPanelProps) {
  const reduced = useReducedMotion();
  const isNew = !produit;

  const qc = useQueryClient();

  /* ── mutations ─────────────────────────────────────────── */
  const createMutation = useCreateProduit();
  const updateMutation = useUpdateProduit(produit?.id ?? "");
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";
  const defaultBoutiqueId = useBoutiqueId();
  const { data: boutiquesRes } = useBoutiques(isAdmin);
  const boutiques = useMemo(() => boutiquesRes?.data ?? [], [boutiquesRes]);
  const boutiquesActives = useMemo(() => boutiques.filter((b) => b.isActive !== false), [boutiques]);
  const [selectedBoutiqueIds, setSelectedBoutiqueIds] = useState<string[]>(
    defaultBoutiqueId ? [defaultBoutiqueId] : []
  );
  const isPending = createMutation.isPending || updateMutation.isPending;

  /* ── réattribution boutique (correction d'erreur de saisie) ─ */
  const reassignMutation = useReassignProduitBoutique(produit?.id ?? "");
  const [reassignBoutiqueId, setReassignBoutiqueId] = useState<string>("");
  const [varianteBoutiquePending, setVarianteBoutiquePending] = useState<string | null>(null);

  const produitBoutiqueIds = useMemo(
    () => [...new Set((produit?.variantes ?? []).map((v) => v.boutiqueId ?? "GLOBAL"))],
    [produit?.variantes]
  );

  const reassignBoutiqueItems = useMemo(
    () => [
      { key: "__global__", label: "Catalogue global (aucune)" },
      ...boutiquesActives.map((b) => ({ key: b.id, label: b.nom + (b.ville ? ` · ${b.ville}` : "") })),
    ],
    [boutiquesActives]
  );

  const varianteBoutiqueItems = useMemo(
    () => [
      { key: "__global__", label: "Catalogue global" },
      ...boutiques.map((b) => ({ key: b.id, label: b.nom })),
    ],
    [boutiques]
  );

  const handleReassignBoutique = async () => {
    if (!produit) return;
    const cible = reassignBoutiqueId || null;
    try {
      const { data } = await reassignMutation.mutateAsync(cible);
      if (data.conflicts.length > 0) {
        toast(
          `${data.movedCount} variante(s) déplacée(s), ${data.conflicts.length} en conflit (taille/couleur déjà présente dans la boutique cible)`,
          { icon: "⚠️" }
        );
      } else if (data.movedCount === 0) {
        toast("Aucune variante à déplacer");
      } else {
        toast.success(`${data.movedCount} variante(s) réattribuée(s)`);
      }
    } catch {
      // toast d'erreur géré par onError de la mutation
    }
  };

  const handleVarianteBoutiqueChange = async (varianteId: string, boutiqueId: string | null) => {
    setVarianteBoutiquePending(varianteId);
    try {
      await updateVariante(varianteId, { boutiqueId });
      await qc.invalidateQueries({ queryKey: produitKeys.all });
      toast.success("Boutique de la variante mise à jour");
    } catch (err) {
      toast.error((err as AppError)?.message ?? "Conflit : cette taille/couleur existe déjà dans cette boutique");
    } finally {
      setVarianteBoutiquePending(null);
    }
  };

  /* ── catégories ─────────────────────────────────────────── */
  const { data: categoriesData, isLoading: catsLoading } = useCategoriesList();
  const categories = categoriesData?.data ?? [];
  const categoryGroups = useMemo(() => groupCategories(categories), [categories]);

  /* ── RHF ───────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProduitInput>({
    resolver: zodResolver(createProduitSchema),
    defaultValues: {
      nom: produit?.nom ?? "",
      sku: produit?.sku ?? "",
      description: produit?.description ?? "",
      prixVente: produit?.prixVente ?? "",
      prixAchat: produit?.prixAchat ?? "",
      imageUrl: produit?.imageUrl ?? "",
      categorieId: produit?.categorieId ?? "",
    },
  });

  const selectedCategorieId = watch("categorieId");

  /* ── logique catégorie → tailles / couleurs ────────────── */
  const selectedCat = categories.find((c) => c.id === selectedCategorieId);
  const taillePresets = getTaillesForSlug(selectedCat?.slug);     // null = chaussures
  const couleurConfig = selectedCat ? (SLUG_COULEUR_CONFIG[selectedCat.slug] ?? null) : null;
  const couleurLabel = couleurConfig?.label ?? "Couleur";
  // null config = catégorie standard → top 10 couleurs ; config avec presets vides = saisie libre
  const couleurPresets = couleurConfig ? couleurConfig.presets : DEFAULT_COLORS;

  /* ── useEffect édition ──────────────────────────────────── */
  // On n'initialise l'état local QUE quand on ouvre un nouveau produit (id change).
  // Un refetch en arrière-plan ne doit pas écraser les modifications en cours de l'utilisateur.
  const initedProduitIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!produit) return;
    if (produit.id === initedProduitIdRef.current) return;
    initedProduitIdRef.current = produit.id;

    reset({
      nom: produit.nom,
      sku: produit.sku ?? "",
      description: produit.description ?? "",
      prixVente: produit.prixVente,
      prixAchat: produit.prixAchat,
      imageUrl: produit.imageUrl ?? "",
      categorieId: produit.categorieId,
    });
    setPreviewUrl(produit.imageUrl ?? null);
    setSelectedTailles(produit.variantes ? [...new Set(produit.variantes.map((v) => v.taille))] : []);
    setSelectedCouleurs(
      produit.variantes ? [...new Set(produit.variantes.map((v) => v.couleur))] : []
    );
    if (produit.variantes?.[0]) setSeuilAlerte(produit.variantes[0].seuilAlerte);
    const qmap: Record<string, number> = {};
    produit.variantes?.forEach((v) => { qmap[`${v.taille}-${v.couleur}`] = v.quantiteStock; });
    setQuantites(qmap);
  }, [produit, reset]);

  /* ── image upload ───────────────────────────────────────── */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(produit?.imageUrl ?? null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) { height = Math.round(height * MAX / width); width = MAX; }
        else                 { width  = Math.round(width  * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      setPreviewUrl(dataUrl);
      setValue("imageUrl", dataUrl, { shouldValidate: false });
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setValue("imageUrl", "", { shouldValidate: false });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── variantes état ─────────────────────────────────────── */
  const [varianteError, setVarianteError] = useState<string | null>(null);
  const [selectedTailles, setSelectedTailles] = useState<string[]>(
    produit?.variantes ? [...new Set(produit.variantes.map((v) => v.taille))] : []
  );
  const [newTaille, setNewTaille] = useState("");
  const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>(
    produit?.variantes
      ? [...new Set(produit.variantes.map((v) => v.couleur))]
      : []
  );
  const [newColor, setNewColor] = useState("");
  const [seuilAlerte, setSeuilAlerte] = useState<number>(
    produit?.variantes?.[0]?.seuilAlerte ?? 5
  );
  const [quantites, setQuantites] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    produit?.variantes?.forEach((v) => { map[`${v.taille}-${v.couleur}`] = v.quantiteStock; });
    return map;
  });

  /* ── helpers taille ─────────────────────────────────────── */
  const toggleTaille = (t: string) => {
    setVarianteError(null);
    setSelectedTailles((cur) => cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]);
  };

  const addTaille = () => {
    const n = newTaille.trim();
    if (!n || selectedTailles.includes(n)) return;
    setVarianteError(null);
    setSelectedTailles((cur) => [...cur, n]);
    setNewTaille("");
  };

  /* ── helpers couleur ─────────────────────────────────────── */
  const toggleCouleur = (c: string) => {
    setVarianteError(null);
    setSelectedCouleurs((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]);
  };

  const addColor = () => {
    const n = newColor.trim();
    if (!n || selectedCouleurs.includes(n)) return;
    setVarianteError(null);
    setSelectedCouleurs((cur) => [...cur, n]);
    setNewColor("");
  };

  const customColors = selectedCouleurs.filter((c) => !couleurPresets.includes(c));

  /* ── submit ──────────────────────────────────────────────── */
  const setQty = (taille: string, couleur: string, val: number) =>
    setQuantites((cur) => ({ ...cur, [`${taille}-${couleur}`]: Math.max(0, val) }));

  const onSubmit = handleSubmit(async (fields) => {
    if (selectedTailles.length === 0 || selectedCouleurs.length === 0) {
      setVarianteError("Sélectionnez au moins une taille et une couleur");
      return;
    }
    setVarianteError(null);

    const variantes = selectedTailles.flatMap((taille) =>
      selectedCouleurs.map((couleur) => ({
        taille,
        couleur,
        quantiteStock: quantites[`${taille}-${couleur}`] ?? 0,
        seuilAlerte,
      }))
    );

    const prixVente = parseFloat(fields.prixVente).toFixed(2);
    const prixAchat = parseFloat(fields.prixAchat).toFixed(2);

    if (isNew) {
      createMutation.mutate(
        {
          body: {
            nom: fields.nom.trim(),
            sku: fields.sku?.trim() || undefined,
            description: fields.description?.trim() || undefined,
            categorieId: fields.categorieId,
            prixVente,
            prixAchat,
            imageUrl: fields.imageUrl?.trim() || undefined,
            variantes,
          },
          boutiqueIds: user?.role === "ADMIN" ? selectedBoutiqueIds : defaultBoutiqueId ? [defaultBoutiqueId] : undefined,
        },
        {
          onSuccess: () => { toast.success("Produit créé !"); onClose(); },
          onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur lors de la création"),
        }
      );
    } else {
      try {
        await updateMutation.mutateAsync({
          nom: fields.nom.trim(),
          description: fields.description?.trim() || undefined,
          categorieId: fields.categorieId,
          prixVente,
          prixAchat,
          imageUrl: fields.imageUrl?.trim() || undefined,
        });

        // Sync variantes — PATCH en priorité pour préserver l'historique de stock
        const existing = produit.variantes ?? [];

        // Grouper par combo taille||couleur (plusieurs boutiques possibles)
        const existingGroups = new Map<string, typeof existing>();
        for (const v of existing) {
          const key = `${v.taille}||${v.couleur}`;
          if (!existingGroups.has(key)) existingGroups.set(key, []);
          existingGroups.get(key)!.push(v);
        }

        const desiredSet = new Set(
          selectedTailles.flatMap((t) => selectedCouleurs.map((c) => `${t}||${c}`))
        );

        const keysToRemove = [...existingGroups.keys()].filter((k) => !desiredSet.has(k));
        const keysToAdd = [...desiredSet].filter((k) => !existingGroups.has(k));

        const ops: Promise<unknown>[] = [];

        // Repurposer les variantes retirées vers les nouveaux combos via PATCH
        for (let i = 0; i < Math.min(keysToRemove.length, keysToAdd.length); i++) {
          const [newTailleVal, newCouleurVal] = keysToAdd[i].split("||");
          for (const v of existingGroups.get(keysToRemove[i])!) {
            ops.push(updateVariante(v.id, { taille: newTailleVal, couleur: newCouleurVal }));
          }
        }

        // Créer les combos vraiment nouveaux (sans variante existante à repurposer)
        for (let i = keysToRemove.length; i < keysToAdd.length; i++) {
          const [taille, couleur] = keysToAdd[i].split("||");
          ops.push(
            addVarianteToProduit(produit.id, {
              taille,
              couleur,
              quantiteStock: quantites[`${taille}-${couleur}`] ?? 0,
              seuilAlerte,
              boutiqueId: defaultBoutiqueId,
            })
          );
        }

        // Supprimer les variantes restantes non repurposées (best-effort)
        for (let i = keysToAdd.length; i < keysToRemove.length; i++) {
          for (const v of existingGroups.get(keysToRemove[i])!) {
            ops.push(deleteVariante(v.id).catch(() => {}));
          }
        }

        // Ajuster le stock des combos INCHANGÉS si la quantité a été modifiée dans l'UI
        for (const [key, varianteList] of existingGroups.entries()) {
          if (!desiredSet.has(key)) continue;
          const [t, c] = key.split("||");
          const desired = quantites[`${t}-${c}`];
          for (const v of varianteList) {
            if (desired !== undefined && desired !== v.quantiteStock) {
              const delta = desired - v.quantiteStock;
              ops.push(
                adjustVarianteStock(v.id, {
                  variation: delta,
                  motif: "Mise à jour manuelle",
                }).catch(() => {})
              );
            }
          }
        }

        const results = await Promise.allSettled(ops);

        // Re-invalider APRÈS le sync pour que le cache reflète les nouvelles variantes
        await qc.invalidateQueries({ queryKey: produitKeys.all });

        const failed = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
        if (failed.length > 0) {
          const msg = failed[0].reason?.message ?? "Erreur inconnue";
          toast.error(`Produit mis à jour, mais erreur variantes : ${msg}`);
        } else {
          toast.success("Produit mis à jour !");
        }
        onClose();
      } catch {
        // Le toast d'erreur est géré par useUpdateProduit onError
      }
    }
  });

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={getMotionVariant(panelSlide, reduced)}
      className="fixed inset-y-0 right-0 z-[800] flex w-full max-w-[480px] flex-col border-l border-border bg-[linear-gradient(180deg,rgba(34,54,81,0.98),rgba(23,38,58,0.98))]"
    >
      {/* header fixe */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h3 className="font-[var(--font-display)] text-xl">
          {isNew ? "Nouveau produit" : "Éditer produit"}
        </h3>
        <Button isIconOnly variant="light" onPress={onClose} aria-label="Fermer le panel">✕</Button>
      </div>

      {/* corps scrollable */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-6">

        {/* SÉLECTEUR BOUTIQUE (admin uniquement, création uniquement) */}
        {isNew && user?.role === "ADMIN" && (
          <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Boutiques</p>
            <div className="flex flex-col gap-2">
              {boutiques.map((b) => (
                <Checkbox
                  key={b.id}
                  isSelected={selectedBoutiqueIds.includes(b.id)}
                  onValueChange={(checked) => {
                    setSelectedBoutiqueIds((cur) =>
                      checked ? [...cur, b.id] : cur.filter((id) => id !== b.id)
                    );
                  }}
                  classNames={{ label: "text-sm text-text" }}
                >
                  {b.nom}{b.ville ? ` · ${b.ville}` : ""}
                </Checkbox>
              ))}
            </div>
            {selectedBoutiqueIds.length === 0 && (
              <p className="mt-2 text-[11px] text-text-muted/70">
                Sans boutique — catalogue global sans stock attribué
              </p>
            )}
            {selectedBoutiqueIds.length > 1 && (
              <p className="mt-2 text-[11px] text-in/80">
                Les variantes seront dupliquées pour chaque boutique sélectionnée
              </p>
            )}
          </section>
        )}

        {/* RÉATTRIBUTION BOUTIQUE (admin, édition d'un produit existant) */}
        {!isNew && isAdmin && produit && (
          <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
            <p className="mb-1 text-xs uppercase tracking-[0.08em] text-text-muted">Boutique</p>
            <p className="mb-3 text-[11px] text-text-muted/70">
              {produitBoutiqueIds.length === 0
                ? "Aucune variante"
                : produitBoutiqueIds.length > 1
                  ? "Les variantes sont réparties sur plusieurs boutiques (voir détail ci-dessous)"
                  : produitBoutiqueIds[0] === "GLOBAL"
                    ? "Actuellement : catalogue global (aucune boutique)"
                    : `Actuellement : ${boutiques.find((b) => b.id === produitBoutiqueIds[0])?.nom ?? "boutique inconnue"}`}
            </p>
            <div className="flex items-end gap-2">
              <Select
                size="sm"
                label="Réattribuer tout à"
                items={reassignBoutiqueItems}
                selectedKeys={reassignBoutiqueId ? new Set([reassignBoutiqueId]) : new Set(["__global__"])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string | undefined;
                  setReassignBoutiqueId(val === "__global__" ? "" : (val ?? ""));
                }}
                className="flex-1"
                aria-label="Nouvelle boutique"
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>
              <Button
                size="sm"
                variant="flat"
                className="bg-accent text-black"
                isLoading={reassignMutation.isPending}
                onPress={handleReassignBoutique}
              >
                Réattribuer
              </Button>
            </div>

            {/* Détail par variante si réparties sur plusieurs boutiques */}
            {produitBoutiqueIds.length > 1 && (
              <div className="mt-3 space-y-1.5">
                {(produit.variantes ?? []).map((v) => (
                  <div key={v.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-text-muted">{v.taille} · {v.couleur}</span>
                    <Select
                      size="sm"
                      items={varianteBoutiqueItems}
                      selectedKeys={new Set([v.boutiqueId ?? "__global__"])}
                      isDisabled={varianteBoutiquePending === v.id}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] as string | undefined;
                        void handleVarianteBoutiqueChange(v.id, val === "__global__" ? null : (val ?? null));
                      }}
                      className="max-w-[180px]"
                      aria-label={`Boutique de la variante ${v.taille} ${v.couleur}`}
                    >
                      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* IMAGE */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.08em] text-text-muted">Photo</p>
          <div
            role="button"
            tabIndex={0}
            aria-label="Déposer ou sélectionner une image produit"
            className={[
              "relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition",
              isDragging
                ? "border-accent bg-accent/10"
                : "border-border/60 bg-[var(--color-surface-high)] hover:border-accent/60",
            ].join(" ")}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Aperçu" className="h-full w-full object-cover" onError={() => setPreviewUrl(null)} />
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-2xl text-text-muted">📷</span>
                <p className="text-xs text-text-muted">Cliquer ou déposer une image</p>
                <p className="text-[10px] text-text-muted/60">JPG, PNG, WEBP — max 5 MB</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFileChange} />
          {previewUrl && (
            <button type="button" className="mt-2 text-xs text-out hover:underline" onClick={clearImage}>
              Supprimer l&apos;image
            </button>
          )}
        </section>

        {/* IDENTITÉ */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Identité</p>
          <div className="space-y-3">
            <Input
              variant="underlined"
              placeholder="Nom du produit"
              isInvalid={!!errors.nom}
              errorMessage={errors.nom?.message}
              classNames={{ input: "text-xl font-[var(--font-display)]" }}
              {...register("nom")}
            />
            <Input
              variant="underlined"
              placeholder="SKU (auto-généré)"
              isInvalid={!!errors.sku}
              classNames={{ input: "font-[var(--font-mono)] text-sm" }}
              {...register("sku")}
            />
            <Input
              variant="underlined"
              placeholder="Description (optionnel)"
              classNames={{ input: "text-sm text-text-muted" }}
              {...register("description")}
            />
          </div>
        </section>

        {/* CATÉGORIE — groupée */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Catégorie</p>
          {catsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="mb-1.5 h-3 w-20 rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categoryGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-dim">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((cat) => (
                      <Chip
                        key={cat.id}
                        variant="flat"
                        className={
                          selectedCategorieId === cat.id
                            ? "cursor-pointer bg-accent text-black"
                            : "cursor-pointer bg-[var(--color-surface-high)] text-text"
                        }
                        onClick={() => setValue("categorieId", cat.id, { shouldValidate: true })}
                      >
                        {cat.nom}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
              {errors.categorieId && (
                <p className="text-xs text-out">{errors.categorieId.message}</p>
              )}
            </div>
          )}
        </section>

        {/* PRIX */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Prix</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              variant="bordered"
              placeholder="Prix vente"
              endContent={<span className="text-xs text-text-muted">FCFA</span>}
              isInvalid={!!errors.prixVente}
              errorMessage={errors.prixVente?.message}
              {...register("prixVente")}
            />
            <Input
              variant="bordered"
              placeholder="Prix achat"
              endContent={<span className="text-xs text-text-muted">FCFA</span>}
              isInvalid={!!errors.prixAchat}
              errorMessage={errors.prixAchat?.message}
              {...register("prixAchat")}
            />
          </div>
        </section>

        {/* VARIANTES */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">

          {/* ── Tailles ── */}
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Tailles</p>

          {taillePresets === null ? (
            /* Chaussures : chips des tailles ajoutées + input numérique */
            <div className="space-y-2">
              {selectedTailles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTailles.map((t) => (
                    <Chip
                      key={t}
                      variant="flat"
                      className="bg-accent text-black"
                      onClose={() => {
                        setVarianteError(null);
                        setSelectedTailles((cur) => cur.filter((x) => x !== t));
                      }}
                    >
                      {t}
                    </Chip>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  variant="bordered"
                  placeholder="Pointure (ex : 42)"
                  inputMode="numeric"
                  value={newTaille}
                  onValueChange={setNewTaille}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTaille(); } }}
                  size="sm"
                />
                <Button variant="flat" className="shrink-0 bg-accent text-black" onPress={addTaille} size="sm">+</Button>
              </div>
            </div>
          ) : (
            /* Autres catégories : chips cliquables prédéfinies */
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {taillePresets.map((t) => (
                  <Chip
                    key={t}
                    variant="flat"
                    className={
                      selectedTailles.includes(t)
                        ? "cursor-pointer bg-accent text-black"
                        : "cursor-pointer bg-[var(--color-surface-high)] text-text"
                    }
                    onClick={() => toggleTaille(t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
              {/* Taille personnalisée */}
              <div className="flex gap-2 pt-1">
                <Input
                  variant="bordered"
                  placeholder="Taille personnalisée (optionnel)"
                  value={newTaille}
                  onValueChange={setNewTaille}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTaille(); } }}
                  size="sm"
                />
                <Button variant="flat" className="shrink-0 bg-accent/20 text-accent" onPress={addTaille} size="sm">+</Button>
              </div>
              {selectedTailles.filter((t) => !taillePresets.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedTailles
                    .filter((t) => !taillePresets.includes(t))
                    .map((t) => (
                      <Chip
                        key={t}
                        variant="flat"
                        className="bg-accent text-black"
                        onClose={() => {
                          setVarianteError(null);
                          setSelectedTailles((cur) => cur.filter((x) => x !== t));
                        }}
                      >
                        {t}
                      </Chip>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ── Couleurs / label dynamique ── */}
          <p className="mb-2 mt-5 text-xs uppercase tracking-[0.08em] text-text-muted">{couleurLabel}</p>

          {/* Presets cliquables (couleurs ou présentations) */}
          {couleurPresets.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {couleurPresets.map((c) => (
                <Chip
                  key={c}
                  variant="flat"
                  className={
                    selectedCouleurs.includes(c)
                      ? "cursor-pointer bg-accent text-black"
                      : "cursor-pointer bg-[var(--color-surface-high)] text-text"
                  }
                  onClick={() => toggleCouleur(c)}
                >
                  {c}
                </Chip>
              ))}
            </div>
          )}

          {/* Valeurs personnalisées (saisies manuellement) */}
          {customColors.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {customColors.map((c) => (
                <Chip
                  key={c}
                  variant="flat"
                  className="bg-[var(--color-surface-high)] text-text"
                  onClose={() => {
                    setVarianteError(null);
                    setSelectedCouleurs((cur) => cur.filter((x) => x !== c));
                  }}
                >
                  {c}
                </Chip>
              ))}
            </div>
          )}

          {/* Input "Autre" */}
          <div className="flex gap-2">
            <Input
              variant="bordered"
              placeholder={
                couleurPresets.length > 0
                  ? `Autre ${couleurLabel.toLowerCase()}…`
                  : `${couleurLabel}…`
              }
              value={newColor}
              onValueChange={setNewColor}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
              size="sm"
            />
            <Button variant="flat" className="shrink-0 bg-accent text-black" onPress={addColor} size="sm">+</Button>
          </div>

          {varianteError && (
            <p className="mt-2 text-xs text-out">{varianteError}</p>
          )}

          {/* Matrice stock */}
          {selectedTailles.length > 0 && selectedCouleurs.length > 0 && (
            <div className="mt-4 overflow-auto">
              <p className="mb-2 text-xs uppercase tracking-[0.08em] text-text-muted">Quantités</p>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 pr-3 text-left font-normal text-text-muted">Taille</th>
                    {selectedCouleurs.map((c) => (
                      <th key={c} className="pb-2 pr-2 text-left font-normal text-text-muted">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedTailles.map((t) => (
                    <tr key={t}>
                      <td className="py-1 pr-3 font-[var(--font-mono)] text-accent">{t}</td>
                      {selectedCouleurs.map((c) => (
                        <td key={c} className="py-1 pr-2">
                          <Input
                            type="number"
                            variant="bordered"
                            size="sm"
                            classNames={{ input: "text-center font-[var(--font-mono)]", base: "max-w-[72px]" }}
                            value={String(quantites[`${t}-${c}`] ?? 0)}
                            onChange={(e) => setQty(t, c, Number(e.target.value))}
                            aria-label={`Quantité ${t} ${c}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SEUIL ALERTE */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Seuil alerte</p>
          <Slider
            aria-label="Seuil d'alerte stock"
            size="sm"
            step={1}
            minValue={0}
            maxValue={50}
            color="danger"
            value={seuilAlerte}
            onChange={(v) => setSeuilAlerte(Array.isArray(v) ? v[0] : v)}
            showTooltip
          />
          <p className="mt-2 text-xs text-text-muted">
            Alerte déclenchée à <span className="font-semibold text-out">{seuilAlerte}</span> unités
          </p>
        </section>
      </div>

      {/* footer fixe */}
      <div className="border-t border-border/60 p-4 pb-6">
        <Button
          className="w-full bg-accent font-semibold text-black"
          size="lg"
          onPress={() => void onSubmit()}
          isDisabled={isPending}
        >
          {isPending ? <Spinner size="sm" color="current" /> : isNew ? "Créer le produit" : "Enregistrer"}
        </Button>
      </div>
    </motion.aside>
  );
}
