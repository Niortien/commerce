"use client";

import { Button, Input } from "@heroui/react";
import { IconSearch } from "@tabler/icons-react";
import { articles } from "@/lib/vitrine";
import type { VitrineCategorie } from "@/types";

interface Props {
  categories: VitrineCategorie[];
  categorieId: string | null;
  onCategorie: (id: string | null) => void;
  recherche: string;
  onRecherche: (texte: string) => void;
  /** Nombre d'articles affichés après filtre et recherche. */
  visibles: number;
}

/**
 * Le rayon : le nombre d'articles comme titre (un fait, pas un slogan), puis la recherche et les
 * catégories, collées en haut de l'écran pendant que l'on parcourt le catalogue.
 */
export function VitrineToolbar({ categories, categorieId, onCategorie, recherche, onRecherche, visibles }: Props) {
  const active = categories.find((c) => c.id === categorieId);

  return (
    <>
      <h2
        id="articles"
        className="mx-auto w-full max-w-[1600px] scroll-mt-4 px-5 pt-14 text-[32px] font-semibold leading-none tracking-[-0.035em] min-[900px]:px-8 min-[900px]:pt-[72px] min-[900px]:text-[44px]"
      >
        {articles(visibles)}
        {active ? <span className="text-fa-encre-douce"> · {active.nom}</span> : null}
      </h2>
      <div className="sticky top-0 z-20 bg-fa-sol">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-5 py-3 min-[900px]:flex-row min-[900px]:items-center min-[900px]:px-8">
          <Input
            type="search"
            value={recherche}
            onValueChange={onRecherche}
            placeholder="Rechercher un article"
            aria-label="Rechercher un article"
            radius="none"
            variant="flat"
            isClearable
            onClear={() => onRecherche("")}
            startContent={<IconSearch size={20} stroke={2} className="text-fa-encre-douce" aria-hidden />}
            classNames={{
              base: "min-[900px]:max-w-[360px]",
              inputWrapper: "h-12 bg-fa-sol-pas shadow-none data-[hover=true]:bg-fa-sol-pas group-data-[focus=true]:bg-fa-sol-pas",
              input: "text-base text-fa-encre placeholder:text-fa-encre-douce",
            }}
          />
          {categories.length > 1 ? (
            <nav
              aria-label="Catégories"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] min-[900px]:mx-0 min-[900px]:flex-wrap min-[900px]:px-0 [&::-webkit-scrollbar]:hidden"
            >
              <Filtre actif={categorieId === null} onPress={() => onCategorie(null)}>
                Tout
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
    </>
  );
}

function Filtre({ actif, onPress, children }: { actif: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Button
      radius="none"
      disableRipple
      aria-pressed={actif}
      onPress={onPress}
      className={`h-11 min-w-0 shrink-0 px-4 text-base font-medium transition-[background-color,color,transform] duration-150 data-[pressed=true]:scale-[0.97] ${
        actif ? "bg-fa-encre text-fa-sol" : "bg-fa-sol-pas text-fa-encre"
      }`}
    >
      {children}
    </Button>
  );
}
