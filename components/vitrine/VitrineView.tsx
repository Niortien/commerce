"use client";

import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { IconBuildingStore } from "@tabler/icons-react";
import type { Vitrine, VitrineProduit } from "@/types";
import { ProduitVitrineCard } from "./ProduitVitrineCard";
import { ProduitVitrineModal } from "./ProduitVitrineModal";
import { VitrineFooter } from "./VitrineFooter";
import { VitrineHeader } from "./VitrineHeader";

export function VitrineView({ vitrine }: { vitrine: Vitrine }) {
  const { boutique, categories, produits } = vitrine;
  const [categorieId, setCategorieId] = useState<string | null>(null);
  const [ouvert, setOuvert] = useState<VitrineProduit | null>(null);

  const visibles = useMemo(
    () => (categorieId ? produits.filter((p) => p.categorieId === categorieId) : produits),
    [produits, categorieId],
  );

  return (
    <div className="min-h-dvh bg-base">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6">
        <VitrineHeader boutique={boutique} />

        {categories.length > 1 ? (
          <nav aria-label="Catégories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <Button
              size="sm"
              radius="full"
              variant={categorieId === null ? "solid" : "bordered"}
              className={categorieId === null ? "shrink-0 bg-text !text-surface" : "shrink-0"}
              aria-pressed={categorieId === null}
              onPress={() => setCategorieId(null)}
            >
              Tout · {produits.length}
            </Button>
            {categories.map((c) => {
              const actif = categorieId === c.id;
              return (
                <Button
                  key={c.id}
                  size="sm"
                  radius="full"
                  variant={actif ? "solid" : "bordered"}
                  className={actif ? "shrink-0 bg-text !text-surface" : "shrink-0"}
                  aria-pressed={actif}
                  onPress={() => setCategorieId(actif ? null : c.id)}
                >
                  {c.nom}
                </Button>
              );
            })}
          </nav>
        ) : null}

        <section aria-label="Articles disponibles" aria-live="polite">
          {visibles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <IconBuildingStore size={40} className="text-text-dim" aria-hidden />
              <p className="font-semibold text-text">Les articles arrivent bientôt</p>
              <p className="max-w-sm text-sm text-text-muted">
                Écrivez à la boutique sur WhatsApp pour savoir ce qui est disponible aujourd&apos;hui.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibles.map((p) => (
                <li key={p.id}>
                  <ProduitVitrineCard produit={p} onOuvrir={setOuvert} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <VitrineFooter slug={boutique.slug} />
      <ProduitVitrineModal produit={ouvert} boutique={boutique} onFermer={() => setOuvert(null)} />
    </div>
  );
}
