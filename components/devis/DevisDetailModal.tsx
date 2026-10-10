"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { IconCheck, IconPrinter, IconReceipt, IconRotate, IconX } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import {
  CREDIT_VIDE,
  VenteCreditFields,
  erreurCredit,
  versOptionsCredit,
  type CreditSaisie,
} from "@/components/common/VenteCreditFields";
import { StatusChip } from "@/components/common/StatusChip";
import { SortiePaiementStep } from "@/components/sorties/SortiePaiementStep";
import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { useClients } from "@/features/clients/query/clients-queries";
import { useAddTransaction } from "@/features/caisse/mutation/caisse-mutations";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { useChangerStatutDevis, useConvertirDevis } from "@/features/devis/mutation/devis-mutations";
import { useDevis } from "@/features/devis/query/devis-queries";
import { ETAT_DEVIS_META, etatDevis } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { ModePaiement, StatutDevis } from "@/types";
import { DevisDocument } from "./DevisDocument";
import { buildDevisDocument, printDevisDocument } from "./proforma";

const OPTIONS_REGLEMENT = [
  { key: "COMPTANT", label: "Comptant" },
  { key: "CREDIT", label: "À crédit" },
];

interface DevisDetailModalProps {
  devisId: string | null;
  onClose: () => void;
}

/**
 * Un devis : la proforma telle que le client la recevra, et ce qu'on peut en faire selon son état
 * (imprimer, accepter, annuler, encaisser pour le transformer en vente).
 */
