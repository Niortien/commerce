"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface OutfitPiece {
  nom: string;
  categorie: string;
  prix: number;
  produitId: string;
}

const OUTFIT_PIECES: OutfitPiece[] = [
  { nom: "Jordan Air 1 High OG", categorie: "Sneakers", prix: 85000, produitId: "" },
  { nom: "Cargo Pant Wide Fit", categorie: "Bas", prix: 42000, produitId: "" },
  { nom: "Oversized Tee Essential", categorie: "Hauts", prix: 18000, produitId: "" },
  { nom: "Puffer Vest Tactical", categorie: "Vestes", prix: 55000, produitId: "" },
];

function PieceRow({ piece, index }: { piece: OutfitPiece; index: number }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group flex items-center justify-between border-b py-4 transition-colors"
      style={{ borderColor: "var(--v-border)" }}
    >
      <div className="flex items-center gap-4">
        <span
          className="[font-family:var(--font-mono)] text-xs font-black w-6"
          style={{ color: "var(--v-lime)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--v-text)" }}>
            {piece.nom}
          </p>
          <p className="text-[11px]" style={{ color: "var(--v-dim)" }}>
            {piece.categorie}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="[font-family:var(--font-mono)] text-sm font-black" style={{ color: "var(--v-lime)" }}>
          {piece.prix.toLocaleString("fr-FR")} <span className="text-[10px] font-normal" style={{ color: "var(--v-dim)" }}>FCFA</span>
        </span>
        {piece.produitId && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100"
            style={{ color: "var(--v-muted)" }}
          >
            Voir →
          </span>
        )}
      </div>
    </motion.div>
  );

  return piece.produitId ? (
    <Link href={`/boutique/${piece.produitId}`}>{content}</Link>
  ) : (
    content
  );
}

export function LookbookOutfit() {
  const total = OUTFIT_PIECES.reduce((s, p) => s + p.prix, 0);

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-16">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Image look */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio: "3/4", backgroundColor: "var(--v-s2)" }}
        >
          <img
            src="/lookbook-outfit.jpg"
            alt="Look complet Abidjan Nights"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Placeholder */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--v-s2), var(--v-s3))" }}
          >
            <p className="font-black text-7xl uppercase leading-none opacity-10" style={{ color: "var(--v-text)" }}>
              LOOK
            </p>
          </div>
          {/* Badge */}
          <div className="absolute left-4 top-4 rounded-xl px-3 py-1.5" style={{ backgroundColor: "var(--v-lime)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-white">Look 01</p>
          </div>
        </motion.div>

        {/* Liste pièces */}
        <div className="flex flex-col justify-center">
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]"
            style={{ color: "var(--v-lime)" }}
          >
            Déconstruire le look
          </p>
          <h2
            className="mb-8 font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--v-text)" }}
          >
            Nuit
            <br />
            aux Almadies
          </h2>

          <div className="divide-y" style={{ borderColor: "var(--v-border)" }}>
            {OUTFIT_PIECES.map((piece, i) => (
              <PieceRow key={piece.nom} piece={piece} index={i} />
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: "var(--v-s2)" }}>
            <span className="text-sm font-bold" style={{ color: "var(--v-muted)" }}>Total look</span>
            <span className="[font-family:var(--font-mono)] text-xl font-black" style={{ color: "var(--v-lime)" }}>
              {total.toLocaleString("fr-FR")} <span className="text-xs font-normal" style={{ color: "var(--v-dim)" }}>FCFA</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
