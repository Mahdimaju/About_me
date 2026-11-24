"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ImagePlus,
  Link2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import {
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
  type ProjectInput,
} from "@/lib/types";
import { projectInputSchema } from "@/lib/validators";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useToast } from "@/components/ui/ToastProvider";

const PRESET_THUMBNAILS = [
  { label: "Eclipse 3D", url: "/images/projects/solar-eclipse-3d.png" },
  { label: "Dashboard", url: "/images/projects/nebula-campus-analytics.png" },
  { label: "Shader Lab", url: "/images/projects/liquid-obsidian-shader.png" },
  { label: "Design UI", url: "/images/projects/ember-design-system.svg" },
];

interface ProjectFormModalProps {
  open: boolean;
  editingProject: Project | null;
  onClose: () => void;
  onSaved: (project: Project, isEdit: boolean) => void;
}

function ProjectFormDialogContent({
  editingProject,
  onClose,
  onSaved,
}: Omit<ProjectFormModalProps, "open">) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [thumbMode, setThumbMode] = useState<"upload" | "url">(
    editingProject?.thumbnailUrl.startsWith("http") ? "url" : "upload"
  );

  const [title, setTitle] = useState(editingProject?.title ?? "");
  const [category, setCategory] = useState<ProjectCategory>(
    editingProject?.category ?? "3D / Interaktif"
  );
  const [featured, setFeatured] = useState(editingProject?.featured ?? false);
  const [summary, setSummary] = useState(editingProject?.summary ?? "");
  const [description, setDescription] = useState(
    editingProject?.description ?? ""
  );
  const [techStack, setTechStack] = useState<string[]>(
    editingProject?.techStack ?? ["Next.js", "Tailwind CSS"]
  );
  const [techDraft, setTechDraft] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    editingProject?.thumbnailUrl ?? "/images/projects/solar-eclipse-3d.png"
  );
  const [liveUrl, setLiveUrl] = useState(editingProject?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(editingProject?.githubUrl ?? "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const addTechTag = (raw: string) => {
    const clean = raw.trim().replace(/,+$/, "");
    if (!clean) return;
    if (techStack.length >= 12) return;
    if (!techStack.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTechStack((prev) => [...prev, clean]);
    }
    setTechDraft("");
  };

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTechTag(techDraft);
    } else if (e.key === "Backspace" && !techDraft && techStack.length > 0) {
      setTechStack((prev) => prev.slice(0, -1));
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFormError("Format gambar harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Ukuran file melebihi batas maksimal 2 MB.");
      return;
    }

    setUploading(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal mengunggah gambar.");
        return;
      }
      setThumbnailUrl(data.url);
      showToast({
        title: "Thumbnail berhasil diunggah",
        description: "Pratinjau kartu langsung diperbarui.",
        variant: "success",
      });
    } catch {
      setFormError("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
    e.target.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const pendingTech = techDraft.trim()
      ? [...techStack, techDraft.trim()]
      : techStack;

    const payload: ProjectInput = {
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim() || summary.trim(),
      category,
      techStack: pendingTech,
      thumbnailUrl: thumbnailUrl.trim(),
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      featured,
    };

    const parsed = projectInputSchema.safeParse(payload);
    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message || "Periksa kembali isian form."
      );
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      const isEdit = Boolean(editingProject);
      const endpoint = isEdit
        ? `/api/projects/${editingProject!.id}`
        : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || "Gagal menyimpan proyek.";
        setFormError(msg);
        showToast({
          title: `Gagal menyimpan (${res.status})`,
          description: msg,
          variant: "error",
        });
        return;
      }

      onSaved(data.project, isEdit);
      onClose();
      showToast({
        title: isEdit ? "Proyek berhasil diperbarui!" : "Proyek berhasil disimpan!",
        description:
          "Data tersimpan ke projects.json dan langsung tampil di Showcase.",
        variant: "success",
      });
    } catch {
      setFormError("Terjadi kesalahan jaringan saat menyimpan proyek.");
    } finally {
      setSaving(false);
    }
  };

  const previewProject: Project = {
    id: editingProject?.id || "preview-live",
    title: title.trim() || "Judul Proyek Anda",
    summary:
      summary.trim() ||
      "Ringkasan singkat proyek Anda akan tampil secara langsung pada kartu ini.",
    description: description.trim() || summary.trim(),
    category,
    techStack: techStack.length > 0 ? techStack : ["Next.js", "TypeScript"],
    thumbnailUrl: thumbnailUrl.trim() || "/images/projects/solar-eclipse-3d.png",
    liveUrl: liveUrl.trim() || undefined,
    githubUrl: githubUrl.trim() || undefined,
    featured,
    createdAt: editingProject?.createdAt || "2026-11-24T00:00:00.000Z",
    updatedAt: "2026-11-24T00:00:00.000Z",
  };

  const isEdit = Boolean(editingProject);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-form-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[85] flex items-center justify-center bg-void/85 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-surface shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3
              id="project-form-title"
              className="font-display text-xl sm:text-2xl font-bold uppercase tracking-[0.03em] text-ink-primary"
            >
              {isEdit ? "EDIT PROYEK" : "TAMBAH PROYEK BARU"}
            </h3>
            <span className="rounded-md border border-white/12 bg-elevated px-2.5 py-0.5 font-mono text-[10px] text-ink-secondary">
              {isEdit ? "PATCH /api/projects/[id]" : "POST /api/projects"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir proyek"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-ink-secondary hover:border-ember hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden border-b border-white/[0.08] bg-void/60 p-2 gap-2">
          <button
            type="button"
            onClick={() => setMobileTab("form")}
            className={`min-h-[40px] flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
              mobileTab === "form"
                ? "bg-ember text-white"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Edit Form
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`min-h-[40px] flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
              mobileTab === "preview"
                ? "bg-ember text-white"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Pratinjau Kartu
          </button>
        </div>

        {/* Split-Screen Body */}
        <form
          onSubmit={handleSubmit}
          className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[1.28fr_0.92fr] overflow-y-auto lg:overflow-hidden"
        >
          {/* Left Panel: Scrollable Form */}
          <div
            className={`space-y-4 p-6 lg:overflow-y-auto lg:border-r lg:border-white/[0.08] ${
              mobileTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {formError && (
              <div
                role="alert"
                className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-xs text-[#FCA5A5]"
              >
                {formError}
              </div>
            )}

            {/* Judul Proyek */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="proj-title"
                  className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  JUDUL PROYEK <span className="text-ember">*</span>
                </label>
                <span className="font-mono text-[11px] text-ink-muted">
                  {title.length} / 80
                </span>
              </div>
              <input
                id="proj-title"
                type="text"
                maxLength={80}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul proyek Anda"
                className="mt-1.5 w-full rounded-lg border border-white/12 bg-elevated px-3.5 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
              />
            </div>

            {/* Kategori + Featured Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label
                  htmlFor="proj-category"
                  className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  KATEGORI <span className="text-ember">*</span>
                </label>
                <select
                  id="proj-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProjectCategory)
                  }
                  className="mt-1.5 w-full rounded-lg border border-white/12 bg-elevated px-3.5 py-2.5 text-sm text-ink-primary outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-surface">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex h-[42px] items-center justify-between rounded-lg border border-white/12 bg-elevated px-3.5 transition-colors hover:border-ember/45">
                <span className="text-xs font-medium text-amber">
                  Tandai Unggulan (Featured)
                </span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="relative h-5 w-9 rounded-full bg-white/15 transition-colors peer-checked:bg-ember peer-focus-visible:ring-2 peer-focus-visible:ring-ember after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
              </label>
            </div>

            {/* Ringkasan Singkat */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="proj-summary"
                  className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  RINGKASAN SINGKAT <span className="text-ember">*</span>
                </label>
                <span className="font-mono text-[11px] text-ink-muted">
                  {summary.length} / 160
                </span>
              </div>
              <textarea
                id="proj-summary"
                rows={2}
                maxLength={160}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Ringkasan singkat maksimal 2 baris untuk kartu proyek"
                className="mt-1.5 w-full resize-none rounded-lg border border-white/12 bg-elevated px-3.5 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
              />
            </div>

            {/* Deskripsi Lengkap */}
            <div>
              <label
                htmlFor="proj-description"
                className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
              >
                DESKRIPSI LENGKAP (MODAL DETAIL)
              </label>
              <textarea
                id="proj-description"
                rows={3}
                maxLength={2500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan arsitektur, peran Anda, tantangan teknis, dan hasil proyek"
                className="mt-1.5 w-full resize-none rounded-lg border border-white/12 bg-elevated px-3.5 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
              />
            </div>

            {/* Tech Stack Multi-Tag */}
            <div>
              <label
                htmlFor="proj-tech"
                className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
              >
                TECH STACK (TEKAN ENTER UNTUK TAMBAH TAG)
              </label>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-lg border border-white/12 bg-elevated px-3 py-2 focus-within:border-ember focus-within:ring-2 focus-within:ring-ember/25">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md border border-ember/40 bg-ember/12 px-2 py-0.5 font-mono text-[11px] text-ink-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTechStack((prev) => prev.filter((t) => t !== tag))
                      }
                      aria-label={`Hapus ${tag}`}
                      className="text-ink-secondary hover:text-ember"
                    >
                      <X aria-hidden="true" className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  id="proj-tech"
                  type="text"
                  value={techDraft}
                  onChange={(e) => setTechDraft(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  onBlur={() => addTechTag(techDraft)}
                  placeholder="Tambah teknologi..."
                  className="min-w-[120px] flex-1 bg-transparent py-1 text-xs text-ink-primary placeholder:text-ink-muted outline-none"
                />
              </div>
            </div>

            {/* Thumbnail Picker (Native button upload or URL) */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  THUMBNAIL PROYEK (MAKS. 2 MB)
                </span>
                <div className="inline-flex items-center gap-2 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setThumbMode("upload")}
                    className={
                      thumbMode === "upload"
                        ? "text-ember underline underline-offset-4"
                        : "text-ink-muted hover:text-ink-primary"
                    }
                  >
                    Unggah File
                  </button>
                  <span className="text-ink-muted">/</span>
                  <button
                    type="button"
                    onClick={() => setThumbMode("url")}
                    className={
                      thumbMode === "url"
                        ? "text-ember underline underline-offset-4"
                        : "text-ink-muted hover:text-ink-primary"
                    }
                  >
                    URL Gambar
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {thumbMode === "upload" ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) void handleFileUpload(file);
                  }}
                  className="mt-2 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-ember/45 bg-elevated/70 px-4 py-5 text-center transition-colors hover:border-ember hover:bg-ember/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                >
                  {uploading ? (
                    <Loader2
                      aria-hidden="true"
                      className="h-5 w-5 animate-spin text-ember"
                    />
                  ) : (
                    <Upload aria-hidden="true" className="h-5 w-5 text-ember" />
                  )}
                  <span className="mt-2 text-xs font-medium text-ink-primary">
                    {uploading
                      ? "Mengunggah gambar..."
                      : "Seret gambar ke sini atau tekan untuk memilih file"}
                  </span>
                  <span className="mt-1 font-mono text-[10px] text-ink-muted">
                    JPG, PNG, WebP &middot; Rasio 16:10 direkomendasikan (maks. 2 MB)
                  </span>
                </button>
              ) : (
                <div className="mt-2 relative">
                  <Link2
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted"
                  />
                  <label htmlFor="proj-thumb-url" className="sr-only">
                    URL Gambar Thumbnail
                  </label>
                  <input
                    id="proj-thumb-url"
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://contoh.com/thumbnail.webp"
                    className="w-full rounded-lg border border-white/12 bg-elevated pl-10 pr-3.5 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
                  />
                </div>
              )}

              {/* Quick Preset Thumbnails */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-muted mr-1">
                  <ImagePlus aria-hidden="true" className="h-3 w-3" /> Preset:
                </span>
                {PRESET_THUMBNAILS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setThumbnailUrl(preset.url)}
                    className={`rounded-md border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                      thumbnailUrl === preset.url
                        ? "border-ember bg-ember/15 text-ember-glow"
                        : "border-white/10 bg-elevated text-ink-muted hover:text-ink-primary"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Demo & GitHub URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="proj-live-url"
                  className="block font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  URL LIVE DEMO (OPSIONAL)
                </label>
                <input
                  id="proj-live-url"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://contoh-demo.com"
                  className="mt-1.5 w-full rounded-lg border border-white/12 bg-elevated px-3.5 py-2.5 text-xs text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
                />
              </div>
              <div>
                <label
                  htmlFor="proj-github-url"
                  className="block font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  URL GITHUB (OPSIONAL)
                </label>
                <input
                  id="proj-github-url"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="mt-1.5 w-full rounded-lg border border-white/12 bg-elevated px-3.5 py-2.5 text-xs text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
                />
              </div>
            </div>
          </div>

          {/* Right Panel: Sticky Real-Time Card Preview + Submit Actions */}
          <div
            className={`flex flex-col justify-between bg-[#080706] p-6 ${
              mobileTab === "form" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
                PRATINJAU KARTU LANGSUNG
              </p>

              <div className="mx-auto max-w-[360px]">
                <ProjectCard project={previewProject} previewMode />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-5 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[42px] rounded-lg border border-white/12 bg-surface px-5 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:border-white/25 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-ember px-6 py-2 font-display text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-ember-glow disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                {saving && (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                )}
                <span>
                  {saving
                    ? "MENYIMPAN..."
                    : isEdit
                      ? "PERBARUI PROYEK"
                      : "SIMPAN PROYEK"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function ProjectFormModal({
  open,
  editingProject,
  onClose,
  onSaved,
}: ProjectFormModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <ProjectFormDialogContent
          key={editingProject?.id ?? "new-project"}
          editingProject={editingProject}
          onClose={onClose}
          onSaved={onSaved}
        />
      )}
    </AnimatePresence>
  );
}
