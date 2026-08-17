"use client";

import { motion } from "framer-motion";

const HORAIRES = [
  { jour: "Lundi — Vendredi", heure: "09:00 — 20:00" },
  { jour: "Samedi", heure: "09:00 — 22:00" },
  { jour: "Dimanche", heure: "11:00 — 18:00" },
];

export function MarqueContact() {
  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2250709294468"}`;

  return (
    <section className="mx-auto max-w-5xl px-5 py-24 md:px-16">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-2 text-[10px] font-black uppercase tracking-[0.4em]"
        style={{ color: "var(--v-gold)" }}
      >
        Venir nous voir
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-12 font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
        style={{ fontSize: "clamp(32px,6vw,64px)", color: "var(--v-text)" }}
      >
        Contact
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Adresse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--v-s2)" }}
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--v-gold)" }}>
            Adresse
          </p>
          <p className="text-sm font-semibold leading-relaxed" style={{ color: "var(--v-text)" }}>
            Ananeraie Oasis, Quartier Maroc
            <br />
            Yopougon, Abidjan
            <br />
            C&ocirc;te d&rsquo;Ivoire
          </p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-[var(--v-gold)]"
            style={{ color: "var(--v-muted)" }}
          >
            Voir sur Google Maps &rarr;
          </a>
        </motion.div>

        {/* Horaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--v-s2)" }}
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--v-gold)" }}>
            Horaires
          </p>
          <div className="space-y-2">
            {HORAIRES.map((h) => (
              <div key={h.jour} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--v-muted)" }}>{h.jour}</span>
                <span className="font-[var(--font-mono)] text-xs font-black" style={{ color: "var(--v-text)" }}>
                  {h.heure}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact direct */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--v-s2)" }}
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--v-gold)" }}>
            Contact direct
          </p>
          <div className="space-y-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--v-text)]"
              style={{ color: "var(--v-muted)" }}
            >
              <span style={{ color: "#25D366" }}>&#9679;</span>
              +225 07 09 29 44 68
            </a>
            <a
              href="https://www.tiktok.com/@kaypeurbienpaye1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--v-text)]"
              style={{ color: "var(--v-muted)" }}
            >
              <span style={{ color: "var(--v-purple)" }}>&#9679;</span>
              TikTok @kaypeurbienpaye1
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
