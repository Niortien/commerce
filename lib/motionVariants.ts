import type { Transition, Variants } from "framer-motion";

export const motionDurations = {
  fast: 0.12,
  normal: 0.22,
  slow: 0.38,
  xslow: 0.55,
} as const;

export const motionEasing = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutCirc: [0.85, 0, 0.15, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export const riverItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.slow, ease: motionEasing.outExpo },
  },
};

export const riverContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: motionDurations.xslow, ease: motionEasing.inOutCirc },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: motionDurations.normal, ease: motionEasing.inOutCirc },
  },
};

export const commandBar: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.slow, ease: motionEasing.spring },
  },
};

export const panelSlide: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: motionDurations.slow, ease: motionEasing.outExpo },
  },
};

export const newTransaction: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: motionDurations.normal, ease: motionEasing.outExpo },
  },
};

export function getMotionVariant(variants: Variants, prefersReducedMotion: boolean): Variants {
  if (!prefersReducedMotion) return variants;

  const transition: Transition = { duration: 0.15 };
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition },
  };
}
