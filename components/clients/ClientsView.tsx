"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Spinner } from "@heroui/react";
import { IconAddressBook, IconAlarm, IconPlus, IconSearch, IconWallet } from "@tabler/icons-react";
import { ClientFormModal } from "@/components/common/ClientFormModal";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { StatusChip } from "@/components/common/StatusChip";
import type { ClientsListParams } from "@/features/clients/api/clients-api";
import { useClients } from "@/features/clients/query/clients-queries";
import { ETAT_CLIENT_META, etatClient } from "@/lib/credit";
import { formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Client } from "@/types";

const FILTRES = [
  { key: "TOUS", label: "Tous" },
  { key: "AVEC_SOLDE", label: "Qui doivent" },
  { key: "EN_RETARD", label: "En retard" },
];

function filtreApi(cle: string): ClientsListParams["filtre"] {
  return cle === "AVEC_SOLDE" || cle === "EN_RETARD" ? cle : undefined;
}

/** Ce qu'un client doit, en une ligne : le retard d'abord, sinon la prochaine échéance. */
function resume(c: Client): string {
  if (Number(c.enRetard) > 0) return `${formatCurrency(c.enRetard)} en retard depuis ${c.joursRetard} j`;
  if (Number(c.solde) > 0 && c.prochaineEcheance) return `À payer avant le ${formatDateCourte(c.prochaineEcheance)}`;
  if (Number(c.solde) < 0) return `Avoir de ${formatCurrency(Math.abs(Number(c.solde)))}`;
  return "Rien à payer";
}

/** Quincaillerie : les clients pros qui achètent à crédit, ce qu'ils doivent et qui est en retard. */
export function ClientsView() {
  const router = useRouter();
  const [filtre, setFiltre] = useState("TOUS");
  const [saisie, setSaisie] = useState("");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setSearch(saisie.trim()), 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [saisie]);

  const { data, isLoading } = useClients({ filtre: filtreApi(filtre), search: search || undefined });
  const clients = data?.data ?? [];

  // Chiffres d'ensemble, indépendants du filtre affiché.
  const { data: tousRes } = useClients({});
  const tous = tousRes?.data ?? [];
  const aEncaisser = tous.reduce((s, c) => s + Math.max(0, Number(c.solde)), 0);
  const enRetard = tous.filter((c) => Number(c.enRetard) > 0);
  const montantRetard = enRetard.reduce((s, c) => s + Number(c.enRetard), 0);

  return (
    <PageWrapper>
      <PageHero
        tone="return"
        icon={IconAddressBook}
        eyebrow="Opérations"
        title="Clients"
        description="Vos clients pros qui achètent à crédit : ce qu'ils doivent, qui est en retard, et l'encaissement de leurs règlements."
        actions={
          <Button
            className="min-h-11 bg-accent font-semibold text-white"
            startContent={<IconPlus size={18} aria-hidden />}
            onPress={() => setCreateOpen(true)}
          >
            Nouveau client
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile tone="cash" icon={IconWallet} label="À encaisser" value={tousRes ? formatCurrency(aEncaisser) : "—"} />
          <StatTile
            tone="out"
            icon={IconAlarm}
            label="En retard"
            value={tousRes ? formatCurrency(montantRetard) : "—"}
            hint={tousRes && enRetard.length > 0 ? `${enRetard.length} client${enRetard.length > 1 ? "s" : ""}` : undefined}
            delay={0.05}
          />
        </div>
      </PageHero>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SegmentedControl ariaLabel="Filtrer les clients" options={FILTRES} value={filtre} onChange={setFiltre} />
        <Input
          aria-label="Rechercher un client"
          placeholder="Nom ou téléphone"
          variant="bordered"
          value={saisie}
          onValueChange={setSaisie}
          startContent={<IconSearch size={16} className="text-text-muted" aria-hidden />}
          className="md:max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="max-w-md text-sm text-text-muted">
            {search || filtre !== "TOUS"
              ? filtre === "EN_RETARD" && !search
                ? "Aucun client en retard. Tout le monde paie à temps."
                : "Aucun client ne correspond à cette recherche."
              : "Aucun client pour l'instant. Ajoutez vos clients pros pour leur vendre à crédit depuis la caisse."}
          </p>
          {!search && filtre === "TOUS" && (
            <Button variant="bordered" className="min-h-11" startContent={<IconPlus size={16} aria-hidden />} onPress={() => setCreateOpen(true)}>
              Nouveau client
            </Button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface" aria-label="Clients">
          {clients.map((c) => {
            const meta = ETAT_CLIENT_META[etatClient(c)];
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/clients/${c.id}`)}
                  className="grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition-colors duration-150 hover:bg-surface-high focus-visible:outline-accent"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-text">{c.nom}</span>
                    <span className={Number(c.enRetard) > 0 ? "block text-xs text-out-text" : "block text-xs text-text-muted"}>
                      {resume(c)}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className="tabular font-semibold text-text">{formatCurrency(Math.max(0, Number(c.solde)))}</span>
                    <StatusChip label={c.isActif ? meta.label : "Plus de crédit"} tone={c.isActif ? meta.tone : "neutral"} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <ClientFormModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSaved={(c) => router.push(`/clients/${c.id}`)} />
    </PageWrapper>
  );
}
