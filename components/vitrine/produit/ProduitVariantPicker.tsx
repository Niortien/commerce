"use client";

import type { Variante } from "@/types";
import { Taille } from "@/types";

interface ProduitVariantPickerProps {
  variantes: Variante[];
  selectedTaille: Taille | null;
  selectedCouleur: string | null;
  onTailleChange: (t: Taille) => void;
  onCouleurChange: (c: string) => void;
}

const TAILLE_ORDER = [Taille.XS, Taille.S, Taille.M, Taille.L, Taille.XL, Taille.XXL, Taille.XXXL];

function stockColor(stock: number): string {
  if (stock === 0) return "var(--v-red)";
  if (stock <= 3) return "#ff9a3c";
  return "var(--v-lime)";
}

export function ProduitVariantPicker({
  variantes,
  selectedTaille,
  selectedCouleur,
  onTailleChange,
  onCouleurChange,
}: ProduitVariantPickerProps) {
  // Tailles disponibles (ordonnées)
  const tailles = TAILLE_ORDER.filter((t) => variantes.some((v) => v.taille === t));

  // Couleurs disponibles pour la taille sélectionnée
  const couleurs = selectedTaille
    ? [...new Set(variantes.filter((v) => v.taille === selectedTaille).map((v) => v.couleur))]
    : [...new Set(variantes.map((v) => v.couleur))];

  const getStockForTaille = (t: Taille) =>
    variantes.filter((v) => v.taille === t).reduce((s, v) => s + v.quantiteStock, 0);

  const getStockForCouleur = (c: string) =>
    variantes
      .filter((v) => v.couleur === c && (!selectedTaille || v.taille === selectedTaille))
      .reduce((s, v) => s + v.quantiteStock, 0);

  return (
    <div className="space-y-5">
      {/* Sélecteur taille */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--v-muted)" }}
          >
            Taille
            {selectedTaille && (
              <span className="ml-2" style={{ color: "var(--v-lime)" }}>
                — {selectedTaille}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tailles.map((t) => {
            const stock = getStockForTaille(t);
            const isActive = selectedTaille === t;
            return (
              <button
                key={t}
                onClick={() => stock > 0 && onTailleChange(t)}
                disabled={stock === 0}
                className="relative h-11 min-w-[44px] rounded-xl border px-3 text-sm font-black uppercase transition-all"
                style={
                  stock === 0
                    ? {
                        borderColor: "var(--v-border)",
                        color: "var(--v-dim)",
                        opacity: 0.4,
                        cursor: "not-allowed",
                        textDecoration: "line-through",
                      }
                    : isActive
                    ? { borderColor: "var(--v-lime)", backgroundColor: "var(--v-lime)", color: "#fff" }
                    : { borderColor: "var(--v-border)", color: "var(--v-text)" }
                }
              >
                {t}
                {/* Point de stock */}
                {stock > 0 && !isActive && (
                  <span
                    className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: stockColor(stock) }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sélecteur couleur */}
      <div>
        <p
          className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]"
          style={{ color: "var(--v-muted)" }}
        >
          Couleur
          {selectedCouleur && (
            <span className="ml-2" style={{ color: "var(--v-lime)" }}>
              — {selectedCouleur}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {couleurs.map((c) => {
            const stock = getStockForCouleur(c);
            const isActive = selectedCouleur === c;
            return (
              <button
                key={c}
                onClick={() => stock > 0 && onCouleurChange(c)}
                disabled={stock === 0}
                className="rounded-xl border px-4 py-2 text-sm font-bold transition-all"
                style={
                  stock === 0
                    ? { borderColor: "var(--v-border)", color: "var(--v-dim)", opacity: 0.4, cursor: "not-allowed" }
                    : isActive
                    ? { borderColor: "var(--v-lime)", backgroundColor: "rgba(200,118,44,0.1)", color: "var(--v-lime)" }
                    : { borderColor: "var(--v-border)", color: "var(--v-text)" }
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Légende stock */}
      <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--v-dim)" }}>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--v-lime)]" /> Disponible</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#ff9a3c]" /> Limité</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--v-red)]" /> Rupture</span>
      </div>
    </div>
  );
}
