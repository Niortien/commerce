"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Produit } from "@/types";
import { useVitrineStore } from "@/stores/vitrineStore";

interface CatalogueProductCardProps {
  produit: Produit;
  priority?: boolean;
}

export function CatalogueProductCard({ produit, priority }: CatalogueProductCardProps) {
  const addToCart = useVitrineStore((s) => s.addToCart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);

  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url;
  const prix = parseFloat(produit.prixVente || "0");
  const tailles = [...new Set((produit.variantes ?? []).map((v) => v.taille))];
  const totalStock = (produit.variantes ?? []).reduce((s, v) => s + v.quantiteStock, 0);
  const firstVariante = produit.variantes?.[0];

  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixPromo = isPromo ? parseFloat(produit.prixPromo!) : null;
  const tauxReduction = isPromo && prixPromo !== null
    ? Math.round(((prix - prixPromo) / prix) * 100)
    : null;

  return (
    <motion.article
      className="group relative"
      whileHover="hovered"
      initial="rest"
    >
      {/* Image */}
      <Link href={`/boutique/${produit.id}`} className="block">
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-xl"
          style={{ backgroundColor: "var(--v-s2)" }}
        >
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={produit.nom}
              className="h-full w-full object-cover"
              variants={{ rest: { scale: 1 }, hovered: { scale: 1.05 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl opacity-10">👟</div>
          )}

          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity"
            style={{ background: "linear-gradient(to top, rgba(4,8,15,0.7) 0%, transparent 50%)" }}
          />

          {/* Badge promo */}
          {isPromo && (
            <div className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: "var(--v-hot)" }}>
              -{tauxReduction}%
            </div>
          )}

          {/* Rupture badge */}
          {totalStock === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(4,8,15,0.6)" }}
            >
              <span
                className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider"
                style={{ backgroundColor: "var(--v-red)", color: "#fff" }}
              >
                Rupture
              </span>
            </div>
          )}

          {/* Bouton panier hover */}
          {firstVariante && totalStock > 0 && (
            <motion.button
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full font-black text-sm"
              style={{ backgroundColor: "var(--v-lime)", color: "#fff" }}
              variants={{ rest: { opacity: 0, scale: 0.7 }, hovered: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.preventDefault();
                addToCart({ produit, variante: firstVariante, quantite: 1 });
                setCartOpen(true);
              }}
              aria-label="Ajouter au panier"
            >
              +
            </motion.button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 px-1">
        <Link href={`/boutique/${produit.id}`}>
          <h3
            className="font-[var(--font-display)] text-sm font-black uppercase leading-tight tracking-wide transition-colors group-hover:text-[var(--v-lime)]"
            style={{ color: "var(--v-text)" }}
          >
            {produit.nom}
          </h3>
        </Link>

        {/* Tailles dispo */}
        {tailles.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tailles.map((t) => (
              <span
                key={t}
                className="rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase"
                style={{ borderColor: "var(--v-border)", color: "var(--v-dim)" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 flex items-end justify-between gap-2">
          {isPromo && prixPromo !== null ? (
            <div className="flex flex-col gap-0.5">
              <span
                className="[font-family:var(--font-mono)] text-xs line-through"
                style={{ color: "var(--v-dim)" }}
              >
                {prix.toLocaleString("fr-FR")} FCFA
              </span>
              <span
                className="[font-family:var(--font-mono)] text-sm font-black"
                style={{ color: "var(--v-lime)" }}
              >
                {prixPromo.toLocaleString("fr-FR")} <span className="text-[10px] font-normal" style={{ color: "var(--v-dim)" }}>FCFA</span>
              </span>
            </div>
          ) : (
            <span
              className="[font-family:var(--font-mono)] text-sm font-black"
              style={{ color: "var(--v-lime)" }}
            >
              {prix.toLocaleString("fr-FR")} <span className="text-[10px] font-normal" style={{ color: "var(--v-dim)" }}>FCFA</span>
            </span>
          )}
          {priority && !isPromo && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
              style={{ backgroundColor: "var(--v-lime)", color: "#fff" }}
            >
              NEW
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
