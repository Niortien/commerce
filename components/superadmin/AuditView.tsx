"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { IconSearch } from "@tabler/icons-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatusChip } from "@/components/common/StatusChip";
import type { AuditParams } from "@/features/super-admin/api/superadmin-audit-api";
import { useAuditActions, useAuditLogs } from "@/features/super-admin/query/superadmin-audit-queries";
import { useSuperAdminBoutiques } from "@/features/super-admin/query/superadmin-queries";
import { ROLE_LABELS, actionAudit, heureAudit, jourAudit } from "@/lib/audit";
import { Role, type AuditLog } from "@/types";

const TOUTES = "TOUTES";

const ROLES = [
  { key: TOUTES, label: "Tous" },
  { key: Role.SUPER_ADMIN, label: "Super admin" },
  { key: Role.ADMIN, label: "Admins" },
  { key: Role.CAISSIER, label: "Caissiers" },
];

function roleDe(cle: string): Role | undefined {
  return cle === Role.SUPER_ADMIN || cle === Role.ADMIN || cle === Role.CAISSIER ? cle : undefined;
}

/** Regroupe les entrées par jour, dans l'ordre reçu (le plus récent d'abord). */
function parJour(logs: AuditLog[]): Array<{ jour: string; logs: AuditLog[] }> {
  const groupes: Array<{ jour: string; logs: AuditLog[] }> = [];
  for (const log of logs) {
    const jour = jourAudit(log.createdAt);
    const dernier = groupes[groupes.length - 1];
    if (dernier && dernier.jour === jour) dernier.logs.push(log);
    else groupes.push({ jour, logs: [log] });
  }
  return groupes;
}

/**
 * Journal d'audit de la plateforme : connexions, consultations d'espaces, suppressions, annulations,
 * changements d'abonnement ou de type… filtrable par boutique, action, rôle et période.
 */
export function AuditView() {
  const [action, setAction] = useState(TOUTES);
  const [boutiqueId, setBoutiqueId] = useState(TOUTES);
  const [role, setRole] = useState(TOUTES);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [saisie, setSaisie] = useState("");
  const [search, setSearch] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setSearch(saisie.trim()), 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [saisie]);

  const filtres: Omit<AuditParams, "page" | "limit"> = {
    action: action === TOUTES ? undefined : action,
    boutiqueId: boutiqueId === TOUTES ? undefined : boutiqueId,
    role: roleDe(role),
    search: search || undefined,
    dateDebut: dateDebut || undefined,
    dateFin: dateFin || undefined,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAuditLogs(filtres);
  const { data: actionsRes } = useAuditActions();
  const { data: boutiquesRes } = useSuperAdminBoutiques();

  const logs = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const total = data?.pages[0]?.meta.total ?? 0;
  const groupes = useMemo(() => parJour(logs), [logs]);
  const filtre = Boolean(filtres.action || filtres.boutiqueId || filtres.role || filtres.search || dateDebut || dateFin);

  const actions = [TOUTES, ...(actionsRes?.data ?? [])];
  const boutiques = [{ id: TOUTES, nom: "Toutes les boutiques" }, ...(boutiquesRes?.data ?? []).map((b) => ({ id: b.id, nom: b.nom }))];

  const effacer = () => {
    setAction(TOUTES);
    setBoutiqueId(TOUTES);
    setRole(TOUTES);
    setDateDebut("");
    setDateFin("");
    setSaisie("");
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="Plateforme"
        title="Journal d'audit"
        description="Qui a fait quoi, et quand : connexions, consultations d'espaces, suppressions, annulations, changements d'abonnement ou de type de commerce."
      />

      <section aria-label="Filtres" className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select
            label="Action"
            variant="bordered"
            size="sm"
            selectedKeys={[action]}
            disallowEmptySelection
            onSelectionChange={(keys) => setAction(String(Array.from(keys)[0] ?? TOUTES))}
          >
            {actions.map((a) => (
              <SelectItem key={a}>{a === TOUTES ? "Toutes les actions" : actionAudit(a).label}</SelectItem>
            ))}
          </Select>
          <Select
            label="Boutique"
            variant="bordered"
            size="sm"
            selectedKeys={[boutiqueId]}
            disallowEmptySelection
            onSelectionChange={(keys) => setBoutiqueId(String(Array.from(keys)[0] ?? TOUTES))}
          >
            {boutiques.map((b) => (
              <SelectItem key={b.id}>{b.nom}</SelectItem>
            ))}
          </Select>
          <Input
            label="Rechercher"
            placeholder="Email ou mot de la description"
            variant="bordered"
            size="sm"
            value={saisie}
            onValueChange={setSaisie}
            startContent={<IconSearch size={16} className="text-text-muted" aria-hidden />}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SegmentedControl ariaLabel="Rôle de l'auteur" options={ROLES} value={role} onChange={setRole} />
          <div className="flex flex-wrap items-end gap-2">
            <Input type="date" label="Du" variant="bordered" size="sm" value={dateDebut} onValueChange={setDateDebut} className="w-40" />
            <Input type="date" label="Au" variant="bordered" size="sm" value={dateFin} onValueChange={setDateFin} className="w-40" />
            {filtre && (
              <Button variant="light" className="min-h-11" onPress={effacer}>
                Effacer les filtres
              </Button>
            )}
          </div>
        </div>
      </section>

      <p className="text-sm text-text-muted" aria-live="polite">
        {isLoading ? "Chargement du journal…" : `${total} entrée${total > 1 ? "s" : ""}${filtre ? " pour ces filtres" : ""}`}
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : logs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-text-muted">
          {filtre ? "Aucune entrée ne correspond à ces filtres." : "Le journal est vide pour l'instant."}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {groupes.map((g) => (
            <section key={g.jour} aria-label={g.jour}>
              <h2 className="mb-2 text-sm font-semibold capitalize text-text">{g.jour}</h2>
              <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                {g.logs.map((log) => {
                  const meta = actionAudit(log.action);
                  const auteur = log.user;
                  return (
                    <li key={log.id} className="grid grid-cols-[3.25rem_1fr] gap-x-3 px-4 py-3">
                      <time dateTime={log.createdAt} className="tabular pt-0.5 text-xs text-text-muted">
                        {heureAudit(log.createdAt)}
                      </time>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusChip label={meta.label} tone={meta.tone} />
                          {log.description && <p className="min-w-0 text-sm text-text">{log.description}</p>}
                        </div>
                        <p className="mt-1 truncate text-xs text-text-muted">
                          {auteur ? (
                            <>
                              {auteur.email} · {ROLE_LABELS[auteur.role]}
                              {auteur.boutique && <> · {auteur.boutique.nom}</>}
                            </>
                          ) : (
                            "Compte supprimé"
                          )}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
          {hasNextPage && (
            <Button variant="bordered" className="min-h-11 self-center" isLoading={isFetchingNextPage} onPress={() => void fetchNextPage()}>
              Afficher plus
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
