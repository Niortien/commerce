"use client";

import { useState, type Key } from "react";
import { Tab, Tabs } from "@heroui/react";
import {
  IconActivity,
  IconBoxSeam,
  IconCoin,
  IconLayoutDashboard,
  IconPackageExport,
  IconPackageImport,
} from "@tabler/icons-react";
import { StatusChip } from "@/components/common/StatusChip";
import { STATUT_BOUTIQUE_META } from "@/lib/subscription";
import { StatutBoutique } from "@/types";

type PreviewKey = "dashboard" | "caisse" | "abonnements";

const NAV = [
  { icon: IconLayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: IconActivity, label: "Activité" },
  { icon: IconCoin, label: "Caisse", key: "caisse" },
  { icon: IconBoxSeam, label: "Stock" },
  { icon: IconPackageImport, label: "Entrées" },
  { icon: IconPackageExport, label: "Sorties" },
] as const;

// Valeurs d'exemple : volontairement rondes, étiquetées « données d'exemple » sous la maquette.
const KPIS = [
  { label: "Ventes du jour", value: "185 000", tone: "text-cash-text" },
  { label: "Valeur du stock", value: "2 450 000", tone: "text-accent-text" },
  { label: "Bénéfice net", value: "62 500", tone: "text-in-text" },
  { label: "Alertes stock", value: "3", tone: "text-out-text" },
];

const BARS = [38, 52, 44, 66, 58, 80, 72];

const CAISSE_LIGNES = [
  { nom: "Article A · M", qte: 2, total: "30 000" },
  { nom: "Article B · L", qte: 1, total: "22 500" },
  { nom: "Article C · 42", qte: 1, total: "45 000" },
];

const BOUTIQUES = [
  { nom: "Boutique Marcory", statut: StatutBoutique.ACTIF, plan: "Annuel", reste: "200 j" },
  { nom: "Boutique Plateau", statut: StatutBoutique.ESSAI, plan: "Essai", reste: "5 j" },
  { nom: "Boutique Yopougon", statut: StatutBoutique.SUSPENDU, plan: "Mensuel", reste: "Expiré" },
];

function DashboardPane() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-lg border border-border bg-surface p-2.5">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-text-muted">{k.label}</p>
            <p className={`tabular mt-1 font-mono text-sm font-medium sm:text-md ${k.tone}`}>{k.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-lg border border-border bg-surface p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Ventes — 7 jours</p>
        <div className="mt-3 flex h-20 items-end gap-1.5">
          {BARS.map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-accent opacity-80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </>
  );
}

function CaissePane() {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Vente en cours</p>
      <ul className="mt-2 divide-y divide-border">
        {CAISSE_LIGNES.map((l) => (
          <li key={l.nom} className="flex items-center justify-between py-2 text-xs">
            <span className="text-text">
              {l.nom} <span className="text-text-muted">× {l.qte}</span>
            </span>
            <span className="tabular font-mono text-text">{l.total}</span>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
        <span className="text-xs font-semibold text-text">Total</span>
        <span className="tabular font-mono text-sm font-medium text-cash-text">97 500 FCFA</span>
      </div>
      <div className="mt-3 rounded-md bg-accent py-2 text-center text-xs font-semibold text-white">Encaisser</div>
    </div>
  );
}

function AbonnementsPane() {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Boutiques & abonnements</p>
      <ul className="mt-2 divide-y divide-border">
        {BOUTIQUES.map((b) => {
          const meta = STATUT_BOUTIQUE_META[b.statut];
          return (
            <li key={b.nom} className="flex items-center justify-between gap-2 py-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-text">{b.nom}</p>
                <p className="text-[10px] text-text-muted">
                  {b.plan} · {b.reste}
                </p>
              </div>
              <StatusChip label={meta.label} tone={meta.tone} icon={meta.icon} className="shrink-0" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const PANES: Record<PreviewKey, () => JSX.Element> = {
  dashboard: DashboardPane,
  caisse: CaissePane,
  abonnements: AbonnementsPane,
};

/** Maquette HTML interactive du produit (aperçu commutable) — nette en clair/sombre, sans capture d'écran figée. */
export function ProductPreview() {
  const [view, setView] = useState<PreviewKey>("dashboard");
  const Pane = PANES[view];

  return (
    <figure className="w-full">
      <Tabs
        aria-label="Aperçu du produit"
        size="sm"
        variant="solid"
        radius="full"
        selectedKey={view}
        onSelectionChange={(k: Key) => setView(k as PreviewKey)}
        classNames={{ base: "mb-3 justify-center", tabList: "bg-surface-high", tab: "font-medium" }}
      >
        <Tab key="dashboard" title="Tableau de bord" />
        <Tab key="caisse" title="Caisse" />
        <Tab key="abonnements" title="Abonnements" />
      </Tabs>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
        <div aria-hidden className="flex items-center gap-1.5 border-b border-border bg-surface-high px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-out opacity-70" />
          <span className="h-2.5 w-2.5 rounded-full bg-return opacity-70" />
          <span className="h-2.5 w-2.5 rounded-full bg-in opacity-70" />
        </div>
        <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] sm:grid-cols-[9rem_minmax(0,1fr)]">
          <div aria-hidden className="flex flex-col gap-1 bg-sidebar p-2 sm:p-3">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = "key" in item && item.key === view;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
                    active ? "bg-sidebar-active text-sidebar-text" : "text-sidebar-muted"
                  }`}
                >
                  <Icon size={14} className={active ? "text-sidebar-accent" : ""} />
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              );
            })}
          </div>
          <div className="min-h-[19.5rem] min-w-0 bg-base p-3 sm:p-4">
            <Pane />
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-text-muted">
        Aperçu interactif · données d&apos;exemple
      </figcaption>
    </figure>
  );
}
