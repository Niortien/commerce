"use client";

import { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBalle, useUpdateBalle } from "@/features/balles/mutation/balles-mutations";
import { CHOIX, aujourdhuiIso, libelleChoix, nomBalle } from "@/lib/balles";
import { formatCurrency } from "@/lib/formatCurrency";
import { balleSchema, type BalleInput } from "@/lib/validators/balle.schema";
import type { Balle } from "@/types";

interface BalleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Absente : nouvelle balle. Présente : correction (contenu, fournisseur, coût). */
  balle?: Balle;
  onSaved?: (balle: Balle) => void;
}

/** "3000.00" → "3000" pour un champ ; vide si absent. */
const champMontant = (montant: string | null | undefined): string =>
  montant && Number(montant) > 0 ? String(Math.round(Number(montant))) : "";

const valeursDe = (balle?: Balle): BalleInput => ({
  libelle: balle?.libelle ?? "",
  fournisseur: balle?.fournisseur ?? "",
  coutAchat: balle ? String(Math.round(Number(balle.coutAchat))) : "",
  frais: balle && Number(balle.frais) > 0 ? String(Math.round(Number(balle.frais))) : "",
  dateAchat: balle?.dateAchat ?? aujourdhuiIso(),
  notes: balle?.notes ?? "",
  prixChoix1: champMontant(balle?.prixChoix1),
  prixChoix2: champMontant(balle?.prixChoix2),
  prixChoix3: champMontant(balle?.prixChoix3),
});

const enNombre = (v: string | undefined): number | null => (v ? Number(v) : null);

/** Une balle achetée : ce qu'elle contient, ce qu'elle a coûté. Les pièces viennent ensuite, au déballage. */
export function BalleFormModal({ isOpen, onClose, balle, onSaved }: BalleFormModalProps) {
  const creer = useCreateBalle();
  const modifier = useUpdateBalle(balle?.id ?? "");
  const enCours = creer.isPending || modifier.isPending;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<BalleInput>({
    resolver: zodResolver(balleSchema),
    defaultValues: valeursDe(balle),
  });

  useEffect(() => {
    if (isOpen) reset(valeursDe(balle));
  }, [isOpen, balle, reset]);

  const total = Number(watch("coutAchat") || 0) + Number(watch("frais") || 0);

  const onSubmit = handleSubmit(async (values) => {
    const body = {
      libelle: values.libelle,
      fournisseur: values.fournisseur || undefined,
      coutAchat: Number(values.coutAchat),
      frais: values.frais ? Number(values.frais) : 0,
      dateAchat: values.dateAchat,
      notes: values.notes || undefined,
      prixChoix1: enNombre(values.prixChoix1),
      prixChoix2: enNombre(values.prixChoix2),
      prixChoix3: enNombre(values.prixChoix3),
    };
    const res = balle ? await modifier.mutateAsync(body) : await creer.mutateAsync(body);
    onSaved?.(res.data);
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <form onSubmit={onSubmit} noValidate>
          <ModalHeader>{balle ? `Modifier la ${nomBalle(balle).toLowerCase()}` : "Nouvelle balle"}</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Contenu de la balle"
              placeholder="Ex. Jeans femme 45 kg"
              variant="bordered"
              isInvalid={Boolean(errors.libelle)}
              errorMessage={errors.libelle?.message}
              {...register("libelle")}
            />
            <Input label="Fournisseur" placeholder="Facultatif" variant="bordered" {...register("fournisseur")} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Prix de la balle"
                inputMode="numeric"
                variant="bordered"
                endContent={<span className="text-xs text-text-muted">FCFA</span>}
                isInvalid={Boolean(errors.coutAchat)}
                errorMessage={errors.coutAchat?.message}
                {...register("coutAchat")}
              />
              <Input
                label="Frais"
                description="Transport, dédouanement…"
                inputMode="numeric"
                variant="bordered"
                endContent={<span className="text-xs text-text-muted">FCFA</span>}
                isInvalid={Boolean(errors.frais)}
                errorMessage={errors.frais?.message}
                {...register("frais")}
              />
            </div>
            <Input
              type="date"
              label="Achetée le"
              variant="bordered"
              isInvalid={Boolean(errors.dateAchat)}
              errorMessage={errors.dateAchat?.message}
              {...register("dateAchat")}
            />
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium text-text">Prix conseillés par choix</legend>
              <p className="-mt-1 text-xs text-text-muted">
                Facultatif. Au déballage, choisir la qualité d&apos;une pièce remplira son prix.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CHOIX.map((c) => {
                  const champ = `prixChoix${c}` as const;
                  return (
                    <Input
                      key={c}
                      label={libelleChoix(c) ?? ""}
                      inputMode="numeric"
                      variant="bordered"
                      size="sm"
                      isInvalid={Boolean(errors[champ])}
                      errorMessage={errors[champ]?.message}
                      {...register(champ)}
                    />
                  );
                })}
              </div>
            </fieldset>
            <Textarea label="Remarques" variant="bordered" minRows={2} {...register("notes")} />

            <p className="flex items-baseline justify-between rounded-lg bg-surface-high px-4 py-3 text-sm">
              <span className="text-text-muted">Coût total à rembourser</span>
              <span className="tabular text-[15px] font-semibold text-text">{formatCurrency(total)}</span>
            </p>
            {balle && balle.nbPieces > 0 && (
              <p className="text-xs text-text-muted">Le coût de chacune des {balle.nbPieces} pièces sera recalculé.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" className="min-h-11" onPress={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="min-h-11 bg-accent font-semibold text-white" isLoading={enCours}>
              {balle ? "Enregistrer" : "Enregistrer la balle"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
