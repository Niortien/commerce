"use client";

import { useState } from "react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUsers } from "@/features/users/query/users-queries";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/features/users/mutation/users-mutations";
import type { AppUser } from "@/features/users/api/users-api";

const createSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

const updateSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  password: z.string().min(8).optional().or(z.literal("")),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

/**
 * Gestion des caissiers de SA boutique par l'ADMIN. Le rôle est toujours
 * CAISSIER — seul le Super Admin peut créer un compte ADMIN (voir la
 * plateforme Super Admin, /super-admin/utilisateurs).
 */
export function UtilisateursView() {
  const { data: usersRes, isLoading } = useUsers();
  const users = (usersRes?.data ?? []).filter((u) => u.role === "CAISSIER");

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<AppUser | null>(null);

  const createForm = useForm<CreateFormData>({ resolver: zodResolver(createSchema) });
  const updateForm = useForm<UpdateFormData>({ resolver: zodResolver(updateSchema) });

  function openCreate() {
    setEditing(null);
    createForm.reset({ email: "", password: "" });
    onOpen();
  }

  function openEdit(u: AppUser) {
    setEditing(u);
    updateForm.reset({ email: u.email, password: "" });
    onOpen();
  }

  const onSubmitCreate = createForm.handleSubmit(async (data) => {
    await createMutation.mutateAsync(data);
    onClose();
  });

  const onSubmitUpdate = updateForm.handleSubmit(async (data) => {
    if (!editing) return;
    const body = {
      ...(data.email ? { email: data.email } : {}),
      ...(data.password ? { password: data.password } : {}),
    };
    await updateMutation.mutateAsync({ id: editing.id, body });
    onClose();
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Caissiers</h1>
          <p className="text-sm text-text-muted">
            Créez des accès pour votre équipe de caisse. Chaque caissier n&apos;a accès qu&apos;à votre boutique.
          </p>
        </div>
        <Button className="bg-accent text-black" onPress={openCreate}>
          + Nouveau caissier
        </Button>
      </div>

      <Table aria-label="Liste des caissiers">
        <TableHeader>
          <TableColumn>Email</TableColumn>
          <TableColumn>Rôle</TableColumn>
          <TableColumn>Créé le</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} emptyContent="Aucun caissier pour l'instant">
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Chip size="sm" color="default" variant="flat">
                  Caissier
                </Chip>
              </TableCell>
              <TableCell>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat" onPress={() => openEdit(u)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    isLoading={deleteMutation.isPending}
                    onPress={() => deleteMutation.mutate(u.id)}
                  >
                    Retirer l&apos;accès
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          {editing ? (
            <>
              <ModalHeader>Modifier le caissier</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Email"
                    variant="bordered"
                    isInvalid={!!updateForm.formState.errors.email}
                    errorMessage={updateForm.formState.errors.email?.message}
                    {...updateForm.register("email")}
                  />
                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    variant="bordered"
                    placeholder="Laisser vide pour ne pas changer"
                    isInvalid={!!updateForm.formState.errors.password}
                    errorMessage={updateForm.formState.errors.password?.message}
                    {...updateForm.register("password")}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Annuler</Button>
                <Button className="bg-accent text-black" isLoading={updateMutation.isPending} onPress={() => void onSubmitUpdate()}>
                  Enregistrer
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>Nouveau caissier</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Email"
                    variant="bordered"
                    isInvalid={!!createForm.formState.errors.email}
                    errorMessage={createForm.formState.errors.email?.message}
                    {...createForm.register("email")}
                  />
                  <Input
                    label="Mot de passe"
                    type="password"
                    variant="bordered"
                    isInvalid={!!createForm.formState.errors.password}
                    errorMessage={createForm.formState.errors.password?.message}
                    {...createForm.register("password")}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Annuler</Button>
                <Button className="bg-accent text-black" isLoading={createMutation.isPending} onPress={() => void onSubmitCreate()}>
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
