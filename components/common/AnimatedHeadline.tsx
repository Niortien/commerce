"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/*
 * Titre animé lettre par lettre (flou → net, ressort) — adapté du composant « Aurora Hero bg » (21st.dev).
 * Le titre garde un `aria-label` complet : les lettres décoratives sont masquées aux lecteurs d'écran.
 */
export interface HeadlineSegment {
  text: string;
  /** Segment de marque : animé mot par mot pour que le dégradé reste continu. */
  gradient?: boolean;
}

interface AnimatedHeadlineProps {
  segments: HeadlineSegment[];
  className?: string;
}

export function AnimatedHeadline({ segments, className }: AnimatedHeadlineProps) {
  const reduced = useReducedMotion();
  const label = segments.map((s) => s.text).join(" ");
  let order = 0;

  return (
    <h1 aria-label={label} className={className} style={{ textWrap: "balance" }}>
      {segments.flatMap((segment) =>
        segment.text.split(" ").map((word) => {
          const wordIndex = order++;
          const enter = {
            initial: reduced ? false : { y: 40, opacity: 0, filter: "blur(8px)" },
            animate: { y: 0, opacity: 1, filter: "blur(0px)" },
          } as const;

          return (
            <span key={`${wordIndex}-${word}`} aria-hidden className="mr-[0.25em] inline-block last:mr-0">
              {segment.gradient ? (
                <motion.span
                  {...enter}
                  transition={{ delay: wordIndex * 0.08, type: "spring", stiffness: 100, damping: 15 }}
                  className={cn("inline-block", "text-shimmer-gradient")}
                >
                  {word}
                </motion.span>
              ) : (
                word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={letterIndex}
                    {...enter}
                    transition={{
                      delay: wordIndex * 0.08 + letterIndex * 0.025,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))
              )}
            </span>
          );
        })
      )}
    </h1>
  );
}
