"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { IconLayoutGrid } from "@tabler/icons-react";
import { useSuperAdminBoutiques } from "@/features/super-admin/query/superadmin-queries";
import { COMMERCE_PROFILES, TYPES_COMMERCE, resolveTypeCommerce, sectorStyle } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import { useSectorStore, type Secteur } from "@/stores/sectorStore";

const SECTEURS: Secteur[] = ["TOUS", ...TYPES_COMMERCE];

/**
 * Choix du secteur du Super Admin, dans la barre latérale : les pages n'affichent plus que les commerces
 * de ce type. Le nombre de boutiques de chaque secteur est visible avant de choisir.
 */
export function SectorSwitcher({ onSelect }: { onSelect?: () => void }) {
  const labelId = useId();
  const secteur = useSectorStore((s) => s.secteur);
  const setSecteur = useSectorStore((s) => s.setSecteur);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const { data } = useSuperAdminBoutiques();
  const boutiques = data?.data;

  const count = (s: Secteur) =>
    boutiques === undefined
      ? null
      : s === "TOUS"
        ? boutiques.length
        : boutiques.filter((b) => resolveTypeCommerce(b.typeCommerce) === s).length;

  const choose = (s: Secteur) => {
    setSecteur(s);
    onSelect?.();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (index + step + SECTEURS.length) % SECTEURS.length;
    setSecteur(SECTEURS[next]);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <p id={labelId} className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
        Secteur
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className="flex flex-col gap-0.5">
        {SECTEURS.map((s, index) => {
          const profile = s === "TOUS" ? null : COMMERCE_PROFILES[s];
          const Icon = profile ? profile.icon : IconLayoutGrid;
          const selected = s === secteur;
          const n = count(s);
          return (
            <button
              key={s}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(s)}
              onKeyDown={(e) => onKeyDown(e, index)}
              style={profile ? sectorStyle(profile.type, true) : undefined}
              className={cn(
                "relative flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium lg:min-h-9",
                "transition-colors duration-150 focus-visible:outline-sidebar-accent",
                selected ? "bg-sidebar-active text-sidebar-text" : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text"
              )}
            >
              {selected && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-1.5 left-0 w-0.5 rounded-full",
                    profile ? "bg-[color:var(--sector)]" : "bg-sidebar-accent"
                  )}
                />
              )}
              <Icon
                size={18}
                aria-hidden
                className={cn("shrink-0", profile ? "text-[color:var(--sector)]" : "text-sidebar-accent")}
              />
              <span className="min-w-0 flex-1 truncate">{profile ? profile.pluriel : "Tous les commerces"}</span>
              {n !== null && (
                <span className="tabular text-xs text-sidebar-muted" aria-label={`${n} boutique${n > 1 ? "s" : ""}`}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
