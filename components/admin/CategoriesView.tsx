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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORY_GROUPS } from "@/lib/categoryConfig";
import { useAdminCategories } from "@/features/categories/query/categories-queries";
import {
  useCreateCategorie,
  useDeleteCategorie,
  useUpdateCategorie,
} from "@/features/categories/mutation/categories-mutations";
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
  const { data: res, isLoading } = useAdminCategories();
  const categories = res?.data ?? [];

  const createMutation = useCreateCategorie();
  const updateMutation = useUpdateCategorie();
  const deleteMutation = useDeleteCategorie();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Categorie | null>(null);

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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Catégories</h1>
        <Button className="bg-accent text-black" onPress={openCreate}>
          + Nouvelle catégorie
        </Button>
      </div>

      {grouped.map(({ label, items }) => (
        <div key={label} className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
            {label}
          </p>
          <Table aria-label={`Catégories ${label}`} removeWrapper>
            <TableHeader>
              <TableColumn>Nom</TableColumn>
              <TableColumn>Slug</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading} emptyContent="Aucune catégorie">
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nom}</TableCell>
                  <TableCell>
                    <code className="rounded bg-surface-high px-1.5 py-0.5 text-xs text-text-muted">
                      {c.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="flat" onPress={() => openEdit(c)}>
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isLoading={deleteMutation.isPending}
                        onPress={() => deleteMutation.mutate(c.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      <Modal isOpen={isOpen} onClose={onClose}>
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
              className="bg-accent text-black"
              isLoading={isPending}
              onPress={() => void onSubmit()}
            >
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
