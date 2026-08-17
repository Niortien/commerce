"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Spinner } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { getMotionVariant, panelSlide } from "@/lib/motionVariants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCreateEntree } from "@/features/entrees/mutation/entrees-mutations";
import { VariantePicker, type VarianteSelection } from "@/components/common/VariantePicker";
import { EntreeFormLine, type EntreeFormLineData } from "./EntreeFormLine";
import { NewProduitModal } from "./NewProduitModal";
import type { AppError } from "@/types";

const headerSchema = z.object({
  fournisseur: z.string().min(1, "Fournisseur requis"),
  notes: z.string().optional(),
});
type HeaderFields = z.infer<typeof headerSchema>;

type AddMode = "idle" | "choosing" | "picker" | "new";

interface EntreeCreatePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EntreeCreatePanel({ isOpen, onClose }: EntreeCreatePanelProps) {
  const reduced = useReducedMotion();
  const createMutation = useCreateEntree();

  const [lines, setLines] = useState<EntreeFormLineData[]>([]);
  const [addMode, setAddMode] = useState<AddMode>("idle");
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [dateOperation, setDateOperation] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeaderFields>({ resolver: zodResolver(headerSchema) });

  const totalCout = lines
    .reduce((sum, l) => sum + l.quantite * parseFloat(l.prixUnitaire || "0"), 0)
    .toFixed(0);

  const addExistingLine = (sel: VarianteSelection) => {
    const newLine: EntreeFormLineData = {
      varianteId: sel.varianteId,
      produitNom: sel.produitNom,
      taille: sel.taille,
      couleur: sel.couleur,
      quantite: 1,
      prixUnitaire: sel.prixAchat,
    };
    if (replacingIndex !== null) {
      setLines((cur) => cur.map((l, i) => (i === replacingIndex ? newLine : l)));
      setReplacingIndex(null);
      setAddMode("idle");
    } else {
      // Mode batch : on reste dans le picker jusqu'au clic "Terminer"
      setLines((cur) => [...cur, newLine]);
    }
  };

  const addNewLine = (line: EntreeFormLineData) => {
    if (replacingIndex !== null) {
      setLines((cur) => cur.map((l, i) => (i === replacingIndex ? line : l)));
      setReplacingIndex(null);
      setAddMode("idle");
    } else {
      setLines((cur) => [...cur, line]);
      setAddMode("choosing");
    }
  };

  const openReplaceExisting = (index: number) => {
    setReplacingIndex(index);
    setAddMode("picker");
  };

  const openEditNew = (index: number) => {
    setReplacingIndex(index);
    setAddMode("new");
  };

