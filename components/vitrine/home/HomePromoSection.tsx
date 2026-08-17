"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProduitCard } from "@/components/vitrine/common/ProduitCard";

export function HomePromoSection() {
  const { data, isLoading } = useVitrineProduits({ enPromo: true, limit: 6 });
  const produits = data?.pages[0]?.data ?? [];

  if (!isLoading && produits.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(170deg, rgba(255,51,89,0.08) 0%, var(--v-bg) 55%)" }}
    >
      {/* Glow rouge en haut */}
      <div
        className="pointer-events-none absolute -top-16 left-0 right-0 h-40 blur-3xl"
        style={{ background: "linear-gradient(90deg, rgba(255,51,89,0.12) 0%, transparent 60%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            {/* Badge flash */}
            <div className="mb-4 inline-flex items-center gap-2">
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: "var(--v-hot)" }}
              />
              <span
                className="text-[10px] font-black uppercase tracking-[0.35em]"
                style={{ color: "var(--v-hot)" }}
              >
                Vente flash &bull; Prix cass&eacute;s
              </span>
            </div>
            <h2
              className="font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "var(--v-text)" }}
            >
              Promos
              <br />
              <span style={{ color: "var(--v-hot)" }}>du moment</span>
            </h2>
            {!isLoading && produits.length > 0 && (
              <p className="mt-3 text-sm" style={{ color: "var(--v-muted)" }}>
                {produits.length} article{produits.length > 1 ? "s" : ""} en promotion
              </p>
            )}
          </div>
          <Link
            href="/catalogue"
            className="hidden shrink-0 rounded-full border px-5 py-2 text-xs font-black uppercase tracking-widest transition-all hover:border-[var(--v-hot)] hover:text-[var(--v-hot)] md:flex items-center gap-2"
            style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
          >
            Tout voir &rarr;
          </Link>
        </div>

        {/* Grille */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array(3).fill(null).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl"
                style={{ backgroundColor: "var(--v-s2)" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produits.slice(0, 6).map((produit, i) => (
              <motion.div
                key={produit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <ProduitCard produit={produit} />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/catalogue"
            className="inline-block rounded-full border px-6 py-3 text-xs font-black uppercase tracking-widest transition-all"
            style={{ borderColor: "var(--v-hot)", color: "var(--v-hot)" }}
          >
            Voir toutes les promos &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
