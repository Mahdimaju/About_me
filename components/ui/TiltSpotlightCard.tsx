"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { useIsTouchDevice, usePrefersReducedMotion } from "./useReducedMotion";

interface TiltSpotlightCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  enableTilt?: boolean;
  onClick?: () => void;
}

export function TiltSpotlightCard({
  children,
  className = "",
  maxTilt = 5,
  enableTilt = true,
  onClick,
}: TiltSpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const [transform, setTransform] = useState("");
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const interactive = !reducedMotion && !isTouch;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    setSpotlight({ x: px, y: py, active: true });

    if (enableTilt) {
      const rotateY = ((x / rect.width) - 0.5) * (maxTilt * 2);
      const rotateX = -((y / rect.height) - 0.5) * (maxTilt * 2);
      setTransform(
        `perspective(950px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`
      );
    }
  };

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, active: false }));
    setTransform("");
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || undefined,
        transition: spotlight.active
          ? "transform 120ms ease-out, border-color 220ms ease"
          : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms ease",
        willChange: interactive ? "transform" : undefined,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {interactive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: spotlight.active ? 1 : 0,
            background: `radial-gradient(360px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255, 77, 0, 0.14), rgba(255, 162, 58, 0.04) 40%, transparent 72%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
