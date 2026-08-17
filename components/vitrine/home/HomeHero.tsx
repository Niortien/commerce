"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWhatsappUrl } from "@/lib/whatsapp";

const waUrl = getWhatsappUrl("Allo Dri Valé, je veux voir vos nouveautés 🔥");

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Glow or — ambiance prestige */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(240,180,41,0.12) 0%, transparent 68%)" }}
      />
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-12 pt-28">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em]"
              style={{ borderColor: "var(--v-border-gold)", color: "var(--v-gold)" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--v-hot)" }}
              />
              Nouveaux drops disponibles
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            className="mt-6 font-[var(--font-display)] font-black leading-[0.92] tracking-[-0.02em]"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <span
              className="block"
              style={{
                fontSize: "clamp(64px, 12vw, 140px)",
                color: "var(--v-text)",
              }}
            >
              SOIS LE
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(64px, 12vw, 140px)",
                color: "var(--v-gold)",
                textShadow: "0 0 60px rgba(240,180,41,0.3)",
              }}
            >
              PLUS STYLÉ
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(64px, 12vw, 140px)",
                color: "var(--v-text)",
              }}
            >
              DE YOP.
            </span>
          </motion.h1>

          {/* Slogan */}
          <motion.div
            className="mt-8 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span style={{ color: "var(--v-gold)", fontSize: 18 }}>★</span>
            <p
              className="font-[var(--font-display)] text-base font-black uppercase tracking-[0.12em] md:text-lg"
              style={{ color: "var(--v-gold)" }}
            >
              Sortez toujours bien habillé
            </p>
            <span style={{ color: "var(--v-gold)", fontSize: 18 }}>★</span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-4 max-w-md text-sm leading-relaxed"
            style={{ color: "var(--v-muted)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Vêtements, sneakers et accessoires importés. Directo depuis
            Yopougon — <span style={{ color: "var(--v-text)", fontWeight: 600 }}>100% authentique.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-4 font-[var(--font-display)] text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(240,180,41,0.35)] active:scale-[0.97]"
              style={{ backgroundColor: "var(--v-gold)", color: "#000" }}
            >
              Explorer le catalogue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-4 font-[var(--font-display)] text-sm font-black uppercase tracking-widest transition-all hover:border-[var(--v-gold)] hover:text-[var(--v-gold)]"
              style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Commander sur WA
            </a>
          </motion.div>

          {/* Stats sociales */}
          <motion.div
            className="mt-12 flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            {[
              { val: "200+", label: "clients à Yop" },
              { val: "4.9★", label: "satisfaction" },
              { val: "24h",  label: "livraison locale" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-[var(--font-display)] text-xl font-black" style={{ color: "var(--v-gold)" }}>
                  {s.val}
                </span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--v-dim)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bande dorée en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent 0%, var(--v-gold) 40%, var(--v-gold) 60%, transparent 100%)", opacity: 0.3 }}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-10 w-px"
          style={{ backgroundColor: "var(--v-dim)" }}
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "var(--v-dim)" }}>scroll</span>
      </motion.div>
    </section>
  );
}
