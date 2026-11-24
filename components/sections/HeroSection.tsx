"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { profile } from "@/data/profile";
import { WaterRippleCanvas } from "@/components/canvas/WaterRippleCanvas";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

const Hero3DScene = dynamic(
  () =>
    import("@/components/canvas/Hero3DScene").then((mod) => mod.Hero3DScene),
  { ssr: false }
);

interface HeroSectionProps {
  projectCount: number;
  skillCount: number;
}

export function HeroSection({ projectCount, skillCount }: HeroSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [motionPaused, setMotionPaused] = useState(false);

  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-void pt-20 pb-14 lg:pt-24 lg:pb-16 flex items-center"
    >
      {/* Layer 1: Full-Bleed Obsidian Hero Portrait + Interactive Water Ripple Shader */}
      <div className="absolute inset-0 z-0">
        {/* Desktop composition */}
        <div className="hidden md:block absolute inset-0">
          <WaterRippleCanvas
            imageSrc={profile.heroImage}
            alt="Mahdi di depan cincin gerhana matahari obsidian"
            width={1408}
            height={768}
            fetchPriority="high"
            focalPoint={[0.68, 0.34]}
            displacement={1.15}
            causticIntensity={0.28}
            listenTarget="window"
            paused={motionPaused}
            className="h-full w-full"
          />
        </div>

        {/* Mobile composition */}
        <div className="md:hidden absolute inset-x-0 top-0 h-[56svh]">
          <WaterRippleCanvas
            imageSrc={profile.heroImage}
            alt="Mahdi di depan cincin gerhana matahari obsidian"
            width={1408}
            height={768}
            fetchPriority="high"
            focalPoint={[0.72, 0.22]}
            displacement={0.85}
            causticIntensity={0.22}
            listenTarget="self"
            paused={motionPaused}
            className="h-full w-full"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/25 via-transparent to-void"
          />
        </div>

        {/* Contrast protection scrim: guarantees >14:1 contrast for left typography */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-r from-void via-void/85 via-[44%] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void via-void/70 to-transparent"
        />
      </div>

      {/* Layer 2: Interactive 3D WebGL Scene (Solar Eclipse Halo + Obsidian Shards + Embers) */}
      <Hero3DScene paused={motionPaused} />

      {/* Layer 3: Crisp Readable Hero Content */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mt-[34svh] md:mt-0 max-w-xl lg:max-w-[560px]">
          {/* Editorial Intro Line (no decorative dot or pill) */}
          <motion.p
            {...fadeUp(0.04)}
            className="font-serif text-sm sm:text-[15px] font-semibold uppercase tracking-[0.16em]"
          >
            <span className="text-ink-secondary">{profile.heroEyebrowPrefix}</span>{" "}
            <span className="text-ember">{profile.shortName}</span>
          </motion.p>

          {/* Stacked Condensed Display Headline */}
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-3.5 font-display text-[2.85rem] sm:text-[3.9rem] lg:text-[5.25rem] font-bold uppercase leading-[0.94] tracking-[-0.02em] text-ink-primary"
          >
            <span className="block">{profile.heroHeadlineLine1}</span>
            <span className="block">{profile.heroHeadlineLine2}</span>
            <span className="block">
              {profile.heroHeadlineLine3Prefix}{" "}
              <span className="text-ember">{profile.heroHeadlineHighlight}</span>
            </span>
          </motion.h1>

          {/* Value Proposition Copy */}
          <motion.p
            {...fadeUp(0.18)}
            className="mt-5 max-w-[46ch] text-[15px] sm:text-[16px] leading-[1.68] text-ink-secondary"
          >
            {profile.heroDescription}
          </motion.p>

          {/* Focal CTA Group */}
          <motion.div
            {...fadeUp(0.24)}
            className="mt-7 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            {/* Primary Capsule Focal CTA: intentional pill + glow dose #1 */}
            <a
              href="#projects"
              className="group inline-flex min-h-[52px] w-full sm:w-auto items-center justify-between sm:justify-start gap-5 rounded-full bg-ember pl-7 pr-2 py-2 font-display text-[17px] font-bold uppercase tracking-[0.08em] text-white shadow-[var(--glow-hero-cta)] transition-all duration-200 hover:bg-ember-glow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              <span>LIHAT PROYEK</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#090706] text-ink-primary transition-transform duration-200 group-hover:scale-105">
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>

            {/* Secondary Action: matte border, no glow */}
            <a
              href="#contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/15 bg-surface/90 px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-ink-primary transition-colors hover:border-ember/60 hover:text-ember-glow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              HUBUNGI SAYA
            </a>
          </motion.div>

          {/* Real Inventory Stats (sourced directly from projects.json, skills.ts, profile.ts) */}
          <motion.dl
            {...fadeUp(0.32)}
            className="mt-10 flex flex-wrap items-baseline gap-8 sm:gap-11 border-t border-white/[0.08] pt-6"
          >
            <div>
              <dd className="font-display text-2xl sm:text-[28px] font-bold leading-none text-ink-primary">
                {projectCount}
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                PROYEK TERDOKUMENTASI
              </dt>
            </div>

            <div>
              <dd className="font-display text-2xl sm:text-[28px] font-bold leading-none text-ink-primary">
                {skillCount}
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                TECH STACK AKTIF
              </dt>
            </div>

            <div>
              <dd className="font-display text-2xl sm:text-[28px] font-bold leading-none text-ember">
                {profile.semesterShort}
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                S1 TEKNOLOGI INFORMASI
              </dt>
            </div>
          </motion.dl>

          {/* Direct Links Row */}
          <motion.div {...fadeUp(0.38)} className="mt-7 hidden sm:block">
            <div className="flex flex-wrap items-center gap-2">
              {profile.heroBadges.map((badge) => (
                <a
                  key={badge.code}
                  href={badge.href}
                  target={"external" in badge && badge.external ? "_blank" : undefined}
                  rel={
                    "external" in badge && badge.external
                      ? "noopener noreferrer"
                      : undefined
                  }
                  title={badge.title}
                  aria-label={badge.title}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border font-mono text-xs font-semibold transition-colors hover:border-ember/60 hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                    "accent" in badge && badge.accent
                      ? "border-ember/45 bg-ember/12 text-ember"
                      : "border-white/10 bg-surface text-ink-secondary"
                  }`}
                >
                  {badge.code}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Right Micro-Rail & R-39 Motion Pause Control */}
      <div className="hidden lg:flex absolute right-6 top-28 bottom-8 z-30 flex-col items-end justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none flex flex-col items-center gap-3 pr-2"
        >
          <span className="h-8 w-[1px] bg-white/15" />
          <span className="vertical-text font-mono text-[10px] tracking-[0.28em] text-ink-muted uppercase">
            INTERACTIVE 3D PORTFOLIO
          </span>
          <span className="h-8 w-[1px] bg-white/15" />
        </div>

        {/* R-39: Pause control for continuous >5s WebGL 3D & ripple animation */}
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setMotionPaused((prev) => !prev)}
            aria-pressed={motionPaused}
            aria-label={
              motionPaused
                ? "Putar kembali animasi 3D dan riak air"
                : "Jeda animasi 3D dan riak air"
            }
            className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-surface px-3 py-2 font-mono text-[11px] text-ink-secondary transition-colors hover:border-ember/50 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            {motionPaused ? (
              <>
                <Play aria-hidden="true" className="h-3 w-3 text-ember" />
                <span>Putar 3D</span>
              </>
            ) : (
              <>
                <Pause aria-hidden="true" className="h-3 w-3 text-ember" />
                <span>Jeda 3D</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Calm Static Scroll Cue (no endless bounce) */}
      <a
        href="#about"
        aria-label="Gulir ke bagian Tentang Saya"
        className="group absolute bottom-5 left-1/2 z-30 hidden md:flex -translate-x-1/2 flex-col items-center gap-2 text-ink-muted hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm px-2 py-1"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
          GULIR
        </span>
        <span className="h-6 w-[1px] bg-white/20 transition-all duration-200 group-hover:h-8 group-hover:bg-ember" />
      </a>
    </section>
  );
}
