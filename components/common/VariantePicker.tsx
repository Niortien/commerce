"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { onlineManager } from "@tanstack/react-query";
import { IconBarcode } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { ScanCodeBarre } from "@/components/common/ScanCodeBarre";
import { StockBadge } from "@/components/common/StockBadge";
import { useProduitsList } from "@/features/produits/query/produits-queries";
import { getVarianteParCode } from "@/features/produits/api/produits-api";
import { useEnLigne } from "@/hooks/useHorsLigne";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import { useHorsLigneStore } from "@/stores/horsLigneStore";
import { formatQuantite, isVarianteUnique, natureDe, uniteDe } from "@/lib/unites";
import { libelleChoix } from "@/lib/balles";
import { NatureProduit, type Produit, type Unite, type Variante } from "@/types";

export interface VarianteSelection {
  varianteId: string;
  produitNom: string;
  taille: string;
  couleur: string;
  prixVente: string;
  prixAchat: string;
  quantiteStock: number;
  unite: Unite;
  nature: NatureProduit;
  conditionnementUnite: Unite | null;
  conditionnementQuantite: number | null;
  /** Friperie : un seul exemplaire, quantité toujours 1. */
  pieceUnique: boolean;
}

/**
 * vente : ce qui se vend (pas les ingrédients) ; un plat reste disponible, il est préparé à la commande.
 * stock : ce qui entre en stock (pas les plats), même en rupture.
 * ingredient : ce qui peut composer un plat (pas les plats).
 * devis : ce qui se vend, même en rupture (on chiffre avant de commander).
 */
export type PickerUsage = "vente" | "stock" | "ingredient" | "devis";

interface VariantePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: VarianteSelection) => void;
  onDone?: () => void;
  excludedVarianteIds?: string[];
  usage?: PickerUsage;
}

function toSelection(produit: Produit, v: Variante): VarianteSelection {
  return {
    varianteId: v.id,
    produitNom: produit.nom,
    taille: v.taille,
    couleur: v.couleur,
    prixVente: produit.prixVente,
    prixAchat: produit.prixAchat,
    quantiteStock: v.quantiteStock,
    unite: uniteDe(produit),
    nature: natureDe(produit),
    conditionnementUnite: produit.conditionnementUnite ?? null,
    conditionnementQuantite: produit.conditionnementQuantite ?? null,
    pieceUnique: Boolean(produit.pieceUnique),
  };
}

