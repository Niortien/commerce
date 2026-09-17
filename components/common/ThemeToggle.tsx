"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useThemeStore } from "@/stores/themeStore";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en thème clair" : "Passer en thème sombre"}
      title={isDark ? "Thème clair" : "Thème sombre"}
      className={[
        "flex items-center gap-2.5 rounded-md border border-border px-3 py-2 text-sm font-medium",
        "text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-high hover:text-text",
        className,
      ].join(" ")}
    >
      {isDark ? <IconSun size={15} className="shrink-0" /> : <IconMoon size={15} className="shrink-0" />}
      {isDark ? "Thème clair" : "Thème sombre"}
    </button>
  );
}
