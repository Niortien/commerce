"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "4.6K", label: "Followers" },
  { value: "100+", label: "Références" },
  { value: "4.9★", label: "Note client" },
];

export function HomeBrandStatement() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:grid-cols-[1.3fr_1fr]">
        {/* Colonne texte */}
        <div>
          <motion.p
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.35em]"
            style={{ color: "var(--v-gold)" }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Qui on est
          </motion.p>

          <motion.h2
            className="font-[var(--font-display)] font-medium leading-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", color: "var(--v-text)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Une maison faite pour ceux qui{" "}
            <span className="italic" style={{ color: "var(--v-gold)" }}>
              ne transigent pas
            </span>{" "}
            sur le style.
          </motion.h2>

          <motion.p
            className="mt-8 max-w-xl text-base leading-relaxed"
            style={{ color: "var(--v-muted)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Luxury Boutique, c&rsquo;est l&rsquo;&eacute;l&eacute;gance multi-marques &agrave; Marcory. V&ecirc;tements, maroquinerie,
            chaussures et accessoires s&eacute;lectionn&eacute;s avec exigence, pour homme et femme &mdash; tout ce qu&rsquo;il faut
            pour s&rsquo;habiller avec caract&egrave;re. On ne fait pas dans le g&eacute;n&eacute;rique.
          </motion.p>

          <motion.blockquote
            className="mt-8 border-l pl-5 font-[var(--font-display)] text-lg italic"
            style={{ borderColor: "var(--v-gold)", color: "var(--v-text)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            &ldquo;Be Luxury. Ici, on ne fait pas dans le compromis.&rdquo;
          </motion.blockquote>
        </div>

        {/* Colonne stats */}
        <motion.div
          className="flex flex-col justify-center gap-8 border-t pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0"
          style={{ borderColor: "var(--v-border)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-4">
              <p
                className="font-[var(--font-display)] font-medium leading-none"
                style={{ fontSize: "clamp(28px,3vw,40px)", color: "var(--v-gold)" }}
              >
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: "var(--v-dim)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