export function VariantePicker({
  isOpen,
  onClose,
  onSelect,
  onDone,
  excludedVarianteIds = [],
  usage = "vente",
}: VariantePickerProps) {
  const [search, setSearch] = useState("");
  const [expandedProduitId, setExpandedProduitId] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState(0);
  const [scanOuvert, setScanOuvert] = useState(false);
  const [rechercheCode, setRechercheCode] = useState(false);

  const enLigne = useEnLigne();
  const boutiqueId = useBoutiqueId();
  const { data, isLoading: chargement } = useProduitsList({ limit: 200 });
  const catalogue = useHorsLigneStore((s) => s.catalogue);
  const boutiqueCatalogue = useHorsLigneStore((s) => s.boutiqueId);
  // Sans réseau : la copie du catalogue gardée sur l'appareil.
  const copie = boutiqueCatalogue === boutiqueId && catalogue.length > 0 ? catalogue : undefined;
  const produits = enLigne ? (data?.data ?? copie) : (copie ?? data?.data);
  const memoriserCatalogue = useHorsLigneStore((s) => s.memoriserCatalogue);

  // Liste complète reçue en ligne : on rafraîchit la copie gardée pour vendre sans réseau.
  useEffect(() => {
    const total = data?.meta.total;
    if (enLigne && boutiqueId && data && total !== undefined && total <= data.data.length) {
      memoriserCatalogue(boutiqueId, data.data);
    }
  }, [enLigne, boutiqueId, data, memoriserCatalogue]);
  const isLoading = enLigne && chargement && !produits;

  const filtered = useMemo(() => {
    if (!produits) return [];
    const exclue = usage === "vente" || usage === "devis" ? NatureProduit.INGREDIENT : NatureProduit.PLAT;
    const q = search.toLowerCase().trim();
    return produits.filter(
      (p) =>
        natureDe(p) !== exclue &&
        (!q ||
          p.nom.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.variantes ?? []).some((v) => v.codeBarre?.toLowerCase() === q))
    );
  }, [produits, search, usage]);

  /**
   * En vente seulement, une rupture bloque ; un plat n'a pas de stock propre.
   * Une pièce unique déjà en rayon ne se réapprovisionne pas.
   */
  const isIndisponible = (produit: Produit, v: Variante) =>
    excludedVarianteIds.includes(v.id) ||
    (usage === "vente" && natureDe(produit) !== NatureProduit.PLAT && v.quantiteStock <= 0) ||
    (usage === "stock" && Boolean(produit.pieceUnique) && v.quantiteStock > 0);

  const handleSelect = (sel: VarianteSelection) => {
    onSelect(sel);
    setAddedCount((n) => n + 1);
    setSearch("");
    setExpandedProduitId(null);
  };

  /**
   * Code-barres lu (lecteur USB qui tape le code puis Entrée, ou caméra) : on ajoute directement
   * l'article. On cherche d'abord dans la liste déjà chargée (marche aussi hors connexion).
   */
  const choisirParCode = async (brut: string) => {
    const code = brut.trim();
    if (!code) return;
    const local = (produits ?? []).flatMap((p) => (p.variantes ?? []).map((v) => ({ p, v }))).find(({ v }) => v.codeBarre === code);
    let trouve: { p: Produit; v: Variante } | undefined = local;
    if (!trouve && onlineManager.isOnline()) {
      setRechercheCode(true);
      try {
        const { data: v } = await getVarianteParCode(code);
        trouve = { p: v.produit, v };
      } catch {
        // Code inconnu : message ci-dessous.
      } finally {
        setRechercheCode(false);
      }
    }
    if (!trouve) {
      toast.error(`Aucun article avec le code ${code}. Ajoute ce code à l'article dans Produits.`);
      return;
    }
    if (isIndisponible(trouve.p, trouve.v)) {
      toast.error(`« ${trouve.p.nom} » n'est pas disponible (rupture ou déjà dans la liste).`);
      return;
    }
    handleSelect(toSelection(trouve.p, trouve.v));
    toast.success(`${trouve.p.nom} ajouté`);
  };

  const handleDone = () => {
    setAddedCount(0);
    if (onDone) {
      onDone();
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setAddedCount(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        wrapper: "z-[1000]",
        backdrop: "z-[950]",
        base: "bg-[var(--color-surface)] border border-border",
        header: "border-b border-border/60",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-md font-semibold">
          {usage === "ingredient" ? "Choisir un ingrédient" : "Choisir un article"}
        </ModalHeader>
        <ModalBody className="pb-4">
          <div className="flex gap-2">
            <Input
              autoFocus
              aria-label="Rechercher un article ou scanner son code-barres"
              placeholder="Nom, SKU ou code-barres…"
              value={search}
              onValueChange={setSearch}
              onKeyDown={(e) => {
                // Les lecteurs de codes-barres tapent le code puis Entrée.
                if (e.key === "Enter" && /^[0-9A-Za-z-]{4,}$/.test(search.trim()) && !filtered.some((p) => p.nom.toLowerCase() === search.trim().toLowerCase())) {
                  e.preventDefault();
                  void choisirParCode(search);
                }
              }}
              endContent={rechercheCode ? <Spinner size="sm" color="warning" /> : null}
              variant="bordered"
              classNames={{ input: "text-sm" }}
            />
            <Button
              isIconOnly
              variant="flat"
              aria-label="Scanner un code-barres avec la caméra"
              className="shrink-0"
              onPress={() => setScanOuvert(true)}
            >
              <IconBarcode size={20} aria-hidden />
            </Button>
          </div>
          {!enLigne && (
            <p className="text-xs text-return-text">Hors connexion : stock tel qu&apos;il était à la dernière connexion.</p>
          )}
          <ScanCodeBarre
            isOpen={scanOuvert}
            onClose={() => setScanOuvert(false)}
            onCode={(code) => {
              setScanOuvert(false);
              void choisirParCode(code);
            }}
          />

          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner size="md" color="warning" />
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-text-muted">Aucun produit trouvé.</p>
          )}

          <div className="space-y-2">
            {filtered.map((produit) => {
              const isExpanded = expandedProduitId === produit.id;
              const variantes = produit.variantes ?? [];
              const unique = variantes.length === 1 && isVarianteUnique(variantes[0]) ? variantes[0] : null;

              // Produit sans taille ni couleur : un seul clic l'ajoute.
              if (unique) {
                const indisponible = isIndisponible(produit, unique);
                const plat = natureDe(produit) === NatureProduit.PLAT;
                return (
                  <button
                    key={produit.id}
                    type="button"
                    disabled={indisponible}
                    onClick={() => handleSelect(toSelection(produit, unique))}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-border/60 bg-[var(--color-surface-high)] px-3 py-2.5 text-left transition-colors duration-150 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-text">{produit.nom}</span>
                      <span className="text-xs text-text-muted">
                        {plat
                          ? "Préparé à la commande"
                          : produit.pieceUnique
                            ? ["Pièce unique", produit.sku, libelleChoix(produit.choix)].filter(Boolean).join(" · ")
                            : `En stock : ${formatQuantite(unique.quantiteStock, uniteDe(produit))}`}
                      </span>
                    </span>
                    {!plat && unique.quantiteStock <= 0 && (
                      <span className="shrink-0 text-[10px] font-semibold text-out">{produit.pieceUnique ? "Vendue" : "Rupture"}</span>
                    )}
                  </button>
                );
              }

              return (
                <div key={produit.id} className="rounded-lg border border-border/60 bg-[var(--color-surface-high)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left"
                    onClick={() => setExpandedProduitId(isExpanded ? null : produit.id)}
                  >
                    <div>
                      <span className="text-sm font-medium text-text">{produit.nom}</span>
                      <span className="ml-2 font-mono text-xs text-text-muted">{produit.sku}</span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {variantes.length} variante{variantes.length !== 1 ? "s" : ""} {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border/40 px-3 pb-3 pt-2">
                      {variantes.length === 0 ? (
                        <p className="text-xs text-text-muted">Aucune variante disponible.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {variantes.map((v) => {
                            const outOfStock = v.quantiteStock <= 0;
                            const disabled = isIndisponible(produit, v);
                            return (
                              <Button
                                key={v.id}
                                size="sm"
                                variant="flat"
                                isDisabled={disabled}
                                className={[
                                  "flex h-auto flex-col items-start gap-0.5 px-3 py-2",
                                  disabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : "bg-[var(--color-surface)] hover:bg-accent/10",
                                ].join(" ")}
                                onPress={() => handleSelect(toSelection(produit, v))}
                              >
                                <span className="font-mono text-xs text-accent">{v.taille}</span>
                                <span className="text-xs text-text">{v.couleur}</span>
                                {outOfStock ? (
                                  <span className="text-[10px] font-semibold text-out">Rupture</span>
                                ) : (
                                  <StockBadge value={v.quantiteStock} isAlert={v.quantiteStock <= v.seuilAlerte} />
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-border/60 pt-3">
          {addedCount > 0 && (
            <span className="mr-auto font-mono text-xs text-in">
              {addedCount} article{addedCount > 1 ? "s" : ""} ajouté{addedCount > 1 ? "s" : ""}
            </span>
          )}
          <Button variant="light" onPress={handleClose}>
            Annuler
          </Button>
          <Button
            className="bg-in font-semibold text-black"
            onPress={handleDone}
          >
            Terminer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
