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
      "Luxury Boutique, c'est avant tout un lieu de vie. Des gens qui comprennent la mode, qui s'entraident. La boutique est un point de rencontre à Marcory, pas juste un commerce.",
  },
];

export function MarqueValues() {
  return (
    <section className="py-24" style={{ backgroundColor: "var(--v-s1)" }}>
      <div className="mx-auto max-w-5xl px-5 md:px-16">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2 font-[var(--font-display)] text-sm italic"
              style={{ color: "var(--v-gold)" }}
            >
              Ce en quoi on croit
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-[var(--font-display)] leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(30px,5vw,52px)", color: "var(--v-text)" }}
            >
              Nos valeurs
            </motion.h2>
          </div>
        </div>

        <div>
          {VALUES.map((val, i) => (
            <motion.div
              key={val.num}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="grid grid-cols-1 gap-3 border-t py-8 md:grid-cols-[80px_1fr_1.4fr] md:gap-8"
              style={{ borderColor: "var(--v-border)" }}
            >
              <span
                className="font-[var(--font-mono)] text-sm font-black"
                style={{ color: "var(--v-gold)" }}
              >
                {val.num}
              </span>
              <h3
                className="font-[var(--font-display)] text-2xl leading-snug"
                style={{ color: "var(--v-text)" }}
              >
                {val.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
                {val.description}
              </p>
            </motion.div>
          ))}
          <div className="border-t" style={{ borderColor: "var(--v-border)" }} />
        </div>
      </div>
    </section>
  );
}
