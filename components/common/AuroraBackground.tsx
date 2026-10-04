"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/*
 * Fond « aurore » — adapté du composant « Aurora Hero bg » (21st.dev, @dhileepkumargm).
 * Adaptations : couleurs de marque Mon Djossi (violet → bleu → cyan), vignette sur le token `--color-base` au lieu du
 * noir, couche `difference` retirée (illisible en thème clair), animation figée sous `prefers-reduced-motion`.
 */
const AURORA =
  "repeating-linear-gradient(100deg, #7c3aed 10%, #2563eb 15%, #06b6d4 20%, #7c3aed 25%, #2563eb 30%)";

interface AuroraBackgroundProps {
  className?: string;
  /** Opacité des bandes (0–1). Plus bas en thème clair pour garder le texte lisible. */
  intensity?: number;
}

export function AuroraBackground({ className, intensity = 0.28 }: AuroraBackgroundProps) {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-[-100%]"
        style={{ background: AURORA, backgroundSize: "300% 100%", filter: "blur(80px)", opacity: intensity }}
        animate={reduced ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[-100%]"
        style={{
          background: AURORA,
          backgroundSize: "200% 100%",
          filter: "blur(60px)",
          opacity: intensity * 0.6,
          mixBlendMode: "soft-light",
        }}
        animate={reduced ? undefined : { backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      {/* Fondu vers le fond de page pour que le texte reste lisible au centre. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-base)_100%)]" />
    </div>
  );
}
