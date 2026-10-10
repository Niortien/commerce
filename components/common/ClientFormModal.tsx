"use client";

import { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateClient, useUpdateClient } from "@/features/clients/mutation/clients-mutations";
import { clientSchema, type ClientInput } from "@/lib/validators/client.schema";
import { useAuthStore } from "@/stores/authStore";
import type { Client } from "@/types";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Absent : nouveau client. */
  client?: Client;
  /** Nom déjà tapé ailleurs (recherche en caisse), repris dans le formulaire. */
  nomPropose?: string;
  onSaved?: (client: Client) => void;
}

const valeursDe = (client?: Client, nomPropose?: string): ClientInput => ({
  nom: client?.nom ?? nomPropose ?? "",
  telephone: client?.telephone ?? "",
  plafondCredit: client?.plafondCredit ? String(Math.round(Number(client.plafondCredit))) : "",
  notes: client?.notes ?? "",
});

/** Fiche d'un client à crédit. Seul l'admin fixe le plafond de crédit. */
export function ClientFormModal({ isOpen, onClose, client, nomPropose, onSaved }: ClientFormModalProps) {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const creer = useCreateClient();
  const modifier = useUpdateClient(client?.id ?? "");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: valeursDe(client, nomPropose),
  });

  useEffect(() => {
    if (isOpen) reset(valeursDe(client, nomPropose));
  }, [isOpen, client, nomPropose, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const body = {
      nom: values.nom,
      telephone: values.telephone || null,
      notes: values.notes || null,
      ...(isAdmin ? { plafondCredit: values.plafondCredit ? Number(values.plafondCredit) : null } : {}),
    };
    const res = client ? await modifier.mutateAsync(body) : await creer.mutateAsync(body);
    onSaved?.(res.data);
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" classNames={{ wrapper: "z-[1100]", backdrop: "z-[1050]" }}>
      <ModalContent>
        <form onSubmit={onSubmit} noValidate>
          <ModalHeader>{client ? "Modifier le client" : "Nouveau client"}</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Nom ou entreprise"
              placeholder="Ex. Koné BTP"
              variant="bordered"
              isInvalid={Boolean(errors.nom)}
              errorMessage={errors.nom?.message}
              {...register("nom")}
            />
            <Input label="Téléphone" type="tel" variant="bordered" {...register("telephone")} />
            {isAdmin ? (
              <Input
                label="Plafond de crédit"
                description="Ce qu'il peut devoir au maximum. Vide : pas de limite."
                inputMode="numeric"
                variant="bordered"
                endContent={<span className="text-xs text-text-muted">FCFA</span>}
                isInvalid={Boolean(errors.plafondCredit)}
                errorMessage={errors.plafondCredit?.message}
                {...register("plafondCredit")}
              />
            ) : (
              <p className="text-xs text-text-muted">Le plafond de crédit de ce client sera fixé par l&apos;administrateur.</p>
            )}
            <Textarea label="Remarques" variant="bordered" minRows={2} {...register("notes")} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" className="min-h-11" onPress={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="min-h-11 bg-accent font-semibold text-white" isLoading={creer.isPending || modifier.isPending}>
              {client ? "Enregistrer" : "Ajouter le client"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
