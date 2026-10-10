"use client";

import { useState } from "react";
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { IconAlertTriangle, IconUserPlus } from "@tabler/icons-react";
import { ClientFormModal } from "@/components/common/ClientFormModal";
import { ModePaiementSelect } from "@/components/common/ModePaiementSelect";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { useClients } from "@/features/clients/query/clients-queries";
import { ECHEANCES_JOURS, creditDisponible, echeanceDans } from "@/lib/credit";
import { formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { ModePaiement, type Client, type VenteCreditOptions } from "@/types";

/** Saisie d'une vente à crédit, avant envoi. */
export interface CreditSaisie {
  clientId: string | null;
  echeanceJours: number;
  /** Montant entier en FCFA, vide = pas d'acompte. */
  acompte: string;
  acompteMode: ModePaiement;
}

export const CREDIT_VIDE: CreditSaisie = { clientId: null, echeanceJours: 30, acompte: "", acompteMode: ModePaiement.CASH };

/** Ce qui empêche d'enregistrer la vente à crédit ; null si tout est bon. */
export function erreurCredit(saisie: CreditSaisie, total: number, client: Client | undefined): string | null {
  if (!saisie.clientId || !client) return "Choisissez le client qui achète à crédit.";
  const acompte = Number(saisie.acompte || 0);
  if (acompte >= total) return "L'acompte couvre toute la vente : encaissez-la comptant.";
  const disponible = creditDisponible(client);
  if (disponible !== null && total - acompte > disponible) {
    return `Plafond dépassé : ${client.nom} peut encore prendre ${formatCurrency(disponible)} à crédit.`;
  }
  return null;
}

export function versOptionsCredit(saisie: CreditSaisie): VenteCreditOptions | null {
  if (!saisie.clientId) return null;
  const acompte = Number(saisie.acompte || 0);
  return {
    clientId: saisie.clientId,
    echeanceJours: saisie.echeanceJours,
    ...(acompte > 0 ? { acompteMontant: acompte.toFixed(2), acompteMode: saisie.acompteMode } : {}),
  };
}

const OPTIONS_ECHEANCE = ECHEANCES_JOURS.map((j) => ({ key: String(j), label: `${j} jours` }));

interface VenteCreditFieldsProps {
  total: number;
  valeur: CreditSaisie;
  onChange: (valeur: CreditSaisie) => void;
}

/**
 * Vente à crédit : le client pro (ou un nouveau), le délai de paiement et un acompte éventuel.
 * Montre ce que le client doit déjà, son retard et ce qu'il devra après cette vente.
 */
export function VenteCreditFields({ total, valeur, onChange }: VenteCreditFieldsProps) {
  const { data, isLoading } = useClients({ actifs: true });
  const clients = data?.data ?? [];
  const client = clients.find((c) => c.id === valeur.clientId);
  const [recherche, setRecherche] = useState("");
  const [creationOpen, setCreationOpen] = useState(false);

  const maj = (patch: Partial<CreditSaisie>) => onChange({ ...valeur, ...patch });
  const acompte = Number(valeur.acompte || 0);
  const resteSurCompte = Math.max(0, total - acompte);
  const erreur = client ? erreurCredit(valeur, total, client) : null;

  return (
    <div className="space-y-3">
      <p className="flex items-baseline justify-between rounded-lg border border-cash/40 bg-cash-dim px-3 py-2">
        <span className="text-sm text-text-muted">Montant de la vente</span>
        <span className="tabular text-lg font-semibold text-cash-text">{formatCurrency(total)}</span>
      </p>
      <div className="flex items-end gap-2">
        <Autocomplete
          label="Client"
          placeholder="Nom ou téléphone"
          variant="bordered"
          size="sm"
          isLoading={isLoading}
          defaultItems={clients}
          selectedKey={valeur.clientId}
          inputValue={client && !recherche ? client.nom : recherche}
          onInputChange={setRecherche}
          onSelectionChange={(cle) => {
            maj({ clientId: cle === null ? null : String(cle) });
            setRecherche("");
          }}
          listboxProps={{ emptyContent: "Aucun client à ce nom. Ajoutez-le avec le bouton à côté." }}
          className="flex-1"
        >
          {(c) => (
            <AutocompleteItem key={c.id} textValue={c.nom}>
              <span className="flex items-center justify-between gap-3">
                <span className="truncate">{c.nom}</span>
                {Number(c.solde) > 0 && <span className="tabular shrink-0 text-xs text-text-muted">doit {formatCurrency(c.solde)}</span>}
              </span>
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Button
          isIconOnly
          variant="bordered"
          className="min-h-11 min-w-11"
          aria-label="Ajouter un nouveau client"
          onPress={() => setCreationOpen(true)}
        >
          <IconUserPlus size={18} aria-hidden />
        </Button>
      </div>

      {client && (
        <div className="rounded-lg bg-surface-high px-3 py-2 text-xs text-text-muted">
          {Number(client.solde) > 0 ? (
            <>Doit déjà {formatCurrency(client.solde)}</>
          ) : (
            <>Rien à payer pour l&apos;instant</>
          )}
          {client.plafondCredit !== null && <> · plafond {formatCurrency(client.plafondCredit)}</>}
          {Number(client.enRetard) > 0 && (
            <span className="mt-1 flex items-center gap-1.5 font-medium text-out-text">
              <IconAlertTriangle size={14} aria-hidden />
              {formatCurrency(client.enRetard)} en retard depuis {client.joursRetard} j
            </span>
          )}
        </div>
      )}

      <div>
        <p className="mb-1.5 text-xs text-text-muted">Paiement attendu sous</p>
        <SegmentedControl
          ariaLabel="Délai de paiement"
          options={OPTIONS_ECHEANCE}
          value={OPTIONS_ECHEANCE.find((o) => o.key === String(valeur.echeanceJours))?.key ?? null}
          onChange={(cle) => maj({ echeanceJours: Number(cle) })}
        />
        <p className="mt-1 text-xs text-text-muted">Échéance le {formatDateCourte(echeanceDans(valeur.echeanceJours))}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Acompte"
          description="Facultatif"
          inputMode="numeric"
          variant="bordered"
          size="sm"
          value={valeur.acompte}
          onValueChange={(v) => /^\d*$/.test(v) && maj({ acompte: v })}
          endContent={<span className="text-xs text-text-muted">FCFA</span>}
        />
        {acompte > 0 && <ModePaiementSelect value={valeur.acompteMode} onChange={(m) => maj({ acompteMode: m })} />}
      </div>

      <p className="flex items-baseline justify-between rounded-lg border border-return-line bg-return-dim px-3 py-2 text-sm">
        <span className="text-return-text">Mis sur le compte du client</span>
        <span className="tabular font-semibold text-return-text">{formatCurrency(resteSurCompte)}</span>
      </p>
      {erreur && (
        <p role="alert" className="text-xs font-medium text-out-text">
          {erreur}
        </p>
      )}

      <ClientFormModal
        isOpen={creationOpen}
        onClose={() => setCreationOpen(false)}
        nomPropose={recherche}
        onSaved={(nouveau) => {
          maj({ clientId: nouveau.id });
          setRecherche("");
        }}
      />
    </div>
  );
}
