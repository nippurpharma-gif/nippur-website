/**
 * Motion presets for UI chrome (Header / Products filters).
 * Scroll and section motion use GSAP (`@/lib/gsap-site`).
 */

export const EASE_CRAFT = [0.23, 1, 0.32, 1] as const;

export const STAGGER_MS = 55;

export const motionTransition = {
  enter: {
    duration: 0.42,
    ease: EASE_CRAFT,
  },
  section: {
    duration: 0.5,
    ease: EASE_CRAFT,
  },
  springNav: {
    type: 'spring' as const,
    stiffness: 480,
    damping: 34,
  },
  fadeFast: {
    duration: 0.18,
    ease: EASE_CRAFT,
  },
};
