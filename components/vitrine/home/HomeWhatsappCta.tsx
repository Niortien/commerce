"use client";

import { motion } from "framer-motion";
import { getWhatsappUrl } from "@/lib/whatsapp";

const WA_SVG = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function HomeWhatsappCta() {
  const waUrl = getWhatsappUrl("Bonjour Luxury Boutique ! Je veux passer une commande 🛒");

  return (
    <section
      className="relative overflow-hidden border-t py-24"
      style={{ backgroundColor: "var(--v-s1)", borderColor: "var(--v-border)" }}
    >
      {/* Grille de fines lignes dorées, discrète */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, var(--v-gold) 0px, var(--v-gold) 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-5 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-16">
        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-3 font-[var(--font-display)] text-sm italic"
            style={{ color: "var(--v-gold)" }}
          >
            Commande directe
          </p>
          <h2
            className="font-[var(--font-display)] leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--v-text)" }}
          >
            Commander sur{" "}
            <span className="italic" style={{ color: "var(--v-gold)" }}>
              WhatsApp.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Message direct avec la boutique. Paiement flexible.
            Réponse en moins de 30 minutes.
          </p>
        </motion.div>

        {/* Carte contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="rounded-2xl border p-8"
          style={{ borderColor: "var(--v-nav-border)", backgroundColor: "var(--v-bg)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: "#25D366", color: "#0d0d0d" }}
            >
              {WA_SVG}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--v-dim)" }}>
                Luxury Boutique
              </p>
              <p className="font-[var(--font-mono)] text-lg font-bold" style={{ color: "var(--v-text)" }}>
                +225 07 09 29 44 68
              </p>
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--v-gold)", color: "#0d0d0d" }}
          >
            Ouvrir WhatsApp
          </a>

          <p className="mt-4 text-center text-[11px] uppercase tracking-widest" style={{ color: "var(--v-dim)" }}>
            Marcory Bd VGE · Abidjan
          </p>
        </motion.div>
      </div>
    </section>
  );
}
