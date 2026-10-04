export type Tone = "accent" | "in" | "out" | "return" | "cash";

/** Classe qui pose `--tone` / `--tone-text` (définies dans `app/globals.css`). */
export const TONE_CLASS: Record<Tone, string> = {
  accent: "tone-accent",
  in: "tone-in",
  out: "tone-out",
  return: "tone-return",
  cash: "tone-cash",
};
