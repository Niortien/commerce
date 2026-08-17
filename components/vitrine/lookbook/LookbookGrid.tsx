"use client";

import { motion } from "framer-motion";

const GRID_ITEMS = [
  { id: 1, src: "/images/dri_style/boutique-interieur-1.jpg", alt: "L'ambiance du shop — Dri Valé", tall: true },
  { id: 2, src: "/images/dri_style/boutique-interieur-3.jpg", alt: "Pièces en boutique — Dri Valé", tall: false },
  { id: 3, src: "/images/dri_style/client-sacs-drivale.jpg", alt: "Client Dri Valé — sortie boutique", tall: false },
  { id: 4, src: "/images/dri_style/look-selfie-lacoste.jpg", alt: "Look du jour — Lacoste x DSQUARED2", tall: false },
  { id: 5, src: "/images/dri_style/boutique-sneakers.jpg", alt: "Boutique Dri Valé — mur sneakers", tall: true },
  { id: 6, src: "/images/dri_style/dri_style6.jpeg", alt: "Style Dri Valé", tall: false },
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
      className={`relative overflow-hidden rounded-xl ${item.tall ? "row-span-2" : ""}`}
      style={{ aspectRatio: item.tall ? "3/4" : "1/1", backgroundColor: "var(--v-s2)" }}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Overlay gradient */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{ background: "rgba(200,118,44,0.08)" }}
      />
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
            Shot à Abidjan — Yopougon, Cocody, Plateau
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
