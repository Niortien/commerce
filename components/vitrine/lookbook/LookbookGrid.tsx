"use client";

import { motion } from "framer-motion";

const GRID_ITEMS = [
  { id: 1, label: "L'ambiance", gradient: "radial-gradient(ellipse at 30% 20%, rgba(216,160,92,0.22) 0%, transparent 60%), #1a1a1a", tall: true },
  { id: 2, label: "Pièces choisies", gradient: "radial-gradient(ellipse at 70% 80%, rgba(216,160,92,0.16) 0%, transparent 60%), #161616", tall: false },
  { id: 3, label: "En boutique", gradient: "radial-gradient(ellipse at 50% 50%, rgba(232,92,92,0.10) 0%, transparent 65%), #1c1c1c", tall: false },
  { id: 4, label: "Le look du jour", gradient: "radial-gradient(ellipse at 20% 70%, rgba(216,160,92,0.20) 0%, transparent 60%), #191919", tall: false },
  { id: 5, label: "La sélection", gradient: "radial-gradient(ellipse at 80% 30%, rgba(185,140,245,0.12) 0%, transparent 60%), #1a1a1a", tall: true },
  { id: 6, label: "Signature", gradient: "radial-gradient(ellipse at 40% 40%, rgba(216,160,92,0.18) 0%, transparent 60%), #171717", tall: false },
];

function GridCell({
  item,
  delay,
}: {
  item: (typeof GRID_ITEMS)[number];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className={`relative flex items-end overflow-hidden rounded-xl border p-4 ${item.tall ? "row-span-2" : ""}`}
      style={{ aspectRatio: item.tall ? "3/4" : "1/1", background: item.gradient, borderColor: "var(--v-border)" }}
    >
      <span
        className="font-[var(--font-display)] text-sm italic"
        style={{ color: "var(--v-gold)" }}
      >
        {item.label}
      </span>
    </motion.div>
  );
}

export function LookbookGrid() {
  return (
    <section
      className="py-16"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-16">
        <div className="mb-10 flex items-end justify-between">
          <h2
            className="font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(32px,6vw,64px)", color: "var(--v-text)" }}
          >
            Le
            <br />
            <span style={{ color: "var(--v-lime)" }}>Shooting</span>
          </h2>
          <p className="max-w-xs text-right text-sm" style={{ color: "var(--v-muted)" }}>
            Shot à Abidjan — Marcory, Cocody, Plateau
          </p>
        </div>

        {/* Grille masonry */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {GRID_ITEMS.map((item, i) => (
            <GridCell key={item.id} item={item} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
