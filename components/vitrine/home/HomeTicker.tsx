"use client";

const ITEMS = [
  "★ BE LUXURY ★",
  "MULTI-MARQUES À MARCORY",
  "PAIEMENT WAVE · ORANGE MONEY · CASH",
  "LIVRAISON ABIDJAN 24H",
  "NOUVELLES PIÈCES CHAQUE SEMAINE",
  "★ BE LUXURY ★",
  "AUTHENTICITÉ GARANTIE",
  "VÊTEMENTS · MAROQUINERIE · CHAUSSURES",
  "C'EST ÇA LUXURY BOUTIQUE",
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
