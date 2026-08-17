"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { getWhatsappUrl } from "@/lib/whatsapp";

const WA_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 14 * 86_400_000;
}

export function HomeFeaturedDrops() {
  const { data } = useVitrineProduits({ limit: 4 });
  const produits = data?.pages[0]?.data ?? [];

  const items = produits.length > 0 ? produits : Array(4).fill(null);

  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      {/* Header */}
      <div className="mb-14 flex items-end justify-between gap-4">
        <div>
          <p
            className="mb-3 text-[10px] font-black uppercase tracking-[0.35em]"
            style={{ color: "var(--v-hot)" }}
          >
            &#x2022; Stock limit&eacute; &#x2022; Commande rapide
          </p>
          <h2
            className="font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "var(--v-text)" }}
          >
            Derniers
            <br />
            <span style={{ color: "var(--v-gold)" }}>Arrivages</span>
          </h2>
        </div>
        <Link
          href="/catalogue"
          className="hidden shrink-0 rounded-full border px-5 py-2 text-xs font-black uppercase tracking-widest transition-all hover:border-[var(--v-gold)] hover:text-[var(--v-gold)] md:flex items-center gap-2"
          style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
        >
          Tout voir &rarr;
        </Link>
      </div>

      {/* Grid 2x2 on desktop, list on mobile */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((produit, i) => {
          const prix = produit ? parseFloat(produit.prixVente || "0") : 0;
          const prixPromo = produit?.prixPromo ? parseFloat(produit.prixPromo) : null;
          const isPromo = produit?.enPromo && prixPromo !== null;
          const isNewDrop = produit ? isNew(produit.createdAt) : false;
          const waText = produit ? `Bonjour ! Je veux commander : ${produit.nom}` : "";
          const waUrl = produit ? getWhatsappUrl(waText) : "#";

          return (
            <motion.article
              key={produit?.id ?? i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
            >
              {/* Image zone */}
              <div
                className="relative h-40 w-36 shrink-0 overflow-hidden md:h-48 md:w-48"
                style={{ backgroundColor: "var(--v-s3)" }}
              >
                {produit?.imageUrl ? (
                  <img
                    src={produit.imageUrl}
                    alt={produit.nom}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl opacity-[0.07]">
                    &#128248;
                  </div>
                )}

                {/* Hot badge */}
                {(isNewDrop || isPromo) && produit && (
                  <div
                    className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: "var(--v-hot)" }}
                  >
                    {isPromo ? `−${Math.round(((prix - prixPromo!) / prix) * 100)}%` : "NEW"}
                  </div>
                )}

                {/* Drop number */}
                <div
                  className="absolute bottom-2 right-2 font-[var(--font-display)] text-[52px] font-black leading-none opacity-[0.08] select-none"
                  style={{ color: "var(--v-text)" }}
                >
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.28em]"
                    style={{ color: "var(--v-gold)" }}
                  >
                    Drop #{String(i + 1).padStart(2, "0")}
                  </span>

                  {produit ? (
                    <>
                      <h3
                        className="mt-1 font-[var(--font-display)] text-lg font-black uppercase leading-tight md:text-xl"
                        style={{ color: "var(--v-text)" }}
                      >
                        {produit.nom}
                      </h3>
                      {produit.categorie && (
                        <p className="mt-0.5 text-[11px] uppercase tracking-widest" style={{ color: "var(--v-muted)" }}>
                          {produit.categorie.nom}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="mt-1 h-5 w-40 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
                      <div className="mt-1 h-3 w-20 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
                    </>
                  )}
                </div>

                <div>
                  {/* Prix */}
                  {produit ? (
                    <div className="flex items-baseline gap-2">
                      <span
                        className="font-[var(--font-mono)] text-2xl font-black"
                        style={{ color: isPromo ? "var(--v-gold)" : "var(--v-text)" }}
                      >
                        {(isPromo ? prixPromo! : prix).toLocaleString("fr-FR")}
                        <span className="ml-1 text-xs font-normal" style={{ color: "var(--v-muted)" }}>FCFA</span>
                      </span>
                      {isPromo && (
                        <span
                          className="font-[var(--font-mono)] text-sm line-through"
                          style={{ color: "var(--v-dim)" }}
                        >
                          {prix.toLocaleString("fr-FR")}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="h-7 w-28 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
                  )}

                  {/* CTAs */}
                  {produit && (
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        href={`/boutique/${produit.id}`}
                        className="flex-1 rounded-xl py-2 text-center text-xs font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: "var(--v-gold)", color: "#060607" }}
                      >
                        Voir
                      </Link>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors hover:bg-[#25D366] hover:border-[#25D366] hover:text-white"
                        style={{ borderColor: "var(--v-border)", color: "#25D366" }}
                        title="Commander sur WhatsApp"
                      >
                        {WA_SVG}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Mobile "Voir tout" */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/catalogue"
          className="inline-block rounded-full border px-6 py-3 text-xs font-black uppercase tracking-widest transition-all"
          style={{ borderColor: "var(--v-gold)", color: "var(--v-gold)" }}
        >
          Explorer tout le catalogue &rarr;
        </Link>
      </div>
    </section>
  );
}