export function DevisDetailModal({ devisId, onClose }: DevisDetailModalProps) {
  const { data, isLoading } = useDevis(devisId);
  const devis = data?.data;
  const { data: boutiqueRes } = useMyBoutique();
  const { data: sessionRes } = useActiveSession();
  const caisseOuverte = Boolean(sessionRes?.data);

  const changerStatut = useChangerStatutDevis();
  const convertir = useConvertirDevis();
  const addTransaction = useAddTransaction();

  const [encaissement, setEncaissement] = useState(false);
  const [confirmAnnuler, setConfirmAnnuler] = useState(false);
  const [mode, setMode] = useState<ModePaiement | null>(null);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [montantRecu, setMontantRecu] = useState("");
  // Un client pro peut emporter sa commande et payer plus tard.
  const [reglement, setReglement] = useState("COMPTANT");
  const [credit, setCredit] = useState<CreditSaisie>(CREDIT_VIDE);
  const { data: clientsRes } = useClients({ actifs: true });

  useEffect(() => {
    setEncaissement(false);
    setReglement("COMPTANT");
    setCredit(CREDIT_VIDE);
    setMode(null);
    setReference("");
    setNotes("");
    setMontantRecu("");
  }, [devisId]);

  const etat = devis ? etatDevis(devis) : null;
  const meta = etat ? ETAT_DEVIS_META[etat] : null;
  const ouvert = devis?.statut === StatutDevis.EN_COURS || devis?.statut === StatutDevis.ACCEPTE;
  const doc = devis ? buildDevisDocument(devis, boutiqueRes?.data) : null;
  const montantInsuffisant =
    mode === ModePaiement.CASH && montantRecu !== "" && Number(montantRecu) < Number(devis?.totalMontant ?? 0);

  const aCredit = reglement === "CREDIT";
  const clientCredit = clientsRes?.data.find((c) => c.id === credit.clientId);
  const blocageCredit = devis ? erreurCredit(credit, Number(devis.totalMontant), clientCredit) : null;

  const vendreACredit = async () => {
    const options = versOptionsCredit(credit);
    if (!devis || !options || blocageCredit) return;
    try {
      const { data: res } = await convertir.mutateAsync({ id: devis.id, credit: options });
      toast.success(`Vente ${res.sortie.reference} mise sur le compte de ${clientCredit?.nom ?? "ce client"}`);
      setEncaissement(false);
    } catch {
      // Message d'erreur affiché par la mutation (plafond, caisse fermée, stock insuffisant…).
    }
  };

  const encaisser = async () => {
    if (!devis || !mode || montantInsuffisant) return;
    try {
      const { data: res } = await convertir.mutateAsync({ id: devis.id });
      try {
        await addTransaction.mutateAsync({
          montant: res.sortie.totalMontant,
          modePaiement: mode,
          sortieId: res.sortie.id,
          reference: reference || undefined,
          notes: notes || undefined,
        });
        toast.success(`Vente ${res.sortie.reference} enregistrée`);
      } catch {
        toast.error("Vente créée, mais le paiement n'a pas été enregistré : ajoutez-le depuis la caisse");
      }
      setEncaissement(false);
    } catch {
      // Message d'erreur affiché par la mutation (caisse fermée, stock insuffisant…).
    }
  };

  return (
    <>
      <Modal isOpen={devisId !== null} onClose={onClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-wrap items-center gap-3">
            <span>{devis ? `Devis ${devis.reference}` : "Devis"}</span>
            {meta && <StatusChip label={meta.label} tone={meta.tone} icon={meta.icon} />}
          </ModalHeader>
          <ModalBody>
            {isLoading || !devis || !doc ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : encaissement ? (
              <div className="space-y-4">
                {!caisseOuverte ? (
                  <p className="rounded-lg border border-out/40 bg-out-dim p-3 text-sm text-text">
                    Aucune caisse ouverte : la vente ne peut pas être enregistrée.{" "}
                    <Link href="/caisse" className="font-semibold text-accent underline">
                      Ouvrir la caisse
                    </Link>
                  </p>
                ) : (
                  <>
                    <SegmentedControl
                      ariaLabel="Mode de règlement"
                      options={OPTIONS_REGLEMENT}
                      value={reglement}
                      onChange={setReglement}
                    />
                    {aCredit ? (
                      <VenteCreditFields total={Number(devis.totalMontant)} valeur={credit} onChange={setCredit} />
                    ) : (
                      <SortiePaiementStep
                        totalMontant={devis.totalMontant}
                        totalAvantRemise={devis.totalAvantRemise}
                        remiseMontant={devis.remiseMontant}
                        selected={mode}
                        onSelect={setMode}
                        reference={reference}
                        onChangeReference={setReference}
                        notes={notes}
                        onChangeNotes={setNotes}
                        montantRecu={montantRecu}
                        onChangeMontantRecu={setMontantRecu}
                      />
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                {devis.statut === StatutDevis.CONVERTI && devis.sortie && (
                  <p className="flex items-center gap-2 rounded-lg bg-in-dim px-3 py-2 text-sm text-in-text">
                    <IconReceipt size={16} aria-hidden />
                    Devenu la vente {devis.sortie.reference} : le stock est sorti.
                  </p>
                )}
                {etat === "EXPIRE" && (
                  <p className="rounded-lg bg-return-dim px-3 py-2 text-sm text-return-text">
                    La date de validité est passée. Vous pouvez encore le transformer en vente si le client confirme aux mêmes
                    prix.
                  </p>
                )}
                <DevisDocument doc={doc} />
              </>
            )}
          </ModalBody>
          <ModalFooter className="flex flex-wrap gap-2">
            {devis && doc && !encaissement && (
              <>
                <Button
                  variant="bordered"
                  className="min-h-11"
                  startContent={<IconPrinter size={16} aria-hidden />}
                  onPress={() => printDevisDocument(doc)}
                >
                  Imprimer
                </Button>
                {ouvert && (
                  <Button
                    variant="light"
                    className="min-h-11 text-out-text"
                    startContent={<IconX size={16} aria-hidden />}
                    onPress={() => setConfirmAnnuler(true)}
                  >
                    Annuler le devis
                  </Button>
                )}
                {devis.statut === StatutDevis.ANNULE && (
                  <Button
                    variant="bordered"
                    className="min-h-11"
                    startContent={<IconRotate size={16} aria-hidden />}
                    isLoading={changerStatut.isPending}
                    onPress={() => changerStatut.mutate({ id: devis.id, statut: StatutDevis.EN_COURS })}
                  >
                    Remettre en cours
                  </Button>
                )}
                <span className="flex-1" />
                {devis.statut === StatutDevis.EN_COURS && (
                  <Button
                    variant="bordered"
                    className="min-h-11"
                    startContent={<IconCheck size={16} aria-hidden />}
                    isLoading={changerStatut.isPending}
                    onPress={() => changerStatut.mutate({ id: devis.id, statut: StatutDevis.ACCEPTE })}
                  >
                    Client d&apos;accord
                  </Button>
                )}
                {ouvert && (
                  <Button className="min-h-11 bg-accent font-semibold text-white" onPress={() => setEncaissement(true)}>
                    Encaisser et vendre
                  </Button>
                )}
              </>
            )}
            {devis && encaissement && (
              <>
                <Button variant="light" className="min-h-11" onPress={() => setEncaissement(false)}>
                  Retour au devis
                </Button>
                <span className="flex-1" />
                {aCredit ? (
                  <Button
                    className="min-h-11 bg-return font-semibold text-white"
                    isDisabled={!caisseOuverte || Boolean(blocageCredit)}
                    isLoading={convertir.isPending}
                    onPress={() => void vendreACredit()}
                  >
                    Vendre à crédit
                  </Button>
                ) : (
                  <Button
                    className="min-h-11 bg-accent font-semibold text-white"
                    isDisabled={!caisseOuverte || !mode || montantInsuffisant}
                    isLoading={convertir.isPending || addTransaction.isPending}
                    onPress={() => void encaisser()}
                  >
                    Encaisser {formatCurrency(devis.totalMontant)}
                  </Button>
                )}
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmModal
        isOpen={confirmAnnuler}
        onClose={() => setConfirmAnnuler(false)}
        onConfirm={() => {
          if (devis) changerStatut.mutate({ id: devis.id, statut: StatutDevis.ANNULE });
          setConfirmAnnuler(false);
        }}
        title="Annuler ce devis ?"
        message="Le devis ne pourra plus devenir une vente, sauf si vous le remettez en cours."
        confirmLabel="Annuler le devis"
        danger
      />
    </>
  );
}
