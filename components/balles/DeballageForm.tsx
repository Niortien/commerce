"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { IconHanger } from "@tabler/icons-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminCategories } from "@/features/categories/query/categories-queries";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { useAjouterPieces } from "@/features/balles/mutation/balles-mutations";
import { CHOIX, isChoix, libelleChoix, prixConseille } from "@/lib/balles";
import { pieceSchema, type PieceInput } from "@/lib/validators/balle.schema";
import type { Balle } from "@/types";
import { PrixRapides } from "./PrixRapides";

interface DeballageFormProps {
  balle: Pick<Balle, "id" | "numero" | "nbPieces" | "prixChoix1" | "prixChoix2" | "prixChoix3">;
}

/** « 0 » = pièce non triée, sinon le numéro du choix. */
const OPTIONS_CHOIX = [
  { key: "0", label: "Non triée" },
  ...CHOIX.map((c) => ({ key: String(c), label: libelleChoix(c) ?? "" })),
];

/**
 * Saisie au déballage, pensée pour enchaîner : qualité, nom, rayon, prix (un appui sur un prix rond), Entrée.
 * La qualité et le rayon restent choisis d'une pièce à l'autre ; une qualité avec un prix conseillé remplit le prix.
 * Le curseur revient sur le nom. Chaque pièce entre en rayon tout de suite.
 */
export function DeballageForm({ balle }: DeballageFormProps) {
  const { data: categoriesRes } = useAdminCategories();
  const categories = categoriesRes?.data ?? [];
  const ajouter = useAjouterPieces(balle.id);
  const nomRef = useRef<HTMLInputElement | null>(null);
  const [annonce, setAnnonce] = useState("");
  const [choix, setChoix] = useState("0");

  // Champs contrôlés : un Input HeroUI branché par `register` ne se vide pas au `reset`.
  const { control, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm<PieceInput>({
    resolver: zodResolver(pieceSchema),
    defaultValues: { nom: "", categorieId: "", prixVente: "" },
  });
  const prixSaisi = useWatch({ control, name: "prixVente" });

  useEffect(() => {
    nomRef.current?.focus();
  }, []);

  const prochain = balle.nbPieces + 1;
  const choixNum = Number(choix);
  const prixDuChoix = isChoix(choixNum) ? prixConseille(balle, choixNum) : null;

  const changerChoix = (cle: string) => {
    setChoix(cle);
    const n = Number(cle);
    const prix = isChoix(n) ? prixConseille(balle, n) : null;
    if (prix !== null) setValue("prixVente", String(prix));
  };

  const onSubmit = handleSubmit(async (values) => {
    const res = await ajouter.mutateAsync([
      {
        nom: values.nom,
        categorieId: values.categorieId,
        prixVente: Number(values.prixVente),
        choix: isChoix(choixNum) ? choixNum : null,
      },
    ]);
    const piece = res.data[0];
    setAnnonce(`${values.nom} mise en rayon${piece ? `, code ${piece.sku}` : ""}.`);
    // La pièce suivante est souvent de la même qualité : on repropose son prix conseillé.
    reset({ nom: "", prixVente: prixDuChoix !== null ? String(prixDuChoix) : "", categorieId: getValues("categorieId") });
    nomRef.current?.focus();
  });

  return (
    <section aria-labelledby="deballage-titre" className="rounded-xl border border-border bg-surface p-4 md:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="deballage-titre" className="font-semibold text-text">
          Déballer
        </h2>
        <span className="tabular text-xs text-text-muted">
          Prochaine pièce : B{balle.numero}-{String(prochain).padStart(3, "0")}
        </span>
      </div>

      <div className="mb-3">
        <SegmentedControl ariaLabel="Qualité de la pièce" options={OPTIONS_CHOIX} value={choix} onChange={changerChoix} />
        {prixDuChoix !== null && (
          <p className="mt-1.5 text-xs text-text-muted">
            Prix conseillé pour le {libelleChoix(choixNum)} : {prixDuChoix.toLocaleString("fr-FR")} FCFA
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr_1fr] sm:items-start">
        <Controller
          name="nom"
          control={control}
          render={({ field }) => (
            <Input
              label="Pièce"
              placeholder="Ex. Veste en jean"
              variant="bordered"
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={Boolean(errors.nom)}
              errorMessage={errors.nom?.message}
              ref={(el: HTMLInputElement | null) => {
                field.ref(el);
                nomRef.current = el;
              }}
            />
          )}
        />
        <Controller
          name="categorieId"
          control={control}
          render={({ field }) => (
            <Select
              label="Rayon"
              variant="bordered"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(String(Array.from(keys)[0] ?? ""))}
              isInvalid={Boolean(errors.categorieId)}
              errorMessage={errors.categorieId?.message ?? (categoriesRes && categories.length === 0 ? "Créez d'abord un rayon" : undefined)}
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
          name="prixVente"
          control={control}
          render={({ field }) => (
            <Input
              label="Prix"
              inputMode="numeric"
              variant="bordered"
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              endContent={<span className="text-xs text-text-muted">FCFA</span>}
              isInvalid={Boolean(errors.prixVente)}
              errorMessage={errors.prixVente?.message}
            />
          )}
        />
        {/* Ordre du clavier = ordre visuel : prix, prix ronds, puis validation. */}
        <PrixRapides
          valeur={prixSaisi}
          onChoisir={(prix) => setValue("prixVente", String(prix), { shouldValidate: Boolean(errors.prixVente) })}
          className="sm:col-span-2"
        />
        <Button
          type="submit"
          className="min-h-14 bg-accent font-semibold text-white"
          startContent={<IconHanger size={18} aria-hidden />}
          isLoading={ajouter.isPending}
        >
          Mettre en rayon
        </Button>
      </form>

      <p className="mt-2 min-h-5 text-xs text-in-text" aria-live="polite">
        {annonce}
      </p>
    </section>
  );
}
