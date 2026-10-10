"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { IconCheck } from "@tabler/icons-react";
import { COMMERCE_PROFILES, TYPES_COMMERCE, sectorStyle } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import type { TypeCommerce } from "@/types";

interface CommerceTypePickerProps {
  value: TypeCommerce | undefined;
  onChange: (type: TypeCommerce) => void;
  label?: string;
  errorMessage?: string;
}

/**
 * Choix du type de commerce. Chaque option montre une ligne de ticket de caisse typique du métier :
 * on voit tout de suite à quoi ressemblera sa caisse (« Garba poulet × 2 », « Câble 2,5 mm² 12 m »…).
 */
export function CommerceTypePicker({
  value,
  onChange,
  label = "Que vendez-vous ?",
  errorMessage,
}: CommerceTypePickerProps) {
  const labelId = useId();
  const errorId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // Radiogroup au clavier : les flèches passent d'une option à l'autre et la sélectionnent.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (index + step + TYPES_COMMERCE.length) % TYPES_COMMERCE.length;
    onChange(TYPES_COMMERCE[next]);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <p id={labelId} className="mb-2 text-sm font-medium text-text">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={Boolean(errorMessage)}
        className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2"
      >
        {TYPES_COMMERCE.map((type, index) => {
          const profile = COMMERCE_PROFILES[type];
          const Icon = profile.icon;
          const selected = type === value;
          // Sans sélection, la première option reste atteignable au clavier.
          const focusable = selected || (value === undefined && index === 0);
          return (
            <button
              key={type}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={focusable ? 0 : -1}
              onClick={() => onChange(type)}
              onKeyDown={(e) => onKeyDown(e, index)}
              style={sectorStyle(type)}
              className={cn(
                "group relative flex cursor-pointer flex-col rounded-lg border bg-surface text-left transition-[border-color,box-shadow] duration-150",
                selected
                  ? "border-[color:var(--sector)] shadow-[0_0_0_1px_var(--sector)]"
                  : "border-border hover:border-text-dim"
              )}
            >
              <span className="flex items-start gap-2.5 px-3 pb-2.5 pt-3">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:color-mix(in_srgb,var(--sector)_12%,transparent)] text-[color:var(--sector)]"
                >
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-text">{profile.label}</span>
                  <span className="block text-xs leading-snug text-text-muted">{profile.description}</span>
                </span>
              </span>
              {/* Ligne de ticket : bord dentelé comme un reçu de caisse */}
              <span
                aria-hidden
                className="mt-auto flex items-baseline justify-between gap-2 border-t border-dashed border-border px-3 py-2 text-xs"
              >
                <span className="min-w-0 truncate text-text">
                  {profile.exemple.article}
                  <span className="ml-1.5 text-text-muted">{profile.exemple.detail}</span>
                </span>
                <span className="tabular shrink-0 font-semibold text-text">{profile.exemple.prix}</span>
              </span>
              {selected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--sector)] text-white dark:text-[color:var(--color-base)]">
                  <IconCheck size={12} aria-hidden />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {errorMessage && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-out-text">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
