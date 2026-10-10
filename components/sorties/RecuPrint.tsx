"use client";

import { useEffect } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { IconCircleCheck } from "@tabler/icons-react";
import { ModePaiement, TypeCommerce } from "@/types";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { formatDateCourte } from "@/lib/devis";
import { formatDateFr } from "@/lib/dateUtils";
import { useAuthStore } from "@/stores/authStore";
import { getBoutiqueContact } from "@/lib/boutiqueConfig";

export interface RecuLigne {
  produitNom: string;
  taille: string;
  couleur: string;
  quantite: number;
  prixUnitaire: string;
  sousTotal: string;
}

const MODE_LABELS: Record<ModePaiement, string> = {
  CASH: "Espèces",
  WAVE: "Wave",
  ORANGE_MONEY: "Orange Money",
  CARTE: "Carte bancaire",
  MTN_MONEY: "MTN Money",
};

/** Vente à crédit : ce qui est payé maintenant et ce qui reste dû par le client. */
export interface RecuCredit {
  client: string;
  acompte: number;
  acompteMode?: ModePaiement;
  reste: number;
  /** AAAA-MM-JJ */
  echeance: string;
}

interface RecuPrintProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  date: string;
  lignes: RecuLigne[];
  totalMontant: string;
  modePaiement: ModePaiement;
  transactionReference?: string;
  montantRecu?: string;
  monnaieRendue?: string;
  remiseMontant?: string;
  totalAvantRemise?: string;
  credit?: RecuCredit;
}

function printRecu() {
  const content = document.getElementById("recu-print-root");
  if (!content) return;

  const w = window.open("", "_blank", "width=350,height=700,toolbar=0,menubar=0");
  if (!w) {
    window.print();
    return;
  }

  const style = w.document.createElement("style");
  style.textContent = [
    "@page { size: 80mm auto; margin: 0; }",
    "body { font-family: monospace; font-size: 10px; width: 80mm;",
    "       margin: 0; padding: 3mm 3mm 2mm; line-height: 1.3; color: #000; }",
    "div { page-break-inside: avoid; break-inside: avoid; }",
  ].join("\n");
  w.document.head.appendChild(style);

  const clone = content.cloneNode(true) as HTMLElement;
  clone.style.display = "block";
  w.document.body.appendChild(clone);

  w.focus();
  w.print();
  w.close();
}

