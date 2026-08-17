"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineCategories, useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import type { Categorie, Produit } from "@/types";

/* ── Carte produit ultra-simple pour mobile ── */
function MiniCard({ produit }: { produit: Produit }) {
  const prix = parseFloat(produit.prixVente || "0");
  const prixPromo = produit.enPromo && produit.prixPromo ? parseFloat(produit.prixPromo) : null;
  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url;

  return (
    <Link
      href={`/boutique/${produit.id}`}
      className="relative flex-shrink-0 overflow-hidden rounded-xl"
      style={{ width: 132, backgroundColor: "var(--v-s2)" }}
    >
      {/* Image */}
      <div className="relative" style={{ aspectRatio: "3/4" }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={produit.nom}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-4xl opacity-[0.08]"
            style={{ backgroundColor: "var(--v-s3)" }}
          >
            &#128248;
          </div>
        )}

        {/* Overlay bas */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(6,6,7,0.95) 0%, rgba(6,6,7,0.3) 45%, transparent 70%)",
          }}
        />

        {/* Badge promo */}
        {prixPromo !== null && (
          <div
            className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--v-hot)" }}
          >
            -{Math.round(((prix - prixPromo) / prix) * 100)}%
          </div>
        )}

        {/* Info bas */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p
            className="line-clamp-2 text-[11px] font-bold uppercase leading-tight"
            style={{ color: "var(--v-text)" }}
          >
            {produit.nom}
          </p>
          <p
            className="mt-1 font-[var(--font-mono)] text-[11px] font-black"
            style={{ color: "var(--v-gold)" }}
          >
            {(prixPromo ?? prix).toLocaleString("fr-FR")}
            <span className="ml-0.5 text-[9px] font-normal" style={{ color: "var(--v-muted)" }}>
              FCFA
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

/* Skeleton d'une carte */
function MiniCardSkeleton() {
  return (
    <div
      className="flex-shrink-0 animate-pulse rounded-xl"
      style={{ width: 132, aspectRatio: "3/4", backgroundColor: "var(--v-s2)" }}
    />
  );
}

/* ── Section pour UNE catégorie ── */
function OneCategorySection({ categorie }: { categorie: Categorie }) {
  const { data, isLoading } = useVitrineProduits({ categorieId: categorie.id, limit: 10 });
  const produits = data?.pages[0]?.data ?? [];

  if (!isLoading && produits.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="py-8"
    >
      {/* Header catégorie */}
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <p
            className="text-[9px] font-black uppercase tracking-[0.3em]"
            style={{ color: "var(--v-gold)" }}
          >
            Collection
          </p>
          <h2
            className="font-[var(--font-display)] text-xl font-black uppercase leading-tight tracking-tight"
            style={{ color: "var(--v-text)" }}
          >
            {categorie.nom}
          </h2>
        </div>
        <Link
          href={`/catalogue?categorieId=${categorie.id}`}
          className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95"
          style={{ borderColor: "var(--v-gold)", color: "var(--v-gold)" }}
        >
          Voir tout &rarr;
        </Link>
      </div>

      {/* Scroll horizontal */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ paddingLeft: 16, paddingRight: 16, scrollbarWidth: "none" }}
      >
        {isLoading
          ? Array(5).fill(null).map((_, i) => <MiniCardSkeleton key={i} />)
          : produits.map((p) => <MiniCard key={p.id} produit={p} />)
        }
      </div>
    </motion.section>
  );
}

/* ── Composant principal ── */
export function HomeCategorySections() {
  const { data, isLoading } = useVitrineCategories();
  const categories = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="py-8 space-y-8">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="px-4 space-y-3">
            <div className="h-6 w-32 animate-pulse rounded" style={{ backgroundColor: "var(--v-s2)" }} />
            <div className="flex gap-3">
              {Array(4).fill(null).map((__, j) => <MiniCardSkeleton key={j} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="border-t"
      style={{ borderColor: "var(--v-border)" }}
    >
      {/* Séparateur titre section */}
      <div className="px-4 pt-10 pb-2">
        <p
          className="text-[9px] font-black uppercase tracking-[0.35em]"
          style={{ color: "var(--v-hot)" }}
        >
          &#x25cf; Explore par cat&eacute;gorie
        </p>
        <h2
          className="mt-1 font-[var(--font-display)] text-2xl font-black uppercase"
          style={{ color: "var(--v-text)" }}
        >
          Qu&rsquo;est-ce que
          <br />
          <span style={{ color: "var(--v-gold)" }}>tu cherches ?</span>
        </h2>
      </div>

      {categories.map((cat) => (
        <OneCategorySection key={cat.id} categorie={cat} />
      ))}
    </div>
  );
}
