"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import { IconCategory2, IconLayoutGrid, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CountUp } from "@/components/common/CountUp";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { RowActionButton } from "@/components/common/RowActionButton";
import { StatTile } from "@/components/common/StatTile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionEasing } from "@/lib/motionVariants";
import { CATEGORY_GROUPS } from "@/lib/categoryConfig";
import { useAdminCategories } from "@/features/categories/query/categories-queries";
import {
  useCreateCategorie,
  useDeleteCategorie,
  useUpdateCategorie,
} from "@/features/categories/mutation/categories-mutations";
import { useAuthStore } from "@/stores/authStore";
import type { Categorie } from "@/types";

const GROUPES = CATEGORY_GROUPS.map((g) => g.label);

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const schema = z.object({
  nom:         z.string().min(1, "Requis"),
  slug:        z.string().min(1, "Requis").regex(/^[a-z0-9-]+$/, "Minuscules, chiffres et tirets uniquement"),
  description: z.string().min(1, "Requis"),
});
type FormData = z.infer<typeof schema>;

export function CategoriesView() {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const { data: res, isLoading } = useAdminCategories();
  const categories = res?.data ?? [];

  const createMutation = useCreateCategorie();
  const updateMutation = useUpdateCategorie();
  const deleteMutation = useDeleteCategorie();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Categorie | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Categorie | null>(null);
  const reduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const nomValue = watch("nom");

  useEffect(() => {
    if (!editing) {
      setValue("slug", slugify(nomValue ?? ""));
    }
  }, [nomValue, editing, setValue]);

  function openCreate() {
    setEditing(null);
    reset({ nom: "", slug: "", description: GROUPES[0] });
    onOpen();
  }

  function openEdit(c: Categorie) {
    setEditing(c);
    reset({ nom: c.nom, slug: c.slug, description: c.description ?? GROUPES[0] });
    onOpen();
  }

  const onSubmit = handleSubmit(async (data) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, body: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  });

  // Grouper par description pour l'affichage
  const grouped = GROUPES.map((label) => ({
    label,
    items: categories.filter((c) => c.description === label),
  })).filter((g) => g.items.length > 0);
  const autres = categories.filter((c) => !GROUPES.includes(c.description ?? ""));
  if (autres.length > 0) grouped.push({ label: "Autres", items: autres });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <PageWrapper>
      <PageHero
        tone="cash"
        icon={IconCategory2}
        eyebrow="Catalogue"
        title="Catégories"
        description={
          isAdmin
            ? "Organisez vos produits par groupe."
            : "Consultation seule — la modification est réservée à l'administrateur."
        }
        actions={
          isAdmin && (
            <Button
              className="min-h-11 bg-cash font-semibold text-white"
              startContent={<IconPlus size={18} aria-hidden />}
              onPress={openCreate}
            >
              Nouvelle catégorie
            </Button>
          )
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile tone="cash" icon={IconCategory2} label="Catégories" value={isLoading ? "—" : <CountUp value={categories.length} />} />
          <StatTile tone="accent" icon={IconLayoutGrid} label="Groupes" value={isLoading ? "—" : <CountUp value={grouped.length} />} delay={0.05} />
        </div>
      </PageHero>

      {isLoading && (
        <div role="status" aria-label="Chargement des catégories" className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && grouped.length === 0 && (
        <EmptyRiver
          message="Aucune catégorie"
          hint={isAdmin ? "Créez une première catégorie pour classer vos produits." : "L'administrateur n'en a pas encore créé."}
          action={
            isAdmin && (
              <Button size="sm" className="bg-cash font-semibold text-white" onPress={openCreate}>
                Créer une catégorie
              </Button>
            )
          }
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {grouped.map(({ label, items }, gi) => (
          <motion.section
            key={label}
            aria-label={`Catégories ${label}`}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: motionEasing.outExpo, delay: gi * 0.05 }}
            className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
          >
            <header className="flex items-center justify-between gap-2 border-b border-border bg-surface-high px-4 py-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</h2>
              <span className="rounded-full bg-cash-dim px-2 py-0.5 font-mono text-xs font-semibold text-cash-text">{items.length}</span>
            </header>
            <ul className="divide-y divide-border">
              {items.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-surface-high">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{c.nom}</p>
                    <code className="font-mono text-xs text-text-muted">{c.slug}</code>
                  </div>
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
        ))}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && !deleteMutation.isPending) {
            deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
          }
        }}
        title="Supprimer la catégorie"
        message={`Supprimer « ${deleteTarget?.nom ?? ""} » ? Les produits qui l'utilisent devront être reclassés.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        danger
      />

      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader>
            {editing ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Input
                label="Nom"
                variant="bordered"
                isInvalid={!!errors.nom}
                errorMessage={errors.nom?.message}
                {...register("nom")}
              />
              <Input
                label="Slug"
                variant="bordered"
                placeholder="ex: tee-shirt"
                description="Généré automatiquement, modifiable"
                isInvalid={!!errors.slug}
                errorMessage={errors.slug?.message}
                {...register("slug")}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Groupe"
                    variant="bordered"
                    selectedKeys={field.value ? new Set([field.value]) : new Set()}
                    onSelectionChange={(keys) => field.onChange([...keys][0])}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                  >
                    {GROUPES.map((g) => (
                      <SelectItem key={g}>{g}</SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button
              className="bg-cash font-semibold text-white"
              isLoading={isPending}
              onPress={() => void onSubmit()}
            >
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
