"use client";

interface CatalogueHeroProps {
  total: number;
  search: string;
  onSearch: (v: string) => void;
}

export function CatalogueHero({ total, search, onSearch }: CatalogueHeroProps) {
  return (
    <section
      className="border-b px-5 pb-10 pt-12"
      style={{ borderColor: "var(--v-border)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              className="mb-2 text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: "var(--v-gold)" }}
            >
              Dri Val&eacute; &mdash; Yop City
            </p>
            <h1
              className="font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(48px, 9vw, 96px)", color: "var(--v-text)" }}
            >
              Catalogue
            </h1>
            <p className="mt-2 font-[var(--font-mono)] text-sm" style={{ color: "var(--v-muted)" }}>
              {total} article{total !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="w-full max-w-sm">
            <div
              className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors focus-within:border-[var(--v-gold)]"
              style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "var(--v-dim)", flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cherche ta pièce..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--v-dim)]"
                style={{ color: "var(--v-text)" }}
              />
              {search && (
                <button
                  onClick={() => onSearch("")}
                  className="text-xs transition-colors hover:text-[var(--v-text)]"
                  style={{ color: "var(--v-dim)" }}
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
