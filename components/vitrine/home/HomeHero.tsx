"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWhatsappUrl } from "@/lib/whatsapp";

const waUrl = getWhatsappUrl("Allo Luxury Boutique, je veux voir vos nouveautés ✨");

const STATS = [
  { val: "4.6K", label: "followers" },
  { val: "4.9★", label: "satisfaction" },
  { val: "24h", label: "livraison Abidjan" },
];

function VisualPanel() {
  return (
    <div
      className="relative overflow-hidden border-t md:h-auto md:border-l md:border-t-0"
      style={{ borderColor: "var(--v-nav-border)", backgroundColor: "var(--v-s1)" }}
    >
      {/* Photo éditoriale */}
      <img
        src="/images/image_luxury/image3.jpg"
        alt="Pièce Luxury Boutique portée en studio"
        className="absolute inset-0 h-full w-full scale-110 object-cover object-top"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.15) 45%, rgba(13,13,13,0.35) 100%)",
        }}
        aria-hidden
      />
      {/* Grille de fines lignes dorées en diagonale, en texture légère */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, var(--v-gold) 0px, var(--v-gold) 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden
      />
      {/* Cadre fin */}
      <div
        className="pointer-events-none absolute inset-6 border md:inset-10"
        style={{ borderColor: "var(--v-gold)", opacity: 0.3 }}
        aria-hidden
      />

      <div className="relative flex h-24 items-end justify-center px-6 pb-4 md:h-full md:min-h-[560px] md:pb-10">
        <p
          className="font-[var(--font-display)] text-center text-sm italic leading-relaxed md:max-w-[220px] md:text-base"
          style={{ color: "#fff" }}
        >
          Marcory Boulevard VGE
          <br className="hidden md:block" /> Abidjan, Côte d&rsquo;Ivoire
        </p>
      </div>
    </div>
  );
}

export function HomeHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      <div className="mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
        {/* Colonne texte */}
        <div className="flex flex-col justify-center px-6 py-28 md:px-16 md:py-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-[var(--font-display)] text-sm italic tracking-wide"
            style={{ color: "var(--v-gold)" }}
          >
            Maison multi-marques — Marcory, Abidjan
          </motion.p>

          <motion.h1
            className="mt-6 font-[var(--font-display)] font-semibold leading-[1.02]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span
              className="block"
              style={{ fontSize: "clamp(44px, 7vw, 88px)", color: "var(--v-text)" }}
            >
              L&rsquo;élégance
            </span>
            <span
              className="block italic"
              style={{
                fontSize: "clamp(44px, 7vw, 88px)",
                color: "var(--v-gold)",
                textShadow: "0 0 50px rgba(216,160,92,0.25)",
              }}
            >
              n&rsquo;attend pas.
            </span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-lg text-base leading-relaxed"
            style={{ color: "var(--v-muted)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Vêtements, maroquinerie, chaussures et accessoires de luxe, homme et femme.
            Multi-marques, sélection exigeante,{" "}
            <span style={{ color: "var(--v-text)", fontWeight: 600 }}>100% authentique.</span>
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-full border-2 px-9 py-3.5 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[0.15em] transition-all hover:bg-[var(--v-gold)] hover:text-black"
              style={{ borderColor: "var(--v-gold)", color: "var(--v-gold)" }}
            >
              Découvrir la collection
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.2em] underline-offset-4 transition-colors hover:underline"
              style={{ color: "var(--v-muted)" }}
            >
              ou nous écrire sur WhatsApp →
            </a>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center gap-8 border-t pt-8"
            style={{ borderColor: "var(--v-border)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-8">
                {i > 0 && <span style={{ color: "var(--v-border)" }}>·</span>}
                <div className="flex flex-col items-start">
                  <span className="font-[var(--font-display)] text-lg font-semibold" style={{ color: "var(--v-text)" }}>
                    {s.val}
                  </span>
                  <span className="mt-0.5 text-[9px] uppercase tracking-wider" style={{ color: "var(--v-dim)" }}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Colonne visuelle */}
        <VisualPanel />
      </div>
    </section>
  );
}
