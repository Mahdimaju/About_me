"use client";

import { motion } from "motion/react";
import {
  Activity,
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
  Terminal,
  Triangle,
  Waves,
} from "lucide-react";
import { skillCategories } from "@/data/skills";
import type { SkillLevel } from "@/lib/types";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

const LEVEL_SEGMENTS: Record<SkillLevel, number> = {
  Dasar: 1,
  Menengah: 2,
  Mahir: 3,
};

function SkillIcon({ name }: { name: string }) {
  const cls =
    "h-4 w-4 text-ink-secondary group-hover/chip:text-amber transition-colors";
  switch (name) {
    case "nextjs":
      return <Globe aria-hidden="true" className={cls} />;
    case "react":
      return <Cpu aria-hidden="true" className={cls} />;
    case "ts":
      return <Braces aria-hidden="true" className={cls} />;
    case "tailwind":
      return <Palette aria-hidden="true" className={cls} />;
    case "html":
      return <FileCode2 aria-hidden="true" className={cls} />;
    case "three":
    case "r3f":
      return <Box aria-hidden="true" className={cls} />;
    case "glsl":
      return <Waves aria-hidden="true" className={cls} />;
    case "motion":
      return <Activity aria-hidden="true" className={cls} />;
    case "node":
      return <Server aria-hidden="true" className={cls} />;
    case "api":
      return <Layers aria-hidden="true" className={cls} />;
    case "db":
    case "prisma":
      return <Database aria-hidden="true" className={cls} />;
    case "git":
      return <GitBranch aria-hidden="true" className={cls} />;
    case "figma":
      return <PenTool aria-hidden="true" className={cls} />;
    case "vercel":
      return <Triangle aria-hidden="true" className={cls} />;
    case "terminal":
      return <Terminal aria-hidden="true" className={cls} />;
    default:
      return <Code2 aria-hidden="true" className={cls} />;
  }
}

export function SkillsSection() {
  const reducedMotion = usePrefersReducedMotion();

  const revealProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="skills"
      className="relative border-y border-white/[0.07] bg-[#080706] py-16 md:py-24 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header + Legend */}
        <motion.div
          {...revealProps}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/[0.08]"
        >
          <div>
            <p className="font-serif text-sm font-semibold uppercase tracking-[0.14em] text-ember">
              03 / KEAHLIAN
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.01em] text-ink-primary">
              TECH STACK &amp; ARSENAL
            </h2>
          </div>

          {/* Crisp matte proficiency legend (square bars, not pills) */}
          <div className="inline-flex flex-wrap items-center gap-4 self-start sm:self-auto rounded-lg border border-white/[0.08] bg-surface px-3.5 py-2 font-mono text-[11px] text-ink-secondary">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="h-1.5 w-2.5 rounded-[2px] bg-ember" />
                <span className="h-1.5 w-2.5 rounded-[2px] bg-ember" />
                <span className="h-1.5 w-2.5 rounded-[2px] bg-ember" />
              </span>
              Mahir
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="h-1.5 w-2.5 rounded-[2px] bg-ember" />
                <span className="h-1.5 w-2.5 rounded-[2px] bg-ember" />
                <span className="h-1.5 w-2.5 rounded-[2px] bg-white/15" />
              </span>
              Menengah
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="h-1.5 w-2.5 rounded-[2px] bg-ember" />
                <span className="h-1.5 w-2.5 rounded-[2px] bg-white/15" />
                <span className="h-1.5 w-2.5 rounded-[2px] bg-white/15" />
              </span>
              Dasar
            </span>
          </div>
        </motion.div>

        {/* Architectural Horizontal Specification Matrix (breaks uniform boxed-card grid) */}
        <div className="divide-y divide-white/[0.07]">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              {...(reducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.15 },
                    transition: {
                      duration: 0.45,
                      delay: idx * 0.06,
                      ease: [0.22, 1, 0.36, 1] as const,
                    },
                  })}
              className="py-7 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 lg:gap-10 items-start"
            >
              {/* Left Category Index & Title */}
              <div className="flex items-baseline justify-between lg:flex-col lg:justify-start gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-ember">
                    {category.index}
                  </span>
                  <h3 className="font-display text-xl font-semibold uppercase tracking-[0.03em] text-ink-primary">
                    {category.name}
                  </h3>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted lg:pl-7">
                  {category.items.length} teknologi
                </span>
              </div>

              {/* Right Skill Items */}
              <div className="flex flex-wrap gap-2.5">
                {category.items.map((skill) => {
                  const filled = LEVEL_SEGMENTS[skill.level];
                  return (
                    <div
                      key={skill.name}
                      title={`${skill.name}: ${skill.level}`}
                      className="group/chip flex items-center gap-3 rounded-lg border border-white/[0.08] bg-surface px-3.5 py-2.5 transition-colors hover:border-ember/45 hover:bg-elevated"
                    >
                      <SkillIcon name={skill.icon} />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-ink-primary leading-tight">
                          {skill.name}
                        </span>
                        <div className="mt-1.5 flex items-center gap-1">
                          {[1, 2, 3].map((seg) => (
                            <span
                              key={seg}
                              aria-hidden="true"
                              className={`h-1 w-3 rounded-[2px] ${
                                seg <= filled ? "bg-ember" : "bg-white/12"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
