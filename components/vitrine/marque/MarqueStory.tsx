"use client";

import { motion } from "framer-motion";

const TIMELINE = [
  {
    year: "Les débuts",
    title: "L'idée",
    description:
      "À Yopougon, une passion pour la mode et les produits importés. Les premières pièces arrivent des États-Unis — ensembles, casquettes, accessoires — et trouvent preneur en quelques heures. Le bouche-à-oreille fait le reste.",
    img: "/story-2020.jpg",
  },
  {
    year: "La boutique",
    title: "Ananeraie Oasis",
    description:
      "Dri Valé ouvre ses portes à l'Ananeraie Oasis, quartier Maroc, Yopougon. Le concept se précise : vêtements de qualité, maroquinerie, parfumerie, produits importés USA — à prix justes, sans intermédiaire.",
    img: "/story-2022.jpg",
  },
  {
    year: "Digital",
    title: "TikTok & WhatsApp",
    description:
      "La boutique se retrouve sur TikTok et les commandes via WhatsApp explosent. Livraisons à Abidjan (Selmer, Niangon) et expédition partout en Côte d'Ivoire.",
    img: "/story-2024.jpg",
  },
  {
    year: "Aujourd'hui",
    title: "Toujours en mouvement",
    description:
      "Nouvelles arrivées régulières, une clientèle fidèle qui grandit chaque jour, et une boutique qui reste le point de repère mode de Yopougon. Le mouvement continue.",
    img: "/story-now.jpg",
  },
];

export function MarqueStory() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24 md:px-16">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-2 text-[10px] font-black uppercase tracking-[0.4em]"
        style={{ color: "var(--v-gold)" }}
      >
        Notre histoire
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-16 font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
        style={{ fontSize: "clamp(32px,6vw,64px)", color: "var(--v-text)" }}
      >
        Timeline
      </motion.h2>

      <div className="relative">
        <div
          className="absolute left-[18px] top-0 bottom-0 w-px md:left-1/2"
          style={{ backgroundColor: "var(--v-border)" }}
        />

        <div className="space-y-16">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col gap-6 pl-12 md:pl-0 md:flex-row md:items-center ${
                i % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div
                className="absolute left-0 top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2"
                style={{ borderColor: "var(--v-gold)", backgroundColor: "var(--v-bg)", zIndex: 1 }}
              >
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--v-gold)" }} />
              </div>

              <div className={`md:w-[45%] ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                <p
                  className="mb-1 font-[var(--font-mono)] text-sm font-black"
                  style={{ color: "var(--v-gold)" }}
                >
                  {item.year}
                </p>
                <h3 className="mb-2 text-lg font-black uppercase" style={{ color: "var(--v-text)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
                  {item.description}
                </p>
              </div>

              <div
                className="h-32 w-full overflow-hidden rounded-xl md:w-[45%] md:h-40"
                style={{ backgroundColor: "var(--v-s2)" }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
