"use client";

import { motion } from "framer-motion";

const GRID_ITEMS = [
  { id: 1, label: "L'ambiance", src: "/images/image_luxury/image1.jpg", tall: true },
  { id: 2, label: "Pièces choisies", src: "/images/image_luxury/image8.jpg", tall: false },
  { id: 3, label: "En boutique", src: "/images/image_luxury/image9.jpg", tall: false },
  { id: 4, label: "Le look du jour", src: "/images/image_luxury/image2.jpg", tall: false },
  { id: 5, label: "La sélection", src: "/images/image_luxury/image4.jpg", tall: true },
  { id: 6, label: "Signature", src: "/images/image_luxury/image11.jpg", tall: false },
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
      className={`group relative flex items-end overflow-hidden rounded-xl border ${item.tall ? "row-span-2" : ""}`}
      style={{ aspectRatio: item.tall ? "3/4" : "1/1", borderColor: "var(--v-border)" }}
    >
      <img
        src={item.src}
        alt={item.label}
        className="absolute inset-0 h-full w-full scale-110 object-cover transition-transform duration-500 group-hover:scale-[1.18]"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 55%)" }}
        aria-hidden
      />
      <span
        className="relative p-4 font-[var(--font-display)] text-sm italic"
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
          <div>
            <p
              className="mb-1 font-[var(--font-display)] text-sm italic"
              style={{ color: "var(--v-gold)" }}
            >
              Regard sur la collection
            </p>
            <h2
              className="font-[var(--font-display)] leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(30px,5vw,52px)", color: "var(--v-text)" }}
            >
              Le shooting
            </h2>
          </div>
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
