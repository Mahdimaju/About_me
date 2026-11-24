"use client";

import { motion } from "motion/react";
import { profile } from "@/data/profile";
import { WaterRippleCanvas } from "@/components/canvas/WaterRippleCanvas";
import { TiltSpotlightCard } from "@/components/ui/TiltSpotlightCard";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

export function AboutSection() {
  const reducedMotion = usePrefersReducedMotion();

  const revealProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="about"
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div {...revealProps}>
          <p className="font-serif text-sm font-semibold uppercase tracking-[0.14em] text-ember">
            02 / TENTANG SAYA
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.01em] text-ink-primary">
            MENGENAL LEBIH DEKAT
          </h2>
        </motion.div>

        {/* 12-Column Editorial Spread (Portrait Left + Typographic Specification Ledger Right) */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left 5 cols: Interactive Portrait with subtle matte Eclipse arc motif */}
          <motion.div {...revealProps} className="lg:col-span-5 relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 -right-4 h-40 w-40 rounded-full border border-ember/35"
            />

            <TiltSpotlightCard
              maxTilt={4}
              className="relative rounded-2xl border border-white/10 bg-surface"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <WaterRippleCanvas
                  imageSrc={profile.aboutImage}
                  alt="Foto profil Mahdi, Mahasiswa S1 Teknologi Informasi"
                  width={800}
                  height={1000}
                  focalPoint={[0.5, 0.25]}
                  displacement={0.95}
                  causticIntensity={0.22}
                  activateOnHover
                  className="h-full w-full"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void/90 via-void/30 to-transparent"
                />

                {/* Matte solid caption tag (no blur, no decorative dot) */}
                <div className="absolute left-4 bottom-4 z-20 rounded-md border border-white/12 bg-void/95 px-3 py-1.5">
                  <span className="font-mono text-[11px] text-ink-primary">
                    Mahasiswa IT &middot; {profile.semester}
                  </span>
                </div>
              </div>
            </TiltSpotlightCard>
          </motion.div>

          {/* Right 7 cols: Editorial Quote, Bio & Clean Hairline Specification Ledger (replaces Bento Grid) */}
          <motion.div
            {...revealProps}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <blockquote className="font-serif text-2xl sm:text-[28px] font-medium leading-[1.34] text-ink-primary">
              &ldquo;{profile.aboutQuote}&rdquo;
            </blockquote>

            <div className="space-y-4 text-[15px] leading-[1.74] text-ink-secondary">
              {profile.aboutParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Architectural Specification Rows (RHYTHM 3 variation vs card grids) */}
            <dl className="mt-4 border-t border-white/[0.09] divide-y divide-white/[0.09]">
              <div className="py-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1.5 sm:gap-6 items-baseline">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                  FOKUS BIDANG
                </dt>
                <dd>
                  <p className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-ink-primary">
                    {profile.focusArea}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-secondary">
                    {profile.focusTools}
                  </p>
                </dd>
              </div>

              <div className="py-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1.5 sm:gap-6 items-baseline">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                  PENDIDIKAN SAAT INI
                </dt>
                <dd>
                  <p className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-ink-primary">
                    {profile.university}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-secondary">
                    {profile.educationSub}
                  </p>
                </dd>
              </div>

              <div className="py-5 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 items-center">
                <dt className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#22C55E]">
                  {/* Single calm matte dot marking real availability state (no glow, no pulse) */}
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[#22C55E]"
                  />
                  <span>TERSEDIA</span>
                </dt>
                <dd className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm font-medium text-ink-primary">
                    {profile.availability}
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-lg border border-ember/55 bg-ember/12 px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink-primary transition-colors hover:bg-ember hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                  >
                    Ajak Kolaborasi
                  </a>
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
