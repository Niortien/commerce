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
import { useUsers } from "@/features/users/query/users-queries";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/features/users/mutation/users-mutations";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";
import type { AppUser } from "@/features/users/api/users-api";

const createSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
  role: z.enum(["ADMIN", "VENDEUR"]),
  boutiqueId: z.string().nullable().optional(),
});

const updateSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  password: z.string().min(6).optional().or(z.literal("")),
  role: z.enum(["ADMIN", "VENDEUR"]).optional(),
  boutiqueId: z.string().nullable().optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

export function UtilisateursView() {
  const { data: usersRes, isLoading } = useUsers();
  const users = usersRes?.data ?? [];
  const { data: boutiquesRes } = useBoutiques();
  const boutiques = boutiquesRes?.data ?? [];

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<AppUser | null>(null);

  const createForm = useForm<CreateFormData>({ resolver: zodResolver(createSchema) });
  const updateForm = useForm<UpdateFormData>({ resolver: zodResolver(updateSchema) });

  function openCreate() {
    setEditing(null);
    createForm.reset({ email: "", password: "", role: "VENDEUR", boutiqueId: null });
    onOpen();
  }

  function openEdit(u: AppUser) {
    setEditing(u);
    updateForm.reset({ email: u.email, password: "", role: u.role, boutiqueId: u.boutiqueId });
    onOpen();
  }

  const onSubmitCreate = createForm.handleSubmit(async (data) => {
    await createMutation.mutateAsync({
      ...data,
      boutiqueId: data.boutiqueId || null,
    });
    onClose();
  });

  const onSubmitUpdate = updateForm.handleSubmit(async (data) => {
    if (!editing) return;
    const body = {
      ...(data.email ? { email: data.email } : {}),
      ...(data.password ? { password: data.password } : {}),
      ...(data.role ? { role: data.role } : {}),
      boutiqueId: data.boutiqueId || null,
    };
    await updateMutation.mutateAsync({ id: editing.id, body });
    onClose();
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Utilisateurs</h1>
        <Button className="bg-accent text-black" onPress={openCreate}>
          + Nouvel utilisateur
        </Button>
      </div>

      <Table aria-label="Liste des utilisateurs">
        <TableHeader>
          <TableColumn>Email</TableColumn>
          <TableColumn>Rôle</TableColumn>
          <TableColumn>Boutique</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} emptyContent="Aucun utilisateur">
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Chip size="sm" color={u.role === "ADMIN" ? "warning" : "default"} variant="flat">
                  {u.role}
                </Chip>
              </TableCell>
              <TableCell>{u.boutique?.nom ?? "—"}</TableCell>
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
                    Supprimer
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
              <ModalHeader>Modifier l&apos;utilisateur</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Input label="Email" variant="bordered" isInvalid={!!updateForm.formState.errors.email} errorMessage={updateForm.formState.errors.email?.message} {...updateForm.register("email")} />
                  <Input label="Nouveau mot de passe" type="password" variant="bordered" placeholder="Laisser vide pour ne pas changer" {...updateForm.register("password")} />
                  <Controller
                    name="role"
                    control={updateForm.control}
                    render={({ field }) => (
                      <Select label="Rôle" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
                        <SelectItem key="ADMIN">ADMIN</SelectItem>
                        <SelectItem key="VENDEUR">VENDEUR</SelectItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="boutiqueId"
                    control={updateForm.control}
                    render={({ field }) => (
                      <Select label="Boutique" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? null)}>
                        <>
                          <SelectItem key="">Aucune boutique</SelectItem>
                          {boutiques.map((b) => (
                            <SelectItem key={b.id}>{b.nom}</SelectItem>
                          ))}
                        </>
                      </Select>
                    )}
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
              <ModalHeader>Nouvel utilisateur</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Input label="Email" variant="bordered" isInvalid={!!createForm.formState.errors.email} errorMessage={createForm.formState.errors.email?.message} {...createForm.register("email")} />
                  <Input label="Mot de passe" type="password" variant="bordered" isInvalid={!!createForm.formState.errors.password} errorMessage={createForm.formState.errors.password?.message} {...createForm.register("password")} />
                  <Controller
                    name="role"
                    control={createForm.control}
                    render={({ field }) => (
                      <Select label="Rôle" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
                        <SelectItem key="ADMIN">ADMIN</SelectItem>
                        <SelectItem key="VENDEUR">VENDEUR</SelectItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="boutiqueId"
                    control={createForm.control}
                    render={({ field }) => (
                      <Select label="Boutique" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? null)}>
                        <>
                          <SelectItem key="">Aucune boutique</SelectItem>
                          {boutiques.map((b) => (
                            <SelectItem key={b.id}>{b.nom}</SelectItem>
                          ))}
                        </>
                      </Select>
                    )}
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
