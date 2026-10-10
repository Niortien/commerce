"use client";

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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuperAdminBoutiques, useSuperAdminUsers } from "@/features/super-admin/query/superadmin-queries";
import {
  useCreateSuperAdminUser,
  useDeleteSuperAdminUser,
} from "@/features/super-admin/mutation/superadmin-mutations";
import { PhoneLink } from "@/components/common/PhoneLink";
import { IconEye } from "@tabler/icons-react";
import { useConsultation } from "@/hooks/useConsultation";
import { createSuperAdminUserSchema, type CreateSuperAdminUserInput } from "@/lib/validators/superadmin.schema";
import { COMMERCE_PROFILES, resolveTypeCommerce } from "@/lib/commerce";
import { useSectorStore } from "@/stores/sectorStore";

const ROLE_COLOR: Record<string, "danger" | "warning" | "default"> = {
  SUPER_ADMIN: "danger",
  ADMIN: "warning",
  CAISSIER: "default",
};

/** Vue transverse : tous les acteurs de la plateforme, toutes boutiques confondues. */
export function UtilisateursView() {
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const { data: usersRes, isLoading } = useSuperAdminUsers();
  const { data: boutiquesRes } = useSuperAdminBoutiques();

  // Avec un secteur choisi : seulement les comptes des boutiques de ce type (les Super Admins n'en ont pas).
  const secteur = useSectorStore((s) => s.secteur);
  const profile = secteur === "TOUS" ? null : COMMERCE_PROFILES[secteur];
  const toutesBoutiques = boutiquesRes?.data ?? [];
  const boutiques = profile
    ? toutesBoutiques.filter((b) => resolveTypeCommerce(b.typeCommerce) === profile.type)
    : toutesBoutiques;
  const idsSecteur = new Set(boutiques.map((b) => b.id));
  const tousUsers = usersRes?.data ?? [];
  const usersSecteur = profile ? tousUsers.filter((u) => u.boutiqueId != null && idsSecteur.has(u.boutiqueId)) : tousUsers;
  const users = roleFilter === "ALL" ? usersSecteur : usersSecteur.filter((u) => u.role === roleFilter);

  const consultation = useConsultation();
  const createMutation = useCreateSuperAdminUser();
  const deleteMutation = useDeleteSuperAdminUser();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<CreateSuperAdminUserInput>({
    resolver: zodResolver(createSuperAdminUserSchema),
    defaultValues: { role: "ADMIN" },
  });
  const role = watch("role");

  function openCreate() {
    reset({ email: "", password: "", role: "ADMIN", telephone: "", boutiqueId: null });
    onOpen();
  }

  const onSubmit = handleSubmit(async (data) => {
    await createMutation.mutateAsync({
      ...data,
      telephone: data.telephone?.trim() || null,
      boutiqueId: data.role === "SUPER_ADMIN" ? null : data.boutiqueId || null,
    });
    onClose();
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{profile ? `Utilisateurs : ${profile.pluriel.toLowerCase()}` : "Utilisateurs"}</h1>
          <p className="text-sm text-text-muted">
            {profile
              ? `Admins et caissiers des commerces de type « ${profile.label} ».`
              : "Tous les acteurs de la plateforme, toutes boutiques confondues."}
          </p>
        </div>
        <Button className="bg-accent text-white" onPress={openCreate}>
          + Nouvel utilisateur
        </Button>
      </div>

      <Select
        aria-label="Filtrer par rôle"
        label="Rôle"
        size="sm"
        variant="bordered"
        className="mb-4 max-w-xs"
        selectedKeys={[roleFilter]}
        disallowEmptySelection
        onSelectionChange={(keys) => setRoleFilter(String(Array.from(keys)[0] ?? "ALL"))}
      >
        <SelectItem key="ALL">Tous</SelectItem>
        <SelectItem key="SUPER_ADMIN">Super admins</SelectItem>
        <SelectItem key="ADMIN">Admins</SelectItem>
        <SelectItem key="CAISSIER">Caissiers</SelectItem>
      </Select>

      <Table aria-label="Liste des utilisateurs">
        <TableHeader>
          <TableColumn>Email</TableColumn>
          <TableColumn>Rôle</TableColumn>
          <TableColumn>Téléphone</TableColumn>
          <TableColumn>Boutique</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} emptyContent={profile ? `Aucun utilisateur dans les ${profile.pluriel.toLowerCase()}` : "Aucun utilisateur"}>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Chip size="sm" color={ROLE_COLOR[u.role]} variant="flat">{u.role}</Chip>
              </TableCell>
              <TableCell>
                {u.telephone ? (
                  <PhoneLink phone={u.telephone} />
                ) : (
                  <PhoneLink
                    phone={u.boutique?.telephone ?? u.boutique?.whatsapp}
                    hint={u.boutique?.telephone ?? u.boutique?.whatsapp ? "(boutique)" : undefined}
                  />
                )}
              </TableCell>
              <TableCell>{u.boutique?.nom ?? "—"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {/* Voir ce que voit ce compte, sans pouvoir rien modifier. */}
                  {(u.role === "ADMIN" || u.role === "CAISSIER") && u.boutiqueId && (
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<IconEye size={16} aria-hidden />}
                      isLoading={consultation.isPending}
                      onPress={() => consultation.ouvrirUtilisateur(u.id)}
                    >
                      Voir son espace
                    </Button>
                  )}
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
          <ModalHeader>Nouvel utilisateur</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Input label="Email" variant="bordered" isInvalid={!!errors.email} errorMessage={errors.email?.message} {...register("email")} />
              <Input label="Mot de passe" type="password" variant="bordered" isInvalid={!!errors.password} errorMessage={errors.password?.message} {...register("password")} />
              <Input label="Téléphone" type="tel" variant="bordered" placeholder="+225 07 00 00 00 00" {...register("telephone")} />
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
            <Button className="bg-accent text-white" isLoading={createMutation.isPending} onPress={() => void onSubmit()}>
              Créer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
