"use client";

import { motion } from "framer-motion";

const WORDS = [
  { text: "DRI VALÉ", size: "clamp(52px,10vw,120px)", accent: false },
  { text: "C'EST", size: "clamp(28px,5vw,56px)", accent: false },
  { text: "YOP", size: "clamp(64px,12vw,140px)", accent: true },
  { text: "CITY.", size: "clamp(64px,12vw,140px)", accent: false },
];

export function MarqueHero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden px-5 py-24 md:px-16"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Gold glow */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl opacity-[0.08]"
        style={{ backgroundColor: "var(--v-gold)" }}
        aria-hidden
      />

      {/* Hot red glow bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-20 left-0 h-72 w-72 rounded-full blur-3xl opacity-[0.06]"
        style={{ backgroundColor: "var(--v-hot)" }}
        aria-hidden
      />

      {/* Lignes typographiques */}
      <div>
        {WORDS.map((word, i) => (
          <motion.div
            key={word.text}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="block font-[var(--font-display)] font-black leading-none tracking-tighter"
              style={{
                fontSize: word.size,
                color: word.accent ? "var(--v-gold)" : "var(--v-text)",
                marginLeft: i % 2 === 1 ? "clamp(20px,6vw,120px)" : 0,
              }}
            >
              {word.text}
            </h1>
          </motion.div>
        ))}

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 max-w-sm text-base leading-relaxed"
          style={{ color: "var(--v-muted)" }}
        >
          La boutique des jeunes class&eacute;s de Yopougon.
          Fringues import&eacute;es, style garanti.
        </motion.p>
      </div>

      {/* Déco lettre */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="pointer-events-none absolute bottom-10 right-10 font-[var(--font-display)] font-black leading-none select-none"
        style={{ fontSize: "200px", color: "var(--v-s2)", userSelect: "none" }}
        aria-hidden
      >
        Y
      </motion.p>
    </section>
  );
}
