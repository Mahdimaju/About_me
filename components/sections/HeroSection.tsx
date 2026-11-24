"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowUpRight, Cpu, FolderGit2, GraduationCap, Play } from "lucide-react";
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

  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.65,
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
            focalPoint={[0.68, 0.34]}
            displacement={1.15}
            causticIntensity={0.28}
            listenTarget="window"
            className="h-full w-full"
          />
        </div>

        {/* Mobile composition: portrait framed cleanly above text */}
        <div className="md:hidden absolute inset-x-0 top-0 h-[56svh]">
          <WaterRippleCanvas
            imageSrc={profile.heroImage}
            alt="Mahdi di depan cincin gerhana matahari obsidian"
            focalPoint={[0.72, 0.22]}
            displacement={0.85}
            causticIntensity={0.22}
            listenTarget="self"
            className="h-full w-full"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/25 via-transparent to-void"
          />
        </div>

        {/* Contrast protection scrim so left typography is always ultra-crisp & readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-r from-void via-void/80 via-[44%] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void via-void/70 to-transparent"
        />
      </div>

      {/* Layer 2: Interactive 3D WebGL Scene (Solar Eclipse Halo + Obsidian Shards + Embers) */}
      <Hero3DScene />

      {/* Layer 3: Crisp Readable Hero Content (Never Distorted by Water Shader) */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mt-[34svh] md:mt-0 max-w-xl lg:max-w-[560px]">
          {/* Eyebrow */}
          <motion.div
            {...fadeUp(0.05)}
            className="inline-flex items-center gap-2.5 font-serif text-sm sm:text-[15px] font-semibold uppercase tracking-[0.18em]"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_#FF4D00]"
            />
            <span className="text-ink-secondary">{profile.heroEyebrowPrefix}</span>
            <span className="text-ember">{profile.shortName}</span>
          </motion.div>

          {/* Stacked Condensed Display Headline */}
          <motion.h1
            {...fadeUp(0.12)}
            className="mt-4 font-display text-[2.85rem] sm:text-[3.9rem] lg:text-[5.2rem] font-bold uppercase leading-[0.94] tracking-[-0.02em] text-ink-primary"
          >
            <span className="block">{profile.heroHeadlineLine1}</span>
            <span className="block">{profile.heroHeadlineLine2}</span>
            <span className="block">
              {profile.heroHeadlineLine3Prefix}{" "}
              <span className="text-ember drop-shadow-[0_0_32px_rgba(255,77,0,0.45)]">
                {profile.heroHeadlineHighlight}
              </span>
            </span>
          </motion.h1>

          {/* Value Proposition Copy */}
          <motion.p
            {...fadeUp(0.2)}
            className="mt-5 max-w-[46ch] text-[15px] sm:text-[16px] leading-[1.68] text-ink-secondary"
          >
            {profile.heroDescription}
          </motion.p>

          {/* Signature CTA Group */}
          <motion.div
            {...fadeUp(0.28)}
            className="mt-7 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            {/* Primary Capsule Button with Recessed Dark Orb */}
            <a
              href="#projects"
              className="group inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-5 rounded-full bg-ember pl-7 pr-2 py-2 font-display text-[17px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_28px_-4px_rgba(255,77,0,0.55)] transition-all duration-200 hover:bg-ember-glow hover:shadow-[0_0_38px_-2px_rgba(255,106,26,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              <span>LIHAT PROYEK</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#090706] text-ink-primary transition-transform duration-200 group-hover:scale-105">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>

            {/* Secondary Circular Icon Ring CTA */}
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full py-1.5 pr-3 text-ink-primary transition-colors hover:text-ember-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ember/70 bg-ember/10 text-ember transition-all group-hover:border-ember group-hover:bg-ember group-hover:text-white group-hover:shadow-[0_0_20px_-2px_rgba(255,77,0,0.6)]">
                <Play className="h-3.5 w-3.5 fill-current translate-x-[1px]" />
              </span>
              <span className="font-display text-sm font-semibold uppercase tracking-[0.12em]">
                HUBUNGI SAYA
              </span>
            </a>
          </motion.div>

          {/* Mini Stats Strip */}
          <motion.div
            {...fadeUp(0.36)}
            className="mt-9 flex flex-wrap items-center gap-7 sm:gap-10"
          >
            <div className="flex flex-col">
              <FolderGit2 className="mb-1.5 hidden sm:block h-4 w-4 text-ink-muted" />
              <span className="font-display text-2xl sm:text-[28px] font-bold leading-none text-ink-primary">
                {projectCount}+
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                PROYEK SELESAI
              </span>
            </div>

            <div className="flex flex-col">
              <Cpu className="mb-1.5 hidden sm:block h-4 w-4 text-ink-muted" />
              <span className="font-display text-2xl sm:text-[28px] font-bold leading-none text-ink-primary">
                {skillCount}+
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                TECH STACK
              </span>
            </div>

            <div className="flex flex-col">
              <GraduationCap className="mb-1.5 hidden sm:block h-4 w-4 text-ember" />
              <span className="font-display text-2xl sm:text-[28px] font-bold leading-none text-ember">
                {profile.semesterShort}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                MAHASISWA IT
              </span>
            </div>
          </motion.div>

          {/* Bottom Quick Tech & Social Row */}
          <motion.div {...fadeUp(0.44)} className="mt-8 hidden sm:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              TEKNOLOGI UTAMA &amp; TAUTAN
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
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
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/60 hover:text-ember hover:shadow-[0_0_16px_-4px_rgba(255,77,0,0.45)] ${
                    "accent" in badge && badge.accent
                      ? "border-ember/50 bg-ember/15 text-ember"
                      : "border-white/10 bg-surface/80 text-ink-secondary"
                  }`}
                >
                  {badge.code}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Right Vertical Micro-Rail & Scroll Cue */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:flex fixed-none absolute right-6 top-28 bottom-10 z-30 flex-col items-center justify-between"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="h-3 w-3 rounded-full bg-ember shadow-[0_0_24px_6px_rgba(255,77,0,0.75)]" />
          <span className="vertical-text font-mono text-[10px] tracking-[0.34em] text-ink-muted uppercase">
            INTERACTIVE 3D PORTFOLIO
          </span>
          <span className="h-2 w-2 rounded-full bg-amber/80 shadow-[0_0_14px_3px_rgba(255,162,58,0.65)]" />
        </div>

        <div className="text-right pr-2">
          <p className="font-display text-[11px] uppercase leading-tight tracking-[0.14em] text-ink-muted">
            BUILDING
            <br />
            IMPACT THROUGH
            <br />
            <span className="text-ink-secondary">CODE &amp; 3D</span>
          </p>
        </div>
      </div>

      {/* Interactive Scroll Down Indicator */}
      <a
        href="#about"
        aria-label="Gulir ke Tentang Saya"
        className="group absolute bottom-5 left-1/2 z-30 hidden md:flex -translate-x-1/2 flex-col items-center gap-2 text-ink-muted hover:text-ember transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
          GULIR
        </span>
        <span className="relative h-7 w-[1px] overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-3 bg-ember shadow-[0_0_8px_#FF4D00] animate-bounce" />
        </span>
      </a>
    </section>
  );
}
