"use client";

import { motion } from "framer-motion";
import type { Variante } from "@/types";
import { Taille } from "@/types";
import { ProduitVariantPicker } from "./ProduitVariantPicker";
import { getWhatsappUrl } from "@/lib/whatsapp";

interface ProduitVariantesSectionProps {
  variantes: Variante[];
  selectedTaille: Taille | null;
  selectedCouleur: string | null;
  onTailleChange: (t: Taille) => void;
  onCouleurChange: (c: string) => void;
}

const TAILLE_ORDER = [Taille.XS, Taille.S, Taille.M, Taille.L, Taille.XL, Taille.XXL, Taille.XXXL];

function StockDot({ stock }: { stock: number }) {
  const color = stock === 0 ? "var(--v-red)" : stock <= 3 ? "#ff9a3c" : "var(--v-lime)";
  return (
    <span
      className="inline-flex h-2 w-2 rounded-full"
      style={{ backgroundColor: color, flexShrink: 0 }}
    />
  );
}

export function ProduitVariantesSection({
  variantes,
  selectedTaille,
  selectedCouleur,
  onTailleChange,
  onCouleurChange,
}: ProduitVariantesSectionProps) {
  const tailles = TAILLE_ORDER.filter((t) => variantes.some((v) => v.taille === t));
  const couleurs = [...new Set(variantes.map((v) => v.couleur))];

  // Pas de variantes → état vide avec CTA WhatsApp
  if (variantes.length === 0) {
    const url = getWhatsappUrl(
      "Bonjour Dri Valé 👋 Je voudrais avoir des infos sur les tailles disponibles pour un produit."
    );
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
      >
        <p className="mb-1 text-sm font-bold" style={{ color: "var(--v-text)" }}>
          Tailles non renseignées
        </p>
        <p className="mb-4 text-xs" style={{ color: "var(--v-muted)" }}>
          Contacte-nous pour connaître les disponibilités.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: "#25D366", color: "#000" }}
        >
          Demander les tailles
        </a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Header section */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{ backgroundColor: "var(--v-s2)" }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: "var(--v-lime)" }}>
          Disponibilités
        </p>
        <span className="text-[10px] font-semibold" style={{ color: "var(--v-dim)" }}>
          {variantes.filter((v) => v.quantiteStock > 0).length} / {variantes.length} dispo
        </span>
      </div>

      {/* Picker taille + couleur */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
      >
        <ProduitVariantPicker
          variantes={variantes}
          selectedTaille={selectedTaille}
          selectedCouleur={selectedCouleur}
          onTailleChange={onTailleChange}
          onCouleurChange={onCouleurChange}
        />
      </div>

      {/* Grille de stock complète */}
      {couleurs.length > 0 && tailles.length > 0 && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--v-border)" }}
        >
          <div
            className="px-4 py-2.5 border-b"
            style={{ backgroundColor: "var(--v-s2)", borderColor: "var(--v-border)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: "var(--v-muted)" }}>
              Grille de stock
            </p>
          </div>

          <div className="overflow-x-auto" style={{ backgroundColor: "var(--v-s1)" }}>
            <table className="w-full text-[11px]">
              <thead>
                <tr style={{ borderBottom: `1px solid var(--v-border)` }}>
                  <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider" style={{ color: "var(--v-dim)" }}>
                    Taille
                  </th>
                  {couleurs.map((c) => (
                    <th
                      key={c}
                      className="px-3 py-2.5 text-center font-bold uppercase tracking-wider"
                      style={{ color: "var(--v-dim)" }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tailles.map((t, rowIdx) => (
                  <tr
                    key={t}
                    className="transition-colors"
                    style={{
                      borderBottom: rowIdx < tailles.length - 1 ? `1px solid var(--v-border)` : undefined,
                      backgroundColor:
                        selectedTaille === t ? "rgba(200,118,44,0.05)" : undefined,
                    }}
                  >
                    <td className="px-4 py-2.5">
                      <span
                        className="font-black uppercase"
                        style={{
                          color: selectedTaille === t ? "var(--v-lime)" : "var(--v-text)",
                        }}
                      >
                        {t}
                      </span>
                    </td>
                    {couleurs.map((c) => {
                      const v = variantes.find((x) => x.taille === t && x.couleur === c);
                      const stock = v?.quantiteStock ?? -1;
                      const isSelected = selectedTaille === t && selectedCouleur === c;
                      return (
                        <td key={c} className="px-3 py-2.5 text-center">
                          {stock === -1 ? (
                            <span style={{ color: "var(--v-dim)" }}>—</span>
                          ) : (
                            <button
                              onClick={() => {
                                if (stock > 0) {
                                  onTailleChange(t);
                                  onCouleurChange(c);
                                }
                              }}
                              disabled={stock === 0}
                              className="inline-flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 transition-all disabled:cursor-not-allowed"
                              style={
                                isSelected
                                  ? { backgroundColor: "rgba(200,118,44,0.15)", outline: "1px solid var(--v-lime)" }
                                  : undefined
                              }
                            >
                              <StockDot stock={stock} />
                              <span
                                className="font-[var(--font-mono)] font-black"
                                style={{
                                  color: stock === 0 ? "var(--v-dim)" : "var(--v-text)",
                                  textDecoration: stock === 0 ? "line-through" : undefined,
                                }}
                              >
                                {stock}
                              </span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Légende */}
          <div
            className="flex items-center gap-4 px-4 py-2.5 border-t"
            style={{ backgroundColor: "var(--v-s2)", borderColor: "var(--v-border)" }}
          >
            <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--v-dim)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--v-lime)]" />Disponible
            </span>
            <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--v-dim)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff9a3c]" />Limité (≤3)
            </span>
            <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--v-dim)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--v-red)]" />Rupture
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
