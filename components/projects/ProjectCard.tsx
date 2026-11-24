"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Pencil, Star, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { WaterRippleCanvas } from "@/components/canvas/WaterRippleCanvas";
import { TiltSpotlightCard } from "@/components/ui/TiltSpotlightCard";

const FALLBACK_THUMB = "/images/projects/solar-eclipse-3d.png";

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  previewMode?: boolean;
  onSelect?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({
  project,
  isAdmin = false,
  previewMode = false,
  onSelect,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [imgErrorSrc, setImgErrorSrc] = useState<string | null>(null);
  const resolvedThumb =
    project.thumbnailUrl && imgErrorSrc !== project.thumbnailUrl
      ? project.thumbnailUrl
      : FALLBACK_THUMB;

  const visibleTech = project.techStack.slice(0, 4);
  const extraCount = Math.max(0, project.techStack.length - visibleTech.length);

  return (
    <TiltSpotlightCard
      maxTilt={previewMode ? 0 : 5}
      enableTilt={!previewMode}
      onClick={!previewMode && onSelect ? () => onSelect(project) : undefined}
      className={`group flex h-full flex-col rounded-2xl border bg-surface transition-all duration-300 ${
        previewMode ? "" : "cursor-pointer"
      } ${
        project.featured
          ? "border-ember/45 shadow-[0_0_32px_-14px_rgba(255,77,0,0.45)] hover:border-ember"
          : "border-white/[0.08] hover:border-ember/45"
      }`}
    >
      {/* Thumbnail Area (16:10) with Interactive Water Ripple on Hover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-void border-b border-white/[0.06]">
        {previewMode ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedThumb}
            alt={project.title || "Pratinjau thumbnail proyek"}
            onError={() => setImgErrorSrc(project.thumbnailUrl)}
            className="h-full w-full object-cover"
          />
        ) : (
          <WaterRippleCanvas
            imageSrc={resolvedThumb}
            alt={project.title}
            activateOnHover
            displacement={0.95}
            causticIntensity={0.26}
            className="h-full w-full"
            imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}

        {/* Top-left Category & Featured Badges */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/15 bg-void/80 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-primary">
            {project.category}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber/50 bg-[#1B1108]/85 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-amber">
              <Star className="h-2.5 w-2.5 fill-amber" />
              UNGGULAN
            </span>
          )}
        </div>

        {/* Top-right Admin Edit/Delete Controls */}
        {isAdmin && !previewMode && (
          <div
            className="absolute right-3 top-3 z-30 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onEdit?.(project)}
              aria-label={`Edit proyek ${project.title}`}
              title="Edit proyek"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-void/85 backdrop-blur-md text-ink-secondary transition-colors hover:border-ember hover:bg-ember/20 hover:text-ink-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(project)}
              aria-label={`Hapus proyek ${project.title}`}
              title="Hapus proyek"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-void/85 backdrop-blur-md text-ink-secondary transition-colors hover:border-[#EF4444] hover:bg-[#EF4444]/20 hover:text-[#EF4444]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[22px] font-semibold uppercase leading-tight tracking-[0.02em] text-ink-primary transition-colors group-hover:text-ember-glow">
          {project.title || "Judul Proyek Baru"}
        </h3>

        <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.6] text-ink-secondary">
          {project.summary ||
            "Ringkasan singkat proyek Anda akan tampil langsung di sini."}
        </p>

        {/* Tech Stack Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTech.length > 0 ? (
            visibleTech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/[0.08] bg-elevated px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-white/[0.08] bg-elevated px-2.5 py-0.5 font-mono text-[11px] text-ink-muted">
              Next.js
            </span>
          )}
          {extraCount > 0 && (
            <span className="rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[11px] text-ember-glow">
              +{extraCount}
            </span>
          )}
        </div>

        {/* Footer Links */}
        <div
          className="mt-auto pt-4 border-t border-white/[0.07] flex items-center justify-between gap-2 text-xs font-medium"
          onClick={(e) => {
            if (!previewMode) e.stopPropagation();
          }}
        >
          <div className="flex items-center gap-3">
            {project.liveUrl ? (
              <a
                href={previewMode ? undefined : project.liveUrl}
                target={previewMode ? undefined : "_blank"}
                rel={previewMode ? undefined : "noopener noreferrer"}
                className="inline-flex items-center gap-1 text-ember hover:text-amber transition-colors"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-ink-muted">No Demo</span>
            )}

            {project.githubUrl && (
              <a
                href={previewMode ? undefined : project.githubUrl}
                target={previewMode ? undefined : "_blank"}
                rel={previewMode ? undefined : "noopener noreferrer"}
                className="text-ink-secondary hover:text-ink-primary transition-colors"
              >
                GitHub
              </a>
            )}
          </div>

          <button
            type="button"
            disabled={previewMode}
            onClick={!previewMode && onSelect ? () => onSelect(project) : undefined}
            className="inline-flex items-center gap-1 text-ink-primary hover:text-ember-glow transition-colors disabled:pointer-events-none"
          >
            <span>Detail</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </TiltSpotlightCard>
  );
}
