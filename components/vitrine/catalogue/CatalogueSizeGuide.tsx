"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIZE_TABLE = [
  { taille: "XS", eu: "36-37", cm: "23-24", us: "4-5" },
  { taille: "S", eu: "38-39", cm: "24.5-25.5", us: "6-7" },
  { taille: "M", eu: "40-41", cm: "26-26.5", us: "7.5-8.5" },
  { taille: "L", eu: "42-43", cm: "27-27.5", us: "9-10" },
  { taille: "XL", eu: "44-45", cm: "28-29", us: "10.5-11.5" },
  { taille: "XXL", eu: "46-47", cm: "29.5-30", us: "12-13" },
  { taille: "XXXL", eu: "48+", cm: "31+", us: "14+" },
];

export function CatalogueSizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="border-t"
      style={{ borderColor: "var(--v-border)" }}
    >
      <div className="mx-auto max-w-7xl px-5">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-5"
        >
          <span
            className="font-[var(--font-display)] text-sm font-black uppercase tracking-widest"
            style={{ color: "var(--v-text)" }}
          >
            Guide des tailles
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-lg"
            style={{ color: "var(--v-lime)" }}
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-8">
                <p className="mb-4 text-sm" style={{ color: "var(--v-muted)" }}>
                  Références indicatives. En cas de doute, commandez via WhatsApp pour un conseil personnalisé.
                </p>
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--v-border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: "var(--v-s2)" }}>
                        {["Taille", "EU", "CM", "US"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: "var(--v-lime)" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_TABLE.map((row, i) => (
                        <tr
                          key={row.taille}
                          className="border-t"
                          style={{ borderColor: "var(--v-border)", backgroundColor: i % 2 === 0 ? "transparent" : "var(--v-s1)" }}
                        >
                          <td className="px-4 py-3 font-bold" style={{ color: "var(--v-text)" }}>{row.taille}</td>
                          <td className="px-4 py-3 font-[var(--font-mono)]" style={{ color: "var(--v-muted)" }}>{row.eu}</td>
                          <td className="px-4 py-3 font-[var(--font-mono)]" style={{ color: "var(--v-muted)" }}>{row.cm}</td>
                          <td className="px-4 py-3 font-[var(--font-mono)]" style={{ color: "var(--v-muted)" }}>{row.us}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
