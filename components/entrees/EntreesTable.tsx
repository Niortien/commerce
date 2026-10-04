"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { IconArrowBackUp, IconPencil, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { RowActionButton } from "@/components/common/RowActionButton";
import { StatutPill } from "@/components/common/StatutPill";
import {
  useAnnulerEntree,
  useDeleteEntree,
} from "@/features/entrees/mutation/entrees-mutations";
import type { Entree } from "@/types";
import { EditEntreeModal } from "./EditEntreeModal";

interface EntreesTableProps {
  data: Entree[];
}

const columnHelper = createColumnHelper<Entree>();

export function EntreesTable({ data }: EntreesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [editEntree, setEditEntree] = useState<Entree | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Entree | null>(null);

  const annulerMutation = useAnnulerEntree();
  const deleteMutation = useDeleteEntree();

  const columns = useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => {
          const val = info.getValue();
          if (!val) return <span className="text-xs text-text-muted">—</span>;
          const d = new Date(val);
          if (isNaN(d.getTime())) return <span className="text-xs text-text-muted">—</span>;
          return format(d, "dd MMM yyyy HH:mm", { locale: fr });
        },
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
      columnHelper.accessor("fournisseur", {
        header: "Fournisseur",
        cell: (info) => (
          <span className="font-medium text-text">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("lignes", {
        header: "Articles",
        enableSorting: false,
        cell: (info) => {
          const lignes = info.getValue();
          if (!lignes) return <span className="text-xs text-text-muted">—</span>;
          return (
            <span className="text-xs text-text-muted">
              {lignes.length} article{lignes.length !== 1 ? "s" : ""}
            </span>
          );
        },
      }),
      columnHelper.accessor("totalCout", {
        header: "Coût total",
        cell: (info) => (
          <CurrencyDisplay montant={info.getValue()} tone="in" size="sm" className="font-semibold tabular-nums" />
        ),
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
          const entree = info.row.original;
          const isAnnulee = entree.notes?.includes("[ANNULEE]") ?? false;
          return (
            <div className="flex items-center gap-1.5">
              {!isAnnulee && (
                <>
                  <RowActionButton label="Modifier l'entrée" tone="accent" onPress={() => setEditEntree(entree)}>
                    <IconPencil size={16} aria-hidden />
                  </RowActionButton>
                  <RowActionButton
                    label="Annuler l'entrée"
                    tone="neutral"
                    isLoading={annulerMutation.isPending && annulerMutation.variables === entree.id}
                    onPress={() => annulerMutation.mutate(entree.id)}
                  >
                    <IconArrowBackUp size={16} aria-hidden />
                  </RowActionButton>
                </>
              )}
              <RowActionButton label="Supprimer l'entrée" tone="out" onPress={() => setDeleteTarget(entree)}>
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
      <EditEntreeModal entree={editEntree} onClose={() => setEditEntree(null)} />
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && !deleteMutation.isPending)
            deleteMutation.mutate(deleteTarget.id, {
              onSuccess: () => setDeleteTarget(null),
            });
        }}
        title="Supprimer l'entrée"
        message={`Supprimer ${deleteTarget?.reference ?? "cette entrée"} de ${deleteTarget?.fournisseur ?? ""} ? Le stock sera ajusté en conséquence.`}
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
                  Aucune entrée sur cette période
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
                      isAnnulee ? "opacity-40" : "hover:bg-in-dim",
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
