"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Produit } from "@/types";

interface ProduitGalleryProps {
  produit: Produit;
}

export function ProduitGallery({ produit }: ProduitGalleryProps) {
  const allImages = [
    ...(produit.imageUrl ? [{ url: produit.imageUrl, id: "main" }] : []),
    ...(produit.images ?? []).map((img) => ({ url: img.url, id: img.id })),
  ];

  const images = allImages.length > 0 ? allImages : [{ url: "", id: "placeholder" }];
  const [activeIdx, setActiveIdx] = useState(0);
  const current = images[activeIdx];

  return (
    <div className="flex flex-col gap-3 md:sticky md:top-24">
      {/* Image principale */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl"
        style={{ backgroundColor: "var(--v-s2)" }}
      >
        <AnimatePresence mode="wait">
          {current.url ? (
            <motion.img
              key={current.id}
              src={current.url}
              alt={produit.nom}
              className="h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <motion.div
              key="placeholder"
              className="flex h-full items-center justify-center text-8xl opacity-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              👟
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation flèches si plusieurs images */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border"
              style={{
                backgroundColor: "rgba(4,8,15,0.7)",
                borderColor: "var(--v-border)",
                color: "var(--v-text)",
              }}
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border"
              style={{
                backgroundColor: "rgba(4,8,15,0.7)",
                borderColor: "var(--v-border)",
                color: "var(--v-text)",
              }}
              aria-label="Image suivante"
            >
              ›
            </button>
          </>
        )}

        {/* Indicateur */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === activeIdx ? "20px" : "6px",
                  backgroundColor: i === activeIdx ? "var(--v-lime)" : "rgba(255,255,255,0.3)",
                }}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all"
              style={{
                borderColor: i === activeIdx ? "var(--v-lime)" : "var(--v-border)",
                backgroundColor: "var(--v-s2)",
              }}
            >
              {img.url ? (
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xl opacity-10">👟</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
