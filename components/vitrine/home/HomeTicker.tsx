"use client";

const ITEMS = [
  "★ SORTEZ TOUJOURS BIEN HABILLÉ ★",
  "YOP CITY ON EST LÀ 🔥",
  "PAIEMENT WAVE · ORANGE MONEY · CASH",
  "LIVRAISON YOPOUGON 24H",
  "DROPS LIMITÉS — SOIS RAPIDE",
  "★ SORTEZ TOUJOURS BIEN HABILLÉ ★",
  "STYLE GARANTI OU REMBOURSÉ",
  "AUTHENTIQUE DEPUIS YOP",
  "TROP FORT C'EST DRI VALÉ",
];

export function HomeTicker() {
  const text = ITEMS.join("   ✦   ") + "   ✦   ";

  return (
    <div
      className="overflow-hidden border-y py-3.5"
      style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s1)" }}
    >
      <div className="vitrine-marquee-track flex whitespace-nowrap">
        {[text, text].map((t, i) => (
          <span
            key={i}
            aria-hidden={i > 0}
            className="font-[var(--font-display)] text-[11px] font-black uppercase tracking-[0.22em]"
            style={{ color: "var(--v-gold)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
