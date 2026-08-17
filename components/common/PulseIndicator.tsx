interface PulseIndicatorProps {
  mode?: "normal" | "critique";
}

export function PulseIndicator({ mode = "normal" }: PulseIndicatorProps) {
  return (
    <span
      aria-hidden
      className={
        mode === "critique"
          ? "h-2.5 w-2.5 rounded-full bg-out shadow-glow-red"
          : "h-2.5 w-2.5 rounded-full bg-in shadow-glow-green"
      }
    />
  );
}
