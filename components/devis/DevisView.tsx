"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Spinner } from "@heroui/react";
import { IconClock, IconFileInvoice, IconPlus, IconSearch, IconWallet } from "@tabler/icons-react";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { StatusChip } from "@/components/common/StatusChip";
import { useDevisList } from "@/features/devis/query/devis-queries";
import { ETAT_DEVIS_META, etatDevis, formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { StatutDevis } from "@/types";
import { DevisCreateModal } from "./DevisCreateModal";
import { DevisDetailModal } from "./DevisDetailModal";

type Filtre = "TOUS" | StatutDevis;

const FILTRES: Array<{ key: Filtre; label: string }> = [
  { key: "TOUS", label: "Tous" },
  { key: StatutDevis.EN_COURS, label: "En cours" },
  { key: StatutDevis.ACCEPTE, label: "Acceptés" },
  { key: StatutDevis.CONVERTI, label: "Devenus ventes" },
  { key: StatutDevis.ANNULE, label: "Annulés" },
];

/**
 * Devis / factures proforma (quincaillerie) : chiffrer une demande sans toucher au stock,
 * l'imprimer pour le client, puis l'encaisser quand il revient.
 */
export function DevisView() {
  const [filtre, setFiltre] = useState<Filtre>("TOUS");
  const [saisie, setSaisie] = useState("");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [ouvertId, setOuvertId] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setSearch(saisie.trim()), 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [saisie]);

  const { data, isLoading } = useDevisList({
    limit: 100,
    statut: filtre === "TOUS" ? undefined : filtre,
    search: search || undefined,
  });
  const devis = data?.data ?? [];

  // Chiffres d'ensemble, indépendants du filtre affiché.
  const { data: tousRes } = useDevisList({ limit: 100 });
  const ouverts = (tousRes?.data ?? []).filter(
    (d) => d.statut === StatutDevis.EN_COURS || d.statut === StatutDevis.ACCEPTE
  );
  const enAttente = ouverts.reduce((sum, d) => sum + Number(d.totalMontant), 0);

  return (
    <PageWrapper>
      <PageHero
        tone="accent"
        icon={IconFileInvoice}
        eyebrow="Opérations"
        title="Devis"
        description="Chiffrez une demande, imprimez la proforma pour le client, puis encaissez-la quand il revient. Le stock ne bouge qu'à la vente."
        actions={
          <Button
            className="min-h-11 bg-accent font-semibold text-white"
            startContent={<IconPlus size={18} aria-hidden />}
            onPress={() => setCreateOpen(true)}
          >
            Nouveau devis
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile tone="accent" icon={IconClock} label="Devis ouverts" value={tousRes ? ouverts.length : "—"} />
          <StatTile
            tone="cash"
            icon={IconWallet}
            label="Montant à encaisser"
            value={tousRes ? formatCurrency(enAttente) : "—"}
            delay={0.05}
          />
        </div>
      </PageHero>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SegmentedControl ariaLabel="Filtrer les devis" options={FILTRES} value={filtre} onChange={setFiltre} />
        <Input
          aria-label="Rechercher un client"
          placeholder="Rechercher un client"
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
      ) : devis.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-text-muted">
            {search || filtre !== "TOUS"
              ? "Aucun devis ne correspond à cette recherche."
              : "Aucun devis pour l'instant. Un client vous demande un prix ? Chiffrez-le ici et imprimez-lui la proforma."}
          </p>
          {!search && filtre === "TOUS" && (
            <Button variant="bordered" className="min-h-11" startContent={<IconPlus size={16} aria-hidden />} onPress={() => setCreateOpen(true)}>
              Nouveau devis
            </Button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface" aria-label="Devis">
          {devis.map((d) => {
            const etat = etatDevis(d);
            const meta = ETAT_DEVIS_META[etat];
            const nbArticles = d.lignes?.length ?? 0;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setOuvertId(d.id)}
                  className="grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition-colors duration-150 hover:bg-surface-high focus-visible:outline-accent md:grid-cols-[1.4fr_1fr_auto_auto]"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-text">{d.clientNom}</span>
                    <span className="block text-xs text-text-muted">
                      {d.reference} · {nbArticles} article{nbArticles > 1 ? "s" : ""}
                    </span>
                  </span>
                  <span className="tabular text-right font-semibold text-text md:order-3">{formatCurrency(d.totalMontant)}</span>
                  <span className="text-xs text-text-muted md:order-2">
                    {etat === StatutDevis.CONVERTI
                      ? `Créé le ${formatDateCourte(d.createdAt)}`
                      : `Valable jusqu'au ${formatDateCourte(d.valableJusquAu)}`}
                  </span>
                  <StatusChip label={meta.label} tone={meta.tone} icon={meta.icon} className="justify-self-end md:order-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <DevisCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(created) => {
          setCreateOpen(false);
          setOuvertId(created.id);
        }}
      />
      <DevisDetailModal devisId={ouvertId} onClose={() => setOuvertId(null)} />
    </PageWrapper>
  );
}
