"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "12", label: "Pièces" },
  { value: "3", label: "Looks" },
  { value: "100%", label: "Abidjanais" },
];

export function LookbookEditorial() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-16">
      <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        {/* Texte gauche */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-6 text-[10px] font-black uppercase tracking-[0.4em]"
            style={{ color: "var(--v-gold)" }}
          >
            L&rsquo;histoire derri&egrave;re la collection
          </p>
          <h2
            className="mb-8 font-[var(--font-display)] font-black uppercase leading-tight tracking-tight"
            style={{ fontSize: "clamp(28px,5vw,52px)", color: "var(--v-text)" }}
          >
            Inspir&eacute; par
            <br />
            les nuits d&rsquo;Abidjan
          </h2>
          <p className="mb-5 text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Quand la chaleur du jour laisse place &agrave; l&rsquo;&eacute;lectricit&eacute; de la nuit, Abidjan r&eacute;v&egrave;le
            une autre dimension. Yopougon, Cocody, le Plateau &mdash; des spots o&ugrave; la mode se vit
            sans codes impos&eacute;s, o&ugrave; chaque look est une d&eacute;claration d&rsquo;identit&eacute;.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Dri Val&eacute; a shoot&eacute; cette collection l&agrave; o&ugrave; la ville respire : dans les ruelles de Yop,
            sous les n&eacute;ons, au bord de la lagune. Des pi&egrave;ces pens&eacute;es pour habiter ces moments.
          </p>

          {/* Stats éditoriales */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "var(--v-border)" }}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-[var(--font-mono)] text-2xl font-black"
                  style={{ color: "var(--v-gold)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--v-dim)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Photo droite */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div
            className="aspect-[3/4] w-full overflow-hidden rounded-2xl"
            style={{ backgroundColor: "var(--v-s2)" }}
          >
            <img
              src="/images/dri_style/boutique-interieur-2.jpg"
              alt="Boutique Dri Valé — collection"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              className="flex h-full w-full items-end p-6"
              style={{
                background: "linear-gradient(135deg, var(--v-s2) 0%, var(--v-s3) 100%)",
              }}
            >
              <p className="font-black text-5xl uppercase leading-none opacity-10" style={{ color: "var(--v-text)" }}>
                EDITORIAL
              </p>
            </div>
          </div>

          {/* Accent gold */}
          <div
            className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl"
            style={{ backgroundColor: "var(--v-gold)", opacity: 0.25, zIndex: -1 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
