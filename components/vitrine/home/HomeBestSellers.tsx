"use client";

import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProduitCard } from "@/components/vitrine/common/ProduitCard";

export function HomeBestSellers() {
  const { data, isLoading } = useVitrineProduits({ limit: 4 });
  const produits = data?.pages[0]?.data ?? [];

  return (
    <section
      className="py-20"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12">
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--v-lime)" }}
          >
            Incontournables
          </p>
          <h2
            className="font-[var(--font-display)] text-3xl font-black uppercase tracking-tight md:text-5xl"
            style={{ color: "var(--v-text)" }}
          >
            Best Sellers
          </h2>
        </div>

        {/* Layout mag : 1 grand + 3 petits */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array(4).fill(null).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl ${i === 0 ? "aspect-[2/3] md:col-span-2 md:row-span-2" : "aspect-square"}`}
                style={{ backgroundColor: "var(--v-s2)" }}
              />
            ))}
          </div>
        ) : produits.length === 0 ? (
          <p className="py-12 text-center text-sm" style={{ color: "var(--v-muted)" }}>
            Produits bientôt disponibles
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {produits.map((produit, i) => (
              <motion.div
                key={produit.id}
                className={i === 0 ? "col-span-2 row-span-2" : ""}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <ProduitCard produit={produit} rank={i + 1} large={i === 0} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
