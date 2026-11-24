"use client";

import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Star,
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
      <div className="mx-auto max-w-6xl">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-ink-secondary hover:text-ember transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Portofolio</span>
            </Link>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.02em]">
              PORTAL <span className="text-ember">ADMIN PROYEK</span>
            </h1>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/35 bg-[#22C55E]/10 px-3.5 py-1.5 font-mono text-[11px] text-[#22C55E]">
                <ShieldCheck className="h-3.5 w-3.5" />
                TERAUTENTIKASI
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-ember px-5 py-2.5 font-display text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_0_24px_-4px_rgba(255,77,0,0.55)] hover:bg-ember-glow transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>TAMBAH PROYEK</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-surface px-4 py-2.5 text-xs text-ink-secondary hover:border-[#EF4444]/50 hover:text-[#EF4444] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Auth Gate or Management Table */}
        {!isAdmin ? (
          <div className="mx-auto mt-16 max-w-md rounded-2xl border border-ember/30 bg-surface p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ember/40 bg-ember/15 text-amber">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold uppercase">
              AUTENTIKASI MODE ADMIN
            </h2>
            <p className="mt-2 text-xs text-ink-secondary">
              Masukkan <code className="font-mono text-ember">ADMIN_PASSCODE</code>{" "}
              untuk mengelola daftar proyek portofolio.
            </p>

            <form onSubmit={handleLogin} className="mt-6 text-left">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Masukkan passcode admin..."
                  className="w-full rounded-xl border border-ember/45 bg-elevated pl-4 pr-16 py-3 text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 font-mono text-[10px] text-ink-muted hover:text-ink-primary"
                >
                  {showPass ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
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
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_24px_-4px_rgba(255,77,0,0.55)] hover:bg-ember-glow disabled:opacity-55"
              >
                {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{authLoading ? "MEMVERIFIKASI..." : "MASUK MODE ADMIN"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-surface p-4 hover:border-ember/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="h-16 w-24 shrink-0 rounded-xl border border-white/10 object-cover bg-void"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ember">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2 py-0.5 font-mono text-[10px] text-amber">
                          <Star className="h-2.5 w-2.5 fill-amber" />
                          Unggulan
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 truncate font-display text-xl font-semibold uppercase text-ink-primary">
                      {project.title}
                    </h3>
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
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-elevated px-3.5 py-2 text-xs font-medium text-ink-primary hover:border-ember/60 hover:text-ember-glow transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(project)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 px-3.5 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
