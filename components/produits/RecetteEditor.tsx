"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { IconChefHat, IconPlus, IconX } from "@tabler/icons-react";
import { QuantiteInput } from "@/components/common/QuantiteInput";
import { VariantePicker, type VarianteSelection } from "@/components/common/VariantePicker";
import { useRecette } from "@/features/produits/query/produits-queries";
import { useSaveRecette } from "@/features/produits/mutation/produits-mutations";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatQuantite, isUniteEntiere, uniteDe } from "@/lib/unites";
import type { Unite } from "@/types";

interface LigneRecette {
  varianteId: string;
  nom: string;
  unite: Unite;
  quantite: number;
  /** Prix d'achat de l'ingrédient, par unité. */
  prixAchat: number;
  stock: number;
}

interface RecetteEditorProps {
  platId: string;
  prixVente: string;
  canEdit: boolean;
}

const memeRecette = (a: LigneRecette[], b: LigneRecette[]) =>
  a.length === b.length && a.every((l, i) => l.varianteId === b[i].varianteId && l.quantite === b[i].quantite);

/**
 * Fiche technique d'un plat : les ingrédients d'UNE portion. Chaque vente du plat retire ces quantités
 * du stock. Le coût matière, la marge et le nombre de portions encore possibles se calculent en direct.
 */
export function RecetteEditor({ platId, prixVente, canEdit }: RecetteEditorProps) {
  const { data, isLoading } = useRecette(platId);
  const save = useSaveRecette(platId);
  const [pickerOpen, setPickerOpen] = useState(false);

  const enregistree = useMemo<LigneRecette[]>(
    () =>
      (data?.data ?? []).map((r) => ({
        varianteId: r.ingredientVarianteId,
        nom: r.ingredient?.produit?.nom ?? "Ingrédient supprimé",
        unite: uniteDe(r.ingredient?.produit),
        quantite: r.quantite,
        prixAchat: Number(r.ingredient?.produit?.prixAchat ?? 0),
        stock: r.ingredient?.quantiteStock ?? 0,
      })),
    [data]
  );
  const [lignes, setLignes] = useState<LigneRecette[]>([]);
  useEffect(() => setLignes(enregistree), [enregistree]);

  const modifiee = !memeRecette(lignes, enregistree);
  const cout = lignes.reduce((sum, l) => sum + l.prixAchat * l.quantite, 0);
  const prix = Number(prixVente);
  const marge = prix - cout;
  const portions = lignes.length > 0 ? Math.min(...lignes.map((l) => Math.floor(l.stock / l.quantite))) : null;
  const limitant = portions !== null ? lignes.find((l) => Math.floor(l.stock / l.quantite) === portions) : undefined;

  const ajouter = (sel: VarianteSelection) => {
    setLignes((cur) => [
      ...cur,
      {
        varianteId: sel.varianteId,
        nom: sel.produitNom,
        unite: sel.unite,
        quantite: isUniteEntiere(sel.unite) ? 1 : 0.1,
        prixAchat: Number(sel.prixAchat),
        stock: sel.quantiteStock,
      },
    ]);
  };

  const enregistrer = () =>
    save.mutate({ lignes: lignes.map((l) => ({ varianteId: l.varianteId, quantite: l.quantite })) });

  return (
    <section aria-labelledby="fiche-technique" className="rounded-xl border border-border/80 bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <IconChefHat size={20} className="mt-0.5 shrink-0 text-[color:var(--sector-restaurant)]" aria-hidden />
          <div>
            <h2 id="fiche-technique" className="font-display text-lg font-bold text-text">
              Fiche technique
            </h2>
            <p className="text-sm text-text-muted">
              Les ingrédients d&apos;une portion. Chaque vente du plat les retire du stock.
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            size="sm"
            variant="bordered"
            className="min-h-11 font-medium"
            startContent={<IconPlus size={16} aria-hidden />}
            onPress={() => setPickerOpen(true)}
          >
            Ajouter un ingrédient
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner size="sm" />
        </div>
      ) : lignes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
          {canEdit
            ? "Aucun ingrédient pour l'instant. Sans fiche technique, vendre ce plat ne retire rien du stock."
            : "Aucune fiche technique : vendre ce plat ne retire rien du stock."}
        </p>
      ) : (
        <ul className="divide-y divide-border/60" aria-label="Ingrédients d'une portion">
          {lignes.map((l, i) => (
            <li key={l.varianteId} className="grid grid-cols-[1fr_96px_auto] items-center gap-2 py-2 sm:grid-cols-[1fr_110px_100px_auto] sm:gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{l.nom}</p>
                <p className={l.stock < l.quantite ? "text-xs text-out-text" : "text-xs text-text-muted"}>
                  En stock : {formatQuantite(l.stock, l.unite)}
                </p>
              </div>
              {canEdit ? (
                <QuantiteInput
                  value={l.quantite}
                  unite={l.unite}
                  onChange={(q) => setLignes((cur) => cur.map((x, j) => (j === i ? { ...x, quantite: q } : x)))}
                  ariaLabel={`Quantité par portion : ${l.nom}`}
                />
              ) : (
                <span className="tabular text-sm text-text">{formatQuantite(l.quantite, l.unite)}</span>
              )}
              <span className="tabular hidden text-right text-sm text-text-muted sm:block">
                {formatCurrency(l.prixAchat * l.quantite)}
              </span>
              {canEdit ? (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="min-h-11 min-w-11 text-text-muted hover:text-out-text"
                  aria-label={`Retirer ${l.nom} de la fiche`}
                  onPress={() => setLignes((cur) => cur.filter((_, j) => j !== i))}
                >
                  <IconX size={16} aria-hidden />
                </Button>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
      )}

      {lignes.length > 0 && (
        <dl className="mt-3 grid grid-cols-1 gap-3 border-t border-border/60 pt-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-text-muted">Coût matière d&apos;une portion</dt>
            <dd className="tabular mt-0.5 font-semibold text-text">
              {formatCurrency(cout)}
              {prix > 0 && <span className="ml-1.5 text-xs font-normal text-text-muted">({Math.round((cout / prix) * 100)} % du prix)</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Marge par portion</dt>
            <dd className={marge < 0 ? "tabular mt-0.5 font-semibold text-out-text" : "tabular mt-0.5 font-semibold text-in-text"}>
              {formatCurrency(marge)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Portions possibles avec le stock</dt>
            <dd className="tabular mt-0.5 font-semibold text-text">
              {portions}
              {limitant && portions !== null && portions < 10 && (
                <span className="ml-1.5 text-xs font-normal text-text-muted">limité par {limitant.nom.toLowerCase()}</span>
              )}
            </dd>
          </div>
        </dl>
      )}

      {canEdit && modifiee && (
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="light" className="min-h-11" onPress={() => setLignes(enregistree)}>
            Annuler les changements
          </Button>
          <Button className="min-h-11 bg-accent font-semibold text-white" isLoading={save.isPending} onPress={enregistrer}>
            Enregistrer la fiche
          </Button>
        </div>
      )}

      <VariantePicker
        usage="ingredient"
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={ajouter}
        excludedVarianteIds={lignes.map((l) => l.varianteId)}
      />
    </section>
  );
}
