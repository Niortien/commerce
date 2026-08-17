"use client";

import { useEffect } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { ModePaiement } from "@/types";
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
}: RecuPrintProps) {
  const boutiqueName = useAuthStore((s) => s.user?.boutiqueName ?? null);
  const contact = getBoutiqueContact(boutiqueName);

  const now = new Date();
  const isFeteIndependance = now.getMonth() === 7 && (now.getDate() === 7 || now.getDate() === 8);

  const showCash = modePaiement === ModePaiement.CASH && !!montantRecu;
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
          <div style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 3 }}>DRI VALÉ</div>
          {boutiqueName && (
            <div style={{ fontSize: 10, fontWeight: "bold", marginTop: 1 }}>{boutiqueName}</div>
          )}
          {contact && (
            <div style={{ fontSize: 9, marginTop: 1 }}>{contact.telephones.join(" / ")}</div>
          )}
          {!boutiqueName && (
            <div style={{ fontSize: 9 }}>Dri Valé — Gestion Boutique</div>
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
            <div style={{ paddingLeft: 6 }}>{l.taille} · {l.couleur}</div>
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
        <div style={{ fontSize: 9, marginTop: 2 }}>Mode : {MODE_LABELS[modePaiement]}</div>
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
        <div style={{ textAlign: "center", fontSize: 9, fontStyle: "italic" }}>Sortez toujours bien habillé</div>
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
          Dri Valé
        </div>
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
          <ModalHeader className="text-base font-semibold">Reçu client</ModalHeader>
          <ModalBody>
            <div className="rounded-lg border border-border/60 bg-white p-4 text-black">
              {/* En-tête */}
              <div className="mb-2 text-center">
                <p className="text-base font-bold tracking-[0.25em]">DRI VALÉ</p>
                {boutiqueName && (
                  <p className="text-[11px] font-semibold text-gray-800">{boutiqueName}</p>
                )}
                {contact && (
                  <p className="text-[10px] text-gray-500">{contact.telephones.join(" / ")}</p>
                )}
                {!boutiqueName && (
                  <p className="text-[10px] text-gray-500">Boutique · Stock & Caisse</p>
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
                  <p className="pl-2 text-gray-500">{l.taille} · {l.couleur}</p>
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
                <div className="flex justify-between">
                  <span>Mode</span>
                  <span className="font-medium text-black">{MODE_LABELS[modePaiement]}</span>
                </div>
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
              <p className="text-center text-[10px] italic text-gray-400">Sortez toujours bien habillé</p>
              {isFeteIndependance && (
                <p className="mt-1 text-center text-[11px] font-bold text-orange-600">
                  🇨🇮 Bonne fête d&apos;indépendance ! 🇨🇮
                </p>
              )}
              <p className="mt-3 text-center text-lg font-bold italic tracking-[0.3em] text-gray-300">
                Dri Valé
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="gap-3">
            <Button variant="flat" className="flex-1 text-text-muted" onPress={onClose}>
              Fermer
            </Button>
            <Button
              className="flex-1 bg-accent font-semibold text-black"
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