export function RecuPrint({
  isOpen,
  onClose,
  reference,
  date,
  lignes,
  totalMontant,
  modePaiement,
  transactionReference,
  montantRecu,
  monnaieRendue,
  remiseMontant,
  totalAvantRemise,
  credit,
}: RecuPrintProps) {
  const boutiqueName = useAuthStore((s) => s.user?.boutiqueName ?? null);
  // Chaque boutique imprime ses reçus à son nom (l'en-tête « Luxury Boutique » datait de la version mono-boutique).
  const enseigne = boutiqueName ?? "Mon Djossi";
  const contact = getBoutiqueContact(boutiqueName);

  const now = new Date();
  const isFeteIndependance = now.getMonth() === 7 && (now.getDate() === 7 || now.getDate() === 8);

  const showCash = !credit && modePaiement === ModePaiement.CASH && !!montantRecu;
  // Le slogan parle de vêtements : il n'a pas sa place sur le reçu d'une quincaillerie ou d'un restaurant.
  const typeCommerce = useTypeCommerce();
  const sloganVetements = typeCommerce === TypeCommerce.VETEMENTS || typeCommerce === TypeCommerce.FRIPERIE;
  const fcfa = (n: number | string) => `${Number(n).toLocaleString("fr-FR")} FCFA`;
  const showRemise = !!remiseMontant && parseFloat(remiseMontant) > 0;

  useEffect(() => {
    const el = document.getElementById("recu-print-root");
    if (!el) return;
    el.style.display = isOpen ? "block" : "none";
  }, [isOpen]);

  return (
    <>
      {/* Zone d'impression — hors modal, visible uniquement @media print */}
      <div id="recu-print-root" aria-hidden="true" style={{ display: "none" }}>
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 2 }}>{enseigne.toUpperCase()}</div>
          {contact && (
            <div style={{ fontSize: 9, marginTop: 1 }}>{contact.telephones.join(" / ")}</div>
          )}
        </div>
        <div style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />
        <div style={{ fontSize: 9 }}>
          <div>Date : {formatDateFr(date)}</div>
          <div>Réf  : {reference}</div>
          {transactionReference && <div>Pmt  : {transactionReference}</div>}
        </div>
        <div style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />
        {lignes.map((l, i) => (
          <div key={i} style={{ fontSize: 9, marginBottom: 2 }}>
            <div style={{ fontWeight: "bold" }}>{l.produitNom}</div>
            <div style={{ paddingLeft: 6 }}>{l.couleur ? `${l.taille} · ${l.couleur}` : l.taille}</div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 6 }}>
              <span>{l.quantite} x {Number(l.prixUnitaire).toLocaleString("fr-FR")} FCFA</span>
              <span>{Number(l.sousTotal).toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />
        {showRemise && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
              <span>Sous-total</span>
              <span>{Number(totalAvantRemise).toLocaleString("fr-FR")} FCFA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginTop: 1 }}>
              <span>Reduction</span>
              <span>- {Number(remiseMontant).toLocaleString("fr-FR")} FCFA</span>
            </div>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 11, marginTop: showRemise ? 2 : 0 }}>
          <span>TOTAL</span>
          <span>{Number(totalMontant).toLocaleString("fr-FR")} FCFA</span>
        </div>
        {credit ? (
          <>
            <div style={{ fontSize: 9, marginTop: 2, fontWeight: "bold" }}>Vente à crédit : {credit.client}</div>
            {credit.acompte > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginTop: 1 }}>
                <span>Acompte{credit.acompteMode ? ` (${MODE_LABELS[credit.acompteMode]})` : ""}</span>
                <span>{fcfa(credit.acompte)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginTop: 1, fontWeight: "bold" }}>
              <span>Reste dû</span>
              <span>{fcfa(credit.reste)}</span>
            </div>
            <div style={{ fontSize: 9, marginTop: 1 }}>À payer avant le {formatDateCourte(credit.echeance)}</div>
          </>
        ) : (
          <div style={{ fontSize: 9, marginTop: 2 }}>Mode : {MODE_LABELS[modePaiement]}</div>
        )}
        {showCash && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginTop: 1 }}>
              <span>Recu</span>
              <span>{Number(montantRecu).toLocaleString("fr-FR")} FCFA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginTop: 1, fontWeight: "bold" }}>
              <span>Monnaie rendue</span>
              <span>{Number(monnaieRendue ?? 0).toLocaleString("fr-FR")} FCFA</span>
            </div>
          </>
        )}
        <div style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />
        <div style={{ textAlign: "center", fontSize: 9 }}>Merci pour votre achat !</div>
        {sloganVetements && <div style={{ textAlign: "center", fontSize: 9, fontStyle: "italic" }}>Sortez toujours bien habillé</div>}
        {isFeteIndependance && (
          <div style={{ textAlign: "center", fontSize: 10, fontWeight: "bold", marginTop: 4, letterSpacing: 1 }}>
            🇨🇮 Bonne fête d&apos;indépendance ! 🇨🇮
          </div>
        )}
        <div style={{
          textAlign: "center",
          marginTop: 10,
          fontSize: 16,
          fontWeight: "bold",
          fontStyle: "italic",
          letterSpacing: 4,
          color: "#bbb",
          lineHeight: 1,
        }}>
          {enseigne}
        </div>
        <div style={{ borderTop: "1px dashed #000", margin: "8px 0 4px" }} />
        <div style={{ textAlign: "center", fontSize: 8 }}>Propulsé par Mon Djossi</div>
        <div style={{ textAlign: "center", fontSize: 8 }}>Gérez · Vendez · Développez</div>
      </div>

      {/* Modal visuelle */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={(open) => { if (!open) onClose(); }}
        size="sm"
        classNames={{
          wrapper: "z-[1000]",
          backdrop: "z-[950]",
          base: "bg-[var(--color-surface)] border border-border",
          header: "border-b border-border/60",
          footer: "border-t border-border/60",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col items-start gap-0.5">
            <span className="flex items-center gap-1.5 text-base font-semibold text-in">
              <IconCircleCheck size={18} />
              Vente enregistrée
            </span>
            <span className="text-xs font-normal text-text-muted">
              {credit
                ? `${fcfa(credit.acompte)} encaissés · ${fcfa(credit.reste)} à crédit`
                : `${fcfa(totalMontant)} encaissés`}
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-lg border border-border/60 bg-white p-4 text-black">
              {/* En-tête */}
              <div className="mb-2 text-center">
                <p className="text-base font-bold tracking-[0.15em]">{enseigne.toUpperCase()}</p>
                {contact && (
                  <p className="text-[10px] text-gray-500">{contact.telephones.join(" / ")}</p>
                )}
              </div>
              <div className="my-2 border-t border-dashed border-gray-300" />

              {/* Infos */}
              <div className="space-y-0.5 text-[10px] text-gray-700">
                <p>Date : {formatDateFr(date)}</p>
                <p>Réf : {reference}</p>
                {transactionReference && <p>Pmt : {transactionReference}</p>}
              </div>
              <div className="my-2 border-t border-dashed border-gray-300" />

              {/* Lignes */}
              {lignes.map((l, i) => (
                <div key={i} className="mb-2 text-[10px]">
                  <p className="font-medium text-black">{l.produitNom}</p>
                  <p className="pl-2 text-gray-500">{l.couleur ? `${l.taille} · ${l.couleur}` : l.taille}</p>
                  <div className="flex justify-between pl-2">
                    <span>{l.quantite} × {Number(l.prixUnitaire).toLocaleString("fr-FR")} FCFA</span>
                    <span className="font-medium">{Number(l.sousTotal).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              ))}
              <div className="my-2 border-t border-dashed border-gray-300" />

              {/* Remise */}
              {showRemise && (
                <div className="mb-1 space-y-0.5 text-[10px] text-gray-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{Number(totalAvantRemise).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Réduction</span>
                    <span>− {Number(remiseMontant).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{Number(totalMontant).toLocaleString("fr-FR")} FCFA</span>
              </div>

              {/* Paiement */}
              <div className="mt-2 space-y-1 text-[10px] text-gray-600">
                {credit ? (
                  <>
                    <div className="flex justify-between">
                      <span>Vente à crédit</span>
                      <span className="font-medium text-black">{credit.client}</span>
                    </div>
                    {credit.acompte > 0 && (
                      <div className="flex justify-between">
                        <span>Acompte{credit.acompteMode ? ` (${MODE_LABELS[credit.acompteMode]})` : ""}</span>
                        <span className="font-medium text-black">{fcfa(credit.acompte)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-dashed border-gray-200 pt-1">
                      <span className="font-semibold text-black">Reste dû</span>
                      <span className="font-bold text-black">{fcfa(credit.reste)}</span>
                    </div>
                    <p>À payer avant le {formatDateCourte(credit.echeance)}</p>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Mode</span>
                    <span className="font-medium text-black">{MODE_LABELS[modePaiement]}</span>
                  </div>
                )}
                {showCash && (
                  <>
                    <div className="flex justify-between">
                      <span>Reçu</span>
                      <span className="font-medium text-black">
                        {Number(montantRecu).toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-gray-200 pt-1">
                      <span className="font-semibold text-black">Monnaie rendue</span>
                      <span className="font-bold text-green-700">
                        {Number(monnaieRendue ?? 0).toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="my-2 border-t border-dashed border-gray-300" />
              <p className="text-center text-[10px] text-gray-500">Merci pour votre achat !</p>
              {sloganVetements && <p className="text-center text-[10px] italic text-gray-400">Sortez toujours bien habillé</p>}
              {isFeteIndependance && (
                <p className="mt-1 text-center text-[11px] font-bold text-orange-600">
                  🇨🇮 Bonne fête d&apos;indépendance ! 🇨🇮
                </p>
              )}
              <p className="mt-3 text-center text-lg font-bold italic tracking-[0.3em] text-gray-300">
                {enseigne}
              </p>
              <div className="mt-3 border-t border-dashed border-gray-300 pt-2 text-center text-[9px] text-gray-400">
                <p>Propulsé par Mon Djossi</p>
                <p>Gérez · Vendez · Développez</p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="gap-3">
            <Button variant="flat" className="flex-1 text-text-muted" onPress={onClose}>
              Fermer
            </Button>
            <Button
              className="flex-1 bg-accent font-semibold text-white"
              onPress={printRecu}
            >
              🖨 Imprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
