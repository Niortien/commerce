"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { IconCash, IconChartLine, IconEye, IconPlus, IconRefresh, IconUsers } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuperAdminBoutiques } from "@/features/super-admin/query/superadmin-queries";
import {
  useChangerStatutBoutique,
  useChangerTypeCommerce,
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
import { PLAN_PRIX_FCFA } from "@/lib/pricing";
import { StatusChip } from "@/components/common/StatusChip";
import { BoutiquesSummary } from "@/components/superadmin/BoutiquesSummary";
import { CommerceBadge } from "@/components/common/CommerceBadge";
import { CommerceTypePicker } from "@/components/common/CommerceTypePicker";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { COMMERCE_PROFILES, TYPES_COMMERCE, isTypeCommerce, resolveTypeCommerce } from "@/lib/commerce";
import { useSectorStore } from "@/stores/sectorStore";
import { useConsultation } from "@/hooks/useConsultation";
import { PlanAbonnement, StatutBoutique, TypeCommerce, type Boutique } from "@/types";

const STATUT_OPTIONS = Object.values(StatutBoutique);

export function BoutiquesView() {
  const { data: res, isLoading } = useSuperAdminBoutiques();
  const consultation = useConsultation();
  // Le Super Admin ne voit que le secteur choisi dans la barre latérale (ou toute la plateforme).
  const secteur = useSectorStore((s) => s.secteur);
  const profile = secteur === "TOUS" ? null : COMMERCE_PROFILES[secteur];
  const toutes = res?.data ?? [];
  const boutiques = profile ? toutes.filter((b) => resolveTypeCommerce(b.typeCommerce) === profile.type) : toutes;

  const registerMutation = useRegisterBoutique();
  const statutMutation = useChangerStatutBoutique();
  const abonnementMutation = useCreateAbonnement();
  const typeMutation = useChangerTypeCommerce();
  const [typeChange, setTypeChange] = useState<{ boutique: Boutique; type: TypeCommerce } | null>(null);

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
    registerForm.reset({ plan: PlanAbonnement.ESSAI, typeCommerce: profile?.type });
    registerModal.onOpen();
  }

  function openAbonnement(b: Boutique) {
    setSelected(b);
    const plan = b.abonnementActif?.plan ?? PlanAbonnement.MENSUEL;
    abonnementForm.reset({ boutiqueId: b.id, plan, dateFin: dateFinPourPlan(plan), montant: PLAN_PRIX_FCFA[plan] });
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

  async function confirmTypeChange() {
    if (!typeChange) return;
    await typeMutation.mutateAsync({ id: typeChange.boutique.id, typeCommerce: typeChange.type });
    setTypeChange(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <PageHeader
        eyebrow={profile ? "Secteur" : "Plateforme"}
        title={profile ? `${profile.pluriel} & abonnements` : "Boutiques & abonnements"}
        description={
          profile
            ? `Seuls les commerces de type « ${profile.label} » sont affichés. Changez de secteur dans la barre latérale.`
            : "Toutes les boutiques de la plateforme : leur statut, leur plan et leur date d'échéance. Une boutique suspendue ne peut plus utiliser le stock ni la caisse."
        }
        actions={
          <Button className="bg-accent font-semibold text-white" onPress={openRegister} startContent={<IconPlus size={16} aria-hidden />}>
            {profile ? `Inscrire : ${profile.label.toLowerCase()}` : "Inscrire une boutique"}
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
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-text-muted">
            {profile ? `Aucun commerce de type « ${profile.label} » pour le moment.` : "Aucune boutique inscrite."}
          </p>
          <Button variant="bordered" className="min-h-11 font-medium" onPress={openRegister} startContent={<IconPlus size={16} aria-hidden />}>
            {profile ? `Inscrire : ${profile.label.toLowerCase()}` : "Inscrire une boutique"}
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2" aria-label="Liste des boutiques">
          {boutiques.map((b) => {
            const meta = STATUT_BOUTIQUE_META[b.statut];
            const attente = b.statut === StatutBoutique.EN_ATTENTE;
            const type = resolveTypeCommerce(b.typeCommerce);
            return (
              <li key={b.id} className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold text-text">{b.nom}</p>
                    <p className="truncate text-xs text-text-muted">
                      {b.ville ?? "—"} · /{b.slug}
                    </p>
                    {!profile && <CommerceBadge type={type} className="mt-2" />}
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
                  <Select
                    size="sm"
                    label="Type"
                    labelPlacement="outside-left"
                    aria-label={`Type de commerce de ${b.nom}`}
                    selectedKeys={[type]}
                    disallowEmptySelection
                    className="sm:max-w-[13rem]"
                    classNames={{ trigger: "min-h-11", label: "text-xs text-text-muted" }}
                    isDisabled={typeMutation.isPending}
                    onSelectionChange={(keys) => {
                      const next = Array.from(keys)[0];
                      if (isTypeCommerce(next) && next !== type) setTypeChange({ boutique: b, type: next });
                    }}
                  >
                    {TYPES_COMMERCE.map((t) => (
                      <SelectItem key={t}>{COMMERCE_PROFILES[t].label}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex flex-wrap gap-2 sm:ml-auto">
                    {/* Voir ce que voient l'admin ou les caissiers de la boutique, sans rien pouvoir modifier. */}
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="min-h-11 flex-1 font-medium sm:flex-none"
                          startContent={<IconEye size={16} aria-hidden />}
                          isLoading={consultation.isPending}
                        >
                          Voir l&apos;espace
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label={`Ouvrir un espace de ${b.nom}`}
                        onAction={(cle) =>
                          consultation.ouvrirBoutique({ boutiqueId: b.id, role: cle === "CAISSIER" ? "CAISSIER" : "ADMIN" })
                        }
                      >
                        <DropdownItem key="ADMIN" description="Tableau de bord, réglages, rapports">
                          Espace admin
                        </DropdownItem>
                        <DropdownItem key="CAISSIER" description="Caisse et ventes">
                          Espace caissier
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
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
              <div className="sm:col-span-2">
                <Controller
                  name="typeCommerce"
                  control={registerForm.control}
                  render={({ field, fieldState }) => (
                    <CommerceTypePicker
                      label="Type de commerce"
                      value={field.value}
                      onChange={field.onChange}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
              </div>
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

      {/* Changement de type de commerce : réservé au Super Admin */}
      <ConfirmModal
        isOpen={typeChange !== null}
        onClose={() => setTypeChange(null)}
        onConfirm={() => void confirmTypeChange()}
        isLoading={typeMutation.isPending}
        title="Changer le type de commerce"
        message={
          typeChange
            ? `« ${typeChange.boutique.nom} » deviendra : ${COMMERCE_PROFILES[typeChange.type].label}. Son équipe verra les pages et le vocabulaire de ce commerce. Ses produits, son stock et ses ventes ne changent pas.`
            : ""
        }
        confirmLabel={typeChange ? `Passer en ${COMMERCE_PROFILES[typeChange.type].label.toLowerCase()}` : "Confirmer"}
      />

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
                      abonnementForm.setValue("montant", PLAN_PRIX_FCFA[plan]);
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
              <Input label="Montant (FCFA)" type="number" variant="bordered" description="Pré-rempli selon le tarif du plan, modifiable (remise, geste commercial)" {...abonnementForm.register("montant")} />
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
