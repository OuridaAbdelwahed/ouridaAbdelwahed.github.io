export const motionDurations = {
  fast: 0.18,
  normal: 0.42,
  slow: 0.78,
  cinematic: 1.1,
} as const;

export const motionEasings = {
  smooth: [0.22, 1, 0.36, 1] as const,
  soft: [0.16, 1, 0.3, 1] as const,
} as const;

export const motionSpring = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 24,
  mass: 0.9,
};
