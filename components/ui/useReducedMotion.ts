"use client";

import { useSyncExternalStore } from "react";

function createMediaStore(query: string) {
  return {
    subscribe(callback: () => void) {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    getSnapshot() {
      if (typeof window === "undefined" || !window.matchMedia) return false;
      return window.matchMedia(query).matches;
    },
    getServerSnapshot() {
      return false;
    },
  };
}

const reducedMotionStore = createMediaStore("(prefers-reduced-motion: reduce)");
const coarsePointerStore = createMediaStore("(pointer: coarse)");

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot
  );
}

export function useIsTouchDevice(): boolean {
  return useSyncExternalStore(
    coarsePointerStore.subscribe,
    coarsePointerStore.getSnapshot,
    coarsePointerStore.getServerSnapshot
  );
}
