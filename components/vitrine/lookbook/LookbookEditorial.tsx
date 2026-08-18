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
            className="mb-4 font-[var(--font-display)] text-sm italic"
            style={{ color: "var(--v-gold)" }}
          >
            L&rsquo;histoire derri&egrave;re la collection
          </p>
          <h2
            className="mb-8 font-[var(--font-display)] leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(28px,5vw,48px)", color: "var(--v-text)" }}
          >
            Inspir&eacute; par <span className="italic" style={{ color: "var(--v-gold)" }}>Abidjan.</span>
          </h2>
          <p className="mb-5 text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Quand la chaleur du jour laisse place &agrave; l&rsquo;&eacute;lectricit&eacute; de la nuit, Abidjan r&eacute;v&egrave;le
            une autre dimension. Marcory, Cocody, le Plateau &mdash; des spots o&ugrave; la mode se vit
            sans codes impos&eacute;s, o&ugrave; chaque look est une d&eacute;claration d&rsquo;identit&eacute;.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Luxury Boutique a shoot&eacute; cette collection l&agrave; o&ugrave; la ville respire : dans les rues d&rsquo;Abidjan,
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
          className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border"
          style={{ borderColor: "var(--v-nav-border)", backgroundColor: "var(--v-s1)" }}
        >
          <img
            src="/images/image_luxury/image3.jpg"
            alt="Pièce Luxury Boutique, shooting éditorial"
            className="absolute inset-0 h-full w-full scale-110 object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 50%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-6 border"
            style={{ borderColor: "var(--v-gold)", opacity: 0.3 }}
            aria-hidden
          />
          <div className="relative flex h-full items-end p-8">
            <p className="font-[var(--font-display)] text-sm italic leading-relaxed" style={{ color: "#fff" }}>
              Marcory · Cocody · Le Plateau
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
