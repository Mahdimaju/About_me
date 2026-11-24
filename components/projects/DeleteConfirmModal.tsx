"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";

interface DeleteConfirmModalProps {
  project: Project | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function DeleteConfirmModal({
  project,
  onClose,
  onDeleted,
}: DeleteConfirmModalProps) {
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  const handleConfirm = async () => {
    if (!project) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({
          title: "Gagal menghapus proyek",
          description: data.error || "Periksa sesi Admin Anda.",
          variant: "error",
        });
        return;
      }
      onDeleted(project.id);
      onClose();
      showToast({
        title: "Proyek berhasil dihapus",
        description: `"${project.title}" telah dihapus dari daftar portofolio.`,
        variant: "info",
      });
    } catch {
      showToast({
        title: "Gagal terhubung ke server",
        description: "Coba lagi beberapa saat.",
        variant: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-void/85 backdrop-blur-lg p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[#EF4444]/40 bg-surface p-6 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.95)]"
          >
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#EF4444]">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>KONFIRMASI PENGHAPUSAN</span>
            </div>

            <h3
              id="delete-confirm-title"
              className="mt-3 font-display text-2xl font-bold uppercase text-ink-primary"
            >
              HAPUS PROYEK INI PERMANEN?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              Proyek{" "}
              <span className="font-semibold text-ink-primary">
                &ldquo;{project.title}&rdquo;
              </span>{" "}
              akan dihapus dari <code className="font-mono text-xs text-ember">data/projects.json</code>{" "}
              dan tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={onClose}
                className="rounded-full border border-white/15 bg-elevated px-5 py-2.5 text-xs font-semibold text-ink-primary hover:border-white/30 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 rounded-full bg-[#EF4444] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#DC2626] disabled:opacity-55"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{deleting ? "Menghapus..." : "Ya, Hapus Proyek"}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
