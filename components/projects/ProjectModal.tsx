"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Code2, X } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function formatMonthYear(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    })
      .format(new Date(iso))
      .toUpperCase();
  } catch {
    return "2026";
  }
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        /* Glass Dose #2: modal backdrop separates active dialog from underlying page */
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/85 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-[820px] overflow-hidden rounded-2xl border border-white/12 bg-surface shadow-2xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail proyek"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-void/95 text-ink-secondary transition-colors hover:border-ember hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>

            {/* 16:9 Hero Thumbnail */}
            <div className="relative aspect-[16/9] max-h-[340px] w-full overflow-hidden bg-void">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                width={800}
                height={450}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface via-surface/40 to-transparent"
              />
            </div>

            {/* Content Body */}
            <div className="px-6 pb-7 pt-2 sm:px-8 sm:pb-8">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                <span className="text-ember">{project.category}</span>
                {project.featured && (
                  <>
                    <span className="text-ink-muted">&middot;</span>
                    <span className="text-amber">PROYEK UNGGULAN</span>
                  </>
                )}
                <span className="text-ink-muted">&middot;</span>
                <span className="text-ink-muted">
                  {formatMonthYear(project.createdAt)}
                </span>
              </div>

              <h3
                id="project-modal-title"
                className="mt-2.5 font-display text-3xl sm:text-4xl font-bold uppercase tracking-[-0.01em] text-ink-primary"
              >
                {project.title}
              </h3>

              <p className="mt-4 text-[15px] leading-[1.72] text-ink-secondary whitespace-pre-line">
                {project.description || project.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/10 bg-elevated px-3 py-1 font-mono text-xs text-ink-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 pt-5 border-t border-white/[0.08]">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-ember px-6 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-ember-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    <span>BUKA LIVE DEMO</span>
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-elevated px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink-primary transition-colors hover:border-ember/60 hover:text-ember-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                  >
                    <Code2 aria-hidden="true" className="h-4 w-4" />
                    <span>LIHAT KODE DI GITHUB</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
