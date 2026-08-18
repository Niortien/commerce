"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWhatsappUrl } from "@/lib/whatsapp";

const waUrl = getWhatsappUrl("Allo Luxury Boutique, je veux voir vos nouveautés ✨");

const STATS = [
  { val: "4.6K", label: "followers" },
  { val: "4.9★", label: "satisfaction" },
  { val: "24h", label: "livraison Abidjan" },
];

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Halo doré centré, discret */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(216,160,92,0.10) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-[var(--font-display)] text-sm italic tracking-wide"
          style={{ color: "var(--v-gold)" }}
        >
          Maison multi-marques — Marcory, Abidjan
        </motion.p>

        <motion.h1
          className="mt-6 font-[var(--font-display)] font-semibold leading-[1.02]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span
            className="block"
            style={{ fontSize: "clamp(48px, 9vw, 108px)", color: "var(--v-text)" }}
          >
            L&rsquo;élégance
          </span>
          <span
            className="block italic"
            style={{
              fontSize: "clamp(48px, 9vw, 108px)",
              color: "var(--v-gold)",
              textShadow: "0 0 50px rgba(216,160,92,0.25)",
            }}
          >
            n&rsquo;attend pas.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-lg text-base leading-relaxed"
          style={{ color: "var(--v-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Vêtements, maroquinerie, chaussures et accessoires de luxe, homme et femme.
          Multi-marques, sélection exigeante,{" "}
          <span style={{ color: "var(--v-text)", fontWeight: 600 }}>100% authentique.</span>
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 rounded-full border-2 px-9 py-3.5 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[0.15em] transition-all hover:bg-[var(--v-gold)] hover:text-black"
            style={{ borderColor: "var(--v-gold)", color: "var(--v-gold)" }}
          >
            Découvrir la collection
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.2em] underline-offset-4 transition-colors hover:underline"
            style={{ color: "var(--v-muted)" }}
          >
            ou nous écrire sur WhatsApp →
          </a>
        </motion.div>

        <motion.div
          className="mt-16 flex items-center gap-8 border-t pt-8"
          style={{ borderColor: "var(--v-border)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              {i > 0 && <span style={{ color: "var(--v-border)" }}>·</span>}
              <div className="flex flex-col items-center">
                <span className="font-[var(--font-display)] text-lg font-semibold" style={{ color: "var(--v-text)" }}>
                  {s.val}
                </span>
                <span className="mt-0.5 text-[9px] uppercase tracking-wider" style={{ color: "var(--v-dim)" }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
