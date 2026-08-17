"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineCategories } from "@/features/vitrine/query/vitrine-queries";

const CATEGORY_GRADIENTS = [
  "linear-gradient(135deg, #1C1C24 0%, #0F0F14 100%)",
  "linear-gradient(135deg, #1E1B24 0%, #0F0F14 100%)",
  "linear-gradient(135deg, #1C1E22 0%, #0F0F14 100%)",
];

export function HomeCategoryGrid() {
  const { data } = useVitrineCategories();
  const categories = data?.data?.slice(0, 3) ?? [];

  const FALLBACK = [
    { id: "1", nom: "Jordan", slug: "jordan", description: "Les icônes" },
    { id: "2", nom: "Nike", slug: "nike", description: "Performance & style" },
    { id: "3", nom: "Adidas", slug: "adidas", description: "Originals only" },
  ];

  const items = categories.length > 0 ? categories : FALLBACK;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="mb-12">
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--v-lime)" }}
        >
          Parcourir
        </p>
        <h2
          className="font-[var(--font-display)] text-3xl font-black uppercase tracking-tight md:text-5xl"
          style={{ color: "var(--v-text)" }}
        >
          Catégories
        </h2>
      </div>

      {/* Grille asymétrique : 1 tall + 2 stacked */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {/* Card 0 — portrait tall (span 2 rows) */}
        {items[0] && (
          <motion.div
            className="row-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={`/catalogue?categorieId=${items[0].id}`}
              className="group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl p-6 md:min-h-[480px]"
              style={{ background: CATEGORY_GRADIENTS[0], border: "1px solid var(--v-border)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-[80px] opacity-[0.06] select-none">
                👟
              </div>
              <motion.div
                className="relative z-10"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <p
                  className="font-[var(--font-display)] text-4xl font-black uppercase md:text-5xl"
                  style={{ color: "var(--v-text)" }}
                >
                  {items[0].nom}
                </p>
                {items[0].description && (
                  <p className="mt-2 text-sm" style={{ color: "var(--v-muted)" }}>
                    {items[0].description}
                  </p>
                )}
                <span
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-widest group-hover:text-[var(--v-lime)] transition-colors"
                  style={{ color: "var(--v-dim)" }}
                >
                  Explorer →
                </span>
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Cards 1 & 2 — landscape */}
        {items.slice(1, 3).map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
          >
            <Link
              href={`/catalogue?categorieId=${cat.id}`}
              className="group relative flex h-full min-h-[150px] flex-col justify-end overflow-hidden rounded-2xl p-5 md:min-h-[228px]"
              style={{
                background: CATEGORY_GRADIENTS[i + 1],
                border: "1px solid var(--v-border)",
              }}
            >
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <p
                  className="font-[var(--font-display)] text-2xl font-black uppercase md:text-3xl"
                  style={{ color: "var(--v-text)" }}
                >
                  {cat.nom}
                </p>
                <span
                  className="mt-1 inline-block text-xs font-bold uppercase tracking-widest transition-colors group-hover:text-[var(--v-lime)]"
                  style={{ color: "var(--v-dim)" }}
                >
                  Explorer →
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
