"use client";

import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { IconCloudOff, IconCloudUpload, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useEnLigne, useSynchroHorsLigne } from "@/hooks/useHorsLigne";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import { useHorsLigneStore } from "@/stores/horsLigneStore";
import { formatCurrency } from "@/lib/formatCurrency";

function heure(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/**
 * Bandeau de la caisse sans internet : dit quand l'appareil est hors connexion, combien de ventes
 * attendent d'être envoyées, et laisse décider des ventes refusées par le serveur.
 * Il fait aussi tourner l'envoi automatique (useSynchroHorsLigne).
 */
export function HorsLigneBanner() {
  useSynchroHorsLigne();
  const enLigne = useEnLigne();
  const boutiqueId = useBoutiqueId();
  const toutes = useHorsLigneStore((s) => s.ventes);
  const reessayer = useHorsLigneStore((s) => s.reessayer);
  const retirer = useHorsLigneStore((s) => s.retirerVente);
  const [ouvert, setOuvert] = useState(false);
  const [aSupprimer, setASupprimer] = useState<string | null>(null);

  const ventes = toutes.filter((v) => v.boutiqueId === boutiqueId);
  const refusees = ventes.filter((v) => v.erreur !== null);
  const enAttente = ventes.length - refusees.length;

  if (enLigne && ventes.length === 0) return null;

  const texteAttente = enAttente > 0 ? `${enAttente} vente${enAttente > 1 ? "s" : ""} en attente d'envoi` : null;
  const texteRefus = refusees.length > 0 ? `${refusees.length} refusée${refusees.length > 1 ? "s" : ""} à vérifier` : null;

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className={[
          "flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2 text-sm",
          refusees.length > 0
            ? "border-out-line bg-out-dim text-out-text"
            : enLigne
              ? "border-cash/30 bg-cash-dim text-cash-text"
              : "border-return-line bg-return-dim text-return-text",
        ].join(" ")}
      >
        {enLigne ? <IconCloudUpload size={18} aria-hidden /> : <IconCloudOff size={18} aria-hidden />}
        <span className="min-w-0 flex-1">
          <strong className="font-semibold">{enLigne ? "Envoi des ventes" : "Hors connexion"}</strong>
          {" — "}
          {enLigne
            ? [texteAttente, texteRefus].filter(Boolean).join(", ")
            : `tu peux continuer à vendre, les ventes sont gardées sur l'appareil${texteAttente ? ` (${texteAttente})` : ""}.`}
        </span>
        {ventes.length > 0 && (
          <Button size="sm" variant="flat" className="h-7 min-w-0 bg-white/40 px-3 dark:bg-white/10" onPress={() => setOuvert(true)}>
            Voir
          </Button>
        )}
      </div>

      <Modal isOpen={ouvert} onClose={() => setOuvert(false)} size="lg" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Ventes faites hors connexion
            <span className="text-xs font-normal text-text-muted">
              Elles partent toutes seules dès que le réseau revient. Une vente refusée (stock épuisé, caisse fermée…)
              attend ta décision.
            </span>
          </ModalHeader>
          <ModalBody>
            <ul className="space-y-2">
              {ventes.map((v) => (
                <li key={v.corps.clientRef} className="rounded-lg border border-border/60 bg-[var(--color-surface-high)] p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs text-text-muted">{heure(v.corps.venduLe)}</span>
                    <span className="font-mono text-sm font-semibold text-text">{formatCurrency(v.total)}</span>
                  </div>
                  <p className="mt-1 text-sm text-text">{v.resume}</p>
                  {v.erreur ? (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-out-text">Refusée : {v.erreur}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="flat" startContent={<IconRefresh size={14} aria-hidden />} onPress={() => reessayer(v.corps.clientRef)}>
                          Renvoyer
                        </Button>
                        <Button size="sm" variant="light" color="danger" startContent={<IconTrash size={14} aria-hidden />} onPress={() => setASupprimer(v.corps.clientRef)}>
                          Abandonner
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-text-muted">En attente d&apos;envoi</p>
                  )}
                </li>
              ))}
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setOuvert(false)}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={aSupprimer !== null} onClose={() => setASupprimer(null)} size="sm">
        <ModalContent>
          <ModalHeader>Abandonner cette vente ?</ModalHeader>
          <ModalBody>
            <p className="text-sm text-text-muted">
              Elle ne sera jamais enregistrée : ni sortie de stock, ni encaissement. Fais-le seulement si la vente
              n&apos;a pas eu lieu ou si tu l&apos;as saisie autrement.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setASupprimer(null)}>
              Garder
            </Button>
            <Button
              color="danger"
              onPress={() => {
                if (aSupprimer) retirer(aSupprimer);
                setASupprimer(null);
              }}
            >
              Abandonner la vente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
