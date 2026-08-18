"use client";

import { motion } from "framer-motion";

const TIMELINE = [
  {
    year: "Les débuts",
    title: "L'idée",
    description:
      "Une passion pour la mode de luxe et le multi-marques. Les premières pièces sélectionnées avec exigence — vêtements, maroquinerie, accessoires — trouvent preneur en quelques jours. Le bouche-à-oreille fait le reste.",
    img: "/images/image_luxury/image9.jpg",
  },
  {
    year: "La boutique",
    title: "Marcory Bd VGE",
    description:
      "Luxury Boutique ouvre ses portes à Marcory Bd VGE, Abidjan. Le concept se précise : vêtements, maroquinerie, chaussures et accessoires de luxe, homme et femme, multi-marques — à prix justes, sans intermédiaire.",
    img: "/images/image_luxury/image4.jpg",
  },
  {
    year: "Digital",
    title: "Réseaux & WhatsApp",
    description:
      "La boutique se retrouve sur les réseaux sociaux et les commandes via WhatsApp se multiplient. Livraison à Abidjan et expédition partout en Côte d'Ivoire.",
    img: "/images/image_luxury/image2.jpg",
  },
  {
    year: "Aujourd'hui",
    title: "Toujours en mouvement",
    description:
      "Nouvelles arrivées régulières, une clientèle fidèle qui grandit chaque jour, et une boutique qui reste la référence luxe multi-marques d'Abidjan. Le mouvement continue.",
    img: "/images/image_luxury/image3.jpg",
  },
];

export function MarqueStory() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24 md:px-16">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-2 font-[var(--font-display)] text-sm italic"
        style={{ color: "var(--v-gold)" }}
      >
        Notre histoire
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-16 font-[var(--font-display)] leading-[1.05] tracking-tight"
        style={{ fontSize: "clamp(30px,5vw,52px)", color: "var(--v-text)" }}
      >
        Notre parcours
      </motion.h2>

      <div className="flex flex-col divide-y" style={{ borderColor: "var(--v-border)" }}>
        {TIMELINE.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="grid grid-cols-1 gap-5 py-9 md:grid-cols-[88px_180px_1fr] md:items-start md:gap-8"
            style={{ borderColor: "var(--v-border)" }}
          >
            <div
              className="hidden overflow-hidden rounded-xl border md:block"
              style={{ aspectRatio: "1/1", borderColor: "var(--v-nav-border)" }}
            >
              <img src={item.img} alt={item.title} className="h-full w-full scale-110 object-cover" />
            </div>
            <div>
              <p
                className="font-[var(--font-mono)] text-xs font-black uppercase tracking-widest"
                style={{ color: "var(--v-gold)" }}
              >
                {item.year}
              </p>
              <h3
                className="mt-2 font-[var(--font-display)] text-2xl leading-snug"
                style={{ color: "var(--v-text)" }}
              >
                {item.title}
              </h3>
            </div>
            <p
              className="max-w-xl text-sm leading-relaxed md:pt-1"
              style={{ color: "var(--v-muted)" }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
