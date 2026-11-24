"use client";

import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FolderOpen,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { ToastProvider, useToast } from "@/components/ui/ToastProvider";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { DeleteConfirmModal } from "@/components/projects/DeleteConfirmModal";

interface AdminDashboardProps {
  initialProjects: Project[];
  initialIsAdmin: boolean;
}

function AdminDashboardInner({
  initialProjects,
  initialIsAdmin,
}: AdminDashboardProps) {
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const [passcode, setPasscode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Masukkan passcode admin.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Passcode tidak valid.");
        return;
      }
      setPasscode("");
      setIsAdmin(true);
      showToast({
        title: "Autentikasi berhasil",
        description: "Selamat datang di Portal Manajemen Proyek.",
        variant: "success",
      });
    } catch {
      setAuthError("Gagal terhubung ke server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAdmin(false);
    showToast({ title: "Berhasil keluar dari Mode Admin", variant: "info" });
  };

  const handleSaved = useCallback((saved: Project, isEdit: boolean) => {
    setProjects((prev) =>
      isEdit
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev]
    );
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-void text-ink-primary px-5 sm:px-8 py-10">
      <main className="mx-auto max-w-6xl">
        {/* Top Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-ink-secondary hover:text-ember transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm"
            >
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Kembali ke Portofolio</span>
            </Link>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.02em]">
              PORTAL <span className="text-ember">ADMIN PROYEK</span>
            </h1>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-[#22C55E]/35 bg-[#22C55E]/10 px-3 py-1.5 font-mono text-[11px] text-[#22C55E]">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
                TERAUTENTIKASI
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-ember px-5 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-ember-glow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                <span>TAMBAH PROYEK</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-white/12 bg-surface px-4 py-2.5 text-xs text-ink-secondary hover:border-[#EF4444]/50 hover:text-[#EF4444] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </header>

        {/* Auth Gate or Management List */}
        {!isAdmin ? (
          <div className="mx-auto mt-16 max-w-md rounded-2xl border border-white/12 bg-surface p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-ember/40 bg-ember/12 text-amber">
              <Lock aria-hidden="true" className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold uppercase">
              AUTENTIKASI MODE ADMIN
            </h2>
            <p className="mt-2 text-xs text-ink-secondary">
              Masukkan <code className="font-mono text-ember">ADMIN_PASSCODE</code>{" "}
              untuk mengelola daftar proyek portofolio.
            </p>

            <form onSubmit={handleLogin} className="mt-6 text-left">
              <label
                htmlFor="admin-page-passcode"
                className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
              >
                Passcode Admin
              </label>
              <div className="relative mt-1.5">
                <input
                  id="admin-page-passcode"
                  type={showPass ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Masukkan passcode admin"
                  className="w-full rounded-lg border border-white/15 bg-elevated pl-4 pr-16 py-3 text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  aria-label={
                    showPass ? "Sembunyikan passcode" : "Tampilkan passcode"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 font-mono text-[10px] text-ink-muted hover:text-ink-primary"
                >
                  {showPass ? (
                    <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                  <span>{showPass ? "HIDE" : "SHOW"}</span>
                </button>
              </div>
              {authError && (
                <p className="mt-2 text-xs text-[#EF4444]">{authError}</p>
              )}
              <button
                type="submit"
                disabled={authLoading}
                className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-ember px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-white hover:bg-ember-glow disabled:opacity-55 transition-colors"
              >
                {authLoading && (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                )}
                <span>{authLoading ? "MEMVERIFIKASI..." : "MASUK MODE ADMIN"}</span>
              </button>
            </form>
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-10 rounded-xl border border-white/[0.09] bg-surface px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-elevated text-ink-muted">
              <FolderOpen aria-hidden="true" className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold uppercase">
              Belum Ada Proyek Tersimpan
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-secondary">
              File <code className="font-mono text-xs text-ember">data/projects.json</code>{" "}
              saat ini kosong. Tambahkan proyek pertama untuk menampilkannya di portofolio.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ember px-5 py-2.5 text-xs font-semibold text-white hover:bg-ember-glow"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              <span>Tambah Proyek Pertama</span>
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-3.5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/[0.09] bg-surface p-4 hover:border-ember/45 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    width={96}
                    height={64}
                    className="h-16 w-24 shrink-0 rounded-lg border border-white/10 object-cover bg-void"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ember">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="rounded-md bg-amber/15 px-2 py-0.5 font-mono text-[10px] text-amber">
                          Unggulan
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 truncate font-display text-xl font-semibold uppercase text-ink-primary">
                      {project.title}
                    </h2>
                    <p className="truncate text-xs text-ink-secondary">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(project);
                      setFormOpen(true);
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/12 bg-elevated px-3.5 py-2 text-xs font-medium text-ink-primary hover:border-ember/60 hover:text-ember-glow transition-colors"
                  >
                    <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(project)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#EF4444]/35 bg-[#EF4444]/10 px-3.5 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ProjectFormModal
        open={formOpen}
        editingProject={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSaved={handleSaved}
      />

      <DeleteConfirmModal
        project={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

export function AdminDashboard(props: AdminDashboardProps) {
  return (
    <ToastProvider>
      <AdminDashboardInner {...props} />
    </ToastProvider>
  );
}
