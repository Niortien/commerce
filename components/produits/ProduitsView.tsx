"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconFileSpreadsheet, IconPlus, IconRosetteDiscount, IconShirt, IconStack2 } from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useProduitsList } from "@/features/produits/query/produits-queries";
import { Role, TypeCommerce, type AppError } from "@/types";
import { NouvelArticleModal } from "@/components/common/NouvelArticleModal";
import { useAuthStore } from "@/stores/authStore";
import { ImportCatalogueModal } from "@/components/common/ImportCatalogueModal";
import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import { useUiStore } from "@/stores/uiStore";
import { ProduitDetailPanel } from "./ProduitDetailPanel";
import { ProduitMasonry } from "./ProduitMasonry";
import { ProduitSearchBar } from "./ProduitSearchBar";
import { ProduitAlphaIndex } from "./ProduitAlphaIndex";

type Disponibilite = "EN_RAYON" | "VENDUE" | "TOUTES";

const DISPONIBILITES: Array<{ key: Disponibilite; label: string }> = [
  { key: "EN_RAYON", label: "En rayon" },
  { key: "VENDUE", label: "Vendues" },
  { key: "TOUTES", label: "Toutes" },
];

export function ProduitsView() {
  const router = useRouter();
  const panelId = useUiStore((state) => state.produitPanelId);
  const setPanelId = useUiStore((state) => state.setProduitPanelId);
  const typeCommerce = useTypeCommerce();
  const profile = COMMERCE_PROFILES[typeCommerce];
  const vetements = typeCommerce === TypeCommerce.VETEMENTS;
  const friperie = typeCommerce === TypeCommerce.FRIPERIE;
  const [nouvelArticleOpen, setNouvelArticleOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const estAdmin = useAuthStore((s) => s.user?.role === Role.ADMIN);
  // Friperie : les pièces vendues restent dans l'historique mais ne doivent pas encombrer le rayon.
  const [disponibilite, setDisponibilite] = useState<Disponibilite>("EN_RAYON");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categorieId, setCategorieId] = useState<string | undefined>(undefined);
  const [enPromo, setEnPromo] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val.trim()), 300);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const { data, isLoading, error } = useProduitsList({
    limit: 100,
    sortOrder: "asc",
    search: search || undefined,
    categorieId,
    enPromo: enPromo || undefined,
    disponibilite: friperie && disponibilite !== "TOUTES" ? disponibilite : undefined,
  });

  const produits = Array.isArray(data?.data) ? data.data : [];
  const appError = error as AppError | null;
  const errorLabel = appError
    ? `[${appError.code}] ${appError.message}`
    : "Impossible de charger la liste des produits.";

  const isFiltering = !!search || !!categorieId || enPromo;
  const showGrouped = !isFiltering && produits.length > 0;
  const nbPromos = produits.filter((p) => p.enPromo && !!p.prixPromo).length;
  const unites = produits.reduce((sum, p) => sum + (p.variantes?.reduce((s, v) => s + v.quantiteStock, 0) ?? 0), 0);

  return (
    <PageWrapper>
      <PageHero
        tone="accent"
        icon={vetements ? IconShirt : profile.icon}
        eyebrow="Catalogue"
        title={profile.vocab.produits}
        description="Votre catalogue : fiches, variantes, prix et promotions. Touchez un produit pour l'ouvrir."
        actions={
          <div className="flex flex-wrap gap-2">
            {estAdmin && (
              <Button
                variant="flat"
                className="min-h-11 font-semibold"
                startContent={<IconFileSpreadsheet size={18} aria-hidden />}
                onPress={() => setImportOpen(true)}
              >
                Importer depuis Excel
              </Button>
            )}
            <Button
              className="min-h-11 bg-accent font-semibold text-white"
              startContent={<IconPlus size={18} aria-hidden />}
              onPress={() => (vetements ? setPanelId("new") : setNouvelArticleOpen(true))}
            >
              {vetements ? "Nouveau produit" : `Ajouter : ${profile.vocab.produits.toLowerCase()}`}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile
            tone="accent"
            icon={IconShirt}
            label={isFiltering ? "Produits trouvés" : "Produits"}
            value={isLoading ? "—" : <CountUp value={produits.length} />}
          />
          <StatTile
            tone="in"
            icon={IconStack2}
            label="Unités en stock"
            value={isLoading ? "—" : <CountUp value={unites} />}
            delay={0.05}
          />
          <StatTile
            tone="return"
            icon={IconRosetteDiscount}
            label="En promotion"
            value={isLoading ? "—" : <CountUp value={nbPromos} />}
            delay={0.1}
          />
        </div>
      </PageHero>

      {estAdmin && !isLoading && !isFiltering && produits.length < 15 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-in-dim text-in-text">
            <IconFileSpreadsheet size={22} aria-hidden />
          </span>
          <p className="min-w-0 flex-1 text-sm text-text-muted">
            <span className="block font-semibold text-text">Ta liste d&apos;articles est déjà dans Excel ?</span>
            Importe-la d&apos;un coup au lieu de tout saisir : articles, catégories et stock de départ en un seul envoi.
          </p>
          <Button className="min-h-11 bg-in font-semibold text-white" onPress={() => setImportOpen(true)}>
            Importer mon fichier
          </Button>
        </div>
      )}

      {estAdmin && <ImportCatalogueModal isOpen={importOpen} onClose={() => setImportOpen(false)} />}

      {!vetements && (
        <NouvelArticleModal
          mode="catalogue"
          isOpen={nouvelArticleOpen}
          onClose={() => setNouvelArticleOpen(false)}
          onCreated={(id) => router.push(`/produits/${id}`)}
        />
      )}

      {friperie && (
        <SegmentedControl
          ariaLabel="Afficher les pièces"
          options={DISPONIBILITES}
          value={disponibilite}
          onChange={setDisponibilite}
        />
      )}

      <ProduitSearchBar
        search={searchInput}
        onSearch={handleSearch}
        categorieId={categorieId}
        onCategorie={setCategorieId}
        enPromo={enPromo}
        onPromo={setEnPromo}
        count={produits.length}
        isLoading={isLoading}
      />

      {isLoading && (
        <div role="status" aria-label="Chargement des produits" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="aspect-[4/5] animate-pulse bg-surface-high" />
              <div className="space-y-2 p-3.5">
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-surface-high" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-surface-high" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-out-line bg-out-dim p-4 text-sm text-out-text">
          <IconAlertCircle size={20} aria-hidden className="mt-0.5 shrink-0" />
          {errorLabel}
        </div>
      )}

      {!isLoading && !error && produits.length === 0 && (
        <EmptyRiver
          message={
            isFiltering
              ? "Aucun produit ne correspond à votre recherche"
              : friperie && disponibilite === "VENDUE"
                ? "Aucune pièce vendue pour l'instant"
                : "Aucun produit pour l'instant"
          }
          hint={
            isFiltering
              ? "Essayez un autre mot-clé ou retirez un filtre."
              : friperie
                ? "Les pièces arrivent en rayon quand vous déballez une balle."
                : "Créez votre premier produit pour remplir le catalogue."
          }
          action={
            !isFiltering &&
            (friperie ? (
              <Button size="sm" className="bg-accent font-semibold text-white" onPress={() => router.push("/balles")}>
                Voir les balles
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-accent font-semibold text-white"
                onPress={() => (vetements ? setPanelId("new") : setNouvelArticleOpen(true))}
              >
                Créer un produit
              </Button>
            ))
          }
        />
      )}

      {!isLoading && produits.length > 0 && (
        <>
          <ProduitMasonry
            items={produits}
            onSelect={(id) => router.push(`/produits/${id}`)}
            grouped={showGrouped}
          />
          {showGrouped && <ProduitAlphaIndex produits={produits} />}
        </>
      )}

      {panelId === "new" ? (
        <ProduitDetailPanel produit={undefined} onClose={() => setPanelId(null)} />
      ) : null}
    </PageWrapper>
  );
}
