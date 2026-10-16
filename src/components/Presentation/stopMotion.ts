import type { Variants } from 'framer-motion';

// Easing em degraus: segura cada "quadro" em vez de interpolar suavemente,
// imitando a cadência de uma animação stop motion (~12 fps).
export const steps = (frames: number) => (t: number) =>
  t >= 1 ? 1 : Math.floor(t * frames) / frames;

export const sequence: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const frame: Variants = {
  hidden: { opacity: 0, y: 36, rotate: -3, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.6, ease: steps(6) },
  },
  exit: {
    opacity: 0,
    y: -24,
    rotate: 2,
    scale: 0.96,
    transition: { duration: 0.3, ease: steps(3) },
  },
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -12 },
  show: {
    opacity: 1,
    scale: [0.4, 1.15, 1],
    rotate: [-12, 6, 0],
    transition: { duration: 0.5, ease: steps(5) },
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    transition: { duration: 0.25, ease: steps(2) },
  },
};
