"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useSortie } from "@/features/sorties/query/sorties-queries";
import {
  useAnnulerSortie,
  useDeleteSortie,
} from "@/features/sorties/mutation/sorties-mutations";
import { ModePaiement, TypeSortie } from "@/types";
import type { Sortie } from "@/types";
import { EditSortieModal } from "./EditSortieModal";
import { RecuPrint, type RecuLigne } from "./RecuPrint";

const TYPE_LABELS: Record<TypeSortie, string> = {
  VENTE: "Vente",
  PERTE: "Perte",
  DON: "Don",
  RETOUR_FOURNISSEUR: "Retour",
  DEPENSE: "Dépense",
};

const TYPE_COLORS: Record<TypeSortie, string> = {
  VENTE: "bg-[color:rgba(74,122,255,0.15)] text-accent",
  PERTE: "bg-[color:rgba(255,77,109,0.15)] text-[var(--color-out)]",
  DON: "bg-[color:rgba(143,126,245,0.15)] text-purple-400",
  RETOUR_FOURNISSEUR: "bg-[color:rgba(100,160,255,0.15)] text-blue-400",
  DEPENSE: "bg-[color:rgba(255,154,60,0.15)] text-[var(--color-return)]",
};

function ReprintButton({ sortieId }: { sortieId: string }) {
  const [fetchRecu, setFetchRecu] = useState(false);
  const [reprintOpen, setReprintOpen] = useState(false);
  const { data: detail, isLoading } = useSortie(fetchRecu ? sortieId : "");

  useEffect(() => {
    if (fetchRecu && detail?.data && !isLoading) {
      setReprintOpen(true);
    }
  }, [fetchRecu, detail?.data, isLoading]);

  const handleClose = () => {
    setReprintOpen(false);
    setFetchRecu(false);
  };

  const recuDetail = detail?.data;
  const recuLignes: RecuLigne[] = (recuDetail?.lignes ?? []).map((l) => ({
    produitNom: l.variante?.produit?.nom ?? "Produit",
    taille: String(l.variante?.taille ?? "—"),
    couleur: l.variante?.couleur ?? "—",
    quantite: l.quantite,
    prixUnitaire: l.prixUnitaire,
    sousTotal: (l.quantite * parseFloat(l.prixUnitaire || "0")).toFixed(0),
  }));

  return (
    <>
      {recuDetail && (
        <RecuPrint
          isOpen={reprintOpen}
          onClose={handleClose}
          reference={recuDetail.reference}
          date={recuDetail.createdAt}
          lignes={recuLignes}
          totalMontant={recuDetail.totalMontant}
          modePaiement={recuDetail.transaction?.modePaiement ?? ModePaiement.CASH}
          transactionReference={recuDetail.transaction?.reference ?? undefined}
        />
      )}
      <Button
        size="sm"
        variant="flat"
        className="min-w-0 bg-[color:rgba(74,122,255,0.12)] text-accent"
        isLoading={isLoading && fetchRecu}
        onPress={() => {
          if (!fetchRecu) setFetchRecu(true);
          else if (detail?.data) setReprintOpen(true);
        }}
        aria-label="Réimprimer le reçu"
      >
        <span className="hidden sm:inline">🖨 Reçu</span>
        <span className="sm:hidden">🖨</span>
      </Button>
    </>
  );
}

interface SortiesTableProps {
  data: Sortie[];
}

const columnHelper = createColumnHelper<Sortie>();

export function SortiesTable({ data }: SortiesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [editSortie, setEditSortie] = useState<Sortie | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sortie | null>(null);

  const annulerMutation = useAnnulerSortie();
  const deleteMutation = useDeleteSortie();

  const columns = useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) =>
          format(new Date(info.getValue()), "dd MMM yyyy HH:mm", { locale: fr }),
        sortingFn: "datetime",
      }),
      columnHelper.accessor("reference", {
        header: "Référence",
        meta: { mobileHidden: true },
        cell: (info) => (
          <span className="font-[var(--font-mono)] text-xs text-text-muted">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => {
          const type = info.getValue();
          return (
            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[type]}`}>
              {TYPE_LABELS[type]}
            </span>
          );
        },
      }),
      columnHelper.accessor("totalMontant", {
        header: "Montant",
        cell: (info) => {
          const sortie = info.row.original;
          return (
            <CurrencyDisplay
              montant={info.getValue()}
              tone={sortie.type === TypeSortie.VENTE ? "cash" : "out"}
              size="sm"
            />
          );
        },
      }),
      columnHelper.accessor("notes", {
        header: "Statut",
        enableSorting: false,
        cell: (info) => {
          const notes = info.getValue();
          if (notes?.includes("[ANNULEE]")) {
            return (
              <span className="rounded bg-[color:rgba(255,77,109,0.15)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-out)]">
                Annulée
              </span>
            );
          }
          return <span className="text-xs text-text-muted">Active</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const sortie = info.row.original;
          const isAnnulee = sortie.notes?.includes("[ANNULEE]") ?? false;
          return (
            <div className="flex items-center gap-1.5">
              {!isAnnulee && (
                <>
                  <Button
                    size="sm"
                    variant="flat"
                    className="min-w-0 bg-[color:rgba(143,126,245,0.12)] text-purple-400"
                    onPress={() => setEditSortie(sortie)}
                  >
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="min-w-0 bg-[color:rgba(255,77,109,0.10)] text-[var(--color-out)]"
                    onPress={() => annulerMutation.mutate(sortie.id)}
                    isLoading={annulerMutation.isPending && annulerMutation.variables === sortie.id}
                    aria-label="Annuler la sortie"
                  >
                    <span className="hidden sm:inline">Annuler</span>
                    <span className="sm:hidden">✕</span>
                  </Button>
                  {sortie.type === TypeSortie.VENTE && (
                    <ReprintButton sortieId={sortie.id} />
                  )}
                </>
              )}
              <Button
                size="sm"
                variant="flat"
                className="min-w-0 bg-[color:rgba(255,77,109,0.06)] text-[var(--color-out)]"
                onPress={() => setDeleteTarget(sortie)}
              >
                🗑️
              </Button>
            </div>
          );
        },
      }),
    ],
    [annulerMutation]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <EditSortieModal sortie={editSortie} onClose={() => setEditSortie(null)} />
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && !deleteMutation.isPending) {
            deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
          }
        }}
        title="Supprimer la sortie"
        message={`Supprimer ${deleteTarget?.reference ?? "cette sortie"} ? Le stock sera restauré si elle n'était pas encore annulée.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        danger
      />

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border/60 bg-[var(--color-surface-high)]"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={[
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted",
                      header.column.getCanSort() ? "cursor-pointer select-none hover:text-text" : "",
                      header.column.columnDef.meta?.mobileHidden ? "hidden sm:table-cell" : "",
                    ].join(" ")}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-text-muted">
                  Aucune sortie sur cette période
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isAnnulee = row.original.notes?.includes("[ANNULEE]") ?? false;
                return (
                  <tr
                    key={row.id}
                    className={[
                      "border-b border-border/30 transition-colors last:border-0",
                      isAnnulee ? "opacity-40" : "hover:bg-[color:rgba(255,77,109,0.04)]",
                    ].join(" ")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={[
                          "px-4 py-3",
                          cell.column.columnDef.meta?.mobileHidden ? "hidden sm:table-cell" : "",
                        ].join(" ")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
