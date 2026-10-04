"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  IconCashRegister,
  IconPencil,
  IconShieldCheck,
  IconUserOff,
  IconUserPlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CountUp } from "@/components/common/CountUp";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { StatTile } from "@/components/common/StatTile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionEasing } from "@/lib/motionVariants";
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
  const [revokeTarget, setRevokeTarget] = useState<AppUser | null>(null);
  const reduced = useReducedMotion();

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
    <PageWrapper>
      <PageHero
        tone="accent"
        icon={IconUsersGroup}
        eyebrow="Équipe"
        title="Caissiers"
        description="Créez des accès pour votre équipe de caisse. Chaque caissier n'a accès qu'à votre boutique."
        actions={
          <Button
            className="min-h-11 bg-accent font-semibold text-white"
            startContent={<IconUserPlus size={18} aria-hidden />}
            onPress={openCreate}
          >
            Nouveau caissier
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile tone="accent" icon={IconUsersGroup} label="Caissiers actifs" value={isLoading ? "—" : <CountUp value={users.length} />} />
          <StatTile tone="in" icon={IconShieldCheck} label="Accès" value="Limité à votre boutique" delay={0.05} />
        </div>
      </PageHero>

      {isLoading && (
        <div role="status" aria-label="Chargement des caissiers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <EmptyRiver
          message="Aucun caissier pour l'instant"
          hint="Ajoutez un caissier pour qu'il puisse ouvrir la caisse et enregistrer des ventes."
          action={
            <Button size="sm" className="bg-accent font-semibold text-white" onPress={openCreate}>
              Ajouter un caissier
            </Button>
          }
        />
      )}

      {users.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((u, i) => (
            <motion.li
              key={u.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: motionEasing.outExpo, delay: Math.min(i * 0.04, 0.24) }}
            >
              <SpotlightCard tone="accent" className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-dim font-display text-lg font-extrabold uppercase text-accent-text"
                  >
                    {u.email.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text">{u.email}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      Ajouté le {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-high px-2 py-0.5 text-xs font-medium text-text-muted">
                      <IconCashRegister size={12} aria-hidden />
                      Caissier
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="flat" className="min-h-9 flex-1 font-medium" startContent={<IconPencil size={15} aria-hidden />} onPress={() => openEdit(u)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    className="min-h-9 flex-1 font-medium"
                    startContent={<IconUserOff size={15} aria-hidden />}
                    onPress={() => setRevokeTarget(u)}
                  >
                    Retirer l&apos;accès
                  </Button>
                </div>
              </SpotlightCard>
            </motion.li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => {
          if (revokeTarget && !deleteMutation.isPending) {
            deleteMutation.mutate(revokeTarget.id, { onSuccess: () => setRevokeTarget(null) });
          }
        }}
        title="Retirer l'accès"
        message={`${revokeTarget?.email ?? "Ce caissier"} ne pourra plus se connecter à votre boutique.`}
        confirmLabel="Retirer l'accès"
        isLoading={deleteMutation.isPending}
        danger
      />

      <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
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
                <Button className="bg-accent text-white" isLoading={updateMutation.isPending} onPress={() => void onSubmitUpdate()}>
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
                <Button className="bg-accent text-white" isLoading={createMutation.isPending} onPress={() => void onSubmitCreate()}>
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
