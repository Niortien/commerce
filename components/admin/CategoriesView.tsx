"use client";

import { useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { IconCategory2, IconLayoutGrid, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CountUp } from "@/components/common/CountUp";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { RowActionButton } from "@/components/common/RowActionButton";
import { StatTile } from "@/components/common/StatTile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { grouperCategories, groupesUtilises } from "@/lib/categories";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import { motionEasing } from "@/lib/motionVariants";
import { cn } from "@/lib/utils";
import { categorieSchema, type CategorieFormData } from "@/lib/validators/categories.schema";
import { useAdminCategories } from "@/features/categories/query/categories-queries";
import {
  useCreateCategorie,
  useDeleteCategorie,
  useUpdateCategorie,
} from "@/features/categories/mutation/categories-mutations";
import { useAuthStore } from "@/stores/authStore";
import type { Categorie } from "@/types";

/**
 * Catégories de la boutique, rangées dans des groupes qu'elle choisit librement (« Grillades », « Plomberie »…).
 * Les groupes déjà utilisés et ceux suggérés pour le métier se choisissent d'un clic.
 */
export function CategoriesView() {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const profile = COMMERCE_PROFILES[useTypeCommerce()];
  const { data: res, isLoading } = useAdminCategories();
  const categories = res?.data ?? [];

  const createMutation = useCreateCategorie();
  const updateMutation = useUpdateCategorie();
  const deleteMutation = useDeleteCategorie();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Categorie | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Categorie | null>(null);
  const reduced = useReducedMotion();

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<CategorieFormData>({
    resolver: zodResolver(categorieSchema),
    defaultValues: { nom: "", groupe: "" },
  });
  const groupeSaisi = useWatch({ control, name: "groupe" });

  const groupes = grouperCategories(categories, profile.groupesSuggeres);
  const nbGroupes = groupes.filter((g) => g.groupe !== null).length;
  // Raccourcis : les groupes de la boutique d'abord, puis les suggestions du métier pas encore utilisées.
  const utilises = groupesUtilises(categories);
  const raccourcis = [...utilises, ...profile.groupesSuggeres.filter((g) => !utilises.includes(g))];

  function openCreate(groupe = "") {
    setEditing(null);
    reset({ nom: "", groupe });
    onOpen();
  }

  function openEdit(c: Categorie) {
    setEditing(c);
    reset({ nom: c.nom, groupe: c.description ?? "" });
    onOpen();
  }

  const onSubmit = handleSubmit(async ({ nom, groupe }) => {
    const body = { nom, description: groupe || null };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, body });
    } else {
      await createMutation.mutateAsync(body);
    }
    onClose();
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const titre = profile.vocab.categories;
  const nomSingulier = titre === "Catégories" ? "catégorie" : titre === "Rayons" ? "rayon" : "rubrique";

  return (
    <PageWrapper>
      <PageHero
        tone="cash"
        icon={IconCategory2}
        eyebrow="Catalogue"
        title={titre}
        description={
          isAdmin
            ? `Classez vos ${profile.vocab.produits.toLowerCase()} et rangez vos ${titre.toLowerCase()} dans les groupes de votre choix.`
            : "Consultation seule : la modification est réservée à l'administrateur."
        }
        actions={
          isAdmin && (
            <Button
              className="min-h-11 bg-cash font-semibold text-white"
              startContent={<IconPlus size={18} aria-hidden />}
              onPress={() => openCreate()}
            >
              {titre === "Catégories" ? "Nouvelle catégorie" : titre === "Rayons" ? "Nouveau rayon" : "Nouvelle rubrique"}
            </Button>
          )
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile tone="cash" icon={IconCategory2} label={titre} value={isLoading ? "—" : <CountUp value={categories.length} />} />
          <StatTile tone="accent" icon={IconLayoutGrid} label="Groupes" value={isLoading ? "—" : <CountUp value={nbGroupes} />} delay={0.05} />
        </div>
      </PageHero>

      {isLoading && (
        <div role="status" aria-label="Chargement" className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <EmptyRiver
          message={`Aucune ${nomSingulier} pour l'instant`}
          hint={isAdmin ? `Créez-en une pour classer vos ${profile.vocab.produits.toLowerCase()}.` : "L'administrateur n'en a pas encore créé."}
          action={
            isAdmin && (
              <Button size="sm" className="bg-cash font-semibold text-white" onPress={() => openCreate()}>
                Créer une {nomSingulier}
              </Button>
            )
          }
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {groupes.map(({ groupe, items }, gi) => {
          const label = groupe ?? "Sans groupe";
          return (
            <motion.section
              key={label}
              aria-label={`${titre} : ${label}`}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: motionEasing.outExpo, delay: gi * 0.05 }}
              className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
            >
              <header className="flex items-center justify-between gap-2 border-b border-border bg-surface-high px-4 py-2">
                <h2 className={cn("text-sm font-semibold", groupe ? "text-text" : "text-text-muted")}>{label}</h2>
                <div className="flex items-center gap-1.5">
                  <span className="tabular rounded-full bg-cash-dim px-2 py-0.5 text-xs font-semibold text-cash-text">{items.length}</span>
                  {isAdmin && groupe && (
                    <RowActionButton label={`Ajouter dans ${groupe}`} tone="accent" onPress={() => openCreate(groupe)}>
                      <IconPlus size={16} aria-hidden />
                    </RowActionButton>
                  )}
                </div>
              </header>
              <ul className="divide-y divide-border">
                {items.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-surface-high">
                    <p className="min-w-0 truncate text-sm font-medium text-text">{c.nom}</p>
                    {isAdmin && (
                      <div className="flex shrink-0 items-center gap-1.5">
                        <RowActionButton label={`Modifier ${c.nom}`} tone="accent" onPress={() => openEdit(c)}>
                          <IconPencil size={16} aria-hidden />
                        </RowActionButton>
                        <RowActionButton label={`Supprimer ${c.nom}`} tone="out" onPress={() => setDeleteTarget(c)}>
                          <IconTrash size={16} aria-hidden />
                        </RowActionButton>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.section>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && !deleteMutation.isPending) {
            deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
          }
        }}
        title={`Supprimer « ${deleteTarget?.nom ?? ""} »`}
        message="Impossible si des produits y sont encore rangés : déplacez-les d'abord."
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        danger
      />

      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader>{editing ? `Modifier « ${editing.nom} »` : `Nouvelle ${nomSingulier}`}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Input
                autoFocus
                label="Nom"
                variant="bordered"
                isInvalid={!!errors.nom}
                errorMessage={errors.nom?.message}
                {...register("nom")}
              />
              <Input
                label="Groupe (facultatif)"
                variant="bordered"
                placeholder={`Ex. ${profile.groupesSuggeres[0] ?? "Boissons"}`}
                description="Écrivez un nouveau groupe ou choisissez-en un ci-dessous."
                isInvalid={!!errors.groupe}
                errorMessage={errors.groupe?.message}
                {...register("groupe")}
              />
              {raccourcis.length > 0 && (
                <div role="group" aria-label="Groupes proposés" className="flex flex-wrap gap-1.5">
                  {raccourcis.map((g) => {
                    const actif = groupeSaisi?.trim() === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        aria-pressed={actif}
                        onClick={() => setValue("groupe", actif ? "" : g, { shouldValidate: true })}
                        className={cn(
                          "min-h-9 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors duration-150",
                          actif ? "border-cash bg-cash-dim text-cash-text" : "border-border text-text-muted hover:border-text-dim hover:text-text"
                        )}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button className="bg-cash font-semibold text-white" isLoading={isPending} onPress={() => void onSubmit()}>
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
