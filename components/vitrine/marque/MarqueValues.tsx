"use client";

import { motion } from "framer-motion";

const VALUES = [
  {
    num: "01",
    title: "Authenticité",
    description:
      "Chaque pièce que nous vendons est vérifiée. Produits importés directement, sans replica, sans compromis. L'authentique ou rien — c'est notre engagement envers notre clientèle.",
  },
  {
    num: "02",
    title: "Qualité",
    description:
      "Nous sélectionnons uniquement des pièces qui durent. Des matières premium, des cuts qui résistent aux tendances. Investis dans quelque chose qui reste.",
  },
  {
    num: "03",
    title: "Communauté",
    description:
      "Dri Valé, c'est avant tout un lieu de vie. Des gens de Yopougon qui comprennent la mode, qui s'entraident. La boutique est un point de rencontre du quartier, pas juste un commerce.",
  },
];

export function MarqueValues() {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2 text-[10px] font-black uppercase tracking-[0.4em]"
          style={{ color: "var(--v-gold)" }}
        >
          Ce en quoi on croit
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-16 font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(32px,6vw,64px)", color: "var(--v-text)" }}
        >
          Nos valeurs
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {VALUES.map((val, i) => (
            <motion.div
              key={val.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl p-8"
              style={{ backgroundColor: "var(--v-s2)" }}
            >
              {/* Numéro décoratif */}
              <p
                className="pointer-events-none absolute right-4 top-4 font-[var(--font-display)] font-black leading-none select-none"
                style={{ fontSize: "100px", color: "var(--v-s3)", userSelect: "none" }}
                aria-hidden
              >
                {val.num}
              </p>

              <div className="relative z-10">
                <p
                  className="mb-4 font-[var(--font-mono)] text-xs font-black"
                  style={{ color: "var(--v-gold)" }}
                >
                  {val.num}
                </p>
                <h3
                  className="mb-4 font-[var(--font-display)] font-black uppercase leading-tight tracking-tight"
                  style={{ fontSize: "clamp(22px,3vw,32px)", color: "var(--v-text)" }}
                >
                  {val.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
                  {val.description}
                </p>
              </div>

              <div
                className="absolute bottom-0 left-0 h-1 w-full"
                style={{ backgroundColor: "var(--v-gold)", opacity: 0.35 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
