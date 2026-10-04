"use client";

import { useState } from "react";
import Link from "next/link";
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
import { IconChartLine, IconPlus } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuperAdminBoutiques } from "@/features/super-admin/query/superadmin-queries";
import {
  useChangerStatutBoutique,
  useCreateAbonnement,
  useRegisterBoutique,
} from "@/features/super-admin/mutation/superadmin-mutations";
import {
  createAbonnementSchema,
  registerBoutiqueSchema,
  type CreateAbonnementInput,
  type RegisterBoutiqueInput,
} from "@/lib/validators/superadmin.schema";
import { PageHeader } from "@/components/common/PageHeader";
import { PLAN_LABEL, daysUntil, formatDaysLeft } from "@/lib/subscription";
import { BoutiquesSummary } from "@/components/superadmin/BoutiquesSummary";
import { PlanAbonnement, StatutBoutique, type Boutique } from "@/types";

const STATUT_OPTIONS = Object.values(StatutBoutique);
const PLAN_OPTIONS = Object.values(PlanAbonnement);

const STATUT_COLOR: Record<StatutBoutique, "success" | "warning" | "danger" | "default"> = {
  [StatutBoutique.EN_ATTENTE]: "default",
  [StatutBoutique.ESSAI]: "warning",
  [StatutBoutique.ACTIF]: "success",
  [StatutBoutique.SUSPENDU]: "danger",
  [StatutBoutique.ARCHIVE]: "default",
};

