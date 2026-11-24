"use client";

import { motion } from "motion/react";
import {
  Box,
  Braces,
  Code2,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Layers,
  Palette,
  PenTool,
  Server,
  Sparkles,
  Terminal,
  Triangle,
  Waves,
} from "lucide-react";
import { skillCategories } from "@/data/skills";
import type { SkillLevel } from "@/lib/types";
import { TiltSpotlightCard } from "@/components/ui/TiltSpotlightCard";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

const LEVEL_SEGMENTS: Record<SkillLevel, number> = {
  Dasar: 1,
  Menengah: 2,
  Mahir: 3,
};

function SkillIcon({ name }: { name: string }) {
  const cls = "h-4 w-4 text-ink-secondary group-hover/chip:text-amber transition-colors";
  switch (name) {
    case "nextjs":
      return <Globe className={cls} />;
    case "react":
      return <Cpu className={cls} />;
    case "ts":
      return <Braces className={cls} />;
    case "tailwind":
      return <Palette className={cls} />;
    case "html":
      return <FileCode2 className={cls} />;
    case "three":
    case "r3f":
      return <Box className={cls} />;
    case "glsl":
      return <Waves className={cls} />;
    case "motion":
      return <Sparkles className={cls} />;
    case "node":
      return <Server className={cls} />;
    case "api":
      return <Layers className={cls} />;
    case "db":
    case "prisma":
      return <Database className={cls} />;
    case "git":
      return <GitBranch className={cls} />;
    case "figma":
      return <PenTool className={cls} />;
    case "vercel":
      return <Triangle className={cls} />;
    case "terminal":
      return <Terminal className={cls} />;
    default:
      return <Code2 className={cls} />;
  }
}

export function SkillsSection() {
  const reducedMotion = usePrefersReducedMotion();

  const revealProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="skills"
      className="relative py-20 md:py-28 lg:py-32 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header + Legend */}
        <motion.div
          {...revealProps}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <p className="font-serif text-sm font-semibold uppercase tracking-[0.18em] text-ember">
              03 / KEAHLIAN
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.01em] text-ink-primary">
              TECH STACK &amp; ARSENAL
            </h2>
          </div>

          {/* Proficiency Legend */}
          <div className="inline-flex items-center gap-4 self-start sm:self-auto rounded-full border border-white/[0.08] bg-surface px-4 py-2 font-mono text-[11px] text-ink-secondary">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              </span>
              Mahir
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              </span>
              Menengah
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              </span>
              Dasar
            </span>
          </div>
        </motion.div>

        {/* 2x2 Category Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              {...(reducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 24 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.15 },
                    transition: {
                      duration: 0.55,
                      delay: idx * 0.08,
                      ease: [0.22, 1, 0.36, 1] as const,
                    },
                  })}
            >
              <TiltSpotlightCard
                maxTilt={3}
                className="h-full rounded-2xl border border-white/[0.08] bg-surface p-6 hover:border-ember/40"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between gap-3 pb-5 border-b border-white/[0.07]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-ember">
                      {category.index}
                    </span>
                    <h3 className="font-display text-xl font-semibold uppercase tracking-[0.04em] text-ink-primary">
                      {category.name}
                    </h3>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    {category.items.length} TECH
                  </span>
                </div>

                {/* Skill Chips */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {category.items.map((skill) => {
                    const filled = LEVEL_SEGMENTS[skill.level];
                    return (
                      <div
                        key={skill.name}
                        title={`${skill.name} — Tingkat: ${skill.level}`}
                        className="group/chip flex items-center gap-3 rounded-xl border border-white/[0.08] bg-elevated px-3.5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/50 hover:shadow-[0_8px_24px_-10px_rgba(255,77,0,0.35)]"
                      >
                        <SkillIcon name={skill.icon} />
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-ink-primary leading-tight">
                            {skill.name}
                          </span>
                          <div className="mt-1 flex items-center gap-1">
                            {[1, 2, 3].map((seg) => (
                              <span
                                key={seg}
                                className={`h-1 w-3.5 rounded-full transition-colors ${
                                  seg <= filled
                                    ? "bg-ember shadow-[0_0_8px_rgba(255,77,0,0.5)]"
                                    : "bg-white/12"
                                }`}
                              />
                            ))}
                            <span className="ml-1 font-mono text-[10px] text-ink-muted">
                              {skill.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TiltSpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
