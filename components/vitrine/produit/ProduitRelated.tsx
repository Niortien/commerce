"use client";

import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { CatalogueProductCard } from "@/components/vitrine/catalogue/CatalogueProductCard";

interface ProduitRelatedProps {
  categorieId: string;
  excludeId: string;
}

export function ProduitRelated({ categorieId, excludeId }: ProduitRelatedProps) {
  const { data } = useVitrineProduits({ categorieId, limit: 6 });
  const produits = (data?.pages[0]?.data ?? []).filter((p) => p.id !== excludeId).slice(0, 3);

  if (produits.length === 0) return null;

  return (
    <section className="border-t py-16" style={{ borderColor: "var(--v-border)" }}>
      <div className="mx-auto max-w-7xl px-5">
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--v-lime)" }}
        >
          Tu aimeras aussi
        </p>
        <h2
          className="mb-8 font-[var(--font-display)] text-2xl font-black uppercase tracking-tight"
          style={{ color: "var(--v-text)" }}
        >
          Dans la même veine
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produits.map((produit, i) => (
            <motion.div
              key={produit.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <CatalogueProductCard produit={produit} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
