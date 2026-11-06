"use client";

import { Button, Input } from "@heroui/react";
import { IconSearch } from "@tabler/icons-react";
import type { VitrineCategorie } from "@/types";

interface Props {
  categories: VitrineCategorie[];
  categorieId: string | null;
  onCategorie: (id: string | null) => void;
  recherche: string;
  onRecherche: (texte: string) => void;
  total: number;
}

/** Recherche et catégories, collées en haut de l'écran pendant que l'on parcourt les articles. */
export function VitrineToolbar({ categories, categorieId, onCategorie, recherche, onRecherche, total }: Props) {
  return (
    <div id="articles" className="sticky top-0 z-20 scroll-mt-0 bg-base">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:px-8">
        <Input
          type="search"
          value={recherche}
          onValueChange={onRecherche}
          placeholder="Rechercher un article"
          aria-label="Rechercher un article"
          radius="full"
          variant="flat"
          isClearable
          onClear={() => onRecherche("")}
          startContent={<IconSearch size={18} className="text-text-muted" aria-hidden />}
          classNames={{ base: "sm:max-w-xs", inputWrapper: "bg-surface-high data-[hover=true]:bg-surface-high" }}
        />
        {categories.length > 1 ? (
          <nav
            aria-label="Catégories"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <Filtre actif={categorieId === null} onPress={() => onCategorie(null)}>
              Tout · {total}
            </Filtre>
            {categories.map((c) => (
              <Filtre key={c.id} actif={categorieId === c.id} onPress={() => onCategorie(categorieId === c.id ? null : c.id)}>
                {c.nom}
              </Filtre>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function Filtre({ actif, onPress, children }: { actif: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Button
      size="sm"
      radius="full"
      aria-pressed={actif}
      onPress={onPress}
      className={`h-9 shrink-0 px-4 text-sm transition-transform active:scale-95 ${
        actif ? "bg-[color:var(--sector)] font-semibold text-white" : "bg-surface-high text-text"
      }`}
    >
      {children}
    </Button>
  );
}
