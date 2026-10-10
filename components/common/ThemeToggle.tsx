"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { IconDeviceDesktop, IconMoon, IconSun, type Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useThemeStore, type ThemePreference } from "@/stores/themeStore";

const OPTIONS: Array<{ cle: ThemePreference; label: string; icon: Icon }> = [
  { cle: "light", label: "Clair", icon: IconSun },
  { cle: "dark", label: "Sombre", icon: IconMoon },
  { cle: "system", label: "Système", icon: IconDeviceDesktop },
];

function isPreference(valeur: unknown): valeur is ThemePreference {
  return OPTIONS.some((o) => o.cle === valeur);
}

interface ThemeToggleProps {
  className?: string;
  /** Style adapté à la barre latérale bleu nuit. */
  onDark?: boolean;
}

/** Choix du thème en trois boutons : clair, sombre, ou celui de l'appareil. */
export function ThemeToggle({ className = "", onDark = false }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div
      role="radiogroup"
      aria-label="Thème d'affichage"
      className={cn(
        "grid grid-cols-3 gap-1 rounded-lg p-1",
        onDark ? "bg-sidebar-hover/60" : "border border-border bg-surface",
        className
      )}
    >
      {OPTIONS.map(({ cle, label, icon: OptionIcon }) => {
        const actif = theme === cle;
        return (
          <button
            key={cle}
            type="button"
            role="radio"
            aria-checked={actif}
            onClick={() => setTheme(cle)}
            className={cn(
              "flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-accent",
              onDark
                ? actif
                  ? "bg-sidebar-active text-sidebar-text"
                  : "text-sidebar-muted hover:text-sidebar-text"
                : actif
                  ? "bg-surface-high text-text"
                  : "text-text-muted hover:text-text"
            )}
          >
            <OptionIcon size={15} aria-hidden className="shrink-0" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** Version compacte pour la barre du site : une icône qui ouvre les trois choix. */
export function ThemeMenu({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const actuel = OPTIONS.find((o) => o.cle === theme) ?? OPTIONS[2];
  const ActuelIcon = actuel.icon;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button isIconOnly variant="light" className={cn("min-h-11 min-w-11 text-text", className)} aria-label={`Thème : ${actuel.label}. Changer le thème`}>
          <ActuelIcon size={20} aria-hidden />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Thème d'affichage"
        selectionMode="single"
        selectedKeys={[theme]}
        disallowEmptySelection
        onAction={(cle) => {
          if (isPreference(cle)) setTheme(cle);
        }}
      >
        {OPTIONS.map(({ cle, label, icon: OptionIcon }) => (
          <DropdownItem key={cle} startContent={<OptionIcon size={16} aria-hidden />}>
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
