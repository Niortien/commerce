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
import { IconArrowBackUp, IconPencil, IconPrinter, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { RowActionButton } from "@/components/common/RowActionButton";
import { StatutPill } from "@/components/common/StatutPill";
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

// Alignées sur les couleurs de SortieTypeStep (même type = même couleur partout).
const TYPE_COLORS: Record<TypeSortie, string> = {
  VENTE: "bg-cash-dim text-cash-text",
  PERTE: "bg-out-dim text-out-text",
  DON: "bg-return-dim text-return-text",
  RETOUR_FOURNISSEUR: "bg-in-dim text-in-text",
  DEPENSE: "bg-out-dim text-out-text",
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
      <RowActionButton
        label="Réimprimer le reçu"
        tone="cash"
        isLoading={isLoading && fetchRecu}
        onPress={() => {
          if (!fetchRecu) setFetchRecu(true);
          else if (detail?.data) setReprintOpen(true);
        }}
      >
        <IconPrinter size={16} aria-hidden />
      </RowActionButton>
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
          <span className="font-mono text-xs text-text-muted">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => {
          const type = info.getValue();
          return (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[type]}`}>
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
        cell: (info) => <StatutPill annulee={info.getValue()?.includes("[ANNULEE]") ?? false} />,
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
                  <RowActionButton label="Modifier la sortie" tone="accent" onPress={() => setEditSortie(sortie)}>
                    <IconPencil size={16} aria-hidden />
                  </RowActionButton>
                  <RowActionButton
                    label="Annuler la sortie"
                    tone="neutral"
                    isLoading={annulerMutation.isPending && annulerMutation.variables === sortie.id}
                    onPress={() => annulerMutation.mutate(sortie.id)}
                  >
                    <IconArrowBackUp size={16} aria-hidden />
                  </RowActionButton>
                  {sortie.type === TypeSortie.VENTE && <ReprintButton sortieId={sortie.id} />}
                </>
              )}
              <RowActionButton label="Supprimer la sortie" tone="out" onPress={() => setDeleteTarget(sortie)}>
                <IconTrash size={16} aria-hidden />
              </RowActionButton>
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

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border bg-surface-high"
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
                      "border-b border-border transition-colors last:border-0",
                      isAnnulee ? "opacity-40" : "hover:bg-out-dim",
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
