"use client";

import { useState } from "react";
import Link from "next/link";
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
import { IconCash, IconChartLine, IconPlus, IconRefresh, IconUsers } from "@tabler/icons-react";
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
import { PLAN_LABEL, STATUT_BOUTIQUE_META, dateFinPourPlan, daysUntil, formatDaysLeft, PLAN_DUREE_JOURS } from "@/lib/subscription";
import { PlanCards } from "@/components/superadmin/PlanCards";
import { StatusChip } from "@/components/common/StatusChip";
import { BoutiquesSummary } from "@/components/superadmin/BoutiquesSummary";
import { PlanAbonnement, StatutBoutique, type Boutique } from "@/types";

const STATUT_OPTIONS = Object.values(StatutBoutique);

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
    const plan = b.abonnementActif?.plan ?? PlanAbonnement.MENSUEL;
    abonnementForm.reset({ boutiqueId: b.id, plan, dateFin: dateFinPourPlan(plan) });
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
    // Paiement confirmé : une boutique en attente passe en service dès l'abonnement enregistré.
    if (selected?.statut === StatutBoutique.EN_ATTENTE) {
      await statutMutation.mutateAsync({ id: selected.id, statut: StatutBoutique.ACTIF });
    }
    abonnementModal.onClose();
  });

  const enAttente = selected?.statut === StatutBoutique.EN_ATTENTE;

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

      {isLoading ? (
        <div role="status" aria-label="Chargement des boutiques" className="grid gap-3 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      ) : boutiques.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">Aucune boutique inscrite</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2" aria-label="Liste des boutiques">
          {boutiques.map((b) => {
            const meta = STATUT_BOUTIQUE_META[b.statut];
            const attente = b.statut === StatutBoutique.EN_ATTENTE;
            return (
              <li key={b.id} className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold text-text">{b.nom}</p>
                    <p className="truncate text-xs text-text-muted">
                      {b.ville ?? "—"} · /{b.slug}
                    </p>
                  </div>
                  <StatusChip label={meta.label} tone={meta.tone} icon={meta.icon} className="shrink-0" />
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-text-muted">Abonnement</dt>
                    <dd className="mt-0.5">
                      {b.abonnementActif ? (
                        <>
                          <span className="font-semibold text-text">{PLAN_LABEL[b.abonnementActif.plan]}</span>
                          <span className="block text-xs text-text-muted">
                            jusqu&apos;au {new Date(b.abonnementActif.dateFin).toLocaleDateString("fr-FR")} ·{" "}
                            {formatDaysLeft(daysUntil(b.abonnementActif.dateFin))}
                          </span>
                        </>
                      ) : (
                        <span className="text-text-muted">{attente ? "Paiement attendu" : "Aucun"}</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Utilisateurs</dt>
                    <dd className="mt-0.5 flex items-center gap-1.5 font-semibold text-text">
                      <IconUsers size={16} className="text-text-muted" aria-hidden />
                      {b.usersCount ?? "—"}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center">
                  <Select
                    size="sm"
                    label="Statut"
                    labelPlacement="outside-left"
                    aria-label={`Statut de ${b.nom}`}
                    selectedKeys={[b.statut]}
                    disallowEmptySelection
                    className="sm:max-w-[16rem]"
                    classNames={{ trigger: "min-h-11", label: "text-xs text-text-muted" }}
                    isDisabled={statutMutation.isPending}
                    onSelectionChange={(keys) => {
                      const statut = Array.from(keys)[0] as StatutBoutique | undefined;
                      if (statut && statut !== b.statut) {
                        statutMutation.mutate({ id: b.id, statut });
                      }
                    }}
                  >
                    {STATUT_OPTIONS.map((st) => (
                      <SelectItem key={st}>{STATUT_BOUTIQUE_META[st].label}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex gap-2 sm:ml-auto">
                    <Button
                      as={Link}
                      href={`/super-admin/boutiques/${b.id}/activite`}
                      variant="bordered"
                      className="min-h-11 flex-1 font-medium sm:flex-none"
                      startContent={<IconChartLine size={16} aria-hidden />}
                    >
                      Activité
                    </Button>
                    <Button
                      className="min-h-11 flex-1 bg-accent font-semibold text-white sm:flex-none"
                      onPress={() => openAbonnement(b)}
                      startContent={attente ? <IconCash size={16} aria-hidden /> : <IconRefresh size={16} aria-hidden />}
                    >
                      {attente ? "Confirmer le paiement" : "Renouveler"}
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

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
              <div className="sm:col-span-2">
                <Controller
                  name="plan"
                  control={registerForm.control}
                  render={({ field }) => (
                    <PlanCards
                      value={field.value}
                      onChange={(plan) => {
                        field.onChange(plan);
                        registerForm.setValue("dureeJours", PLAN_DUREE_JOURS[plan]);
                      }}
                    />
                  )}
                />
              </div>
              <Input label="Durée (jours)" type="number" variant="bordered" description="Pré-remplie selon le plan, modifiable" {...registerForm.register("dureeJours")} />
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
          <ModalHeader>{enAttente ? "Confirmer le paiement" : "Abonnement"} — {selected?.nom}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              {enAttente && (
                <p className="rounded-md bg-return-dim p-3 text-sm text-return-text">
                  Enregistrez le plan réglé : la boutique passera en « Abonnement actif » et ses utilisateurs pourront se connecter.
                </p>
              )}
              <Controller
                name="plan"
                control={abonnementForm.control}
                render={({ field }) => (
                  <PlanCards
                    value={field.value}
                    onChange={(plan) => {
                      field.onChange(plan);
                      abonnementForm.setValue("dateFin", dateFinPourPlan(plan));
                    }}
                  />
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
            <Button className="bg-accent text-white" isLoading={abonnementMutation.isPending || statutMutation.isPending} onPress={() => void onSubmitAbonnement()}>
              {enAttente ? "Confirmer et activer" : "Enregistrer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
