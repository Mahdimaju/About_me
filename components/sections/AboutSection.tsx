"use client";

import { motion } from "motion/react";
import { ArrowRight, GraduationCap, Layers } from "lucide-react";
import { profile } from "@/data/profile";
import { WaterRippleCanvas } from "@/components/canvas/WaterRippleCanvas";
import { TiltSpotlightCard } from "@/components/ui/TiltSpotlightCard";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

export function AboutSection() {
  const reducedMotion = usePrefersReducedMotion();

  const revealProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 lg:py-32 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div {...revealProps}>
          <p className="font-serif text-sm font-semibold uppercase tracking-[0.18em] text-ember">
            02 / TENTANG SAYA
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.01em] text-ink-primary">
            MENGENAL LEBIH DEKAT
          </h2>
        </motion.div>

        {/* 12-Column Asymmetric Split */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left 5 cols: Interactive Portrait with Water Ripple & Eclipse Arc */}
          <motion.div {...revealProps} className="lg:col-span-5 relative">
            {/* Subtle glowing Solar Eclipse arc peeking from top-right corner */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-5 -right-5 h-44 w-44 rounded-full border border-ember/55 shadow-[0_0_40px_-8px_rgba(255,77,0,0.45)] opacity-80"
            />

            <TiltSpotlightCard
              maxTilt={4.5}
              className="relative rounded-2xl border border-white/10 bg-surface shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <WaterRippleCanvas
                  imageSrc={profile.aboutImage}
                  alt="Foto profil Mahdi, Mahasiswa S1 Teknologi Informasi"
                  focalPoint={[0.5, 0.25]}
                  displacement={0.95}
                  causticIntensity={0.22}
                  activateOnHover
                  className="h-full w-full"
                />

                {/* Subtle bottom gradient for floating badge legibility */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-void/85 via-void/30 to-transparent"
                />

                {/* Floating Glass Pill Badge */}
                <div className="absolute left-4 bottom-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/12 bg-surface/85 backdrop-blur-md px-3.5 py-1.5">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-ember shadow-[0_0_10px_#FF4D00]"
                  />
                  <span className="font-mono text-[11px] text-ink-primary">
                    Mahasiswa IT &bull; {profile.semester}
                  </span>
                </div>
              </div>
            </TiltSpotlightCard>
          </motion.div>

          {/* Right 7 cols: Narrative + Bento Highlight Cards */}
          <motion.div
            {...revealProps}
            className="lg:col-span-7 flex flex-col justify-between gap-6"
          >
            {/* Editorial Quote */}
            <blockquote className="font-serif text-2xl sm:text-[26px] font-medium leading-[1.35] text-ink-primary">
              &ldquo;{profile.aboutQuote}&rdquo;
            </blockquote>

            {/* Bio Paragraphs */}
            <div className="space-y-4 text-[15px] leading-[1.72] text-ink-secondary">
              {profile.aboutParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Bento Highlight Cards */}
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Fokus Bidang */}
              <TiltSpotlightCard
                maxTilt={4}
                className="rounded-2xl border border-white/[0.08] bg-surface p-5 hover:border-ember/40"
              >
                <div className="flex items-center gap-2 text-ember">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 border border-ember/30">
                    <Layers className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ember">
                    FOKUS BIDANG
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-[0.02em] text-ink-primary">
                  {profile.focusArea}
                </h3>
                <p className="mt-1.5 text-xs text-ink-muted">
                  {profile.focusTools}
                </p>
              </TiltSpotlightCard>

              {/* Card 2: Pendidikan */}
              <TiltSpotlightCard
                maxTilt={4}
                className="rounded-2xl border border-white/[0.08] bg-surface p-5 hover:border-ember/40"
              >
                <div className="flex items-center gap-2 text-amber">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber/12 border border-amber/30">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber">
                    PENDIDIKAN SAAT INI
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-[0.02em] text-ink-primary">
                  {profile.university}
                </h3>
                <p className="mt-1.5 text-xs text-ink-muted">
                  {profile.educationSub}
                </p>
              </TiltSpotlightCard>

              {/* Card 3: Availability Full-Width */}
              <TiltSpotlightCard
                maxTilt={2.5}
                className="sm:col-span-2 rounded-2xl border border-ember/30 bg-surface p-5 hover:border-ember/60"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-70" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#22C55E]">
                        STATUS KETERSEDIAAN &bull; AKTIF
                      </span>
                    </div>
                    <p className="mt-2 text-sm sm:text-[15px] font-medium text-ink-primary">
                      {profile.availability}
                    </p>
                  </div>

                  <a
                    href="#contact"
                    className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-ember/50 bg-ember/12 px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.1em] text-ember-glow transition-all hover:bg-ember hover:text-white"
                  >
                    <span>AJAK KOLABORASI</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </TiltSpotlightCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
