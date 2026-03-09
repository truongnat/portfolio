import { useReducedMotion } from 'framer-motion';

/**
 * A wrapper around framer-motion's useReducedMotion that ensures
 * consistency between server and client during hydration.
 * 
 * It returns false during SSR and the initial client render,
 * and then returns the actual user preference after mount.
 */
export function useSafeReducedMotion() {
  const shouldReduceMotion = useReducedMotion();
  return shouldReduceMotion ?? false;
}
