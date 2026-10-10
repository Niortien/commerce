"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { ModePaiementSelect } from "@/components/common/ModePaiementSelect";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { useReglerClient } from "@/features/clients/mutation/clients-mutations";
import { formatCurrency } from "@/lib/formatCurrency";
import { ModePaiement, type Client } from "@/types";

interface ReglementModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

/** Le client paie tout ou partie de ce qu'il doit ; l'argent entre dans la caisse ouverte. */
export function ReglementModal({ isOpen, onClose, client }: ReglementModalProps) {
  const regler = useReglerClient(client.id);
  const { data: sessionRes } = useActiveSession();
  const caisseOuverte = Boolean(sessionRes?.data);
  const [montant, setMontant] = useState("");
  const [mode, setMode] = useState<ModePaiement>(ModePaiement.CASH);

  const solde = Math.round(Number(client.solde));
  const retard = Math.round(Number(client.enRetard));

  useEffect(() => {
    if (isOpen) {
      setMontant("");
      setMode(ModePaiement.CASH);
    }
  }, [isOpen]);

  const valeur = Number(montant || 0);
  const tropEleve = valeur > solde;
  const raccourcis = [
    { label: `Tout : ${formatCurrency(solde)}`, montant: solde },
    ...(retard > 0 && retard < solde ? [{ label: `Le retard : ${formatCurrency(retard)}`, montant: retard }] : []),
  ];

  const enregistrer = async () => {
    if (!(valeur > 0) || tropEleve) return;
    await regler.mutateAsync({ montant: valeur, modePaiement: mode });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>Règlement de {client.nom}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-text-muted">
            Doit {formatCurrency(solde)}
            {retard > 0 && <span className="font-medium text-out-text"> · dont {formatCurrency(retard)} en retard</span>}
          </p>
          {!caisseOuverte && (
            <p className="rounded-lg border border-out-line bg-out-dim p-3 text-sm text-text">
              Aucune caisse ouverte : le règlement ne peut pas être encaissé.{" "}
              <Link href="/caisse" className="font-semibold text-accent underline">
                Ouvrir la caisse
              </Link>
            </p>
          )}
          <Input
            autoFocus
            label="Montant reçu"
            inputMode="numeric"
            variant="bordered"
            value={montant}
            onValueChange={(v) => /^\d*$/.test(v) && setMontant(v)}
            endContent={<span className="text-xs text-text-muted">FCFA</span>}
            isInvalid={tropEleve}
            errorMessage={tropEleve ? `${client.nom} ne doit que ${formatCurrency(solde)}` : undefined}
          />
          <div className="flex flex-wrap gap-2">
            {raccourcis.map((r) => (
              <Button key={r.label} size="sm" variant="bordered" className="tabular min-h-11" onPress={() => setMontant(String(r.montant))}>
                {r.label}
              </Button>
            ))}
          </div>
          <ModePaiementSelect value={mode} onChange={setMode} label="Payé en" />
          {valeur > 0 && !tropEleve && (
            <p className="flex items-baseline justify-between rounded-lg bg-surface-high px-3 py-2 text-sm">
              <span className="text-text-muted">Restera dû</span>
              <span className="tabular font-semibold text-text">{formatCurrency(solde - valeur)}</span>
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" className="min-h-11" onPress={onClose}>
            Annuler
          </Button>
          <Button
            className="min-h-11 bg-accent font-semibold text-white"
            isDisabled={!caisseOuverte || !(valeur > 0) || tropEleve}
            isLoading={regler.isPending}
            onPress={() => void enregistrer()}
          >
            Encaisser {valeur > 0 ? formatCurrency(valeur) : ""}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