  const handleChange = (index: number, field: "quantite" | "prixUnitaire", value: string | number) => {
    setLines((cur) =>
      cur.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const handleRemove = (index: number) => {
    setLines((cur) => cur.filter((_, i) => i !== index));
  };

  const closeAddFlow = () => {
    setAddMode("idle");
    setReplacingIndex(null);
  };

  const onSubmit = handleSubmit((fields) => {
    if (lines.length === 0) {
      toast.error("Ajoute au moins un produit.");
      return;
    }
    createMutation.mutate(
      {
        fournisseur: fields.fournisseur.trim(),
        notes: fields.notes?.trim() || undefined,
        dateOperation: dateOperation || undefined,
        lignes: lines.map((l) => ({
          varianteId: l.varianteId,
          newProduit: l.newProduit,
          quantite: l.quantite,
          prixUnitaire: parseFloat(l.prixUnitaire).toFixed(2),
        })),
      },
      {
        onSuccess: () => {
          toast.success("Entrée enregistrée !");
          reset();
          setLines([]);
          setDateOperation("");
          onClose();
        },
        onError: (err) =>
          toast.error((err as unknown as AppError).message ?? "Erreur lors de la création"),
      }
    );
  });

  if (!isOpen) return null;

  const existingVarianteIds = lines
    .filter((l) => l.varianteId && !l.isNew)
    .map((l) => l.varianteId as string);

  return (
    <>
      {/* Picker produit existant */}
      <VariantePicker
        isOpen={addMode === "picker"}
        onClose={closeAddFlow}
        onSelect={addExistingLine}
        onDone={replacingIndex === null ? closeAddFlow : undefined}
        excludedVarianteIds={replacingIndex !== null ? [] : existingVarianteIds}
      />

      {/* Modal nouveau produit */}
      <NewProduitModal
        isOpen={addMode === "new"}
        defaultValues={
          replacingIndex !== null && lines[replacingIndex]?.isNew
            ? {
                nom: lines[replacingIndex].produitNom,
                taille: lines[replacingIndex].taille,
                couleur: lines[replacingIndex].couleur,
                quantite: lines[replacingIndex].quantite,
                prixUnitaire: lines[replacingIndex].prixUnitaire,
                prixVente: lines[replacingIndex].newProduit?.prixVente,
                prixAchat: lines[replacingIndex].newProduit?.prixAchat,
                categorieId: lines[replacingIndex].newProduit?.categorieId,
                seuilAlerte: lines[replacingIndex].newProduit?.seuilAlerte,
              }
            : undefined
        }
        onClose={closeAddFlow}
        onAdd={addNewLine}
      />

      {/* Overlay panneau */}
      <div
        className="fixed inset-0 z-[700] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.aside
        initial="hidden"
        animate="visible"
        variants={getMotionVariant(panelSlide, reduced)}
        className="fixed inset-y-0 right-0 z-[800] flex w-full max-w-[520px] flex-col border-l border-border bg-[linear-gradient(180deg,rgba(34,81,60,0.95),rgba(23,38,58,0.98))]"
        role="dialog"
        aria-modal="true"
        aria-label="Nouvelle entrée"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h3 className="font-[var(--font-display)] text-xl text-in">Nouvelle entrée</h3>
          <Button isIconOnly variant="light" onPress={onClose} aria-label="Fermer">✕</Button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-6">
          {/* Fournisseur */}
          <section className="rounded-lg border border-border/80 bg-[color:rgba(34,81,60,0.25)] p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Fournisseur</p>
            <div className="space-y-3">
              <Input
                variant="underlined"
                placeholder="Nom du fournisseur"
                isInvalid={!!errors.fournisseur}
                errorMessage={errors.fournisseur?.message}
                classNames={{ input: "text-lg" }}
                {...register("fournisseur")}
              />
              <Input
                variant="underlined"
                placeholder="Notes (optionnel)"
                classNames={{ input: "text-sm text-text-muted" }}
                {...register("notes")}
              />
              <Input
                type="date"
                variant="underlined"
                label="Date de l'opération (si différente d'aujourd'hui)"
                value={dateOperation}
                onValueChange={setDateOperation}
                max={new Date().toISOString().split("T")[0]}
                classNames={{ input: "text-sm", label: "text-xs text-text-dim" }}
              />
            </div>
          </section>

          {/* Lignes */}
          <section className="rounded-lg border border-border/80 bg-[color:rgba(34,81,60,0.25)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-text-muted">Produits reçus</p>
              {lines.length > 0 && (
                <span className="font-[var(--font-mono)] text-xs text-in">
                  Total : {Number(totalCout).toLocaleString("fr-FR")} FCFA
                </span>
              )}
            </div>

            {/* En-têtes colonnes */}
            {lines.length > 0 && (
              <div className="mb-1 grid grid-cols-[1fr_70px_90px_32px] gap-1.5 px-3 sm:grid-cols-[1fr_80px_100px_80px_32px] sm:gap-2">
                <span className="text-[10px] text-text-muted">Produit</span>
                <span className="text-[10px] text-text-muted">Qté</span>
                <span className="text-[10px] text-text-muted">Prix unit.</span>
                <span className="hidden text-right text-[10px] text-text-muted sm:block">S/Total</span>
              </div>
            )}

            <div className="space-y-2">
              {lines.map((line, i) => (
                <EntreeFormLine
                  key={`${line.varianteId ?? "new"}-${i}`}
                  line={line}
                  index={i}
                  onPickVariante={() => openReplaceExisting(i)}
                  onEditNew={() => openEditNew(i)}
                  onChange={handleChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Choix d'ajout */}
            <AnimatePresence>
              {addMode === "choosing" ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-3 overflow-hidden rounded-xl border border-in/30 bg-[color:rgba(34,81,60,0.35)] p-3"
                >
                  <p className="mb-2.5 text-center text-xs text-text-muted">Ce produit existe-t-il déjà dans le stock ?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setReplacingIndex(null); setAddMode("picker"); }}
                      className="flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-surface/60 px-3 py-3 text-left transition-colors hover:border-in/40 hover:bg-in/10"
                    >
                      <span className="text-xl">📦</span>
                      <span className="text-xs font-semibold text-text">Produit existant</span>
                      <span className="text-[10px] text-text-dim">Déjà dans le stock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setReplacingIndex(null); setAddMode("new"); }}
                      className="flex flex-col items-center gap-1.5 rounded-lg border border-in/30 bg-in/10 px-3 py-3 text-left transition-colors hover:border-in/60 hover:bg-in/20"
                    >
                      <span className="text-xl">✨</span>
                      <span className="text-xs font-semibold text-in">Nouveau produit</span>
                      <span className="text-[10px] text-text-dim">Créer et enregistrer</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={closeAddFlow}
                    className="mt-2 w-full text-center text-[11px] text-text-dim hover:text-text-muted"
                  >
                    Annuler
                  </button>
                </motion.div>
              ) : (
                <Button
                  variant="flat"
                  className="mt-3 w-full border border-dashed border-in/40 bg-[color:rgba(57,211,83,0.08)] text-in"
                  onPress={() => setAddMode("choosing")}
                >
                  + Ajouter un produit
                </Button>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 p-4 pb-6">
          <Button
            className="w-full bg-in font-semibold text-black"
            size="lg"
            onPress={() => void onSubmit()}
            isDisabled={createMutation.isPending || lines.length === 0}
          >
            {createMutation.isPending ? <Spinner size="sm" color="current" /> : "Enregistrer l'entrée"}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
