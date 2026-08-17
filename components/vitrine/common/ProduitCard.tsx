"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Produit } from "@/types";
import { useVitrineStore } from "@/stores/vitrineStore";

interface ProduitCardProps {
  produit: Produit;
  rank?: number;
  large?: boolean;
}

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 7 * 86_400_000;
}

export function ProduitCard({ produit, rank, large = false }: ProduitCardProps) {
  const addToCart = useVitrineStore((s) => s.addToCart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);

  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url;
  const prix = parseFloat(produit.prixVente || "0");
  const totalStock = (produit.variantes ?? []).reduce((s, v) => s + v.quantiteStock, 0);
  const firstVariante = produit.variantes?.[0];
  const hasNew = isNew(produit.createdAt);

  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixPromo = isPromo ? parseFloat(produit.prixPromo!) : null;
  const tauxReduction = isPromo && prixPromo !== null
    ? Math.round(((prix - prixPromo) / prix) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariante) return;
    addToCart({ produit, variante: firstVariante, quantite: 1 });
    setCartOpen(true);
  };

  return (
    <motion.div
      className={`group relative overflow-hidden ${large ? "aspect-[3/4]" : "aspect-square"}`}
      whileHover="hovered"
      initial="rest"
    >
      <Link href={`/boutique/${produit.id}`} className="block h-full w-full">
        {/* Image */}
        <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: "var(--v-s2)" }}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={produit.nom}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl opacity-10">👟</div>
          )}
        </div>

        {/* Gradient overlay bas */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(4,8,15,0.9) 0%, rgba(4,8,15,0.3) 40%, transparent 60%)",
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isPromo && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: "var(--v-hot)" }}
            >
              PROMO -{tauxReduction}%
            </span>
          )}
          {hasNew && !isPromo && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
              style={{ backgroundColor: "var(--v-lime)", color: "#fff" }}
            >
              NEW
            </span>
          )}
          {totalStock === 0 && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
              style={{ backgroundColor: "var(--v-red)", color: "#fff" }}
            >
              RUPTURE
            </span>
          )}
        </div>

        {/* Rang */}
        {rank !== undefined && (
          <div
            className="absolute top-3 right-3 font-[var(--font-display)] text-4xl font-black leading-none opacity-30"
            style={{ color: "var(--v-text)" }}
          >
            {String(rank).padStart(2, "0")}
          </div>
        )}

        {/* Info bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.div
            variants={{ rest: { y: 4, opacity: 0.85 }, hovered: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.25 }}
          >
            <p
              className="font-[var(--font-display)] text-sm font-bold leading-tight uppercase tracking-wide"
              style={{ color: "var(--v-text)" }}
            >
              {produit.nom}
            </p>
            {produit.categorie && (
              <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--v-muted)" }}>
                {produit.categorie.nom}
              </p>
            )}
          </motion.div>

          <motion.div
            className="mt-2 flex items-end justify-between"
            variants={{ rest: { y: 8, opacity: 0 }, hovered: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            {isPromo && prixPromo !== null ? (
              <div className="flex flex-col gap-0.5">
                <span
                  className="[font-family:var(--font-mono)] text-xs line-through"
                  style={{ color: "var(--v-dim)" }}
                >
                  {prix.toLocaleString("fr-FR")} FCFA
                </span>
                <span
                  className="[font-family:var(--font-mono)] text-base font-black"
                  style={{ color: "var(--v-lime)" }}
                >
                  {prixPromo.toLocaleString("fr-FR")} <span className="text-xs font-normal">FCFA</span>
                </span>
              </div>
            ) : (
              <span
                className="[font-family:var(--font-mono)] text-base font-black"
                style={{ color: "var(--v-lime)" }}
              >
                {prix.toLocaleString("fr-FR")} <span className="text-xs font-normal">FCFA</span>
              </span>
            )}
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--v-lime)" }}
            >
              VOIR →
            </span>
          </motion.div>
        </div>
      </Link>

      {/* Bouton ajout panier rapide */}
      {firstVariante && totalStock > 0 && (
        <motion.button
          onClick={handleQuickAdd}
          className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-colors"
          style={{ backgroundColor: "var(--v-lime)", color: "#fff" }}
          variants={{ rest: { scale: 0, opacity: 0 }, hovered: { scale: 1, opacity: 1 } }}
          transition={{ duration: 0.2, delay: 0.1 }}
          aria-label="Ajouter au panier"
        >
          +
        </motion.button>
      )}
    </motion.div>
  );
}
