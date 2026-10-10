"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import {
  IconArrowLeft,
  IconBrandWhatsapp,
  IconCash,
  IconPencil,
  IconPhone,
  IconTrash,
  IconUserCheck,
  IconUserOff,
} from "@tabler/icons-react";
import { ClientFormModal } from "@/components/common/ClientFormModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PageWrapper } from "@/components/common/PageWrapper";
import { StatusChip } from "@/components/common/StatusChip";
import { useDeleteClient, useUpdateClient } from "@/features/clients/mutation/clients-mutations";
import { useClient } from "@/features/clients/query/clients-queries";
import { ETAT_CLIENT_META, creditDisponible, etatClient, lienWhatsApp } from "@/lib/credit";
import { formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { ClientReleve } from "./ClientReleve";
import { ReglementModal } from "./ReglementModal";

interface ClientDetailViewProps {
  id: string;
}

/** Un client à crédit : ce qu'il doit, ce qui est en retard, son relevé, et l'encaissement de ses règlements. */
export function ClientDetailView({ id }: ClientDetailViewProps) {
  const router = useRouter();
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const boutique = useAuthStore((s) => s.user?.boutiqueName ?? null);
  const { data, isLoading, error } = useClient(id);
  const modifier = useUpdateClient(id);
  const supprimer = useDeleteClient();
  const [reglementOpen, setReglementOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const client = data?.data;

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </PageWrapper>
    );
  }

  if (error || !client) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-text-muted">Ce client est introuvable : il a peut-être été supprimé.</p>
          <Button as={Link} href="/clients" variant="bordered" className="min-h-11">
            Retour aux clients
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const etat = etatClient(client);
  const meta = ETAT_CLIENT_META[etat];
  const solde = Number(client.solde);
  const disponible = creditDisponible(client);
  const whatsapp = lienWhatsApp(client.telephone);
  // Relance prête à envoyer : le client reçoit le montant exact et l'échéance dépassée.
  const relance =
    whatsapp && Number(client.enRetard) > 0
      ? `${whatsapp}?text=${encodeURIComponent(
          `Bonjour ${client.nom}, ${boutique ? `ici ${boutique}. ` : ""}Il reste ${formatCurrency(client.enRetard)} à régler, en retard depuis ${client.joursRetard} jours. Merci de passer régler dès que possible.`
        )}`
      : whatsapp;

  const chiffres: Array<{ label: string; valeur: string; ton?: string }> = [
    {
      label: solde < 0 ? "Avoir en sa faveur" : "Doit",
      valeur: formatCurrency(Math.abs(solde)),
    },
    {
      label: "En retard",
      valeur: formatCurrency(client.enRetard),
      ton: Number(client.enRetard) > 0 ? "text-out-text" : undefined,
    },
    {
      label: "Prochaine échéance",
      valeur: client.prochaineEcheance ? formatDateCourte(client.prochaineEcheance) : "—",
    },
    {
      label: "Peut encore prendre",
      valeur: disponible === null ? "Sans limite" : formatCurrency(disponible),
    },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <Link
          href="/clients"
          className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text focus-visible:outline-accent"
        >
          <IconArrowLeft size={16} aria-hidden />
          Clients
        </Link>

        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <StatusChip label={meta.label} tone={meta.tone} />
              {!client.isActif && <StatusChip label="Plus de crédit" tone="neutral" />}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-text [font-family:var(--font-display)]">{client.nom}</h1>
            {client.telephone && (
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href={`tel:${client.telephone}`} className="inline-flex min-h-11 items-center gap-1.5 text-text-muted hover:text-text">
                  <IconPhone size={16} aria-hidden />
                  {client.telephone}
                </a>
                {relance && (
                  <a
                    href={relance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-in-text hover:underline"
                  >
                    <IconBrandWhatsapp size={16} aria-hidden />
                    {Number(client.enRetard) > 0 ? "Relancer sur WhatsApp" : "WhatsApp"}
                  </a>
                )}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="min-h-11 bg-accent font-semibold text-white"
              startContent={<IconCash size={18} aria-hidden />}
              isDisabled={solde <= 0}
              onPress={() => setReglementOpen(true)}
            >
              Encaisser un règlement
            </Button>
            {isAdmin && (
              <>
                <Button variant="bordered" className="min-h-11" startContent={<IconPencil size={16} aria-hidden />} onPress={() => setEditOpen(true)}>
                  Modifier
                </Button>
                <Button
                  variant="bordered"
                  className="min-h-11"
                  startContent={client.isActif ? <IconUserOff size={16} aria-hidden /> : <IconUserCheck size={16} aria-hidden />}
                  isLoading={modifier.isPending}
                  onPress={() => modifier.mutate({ isActif: !client.isActif })}
                >
                  {client.isActif ? "Ne plus faire crédit" : "Refaire crédit"}
                </Button>
                {client.operations.length === 0 && (
                  <Button
                    variant="light"
                    className="min-h-11 text-out-text"
                    startContent={<IconTrash size={16} aria-hidden />}
                    onPress={() => setDeleteOpen(true)}
                  >
                    Supprimer
                  </Button>
                )}
              </>
            )}
          </div>
        </header>

        <section aria-label="État du compte" className="rounded-xl border border-border bg-surface p-4 md:p-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
            {chiffres.map((c) => (
              <div key={c.label}>
                <dt className="text-xs text-text-muted">{c.label}</dt>
                <dd className={cn("tabular text-[15px] font-semibold text-text", c.ton)}>{c.valeur}</dd>
              </div>
            ))}
          </dl>
          {Number(client.enRetard) > 0 && (
            <p className="mt-3 text-sm text-out-text">
              Une échéance est dépassée depuis {client.joursRetard} jour{client.joursRetard > 1 ? "s" : ""}.
            </p>
          )}
          {client.notes && <p className="mt-3 text-sm text-text-muted">{client.notes}</p>}
        </section>

        <ClientReleve operations={client.operations} />
      </div>

      <ReglementModal isOpen={reglementOpen} onClose={() => setReglementOpen(false)} client={client} />
      <ClientFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} client={client} />
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await supprimer.mutateAsync(client.id);
          setDeleteOpen(false);
          router.push("/clients");
        }}
        title="Supprimer ce client ?"
        message={`« ${client.nom} » n'a aucune opération : sa fiche sera effacée.`}
        confirmLabel="Supprimer le client"
        isLoading={supprimer.isPending}
        danger
      />
    </PageWrapper>
  );
}
