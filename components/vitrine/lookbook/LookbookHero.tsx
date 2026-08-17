"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function LookbookHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-end overflow-hidden"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Fond parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/dri_style/dir_hero.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,6,7,0.15) 0%, rgba(6,6,7,0.92) 100%)",
          }}
        />
      </motion.div>

      {/* Gold glow décoratif */}
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(240,180,41,0.07)" }}
        aria-hidden
      />

      {/* Contenu */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full px-5 pb-20 md:px-16"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-[10px] font-black uppercase tracking-[0.5em]"
          style={{ color: "var(--v-gold)" }}
        >
          Saison 2025 &mdash; Collection Yop City
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-[var(--font-display)] font-black uppercase leading-none tracking-tighter"
          style={{ fontSize: "clamp(52px,10vw,120px)", color: "var(--v-text)" }}
        >
          ABIDJAN
          <br />
          <span style={{ color: "var(--v-gold)" }}>NIGHTS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 max-w-sm text-sm leading-relaxed"
          style={{ color: "var(--v-muted)" }}
        >
          Des pi&egrave;ces pour ceux qui vivent &agrave; leur propre rythme.
          Shoot&eacute; dans les rues de Yop &mdash; pour les vrais.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
      >
        <div className="h-10 w-px" style={{ backgroundColor: "var(--v-gold)" }} />
        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--v-gold)" }}>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
