"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FolderOpen, LogOut, Plus } from "lucide-react";
import { PROJECT_CATEGORIES, type Project } from "@/lib/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

const FILTER_OPTIONS = ["Semua", ...PROJECT_CATEGORIES] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

interface ProjectsSectionProps {
  projects: Project[];
  isAdmin: boolean;
  onSelectProject: (project: Project) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onLogoutAdmin: () => void;
}

export function ProjectsSection({
  projects,
  isAdmin,
  onSelectProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onLogoutAdmin,
}: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Semua");
  const reducedMotion = usePrefersReducedMotion();

  const filteredProjects = useMemo(() => {
    if (activeFilter === "Semua") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = { Semua: projects.length };
    for (const cat of PROJECT_CATEGORIES) {
      counts[cat] = projects.filter((p) => p.category === cat).length;
    }
    return counts;
  }, [projects]);

  return (
    <section
      id="projects"
      className="relative py-20 md:py-28 lg:py-32 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header Row + Admin Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="font-serif text-sm font-semibold uppercase tracking-[0.18em] text-ember">
              04 / PROYEK UNGGULAN
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.01em] text-ink-primary">
              KARYA &amp; EKSPERIMEN
            </h2>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/35 bg-[#22C55E]/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#22C55E]">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                ADMIN MODE
              </span>

              <button
                type="button"
                onClick={onAddProject}
                className="inline-flex items-center gap-1.5 rounded-full bg-ember px-5 py-2 font-display text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_0_24px_-4px_rgba(255,77,0,0.55)] transition-all hover:bg-ember-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                <Plus className="h-4 w-4" />
                <span>TAMBAH PROYEK</span>
              </button>

              <button
                type="button"
                onClick={onLogoutAdmin}
                title="Keluar dari Mode Admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-surface px-3.5 py-2 font-mono text-[11px] text-ink-secondary transition-colors hover:border-[#EF4444]/60 hover:text-[#EF4444]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter kategori proyek"
          className="mt-7 flex flex-wrap items-center gap-2"
        >
          {FILTER_OPTIONS.map((category) => {
            const active = activeFilter === category;
            const count = countByCategory[category] ?? 0;
            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveFilter(category)}
                className={`relative rounded-full px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                  active
                    ? "text-white"
                    : "border border-white/10 bg-surface text-ink-secondary hover:border-ember/40 hover:text-ink-primary"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeProjectFilter"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-0 -z-0 rounded-full bg-ember shadow-[0_0_20px_-4px_rgba(255,77,0,0.55)]"
                  />
                )}
                <span className="relative z-10">
                  {category === "Semua" ? `Semua (${count})` : category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid or Empty State */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout={!reducedMotion}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout={!reducedMotion}
                  initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <ProjectCard
                    project={project}
                    isAdmin={isAdmin}
                    onSelect={onSelectProject}
                    onEdit={onEditProject}
                    onDelete={onDeleteProject}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-10 rounded-2xl border border-white/[0.08] bg-surface px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-elevated text-ink-muted">
              <FolderOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-ink-primary">
              Belum Ada Proyek di Kategori Ini
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-secondary">
              Belum ditemukan proyek pada filter &ldquo;{activeFilter}&rdquo;.
              Pilih kategori lain atau tambahkan proyek baru dari Mode Admin.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveFilter("Semua")}
                className="rounded-full border border-white/15 bg-elevated px-5 py-2.5 text-xs font-semibold text-ink-primary hover:border-ember/50"
              >
                Tampilkan Semua Proyek
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onAddProject}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ember px-5 py-2.5 text-xs font-semibold text-white hover:bg-ember-glow"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Proyek</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
