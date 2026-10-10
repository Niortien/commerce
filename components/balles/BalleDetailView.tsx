"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { IconArrowLeft, IconCheck, IconPencil, IconPackageImport, IconTrash } from "@tabler/icons-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PageWrapper } from "@/components/common/PageWrapper";
import { StatusChip } from "@/components/common/StatusChip";
import { useChangerStatutBalle, useDeleteBalle } from "@/features/balles/mutation/balles-mutations";
import { useBalle } from "@/features/balles/query/balles-queries";
import { libelleChoix, nomBalle } from "@/lib/balles";
import { formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { StatutBalle } from "@/types";
import { BalleFormModal } from "./BalleFormModal";
import { BalleJauge } from "./BalleJauge";
import { DeballageForm } from "./DeballageForm";
import { PieceList } from "./PieceList";

interface BalleDetailViewProps {
  id: string;
}

/** Une balle : son bilan (coût, recette, marge), le déballage en cours et ses pièces. */
export function BalleDetailView({ id }: BalleDetailViewProps) {
  const router = useRouter();
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const { data, isLoading, error } = useBalle(id);
  const changerStatut = useChangerStatutBalle(id);
  const supprimer = useDeleteBalle();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const balle = data?.data;

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </PageWrapper>
    );
  }

  if (error || !balle) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-text-muted">Cette balle est introuvable : elle a peut-être été supprimée.</p>
          <Button as={Link} href="/balles" variant="bordered" className="min-h-11">
            Retour aux balles
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const enDeballage = balle.statut === StatutBalle.EN_COURS;
  const marge = Number(balle.marge);

  const chiffres: Array<{ label: string; valeur: string; detail?: string; ton?: string }> = [
    {
      label: "Coût de la balle",
      valeur: formatCurrency(balle.coutTotal),
      detail: Number(balle.frais) > 0 ? `dont ${formatCurrency(balle.frais)} de frais` : undefined,
    },
    {
      label: "Coût par article",
      valeur: balle.coutParPiece ? formatCurrency(balle.coutParPiece) : "—",
      detail: `${balle.nbPieces} article${balle.nbPieces > 1 ? "s" : ""}${balle.nbTas > 0 ? `, dont ${balle.nbTas} tas` : ""}`,
    },
    {
      label: "Encaissé",
      valeur: formatCurrency(balle.recetteVentes),
      detail: `${balle.nbVendues} vendue${balle.nbVendues > 1 ? "s" : ""}`,
    },
    {
      label: marge >= 0 ? "Bénéfice" : "Reste à rembourser",
      valeur: formatCurrency(Math.abs(marge)),
      ton: marge >= 0 && balle.nbPieces > 0 ? "text-in-text" : undefined,
    },
    {
      label: "Encore en rayon",
      valeur: formatCurrency(balle.valeurEnRayon),
      detail: `${balle.nbEnRayon} article${balle.nbEnRayon > 1 ? "s" : ""} à vendre`,
    },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <Link
          href="/balles"
          className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text focus-visible:outline-accent"
        >
          <IconArrowLeft size={16} aria-hidden />
          Balles
        </Link>

        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm text-text-muted">
              {nomBalle(balle)}
              <StatusChip label={enDeballage ? "En déballage" : "Déballée"} tone={enDeballage ? "return" : "neutral"} />
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-text [font-family:var(--font-display)]">{balle.libelle}</h1>
            <p className="mt-0.5 text-sm text-text-muted">
              {balle.fournisseur ? `${balle.fournisseur}, achetée le ` : "Achetée le "}
              {formatDateCourte(balle.dateAchat)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="bordered" className="min-h-11" startContent={<IconPencil size={16} aria-hidden />} onPress={() => setEditOpen(true)}>
              Modifier
            </Button>
            {enDeballage ? (
              <Button
                variant="bordered"
                className="min-h-11"
                startContent={<IconCheck size={16} aria-hidden />}
                isDisabled={balle.nbPieces === 0}
                isLoading={changerStatut.isPending}
                onPress={() => changerStatut.mutate(StatutBalle.TERMINEE)}
              >
                Terminer le déballage
              </Button>
            ) : (
              <Button
                variant="bordered"
                className="min-h-11"
                startContent={<IconPackageImport size={16} aria-hidden />}
                isLoading={changerStatut.isPending}
                onPress={() => changerStatut.mutate(StatutBalle.EN_COURS)}
              >
                Rouvrir le déballage
              </Button>
            )}
            {isAdmin && balle.nbPieces === 0 && (
              <Button
                variant="light"
                className="min-h-11 text-out-text"
                startContent={<IconTrash size={16} aria-hidden />}
                onPress={() => setDeleteOpen(true)}
              >
                Supprimer
              </Button>
            )}
          </div>
        </header>

        <section aria-label="Bilan de la balle" className="rounded-xl border border-border bg-surface p-4 md:p-5">
          <BalleJauge balle={balle} taille="lg" />
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-5">
            {chiffres.map((c) => (
              <div key={c.label}>
                <dt className="text-xs text-text-muted">{c.label}</dt>
                <dd className={cn("tabular text-[15px] font-semibold text-text", c.ton)}>{c.valeur}</dd>
                {c.detail && <dd className="text-xs text-text-muted">{c.detail}</dd>}
              </div>
            ))}
          </dl>
        </section>

        {balle.parChoix.some((c) => c.choix !== null) && (
          <section aria-labelledby="choix-titre" className="rounded-xl border border-border bg-surface p-4 md:p-5">
            <h2 id="choix-titre" className="mb-3 font-semibold text-text">
              Par qualité
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-text-muted">
                  <th scope="col" className="pb-2 font-normal">Choix</th>
                  <th scope="col" className="pb-2 text-right font-normal">Articles</th>
                  <th scope="col" className="pb-2 text-right font-normal">Vendues</th>
                  <th scope="col" className="pb-2 text-right font-normal">Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {balle.parChoix.map((c) => (
                  <tr key={c.choix ?? "non-triee"}>
                    <th scope="row" className="py-2 text-left font-medium text-text">{libelleChoix(c.choix) ?? "Non triées"}</th>
                    <td className="tabular py-2 text-right text-text">{c.nbPieces}</td>
                    <td className="tabular py-2 text-right text-text">{c.nbVendues}</td>
                    <td className="tabular py-2 text-right font-semibold text-text">{formatCurrency(c.recette)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {enDeballage ? (
          <DeballageForm balle={balle} />
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-text-muted">
            Déballage terminé. Une pièce oubliée ? Rouvrez le déballage pour l&apos;ajouter.
          </p>
        )}

        <PieceList balleId={balle.id} pieces={balle.pieces} />
      </div>

      <BalleFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} balle={balle} />
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await supprimer.mutateAsync(balle.id);
          setDeleteOpen(false);
          router.push("/balles");
        }}
        title="Supprimer cette balle ?"
        message={`La ${nomBalle(balle).toLowerCase()} et sa dépense de ${formatCurrency(balle.coutTotal)} seront effacées.`}
        confirmLabel="Supprimer la balle"
        isLoading={supprimer.isPending}
        danger
      />
    </PageWrapper>
  );
}
