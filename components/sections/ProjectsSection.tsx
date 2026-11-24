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

  const showFlagshipLayout =
    activeFilter === "Semua" &&
    filteredProjects.length > 1 &&
    filteredProjects[0]?.featured;

  return (
    <section
      id="projects"
      className="relative pt-24 pb-20 md:pt-32 md:pb-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header Row + Admin Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="font-serif text-sm font-semibold uppercase tracking-[0.14em] text-ember">
              04 / PROYEK UNGGULAN
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.01em] text-ink-primary">
              KARYA &amp; EKSPERIMEN
            </h2>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-md border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#22C55E]">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[#22C55E]"
                />
                ADMIN AKTIF
              </span>

              <button
                type="button"
                onClick={onAddProject}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-ember px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-ember-glow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                <span>TAMBAH PROYEK</span>
              </button>

              <button
                type="button"
                onClick={onLogoutAdmin}
                title="Keluar dari Mode Admin"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/12 bg-surface px-3.5 py-2 font-mono text-[11px] text-ink-secondary transition-colors hover:border-[#EF4444]/60 hover:text-[#EF4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Tabs (rounded-lg, matte, no glow) */}
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
                className={`relative min-h-[40px] rounded-lg px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${active
                    ? "text-white"
                    : "border border-white/10 bg-surface text-ink-secondary hover:border-ember/45 hover:text-ink-primary"
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeProjectFilter"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-0 rounded-lg bg-ember"
                  />
                )}
                <span className="relative z-10">
                  {category === "Semua" ? `Semua (${count})` : category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid with Flagship Content Hierarchy (R-14) or Empty State (R-27) */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout={!reducedMotion}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const isWide = Boolean(showFlagshipLayout && index === 0);
                return (
                  <motion.div
                    key={project.id}
                    layout={!reducedMotion}
                    initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${isWide ? "md:col-span-2 lg:col-span-2" : ""}`}
                  >
                    <ProjectCard
                      project={project}
                      isAdmin={isAdmin}
                      featuredWide={isWide}
                      onSelect={onSelectProject}
                      onEdit={onEditProject}
                      onDelete={onDeleteProject}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-10 rounded-xl border border-white/[0.09] bg-surface px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-elevated text-ink-muted">
              <FolderOpen aria-hidden="true" className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-ink-primary">
              {projects.length === 0
                ? "Belum Ada Proyek Tersimpan"
                : `Kategori "${activeFilter}" Masih Kosong`}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-secondary">
              {projects.length === 0
                ? "Daftar proyek masih kosong. Masuk ke Mode Admin (Ctrl+Shift+A) untuk menambahkan karya pertama Anda."
                : `Tidak ada proyek yang cocok dengan filter "${activeFilter}". Kembalikan ke semua kategori untuk melihat seluruh karya.`}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {activeFilter !== "Semua" && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("Semua")}
                  className="min-h-[44px] rounded-lg border border-white/15 bg-elevated px-5 py-2.5 text-xs font-semibold text-ink-primary hover:border-ember/50 transition-colors"
                >
                  Tampilkan Semua Proyek
                </button>
              )}
              {isAdmin && (
                <button
                  type="button"
                  onClick={onAddProject}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ember px-5 py-2.5 text-xs font-semibold text-white hover:bg-ember-glow transition-colors"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
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
