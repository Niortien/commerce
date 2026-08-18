"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function VisualPanel() {
  return (
    <div
      className="relative overflow-hidden border-t md:h-auto md:border-l md:border-t-0"
      style={{ borderColor: "var(--v-nav-border)", backgroundColor: "var(--v-s1)" }}
    >
      <img
        src="/images/image_luxury/image4.jpg"
        alt="Pièce Luxury Boutique — collection Abidjan"
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
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, var(--v-gold) 0px, var(--v-gold) 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-6 border md:inset-10"
        style={{ borderColor: "var(--v-gold)", opacity: 0.3 }}
        aria-hidden
      />

      <div className="relative flex h-24 items-end justify-center px-6 pb-4 md:h-full md:min-h-[540px] md:pb-10">
        <p
          className="font-[var(--font-display)] text-center text-sm italic leading-relaxed md:max-w-[220px] md:text-base"
          style={{ color: "#fff" }}
        >
          Saison 2025
          <br className="hidden md:block" /> Collection Abidjan
        </p>
      </div>
    </div>
  );
}

export function LookbookHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ backgroundColor: "var(--v-bg)" }}>
      <motion.div
        style={{ opacity }}
        className="mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 md:grid-cols-[1.2fr_0.8fr]"
      >
        {/* Colonne texte */}
        <div className="flex flex-col justify-center px-6 py-28 md:px-16 md:py-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-[var(--font-display)] text-sm italic tracking-wide"
            style={{ color: "var(--v-gold)" }}
          >
            Saison 2025 — Collection Abidjan
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
              Le style,
            </span>
            <span
              className="block italic"
              style={{
                fontSize: "clamp(44px, 7vw, 88px)",
                color: "var(--v-gold)",
                textShadow: "0 0 50px rgba(216,160,92,0.25)",
              }}
            >
              à l&rsquo;abidjanaise.
            </span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-lg text-base leading-relaxed"
            style={{ color: "var(--v-muted)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Des pièces pour ceux qui vivent à leur propre rythme.
            Shooté dans les rues d&rsquo;Abidjan, pensé pour l&rsquo;élégance.
          </motion.p>
        </div>

        {/* Colonne visuelle */}
        <VisualPanel />
      </motion.div>
    </section>
  );
}
