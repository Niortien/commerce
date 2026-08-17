"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, useDisclosure } from "@heroui/react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { StockBadge } from "@/components/common/StockBadge";
import { FlowTag } from "@/components/common/FlowTag";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { useAuthStore } from "@/stores/authStore";
import { useProduit, useProduitMouvements } from "@/features/produits/query/produits-queries";
import {
  useAddProduitImage,
  useDeleteProduit,
  useDeleteVariante,
  useRemoveProduitImage,
  useUpdateProduit,
  useAdjustStock,
} from "@/features/produits/mutation/produits-mutations";
import { ProduitDetailPanel } from "./ProduitDetailPanel";
import { PromoInlineForm, type PromoFormData } from "@/components/promotions/PromoInlineForm";
import type { ProduitImage, TypeMouvement, Variante } from "@/types";

interface ProduitDetailViewProps {
  id: string;
}

const TYPE_FLOW: Record<TypeMouvement, "entree" | "sortie" | "ajustement" | "retour"> = {
  ENTREE: "entree",
  SORTIE: "sortie",
  AJUSTEMENT: "ajustement",
  RETOUR: "retour",
};

/* ── Galerie d'images ─────────────────────────────────────────── */
function ImageGallery({
  produitId,
  imageUrl,
  images,
}: {
  produitId: string;
  imageUrl: string | null;
  images: ProduitImage[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const addMutation = useAddProduitImage(produitId);
  const removeMutation = useRemoveProduitImage(produitId);
  const updateMutation = useUpdateProduit(produitId);

  /* Sources unifiées : imageUrl (cover) + images de la galerie */
  type GalleryItem =
    | { kind: "cover"; url: string }
    | { kind: "gallery"; img: ProduitImage };

  const items: GalleryItem[] = [
    ...(imageUrl ? [{ kind: "cover" as const, url: imageUrl }] : []),
    ...images.map((img) => ({ kind: "gallery" as const, img })),
  ];

  const activeUrl = items[activeIdx]
    ? items[activeIdx].kind === "cover"
      ? (items[activeIdx] as { kind: "cover"; url: string }).url
      : (items[activeIdx] as { kind: "gallery"; img: ProduitImage }).img.url
    : null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) { height = Math.round(height * MAX / width); width = MAX; }
        else                 { width  = Math.round(width  * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      addMutation.mutate(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  };

  const handleRemove = (item: GalleryItem) => {
    if (item.kind === "cover") {
      updateMutation.mutate({ imageUrl: null });
    } else {
      removeMutation.mutate(item.img.id);
    }
    setActiveIdx(0);
  };

  const isPending = addMutation.isPending || removeMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-3">
      {/* Image principale */}
      <div className="relative overflow-hidden rounded-xl border border-border/80">
        {activeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeUrl}
            alt="Photo produit"
            className="h-64 w-full object-cover md:h-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="h-64 w-full bg-gradient-to-br from-[var(--color-surface-high)] via-[color:rgba(143,126,245,0.22)] to-border md:h-80" />
        )}

        {/* Bouton supprimer l'image active */}
        {activeUrl && items[activeIdx] && (
          <button
            type="button"
            aria-label="Supprimer cette image"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-sm text-white hover:bg-out/80"
            onClick={() => handleRemove(items[activeIdx])}
            disabled={isPending}
          >
            ✕
          </button>
        )}
      </div>

      {/* Thumbnails + bouton ajouter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item, i) => {
          const thumbUrl = item.kind === "cover" ? item.url : item.img.url;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={[
                "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === activeIdx ? "border-accent" : "border-border/60 opacity-60 hover:opacity-100",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
            </button>
          );
        })}

        {/* Bouton + ajouter */}
        <button
          type="button"
          aria-label="Ajouter une photo"
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border/60 text-xl text-text-muted hover:border-accent/60 hover:text-accent"
        >
          {addMutation.isPending ? <Spinner size="sm" color="warning" /> : "+"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

/* ── Cellule ajustement stock ─────────────────────────────────── */
function AdjustCell({ varianteId }: { varianteId: string }) {
  const adjust = useAdjustStock(varianteId);
  const run = (delta: number) =>
    adjust.mutate({ variation: delta, motif: "Ajustement manuel" });

  return (
    <div className="flex items-center gap-1">
      <Button
        isIconOnly size="sm" variant="flat"
        className="h-6 w-6 min-w-0 rounded bg-[var(--color-surface-high)] text-out"
        isDisabled={adjust.isPending}
        onPress={() => run(-1)}
      >−</Button>
      <Button
        isIconOnly size="sm" variant="flat"
        className="h-6 w-6 min-w-0 rounded bg-[var(--color-surface-high)] text-in"
        isDisabled={adjust.isPending}
        onPress={() => run(1)}
      >+</Button>
    </div>
  );
}

/* ── Cellule suppression variante ─────────────────────────────── */
function DeleteVarianteCell({ variante, produitId }: { variante: Variante; produitId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteMutation = useDeleteVariante(produitId);

  const confirm = () => {
    deleteMutation.mutate(variante.id, { onSuccess: onClose });
  };

  return (
    <>
      <Button
        isIconOnly size="sm" variant="flat"
        className="h-6 w-6 min-w-0 rounded bg-[var(--color-surface-high)] text-out"
        aria-label={`Supprimer variante ${variante.taille} ${variante.couleur}`}
        onPress={onOpen}
      >
        🗑
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent>
          <ModalHeader className="text-base">Supprimer la variante ?</ModalHeader>
          <ModalBody className="text-sm text-text-muted">
            <span className="font-semibold text-text">{variante.taille} — {variante.couleur}</span>
            <p className="mt-1">Cette action est irréversible. Impossible si la variante a des mouvements de stock.</p>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="flat" onPress={onClose}>Annuler</Button>
            <Button
              size="sm"
              className="bg-out text-white"
              isLoading={deleteMutation.isPending}
              onPress={confirm}
            >
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

/* ── Vue principale ───────────────────────────────────────────── */
export function ProduitDetailView({ id }: ProduitDetailViewProps) {
  const router = useRouter();
  const [showPanel, setShowPanel] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");

  const { data, isLoading, error } = useProduit(id);
  const { data: mouvData, isLoading: mouvLoading } = useProduitMouvements(id, { limit: 10 });
  const deleteMutation = useDeleteProduit(id);
  const updateMutation = useUpdateProduit(id);

  const [promoExpanded, setPromoExpanded] = useState(false);

  const produit = data?.data;
  const mouvements = mouvData?.data ?? [];

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      </PageWrapper>
    );
  }

  if (!produit || error) {
    return (
      <PageWrapper>
        <EmptyRiver message="Produit introuvable." />
        <Button variant="light" className="text-text-muted" onPress={() => router.back()}>
          ← Retour
        </Button>
      </PageWrapper>
    );
  }

  const totalStock = produit.variantes?.reduce((sum, v) => sum + v.quantiteStock, 0) ?? 0;

  return (
    <>
      <PageWrapper>
        {/* header */}
        <div className="flex items-center gap-3">
          <Button variant="light" isIconOnly className="text-text-muted" onPress={() => router.back()}>
            ←
          </Button>
          <h1 className="flex-1 font-[var(--font-display)] text-3xl md:text-4xl">{produit.nom}</h1>
          {!produit.isActif && (
            <Chip size="sm" variant="flat" className="bg-[var(--color-out-dim)] text-out">Inactif</Chip>
          )}
          <Button size="sm" variant="bordered" className="border-accent/60 text-accent" onPress={() => setShowPanel(true)}>
            Éditer
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          {/* galerie d'images */}
          <ImageGallery
            produitId={id}
            imageUrl={produit.imageUrl}
            images={produit.images ?? []}
          />

          {/* infos */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border/80 bg-surface p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Identité</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">SKU</span>
                  <span className="font-[var(--font-mono)] text-accent">{produit.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Catégorie</span>
                  <span className="text-text">{produit.categorie?.nom ?? "—"}</span>
                </div>
                {produit.description && (
                  <p className="mt-2 text-text-muted">{produit.description}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-surface p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Prix</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-text-muted">Vente</p>
                  <CurrencyDisplay montant={produit.prixVente} size="lg" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Achat</p>
                  <CurrencyDisplay montant={produit.prixAchat} size="lg" />
                </div>
              </div>
            </div>

            {/* Promotion */}
            <div className="rounded-xl border border-border/80 bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Promotion</p>
                {produit.enPromo && produit.prixPromo && (
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                    -{Math.round(((parseFloat(produit.prixVente) - parseFloat(produit.prixPromo)) / parseFloat(produit.prixVente)) * 100)}%
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={produit.enPromo || promoExpanded}
                  onClick={() => {
                    if (produit.enPromo || promoExpanded) {
                      if (produit.enPromo) updateMutation.mutate({ enPromo: false });
                      setPromoExpanded(false);
                    } else {
                      setPromoExpanded(true);
                    }
                  }}
                  className={[
                    "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                    produit.enPromo || promoExpanded ? "bg-orange-500" : "bg-border",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                      produit.enPromo || promoExpanded ? "translate-x-4" : "translate-x-0.5",
                    ].join(" ")}
                  />
                </button>
                <span className="text-sm text-text-muted">
                  {produit.enPromo ? (
                    <>
                      En promotion à{" "}
                      <span className="font-semibold text-orange-400">
                        {Number(produit.prixPromo).toLocaleString("fr-FR")} FCFA
                      </span>
                    </>
                  ) : promoExpanded ? (
                    "Définir le prix promotionnel"
                  ) : (
                    "Pas en promotion"
                  )}
                </span>
              </div>
              {(promoExpanded || produit.enPromo) && (
                <PromoInlineForm
                  produit={produit}
                  onSave={async (data: PromoFormData) => {
                    await updateMutation.mutateAsync({
                      enPromo: true, prixPromo: data.prixPromo,
                      dateDebutPromo: data.dateDebutPromo, dateFinPromo: data.dateFinPromo,
                    });
                    setPromoExpanded(false);
                  }}
                  onCancel={() => setPromoExpanded(false)}
                  isSaving={updateMutation.isPending}
                />
              )}
            </div>

            <div className="rounded-xl border border-border/80 bg-surface p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.08em] text-text-muted">Stock total</p>
              <StockBadge value={totalStock} />
            </div>
          </div>
        </div>

        {/* variantes */}
        {produit.variantes && produit.variantes.length > 0 && (
          <div className="rounded-xl border border-border/80 bg-surface p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">
              Variantes ({produit.variantes.length})
            </p>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-text-muted">
                    <th className="pb-2 pr-4 font-normal">Taille</th>
                    <th className="pb-2 pr-4 font-normal">Couleur</th>
                    <th className="pb-2 pr-4 font-normal">Stock</th>
                    <th className="pb-2 pr-4 font-normal">Seuil</th>
                    {isAdmin && <th className="pb-2 pr-4 font-normal">Ajuster</th>}
                    <th className="pb-2 font-normal">Suppr.</th>
                  </tr>
                </thead>
                <tbody>
                  {produit.variantes.map((v) => {
                    const isAlerte = v.quantiteStock <= v.seuilAlerte;
                    return (
                      <tr key={v.id} className="border-b border-border/30 last:border-0">
                        <td className="py-2 pr-4 font-[var(--font-mono)] text-accent">{v.taille}</td>
                        <td className="py-2 pr-4 text-text">{v.couleur}</td>
                        <td className="py-2 pr-4">
                          <StockBadge value={v.quantiteStock} isAlert={isAlerte} />
                        </td>
                        <td className="py-2 pr-4 font-[var(--font-mono)] text-text-muted">{v.seuilAlerte}</td>
                        {isAdmin && (
                          <td className="py-2 pr-4">
                            <AdjustCell varianteId={v.id} />
                          </td>
                        )}
                        <td className="py-2">
                          <DeleteVarianteCell variante={v} produitId={id} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* mouvements de stock */}
        <div className="rounded-xl border border-border/80 bg-surface p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">
            Historique des mouvements
          </p>
          {mouvLoading ? (
            <div className="flex justify-center py-6"><Spinner size="sm" color="warning" /></div>
          ) : mouvements.length === 0 ? (
            <EmptyRiver message="Aucun mouvement enregistré pour ce produit." />
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-text-muted">
                    <th className="pb-2 pr-4 font-normal">Type</th>
                    <th className="pb-2 pr-4 font-normal">Qté</th>
                    <th className="pb-2 pr-4 font-normal">Motif</th>
                    <th className="pb-2 font-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mouvements.map((m) => (
                    <tr key={m.id} className="border-b border-border/30 last:border-0">
                      <td className="py-2 pr-4"><FlowTag type={TYPE_FLOW[m.type]} /></td>
                      <td className="py-2 pr-4 font-[var(--font-mono)] text-text">
                        {m.type === "SORTIE" || m.type === "RETOUR" ? "−" : "+"}{m.quantite}
                      </td>
                      <td className="py-2 pr-4 text-text-muted">{m.motif ?? "—"}</td>
                      <td className="py-2 font-[var(--font-mono)] text-xs text-text-muted">
                        {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-3">
          {produit.isActif ? (
            <Button
              variant="bordered"
              className="border-out/60 text-out"
              onPress={onDeleteOpen}
            >
              Désactiver
            </Button>
          ) : (
            <Button
              variant="bordered"
              className="border-in/60 text-in"
              isLoading={updateMutation.isPending}
              onPress={() => updateMutation.mutate({ isActif: true })}
            >
              Réactiver
            </Button>
          )}
        </div>
      </PageWrapper>

      {/* Modal confirmation désactivation */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent>
          <ModalHeader className="text-base">Désactiver le produit ?</ModalHeader>
          <ModalBody className="text-sm text-text-muted">
            <span className="font-semibold text-text">{produit.nom}</span>
            <p className="mt-1">Le produit ne sera plus visible dans le stock. Vous pourrez le réactiver depuis sa page détail.</p>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="flat" onPress={onDeleteClose}>Annuler</Button>
            <Button
              size="sm"
              className="bg-out text-white"
              isLoading={deleteMutation.isPending}
              onPress={() =>
                deleteMutation.mutate(undefined, {
                  onSuccess: () => router.push("/produits"),
                })
              }
            >
              Désactiver
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {showPanel && (
        <ProduitDetailPanel produit={produit} onClose={() => setShowPanel(false)} />
      )}
    </>
  );
}
