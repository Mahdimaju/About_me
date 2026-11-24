"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface AdminAuthModalProps {
  open: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  onLogout: () => void;
  onAddProject: () => void;
}

export function AdminAuthModal({
  open,
  isAdmin,
  onClose,
  onAuthenticated,
  onLogout,
  onAddProject,
}: AdminAuthModalProps) {
  const { showToast } = useToast();
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Masukkan passcode admin terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg =
          data.error || "Akses ditolak. Periksa kembali ADMIN_PASSCODE Anda.";
        setError(msg);
        showToast({
          title: `Passcode Admin tidak valid (${res.status})`,
          description: msg,
          variant: "error",
        });
        return;
      }

      setPasscode("");
      onAuthenticated();
      onClose();
      showToast({
        title: "Mode Admin aktif!",
        description: "Anda sekarang dapat menambah, mengedit, dan menghapus proyek.",
        variant: "success",
      });
    } catch {
      setError("Gagal menghubungi server autentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-auth-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-void/85 backdrop-blur-lg p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] rounded-2xl border border-ember/30 bg-surface p-7 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.95)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal admin"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-ink-muted hover:border-ember/50 hover:text-ink-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {isAdmin ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3
                  id="admin-auth-title"
                  className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.04em] text-ink-primary"
                >
                  MODE ADMIN AKTIF
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                  Sesi admin Anda terverifikasi lewat HTTP-only cookie. Anda
                  dapat langsung mengelola proyek dari halaman utama atau portal{" "}
                  <code className="font-mono text-ember">/admin</code>.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAddProject();
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_0_24px_-4px_rgba(255,77,0,0.55)] hover:bg-ember-glow transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>TAMBAH PROYEK BARU</span>
                  </button>

                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-elevated px-5 py-2.5 text-xs font-semibold text-ink-primary hover:border-ember/50 transition-colors"
                  >
                    Buka Portal /admin
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#EF4444]/35 bg-[#EF4444]/10 px-5 py-2.5 text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar Mode Admin</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ember/40 bg-ember/15 text-amber shadow-[0_0_24px_-6px_rgba(255,77,0,0.6)]">
                  <Lock className="h-5 w-5" />
                </div>

                <h3
                  id="admin-auth-title"
                  className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.04em] text-ink-primary"
                >
                  AUTENTIKASI MODE ADMIN
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                  Masukkan passcode admin (
                  <kbd className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-ink-primary border border-white/10">
                    Ctrl+Shift+A
                  </kbd>
                  ) untuk menambah, mengedit, atau menghapus proyek.
                </p>

                <div className="mt-6 text-left">
                  <label htmlFor="admin-passcode-input" className="sr-only">
                    Passcode Admin
                  </label>
                  <div className="relative">
                    <input
                      id="admin-passcode-input"
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (error) setError(null);
                      }}
                      autoFocus
                      placeholder="Masukkan ADMIN_PASSCODE..."
                      className={`w-full rounded-xl border bg-elevated pl-4 pr-16 py-3 text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-all ${
                        error
                          ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25"
                          : "border-ember/45 focus:border-ember focus:ring-2 focus:ring-ember/25"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode((prev) => !prev)}
                      aria-label={
                        showPasscode ? "Sembunyikan passcode" : "Tampilkan passcode"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted hover:text-ink-primary"
                    >
                      {showPasscode ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>HIDE</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>SHOW</span>
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-xs text-[#EF4444]">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_24px_-4px_rgba(255,77,0,0.55)] transition-all hover:bg-ember-glow disabled:opacity-55"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{loading ? "MEMVERIFIKASI..." : "MASUK MODE ADMIN"}</span>
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
