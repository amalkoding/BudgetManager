"use client";
import { useEffect, useRef, useCallback } from "react";

export function useConfetti() {
  const confettiRef = useRef<((options?: Record<string, unknown>) => void) | null>(null);

  useEffect(() => {
    let isMounted = true;
    import("canvas-confetti").then((mod) => {
      if (isMounted) {
        confettiRef.current = mod.default;
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const fireSuccess = useCallback(() => {
    if (!confettiRef.current) return;
    const fire = confettiRef.current;

    fire({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#F8FAFC"],
    });

    setTimeout(() => {
      fire({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#10B981", "#34D399"],
      });
      fire({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#10B981", "#34D399"],
      });
    }, 250);
  }, []);

  const fireStreak = useCallback((streakCount: number) => {
    if (!confettiRef.current) return;
    const fire = confettiRef.current;
    const intensity = Math.min(streakCount * 20, 150);

    fire({
      particleCount: intensity,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#10B981", "#F59E0B", "#34D399", "#FCD34D", "#FFFFFF"],
      startVelocity: 35,
    });
  }, []);

  return { fireSuccess, fireStreak };
}
