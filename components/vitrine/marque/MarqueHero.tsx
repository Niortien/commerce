"use client";

import { motion } from "framer-motion";

export function MarqueHero() {
  return (
    <section
      className="relative overflow-hidden px-5 py-28 md:px-16 md:py-36"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Glow ambiant */}
      <div
        className="pointer-events-none absolute -top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl opacity-[0.07]"
        style={{ backgroundColor: "var(--v-gold)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        {/* Colonne texte */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 font-[var(--font-display)] text-sm italic"
            style={{ color: "var(--v-gold)" }}
          >
            Notre maison
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-display)] leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(38px,6vw,64px)", color: "var(--v-text)" }}
          >
            Le luxe multi&#8209;marques,{" "}
            <span className="italic" style={{ color: "var(--v-gold)" }}>
              pens&eacute; pour Abidjan.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-7 max-w-md text-base leading-relaxed"
            style={{ color: "var(--v-muted)" }}
          >
            V&ecirc;tements, maroquinerie, chaussures et accessoires s&eacute;lectionn&eacute;s
            avec exigence &mdash; homme et femme, sans compromis sur l&apos;authenticit&eacute;.
          </motion.p>
        </div>

        {/* Colonne cadre citation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="border-l-2 pl-8"
          style={{ borderColor: "var(--v-gold)" }}
        >
          <p
            className="font-[var(--font-display)] text-xl italic leading-snug md:text-2xl"
            style={{ color: "var(--v-text)" }}
          >
            &laquo;&nbsp;Be Luxury n&apos;est pas un slogan, c&apos;est une exigence
            qu&apos;on applique &agrave; chaque pi&egrave;ce.&nbsp;&raquo;
          </p>
          <p
            className="mt-4 text-[11px] font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--v-dim)" }}
          >
            Marcory Bd VGE &middot; Abidjan
          </p>
        </motion.div>
      </div>
    </section>
  );
}
