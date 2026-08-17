"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Chip, Input, Spinner, Switch } from "@heroui/react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useProduitsList } from "@/features/produits/query/produits-queries";
import { useUpdateProduit } from "@/features/produits/mutation/produits-mutations";
import type { Produit } from "@/types";
import { PromoInlineForm, type PromoFormData } from "./PromoInlineForm";

type FilterMode = "tous" | "enPromo";

function ProduitPromoRow({ produit }: { produit: Produit }) {
  const [expanded, setExpanded] = useState(produit.enPromo);
  const update = useUpdateProduit(produit.id);

  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url ?? null;
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixVente = parseFloat(produit.prixVente);
  const tauxReduction = isPromo
    ? Math.round(((prixVente - parseFloat(produit.prixPromo!)) / prixVente) * 100)
    : null;

  async function handleToggle(checked: boolean) {
    if (!checked) {
      if (produit.enPromo) await update.mutateAsync({ enPromo: false });
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }

  async function handleSave(data: PromoFormData) {
    await update.mutateAsync({
      enPromo: true,
      prixPromo: data.prixPromo,
      dateDebutPromo: data.dateDebutPromo,
      dateFinPromo: data.dateFinPromo,
    });
    setExpanded(false);
    toast.success("Produit mis en promotion");
  }

  function handleCancel() {
    if (!produit.enPromo) setExpanded(false);
  }

  return (
    <div className="rounded-xl border border-border/60 bg-[var(--color-surface-high)] p-3">
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)]">
          {imageUrl ? (
            <img src={imageUrl} alt={produit.nom} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-dim text-lg">?</div>
          )}
          {isPromo && (
            <div className="absolute -top-1 -right-1 rounded-full bg-orange-500 px-1 py-0.5 text-[8px] font-bold text-white leading-none">
              -{tauxReduction}%
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{produit.nom}</p>
          <div className="mt-0.5 flex items-center gap-2 flex-wrap">
            {isPromo ? (
              <>
                <span className="text-xs text-text-dim line-through">
                  {prixVente.toLocaleString("fr-FR")} FCFA
                </span>
                <span className="[font-family:var(--font-mono)] text-xs font-bold text-orange-400">
                  {Number(produit.prixPromo).toLocaleString("fr-FR")} FCFA
                </span>
              </>
            ) : (
              <span className="[font-family:var(--font-mono)] text-xs text-text-muted">
                {prixVente.toLocaleString("fr-FR")} FCFA
              </span>
            )}
            {produit.enPromo && !produit.prixPromo && (
              <Chip size="sm" variant="flat" className="bg-orange-500/20 text-orange-400 text-[9px]">
                Prix à définir
              </Chip>
            )}
          </div>
        </div>

        {/* Toggle */}
        <Switch
          size="sm"
          isSelected={produit.enPromo || expanded}
          onValueChange={handleToggle}
          isDisabled={update.isPending}
          classNames={{ thumb: "bg-white", wrapper: "group-data-[selected=true]:bg-orange-500" }}
          aria-label={`Promotion ${produit.nom}`}
        />
      </div>

      {/* Formulaire inline */}
      {(expanded || produit.enPromo) && (
        <PromoInlineForm
          produit={produit}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={update.isPending}
        />
      )}
    </div>
  );
}

export function PromotionsView() {
  const [filterMode, setFilterMode] = useState<FilterMode>("tous");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useProduitsList({ limit: 100, isActif: true });
  const allProduits = data?.data ?? [];

  const filtered = allProduits.filter((p) => {
    const matchMode = filterMode === "tous" || p.enPromo;
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchMode && matchSearch;
  });

  const promoCount = allProduits.filter((p) => p.enPromo).length;

  return (
    <PageWrapper>
      {/* En-tête */}
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(255,165,0,0.18),rgba(34,54,81,0.42))] p-4 md:p-5">
        <h1 className="font-[var(--font-display)] text-2xl text-orange-400 md:text-4xl">
          Promotions
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {promoCount} produit{promoCount !== 1 ? "s" : ""} en promotion
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Rechercher un produit…"
          value={search}
          onValueChange={setSearch}
          size="sm"
          variant="bordered"
          classNames={{
            inputWrapper: "border-border/60 bg-[var(--color-surface-high)] h-9",
          }}
          aria-label="Rechercher un produit"
        />
        <div className="flex gap-1.5">
          {(["tous", "enPromo"] as FilterMode[]).map((mode) => (
            <Chip
              key={mode}
              variant="flat"
              className={
                filterMode === mode
                  ? "cursor-pointer bg-orange-500 font-semibold text-white"
                  : "cursor-pointer bg-[var(--color-surface-high)] text-text-muted hover:text-text"
              }
              onClick={() => setFilterMode(mode)}
            >
              {mode === "tous" ? "Tous les produits" : "En promotion"}
            </Chip>
          ))}
        </div>
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">
          {filterMode === "enPromo" ? "Aucun produit en promotion." : "Aucun produit trouvé."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((produit) => (
            <ProduitPromoRow key={produit.id} produit={produit} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
