"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { QuantiteInput } from "@/components/common/QuantiteInput";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { VariantePicker, type VarianteSelection } from "@/components/common/VariantePicker";
import { useCreateDevis } from "@/features/devis/mutation/devis-mutations";
import { VALIDITES_JOURS } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatQuantite } from "@/lib/unites";
import { devisSchema, type DevisInput } from "@/lib/validators/devis.schema";
import type { Devis, Unite } from "@/types";

interface LigneSaisie {
  varianteId: string;
  nom: string;
  unite: Unite;
  quantite: number;
  prixUnitaire: string;
  stock: number;
}

interface DevisCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (devis: Devis) => void;
}

const VALIDITE_OPTIONS = VALIDITES_JOURS.map((j) => ({ key: String(j), label: `${j} jours` }));

/** Nouveau devis : un client, des articles au prix proposé, une durée de validité. Le stock ne bouge pas. */
export function DevisCreateModal({ isOpen, onClose, onCreated }: DevisCreateModalProps) {
  const createDevis = useCreateDevis();
  const [lignes, setLignes] = useState<LigneSaisie[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<DevisInput>({
    resolver: zodResolver(devisSchema),
    defaultValues: { validiteJours: 15, remiseMontant: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ validiteJours: 15, remiseMontant: "", clientNom: "", clientTelephone: "", notes: "" });
      setLignes([]);
    }
  }, [isOpen, reset]);

  const total = lignes.reduce((sum, l) => sum + l.quantite * Number(l.prixUnitaire || 0), 0);
  const remise = Number(watch("remiseMontant") || 0);
  const remiseTropGrande = remise > total;

  const ajouter = (sel: VarianteSelection) =>
    setLignes((cur) => [
      ...cur,
      { varianteId: sel.varianteId, nom: sel.produitNom, unite: sel.unite, quantite: 1, prixUnitaire: sel.prixVente, stock: sel.quantiteStock },
    ]);

  const majLigne = (i: number, patch: Partial<LigneSaisie>) =>
    setLignes((cur) => cur.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const onSubmit = handleSubmit(async (values) => {
    if (lignes.length === 0) {
      toast.error("Ajoutez au moins un article au devis");
      return;
    }
    if (remiseTropGrande) return;
    const res = await createDevis.mutateAsync({
      clientNom: values.clientNom,
      clientTelephone: values.clientTelephone || undefined,
      validiteJours: values.validiteJours,
      remiseMontant: values.remiseMontant ? Number(values.remiseMontant).toFixed(2) : undefined,
      notes: values.notes || undefined,
      lignes: lignes.map((l) => ({
        varianteId: l.varianteId,
        quantite: l.quantite,
        prixUnitaire: Number(l.prixUnitaire || 0).toFixed(2),
      })),
    });
    onCreated(res.data);
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Nouveau devis</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Client"
                placeholder="Nom ou entreprise"
                variant="bordered"
                isInvalid={Boolean(errors.clientNom)}
                errorMessage={errors.clientNom?.message}
                {...register("clientNom")}
              />
              <Input label="Téléphone du client" type="tel" variant="bordered" {...register("clientTelephone")} />
            </div>

            <div className="mt-1">
              <p className="mb-2 text-sm font-medium text-text">Valable</p>
              <Controller
                name="validiteJours"
                control={control}
                render={({ field }) => (
                  <SegmentedControl
                    ariaLabel="Durée de validité du devis"
                    options={VALIDITE_OPTIONS}
                    value={VALIDITE_OPTIONS.find((o) => o.key === String(field.value))?.key ?? null}
                    onChange={(k) => field.onChange(Number(k))}
                  />
                )}
              />
            </div>

            <section aria-labelledby="devis-articles" className="mt-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 id="devis-articles" className="text-sm font-medium text-text">
                  Articles
                </h3>
                <Button
                  size="sm"
                  variant="bordered"
                  className="min-h-11 font-medium"
                  startContent={<IconPlus size={16} aria-hidden />}
                  onPress={() => setPickerOpen(true)}
                >
                  Ajouter un article
                </Button>
              </div>

              {lignes.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
                  Ajoutez les articles demandés par le client. Les ruptures se chiffrent aussi : le stock ne bouge qu&apos;à la vente.
                </p>
              ) : (
                <ul className="divide-y divide-border/60 rounded-lg border border-border">
                  {lignes.map((l, i) => (
                    <li key={l.varianteId} className="grid grid-cols-[1fr_auto] gap-2 p-2.5 sm:grid-cols-[1fr_110px_120px_90px_auto] sm:items-center sm:gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text">{l.nom}</p>
                        <p className="text-xs text-text-muted">En stock : {formatQuantite(l.stock, l.unite)}</p>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="min-h-11 min-w-11 text-text-muted hover:text-out-text sm:order-last"
                        aria-label={`Retirer ${l.nom} du devis`}
                        onPress={() => setLignes((cur) => cur.filter((_, j) => j !== i))}
                      >
                        <IconX size={16} aria-hidden />
                      </Button>
                      <QuantiteInput
                        value={l.quantite}
                        unite={l.unite}
                        onChange={(q) => majLigne(i, { quantite: q })}
                        ariaLabel={`Quantité : ${l.nom}`}
                      />
                      <Input
                        size="sm"
                        variant="bordered"
                        inputMode="numeric"
                        value={l.prixUnitaire}
                        onValueChange={(v) => /^\d*\.?\d{0,2}$/.test(v) && majLigne(i, { prixUnitaire: v })}
                        endContent={<span className="text-[10px] text-text-muted">FCFA</span>}
                        aria-label={`Prix unitaire de ${l.nom}`}
                        classNames={{ input: "tabular text-sm" }}
                      />
                      <span className="tabular col-span-2 text-right text-sm font-semibold text-text sm:col-span-1">
                        {formatCurrency(l.quantite * Number(l.prixUnitaire || 0))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Remise"
                variant="bordered"
                inputMode="numeric"
                endContent={<span className="text-xs text-text-muted">FCFA</span>}
                isInvalid={Boolean(errors.remiseMontant) || remiseTropGrande}
                errorMessage={remiseTropGrande ? "La remise dépasse le total" : errors.remiseMontant?.message}
                {...register("remiseMontant")}
              />
              <dl className="flex items-center justify-between rounded-lg bg-surface-high px-4 py-3">
                <dt className="text-sm text-text-muted">Total du devis</dt>
                <dd className="tabular font-display text-xl font-bold text-text">
                  {formatCurrency(Math.max(0, total - remise))}
                </dd>
              </dl>
            </div>
            <Textarea label="Conditions ou remarques" variant="bordered" minRows={2} {...register("notes")} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button className="bg-accent font-semibold text-white" isLoading={createDevis.isPending} onPress={() => void onSubmit()}>
              Créer le devis
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VariantePicker
        usage="devis"
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={ajouter}
        excludedVarianteIds={lignes.map((l) => l.varianteId)}
      />
    </>
  );
}
