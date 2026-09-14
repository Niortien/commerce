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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuperAdminBoutiques, useSuperAdminUsers } from "@/features/super-admin/query/superadmin-queries";
import {
  useCreateSuperAdminUser,
  useDeleteSuperAdminUser,
} from "@/features/super-admin/mutation/superadmin-mutations";
import { createSuperAdminUserSchema, type CreateSuperAdminUserInput } from "@/lib/validators/superadmin.schema";

const ROLE_COLOR: Record<string, "danger" | "warning" | "default"> = {
  SUPER_ADMIN: "danger",
  ADMIN: "warning",
  CAISSIER: "default",
};

/** Vue transverse : tous les acteurs de la plateforme, toutes boutiques confondues. */
export function UtilisateursView() {
  const { data: usersRes, isLoading } = useSuperAdminUsers();
  const users = usersRes?.data ?? [];
  const { data: boutiquesRes } = useSuperAdminBoutiques();
  const boutiques = boutiquesRes?.data ?? [];

  const createMutation = useCreateSuperAdminUser();
  const deleteMutation = useDeleteSuperAdminUser();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<CreateSuperAdminUserInput>({
    resolver: zodResolver(createSuperAdminUserSchema),
    defaultValues: { role: "ADMIN" },
  });
  const role = watch("role");

  function openCreate() {
    reset({ email: "", password: "", role: "ADMIN", boutiqueId: null });
    onOpen();
  }

  const onSubmit = handleSubmit(async (data) => {
    await createMutation.mutateAsync({
      ...data,
      boutiqueId: data.role === "SUPER_ADMIN" ? null : data.boutiqueId || null,
    });
    onClose();
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Utilisateurs</h1>
          <p className="text-sm text-text-muted">Tous les acteurs de la plateforme, toutes boutiques confondues.</p>
        </div>
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
                <Chip size="sm" color={ROLE_COLOR[u.role]} variant="flat">{u.role}</Chip>
              </TableCell>
              <TableCell>{u.boutique?.nom ?? "—"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  isLoading={deleteMutation.isPending}
                  onPress={() => deleteMutation.mutate(u.id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader>Nouvel utilisateur</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Input label="Email" variant="bordered" isInvalid={!!errors.email} errorMessage={errors.email?.message} {...register("email")} />
              <Input label="Mot de passe" type="password" variant="bordered" isInvalid={!!errors.password} errorMessage={errors.password?.message} {...register("password")} />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select label="Rôle" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
                    <SelectItem key="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                    <SelectItem key="ADMIN">ADMIN (admin de boutique)</SelectItem>
                    <SelectItem key="CAISSIER">CAISSIER</SelectItem>
                  </Select>
                )}
              />
              {role !== "SUPER_ADMIN" && (
                <Controller
                  name="boutiqueId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Boutique"
                      variant="bordered"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? null)}
                    >
                      {boutiques.map((b) => (
                        <SelectItem key={b.id}>{b.nom}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Annuler</Button>
            <Button className="bg-accent text-black" isLoading={createMutation.isPending} onPress={() => void onSubmit()}>
              Créer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
