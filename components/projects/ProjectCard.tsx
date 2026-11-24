"use client";

import { useState } from "react";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { WaterRippleCanvas } from "@/components/canvas/WaterRippleCanvas";
import { TiltSpotlightCard } from "@/components/ui/TiltSpotlightCard";

const FALLBACK_THUMB = "/images/projects/solar-eclipse-3d.png";

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  previewMode?: boolean;
  featuredWide?: boolean;
  onSelect?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({
  project,
  isAdmin = false,
  previewMode = false,
  featuredWide = false,
  onSelect,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [imgErrorSrc, setImgErrorSrc] = useState<string | null>(null);
  const resolvedThumb =
    project.thumbnailUrl && imgErrorSrc !== project.thumbnailUrl
      ? project.thumbnailUrl
      : FALLBACK_THUMB;

  const visibleTech = project.techStack.slice(0, featuredWide ? 6 : 4);
  const extraCount = Math.max(0, project.techStack.length - visibleTech.length);

  return (
    <TiltSpotlightCard
      maxTilt={previewMode ? 0 : 4}
      enableTilt={!previewMode}
      className={`group flex h-full flex-col rounded-xl border bg-surface transition-colors duration-200 ${
        featuredWide ? "lg:grid lg:grid-cols-[1.15fr_1fr]" : ""
      } ${
        project.featured
          ? "border-ember/45 hover:border-ember"
          : "border-white/[0.09] hover:border-ember/45"
      }`}
    >
      {/* Thumbnail Area (16:10) with Interactive Water Ripple on Hover */}
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden bg-void ${
          featuredWide
            ? "lg:aspect-auto lg:h-full lg:border-r lg:border-b-0 border-b border-white/[0.07]"
            : "border-b border-white/[0.07]"
        }`}
      >
        {previewMode ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedThumb}
            alt={project.title || "Pratinjau thumbnail proyek"}
            width={800}
            height={500}
            onError={() => setImgErrorSrc(project.thumbnailUrl)}
            className="h-full w-full object-cover"
          />
        ) : (
          <WaterRippleCanvas
            imageSrc={resolvedThumb}
            alt={project.title}
            width={800}
            height={500}
            activateOnHover
            displacement={0.95}
            causticIntensity={0.24}
            className="h-full w-full"
            imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}

        {/* Top-left Category & Featured Tags (matte solid, no blur/pill spam) */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md border border-white/15 bg-void/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-primary">
            {project.category}
          </span>
          {project.featured && (
            <span className="rounded-md border border-amber/50 bg-[#1B1108]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-amber">
              UNGGULAN
            </span>
          )}
        </div>

        {/* Top-right Admin Edit/Delete Controls (native buttons, matte solid) */}
        {isAdmin && !previewMode && (
          <div className="absolute right-3 top-3 z-30 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit?.(project)}
              aria-label={`Edit proyek ${project.title}`}
              title="Edit proyek"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-void/95 text-ink-secondary transition-colors hover:border-ember hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(project)}
              aria-label={`Hapus proyek ${project.title}`}
              title="Hapus proyek"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-void/95 text-ink-secondary transition-colors hover:border-[#EF4444] hover:text-[#EF4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]"
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={`flex flex-1 flex-col ${featuredWide ? "p-6 lg:p-7" : "p-5"}`}>
        {previewMode ? (
          <h3 className="font-display text-[22px] font-semibold uppercase leading-tight tracking-[0.02em] text-ink-primary">
            {project.title || "Judul Proyek Baru"}
          </h3>
        ) : (
          <button
            type="button"
            onClick={() => onSelect?.(project)}
            className="text-left rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            <h3
              className={`font-display font-semibold uppercase leading-tight tracking-[0.02em] text-ink-primary transition-colors group-hover:text-ember-glow ${
                featuredWide ? "text-2xl sm:text-[28px]" : "text-[22px]"
              }`}
            >
              {project.title}
            </h3>
          </button>
        )}

        <p
          className={`mt-2.5 text-[13.5px] leading-[1.64] text-ink-secondary ${
            featuredWide ? "line-clamp-3 sm:text-sm" : "line-clamp-2"
          }`}
        >
          {project.summary ||
            "Ringkasan singkat proyek Anda akan tampil langsung di sini."}
        </p>

        {/* Tech Stack Tags (matte rounded-md) */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTech.length > 0 ? (
            visibleTech.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/[0.08] bg-elevated px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="rounded-md border border-white/[0.08] bg-elevated px-2.5 py-0.5 font-mono text-[11px] text-ink-muted">
              Next.js
            </span>
          )}
          {extraCount > 0 && (
            <span className="rounded-md border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[11px] text-ember-glow">
              +{extraCount}
            </span>
          )}
        </div>

        {/* Footer Actions (native links & button) */}
        <div className="mt-auto pt-4 border-t border-white/[0.07] flex items-center justify-between gap-2 text-xs font-medium">
          <div className="flex items-center gap-3.5">
            {project.liveUrl ? (
              <a
                href={previewMode ? undefined : project.liveUrl}
                target={previewMode ? undefined : "_blank"}
                rel={previewMode ? undefined : "noopener noreferrer"}
                className="inline-flex items-center gap-1 text-ember hover:text-amber transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm"
              >
                <span>Live Demo</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-ink-muted">Demo lokal</span>
            )}

            {project.githubUrl && (
              <a
                href={previewMode ? undefined : project.githubUrl}
                target={previewMode ? undefined : "_blank"}
                rel={previewMode ? undefined : "noopener noreferrer"}
                className="text-ink-secondary hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm"
              >
                GitHub
              </a>
            )}
          </div>

          <button
            type="button"
            disabled={previewMode}
            onClick={!previewMode && onSelect ? () => onSelect(project) : undefined}
            className="rounded-md px-2 py-1 text-ink-primary hover:text-ember-glow transition-colors disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </TiltSpotlightCard>
  );
}
