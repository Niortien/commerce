"use client";

const ITEMS = [
  "Multi-marques à Marcory",
  "Paiement Wave · Orange Money · Cash",
  "Livraison Abidjan 24h",
  "Authenticité garantie",
];

export function HomeTicker() {
  return (
    <div
      className="border-y py-4"
      style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-5 text-center">
        {ITEMS.map((item, i) => (
          <span key={item} className="flex items-center gap-3">
            {i > 0 && <span style={{ color: "var(--v-border-gold)" }}>·</span>}
            <span
              className="font-[var(--font-display)] text-xs italic tracking-wide"
              style={{ color: "var(--v-gold)" }}
            >
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
