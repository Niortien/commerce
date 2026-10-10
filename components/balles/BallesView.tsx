"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Spinner } from "@heroui/react";
import { IconChevronRight, IconClockHour4, IconHanger, IconPackageImport, IconPackages, IconPlus, IconSearch } from "@tabler/icons-react";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { StatusChip } from "@/components/common/StatusChip";
import { useBalles } from "@/features/balles/query/balles-queries";
import { useDemarques } from "@/features/demarque/query/demarque-queries";
import { nomBalle } from "@/lib/balles";
import { formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { StatutBalle } from "@/types";
import { BalleFormModal } from "./BalleFormModal";
import { BalleJauge } from "./BalleJauge";

type Filtre = "TOUTES" | StatutBalle;

const FILTRES: Array<{ key: Filtre; label: string }> = [
  { key: "TOUTES", label: "Toutes" },
  { key: StatutBalle.EN_COURS, label: "En déballage" },
  { key: StatutBalle.TERMINEE, label: "Déballées" },
];

/** Friperie : les balles achetées, ce qu'elles contiennent et ce qu'elles ont déjà rapporté. */
export function BallesView() {
  const router = useRouter();
  const [filtre, setFiltre] = useState<Filtre>("TOUTES");
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

  const { data, isLoading } = useBalles({
    limit: 100,
    statut: filtre === "TOUTES" ? undefined : filtre,
    search: search || undefined,
  });
  const balles = data?.data ?? [];

  // Chiffres d'ensemble, indépendants du filtre affiché.
  const { data: toutesRes } = useBalles({ limit: 100 });
  const toutes = toutesRes?.data ?? [];
  const enRayon = toutes.reduce((n, b) => n + b.nbEnRayon, 0);
  const valeurEnRayon = toutes.reduce((n, b) => n + Number(b.valeurEnRayon), 0);
  const enDeballage = toutes.filter((b) => b.statut === StatutBalle.EN_COURS).length;

  // Rappel : des pièces attendent en rayon depuis un mois.
  const { data: aDemarquerRes } = useDemarques({ joursMin: 30, limit: 1 });
  const aDemarquer = aDemarquerRes?.meta.total ?? 0;

  return (
    <PageWrapper>
      <PageHero
        tone="in"
        icon={IconPackages}
        eyebrow="Opérations"
        title="Balles"
        description="Enregistrez chaque balle achetée, puis déballez-la pièce par pièce : son coût se répartit tout seul et vous voyez quand elle est remboursée."
        actions={
          <Button
            className="min-h-11 bg-accent font-semibold text-white"
            startContent={<IconPlus size={18} aria-hidden />}
            onPress={() => setCreateOpen(true)}
          >
            Nouvelle balle
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile tone="return" icon={IconPackageImport} label="En déballage" value={toutesRes ? enDeballage : "—"} />
          <StatTile tone="in" icon={IconHanger} label="Pièces en rayon" value={toutesRes ? enRayon : "—"} delay={0.05} />
          <StatTile
            tone="cash"
            icon={IconPackages}
            label="Valeur en rayon"
            value={toutesRes ? formatCurrency(valeurEnRayon) : "—"}
            delay={0.1}
          />
        </div>
      </PageHero>

      {aDemarquer > 0 && (
        <Link
          href="/demarque"
          className="flex min-h-11 items-center gap-3 rounded-xl border border-return-line bg-return-dim px-4 py-3 text-sm text-return-text transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-return)_18%,transparent)] focus-visible:outline-accent"
        >
          <IconClockHour4 size={18} aria-hidden className="shrink-0" />
          <span className="flex-1">
            {aDemarquer} pièce{aDemarquer > 1 ? "s attendent" : " attend"} en rayon depuis plus de 30 jours. Démarquez-les pour les faire partir.
          </span>
          <IconChevronRight size={18} aria-hidden className="shrink-0" />
        </Link>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SegmentedControl ariaLabel="Filtrer les balles" options={FILTRES} value={filtre} onChange={setFiltre} />
        <Input
          aria-label="Rechercher une balle"
          placeholder="Contenu ou fournisseur"
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
      ) : balles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="max-w-md text-sm text-text-muted">
            {search || filtre !== "TOUTES"
              ? "Aucune balle ne correspond à cette recherche."
              : "Aucune balle pour l'instant. Enregistrez la prochaine que vous achetez : vous saurez exactement ce que chaque pièce vous a coûté."}
          </p>
          {!search && filtre === "TOUTES" && (
            <Button variant="bordered" className="min-h-11" startContent={<IconPlus size={16} aria-hidden />} onPress={() => setCreateOpen(true)}>
              Nouvelle balle
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2" aria-label="Balles">
          {balles.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => router.push(`/balles/${b.id}`)}
                className="flex w-full cursor-pointer flex-col gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-colors duration-150 hover:border-border-active hover:bg-surface-high focus-visible:outline-accent"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-text-muted">{nomBalle(b)}</span>
                    <span className="block truncate font-semibold text-text">{b.libelle}</span>
                    <span className="block text-xs text-text-muted">
                      {b.fournisseur ? `${b.fournisseur}, le ` : "Achetée le "}
                      {formatDateCourte(b.dateAchat)}
                    </span>
                  </span>
                  {b.statut === StatutBalle.EN_COURS ? (
                    <StatusChip label="En déballage" tone="return" className="shrink-0" />
                  ) : (
                    <StatusChip label="Déballée" tone="neutral" className="shrink-0" />
                  )}
                </span>

                <span className="grid grid-cols-3 gap-2 text-xs">
                  <span>
                    <span className="block text-text-muted">Pièces</span>
                    <span className="tabular font-semibold text-text">{b.nbPieces}</span>
                  </span>
                  <span>
                    <span className="block text-text-muted">Vendues</span>
                    <span className="tabular font-semibold text-text">{b.nbVendues}</span>
                  </span>
                  <span>
                    <span className="block text-text-muted">Coût</span>
                    <span className="tabular font-semibold text-text">{formatCurrency(b.coutTotal)}</span>
                  </span>
                </span>

                <BalleJauge balle={b} className="w-full" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <BalleFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={(balle) => router.push(`/balles/${balle.id}`)}
      />
    </PageWrapper>
  );
}