export function BoutiquesView() {
  const { data: res, isLoading } = useSuperAdminBoutiques();
  const boutiques = res?.data ?? [];

  const registerMutation = useRegisterBoutique();
  const statutMutation = useChangerStatutBoutique();
  const abonnementMutation = useCreateAbonnement();

  const registerModal = useDisclosure();
  const abonnementModal = useDisclosure();
  const [selected, setSelected] = useState<Boutique | null>(null);

  const registerForm = useForm<RegisterBoutiqueInput>({
    resolver: zodResolver(registerBoutiqueSchema),
    defaultValues: { plan: PlanAbonnement.ESSAI },
  });

  const abonnementForm = useForm<CreateAbonnementInput>({
    resolver: zodResolver(createAbonnementSchema),
  });

  function openRegister() {
    registerForm.reset({ plan: PlanAbonnement.ESSAI });
    registerModal.onOpen();
  }

  function openAbonnement(b: Boutique) {
    setSelected(b);
    abonnementForm.reset({ boutiqueId: b.id, plan: PlanAbonnement.MENSUEL });
    abonnementModal.onOpen();
  }

  const onSubmitRegister = registerForm.handleSubmit(async (data) => {
    await registerMutation.mutateAsync({
      ...data,
      email: data.email || undefined,
    });
    registerModal.onClose();
  });

  const onSubmitAbonnement = abonnementForm.handleSubmit(async (data) => {
    await abonnementMutation.mutateAsync(data);
    abonnementModal.onClose();
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <PageHeader
        eyebrow="Plateforme"
        title="Boutiques & abonnements"
        description="Toutes les boutiques de la plateforme : leur statut, leur plan et leur date d'échéance. Une boutique suspendue ne peut plus utiliser le stock ni la caisse."
        actions={
          <Button className="bg-accent font-semibold text-white" onPress={openRegister} startContent={<IconPlus size={16} aria-hidden />}>
            Inscrire une boutique
          </Button>
        }
      />

      <BoutiquesSummary boutiques={boutiques} isLoading={isLoading} />

      <Table aria-label="Liste des boutiques">
        <TableHeader>
          <TableColumn>Boutique</TableColumn>
          <TableColumn>Statut</TableColumn>
          <TableColumn>Abonnement</TableColumn>
          <TableColumn>Utilisateurs</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} emptyContent="Aucune boutique inscrite">
          {boutiques.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <div className="font-medium text-text">{b.nom}</div>
                <div className="text-xs text-text-muted">{b.ville ?? "—"} · /{b.slug}</div>
              </TableCell>
              <TableCell>
                <Select
                  size="sm"
                  aria-label={`Statut de ${b.nom}`}
                  selectedKeys={[b.statut]}
                  className="w-40"
                  isDisabled={statutMutation.isPending}
                  onSelectionChange={(keys) => {
                    const statut = Array.from(keys)[0] as StatutBoutique | undefined;
                    if (statut && statut !== b.statut) {
                      statutMutation.mutate({ id: b.id, statut });
                    }
                  }}
                  renderValue={() => <Chip size="sm" color={STATUT_COLOR[b.statut]} variant="flat">{b.statut}</Chip>}
                >
                  {STATUT_OPTIONS.map((s) => (
                    <SelectItem key={s}>{s}</SelectItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                {b.abonnementActif ? (
                  <div className="text-xs">
                    <span className="font-semibold text-text">{PLAN_LABEL[b.abonnementActif.plan]}</span>
                    <span className="text-text-muted"> · jusqu&apos;au {new Date(b.abonnementActif.dateFin).toLocaleDateString("fr-FR")}</span>
                    <p className="mt-0.5 text-text-muted">{formatDaysLeft(daysUntil(b.abonnementActif.dateFin))}</p>
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">Aucun</span>
                )}
              </TableCell>
              <TableCell>{b.usersCount ?? "—"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    as={Link}
                    href={`/super-admin/boutiques/${b.id}/activite`}
                    className="bg-accent-dim font-medium text-accent-text"
                    startContent={<IconChartLine size={14} aria-hidden />}
                  >
                    Activité
                  </Button>
                  <Button size="sm" variant="flat" onPress={() => openAbonnement(b)}>
                    Renouveler / changer plan
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Inscription d'une nouvelle boutique */}
      <Modal isOpen={registerModal.isOpen} onClose={registerModal.onClose} size="lg" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Inscrire une nouvelle boutique</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Nom de la boutique" variant="bordered" isInvalid={!!registerForm.formState.errors.nom} errorMessage={registerForm.formState.errors.nom?.message} {...registerForm.register("nom")} />
              <Input label="Ville" variant="bordered" {...registerForm.register("ville")} />
              <Input label="Adresse" variant="bordered" {...registerForm.register("adresse")} />
              <Input label="WhatsApp" variant="bordered" {...registerForm.register("whatsapp")} />
              <Input label="Email de contact" variant="bordered" {...registerForm.register("email")} />
              <Input label="Téléphone" variant="bordered" {...registerForm.register("telephone")} />
              <Input label="Email de l'admin" variant="bordered" isInvalid={!!registerForm.formState.errors.adminEmail} errorMessage={registerForm.formState.errors.adminEmail?.message} {...registerForm.register("adminEmail")} />
              <Input label="Mot de passe de l'admin" type="password" variant="bordered" isInvalid={!!registerForm.formState.errors.adminPassword} errorMessage={registerForm.formState.errors.adminPassword?.message} {...registerForm.register("adminPassword")} />
              <Controller
                name="plan"
                control={registerForm.control}
                render={({ field }) => (
                  <Select label="Plan" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
                    {PLAN_OPTIONS.map((p) => <SelectItem key={p}>{p}</SelectItem>)}
                  </Select>
                )}
              />
              <Input label="Durée (jours)" type="number" variant="bordered" placeholder="14 (essai) / 30 (payant)" {...registerForm.register("dureeJours")} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={registerModal.onClose}>Annuler</Button>
            <Button className="bg-accent text-white" isLoading={registerMutation.isPending} onPress={() => void onSubmitRegister()}>
              Inscrire
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Renouvellement / changement de plan */}
      <Modal isOpen={abonnementModal.isOpen} onClose={abonnementModal.onClose}>
        <ModalContent>
          <ModalHeader>Abonnement — {selected?.nom}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Controller
                name="plan"
                control={abonnementForm.control}
                render={({ field }) => (
                  <Select label="Plan" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
                    {PLAN_OPTIONS.map((p) => <SelectItem key={p}>{p}</SelectItem>)}
                  </Select>
                )}
              />
              <Input
                label="Date de fin"
                type="date"
                variant="bordered"
                isInvalid={!!abonnementForm.formState.errors.dateFin}
                errorMessage={abonnementForm.formState.errors.dateFin?.message}
                {...abonnementForm.register("dateFin")}
              />
              <Input label="Montant" type="number" variant="bordered" {...abonnementForm.register("montant")} />
              <Input label="Notes" variant="bordered" {...abonnementForm.register("notes")} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={abonnementModal.onClose}>Annuler</Button>
            <Button className="bg-accent text-white" isLoading={abonnementMutation.isPending} onPress={() => void onSubmitAbonnement()}>
              Enregistrer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
