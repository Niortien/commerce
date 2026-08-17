"use client";

import { useVitrineStore } from "@/stores/vitrineStore";

export function VitrineRoot({ children }: { children: React.ReactNode }) {
  const theme = useVitrineStore((s) => s.theme);

  return (
    <div
      data-vitrine
      data-theme={theme}
      className="min-h-screen"
      style={{ backgroundColor: "var(--v-bg)", color: "var(--v-text)" }}
    >
      {children}
    </div>
  );
}
