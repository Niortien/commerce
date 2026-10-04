"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";

interface ThemeToggleProps {
  className?: string;
  /** Style adapté à la barre latérale bleu nuit. */
  onDark?: boolean;
}

export function ThemeToggle({ className = "", onDark = false }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en thème clair" : "Passer en thème sombre"}
      className={cn(
        "flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
        onDark
          ? "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text"
          : "border border-border text-text-muted hover:bg-surface-high hover:text-text",
        className
      )}
    >
      {isDark ? <IconSun size={16} className="shrink-0" aria-hidden /> : <IconMoon size={16} className="shrink-0" aria-hidden />}
      {isDark ? "Thème clair" : "Thème sombre"}
    </button>
  );
}
