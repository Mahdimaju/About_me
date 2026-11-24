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
          className="fixed inset-0 z-[85] flex items-center justify-center bg-void/85 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] rounded-2xl border border-white/12 bg-surface p-7 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal admin"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 text-ink-muted hover:border-ember/50 hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>

            {isAdmin ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/12 text-[#22C55E]">
                  <ShieldCheck aria-hidden="true" className="h-6 w-6" />
                </div>
                <h3
                  id="admin-auth-title"
                  className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.03em] text-ink-primary"
                >
                  MODE ADMIN AKTIF
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                  Sesi admin Anda terverifikasi lewat HTTP-only cookie. Kelola
                  proyek langsung di halaman utama atau melalui portal{" "}
                  <code className="font-mono text-ember">/admin</code>.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAddProject();
                    }}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-ember px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-ember-glow transition-colors"
                  >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    <span>TAMBAH PROYEK BARU</span>
                  </button>

                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-white/12 bg-elevated px-5 py-2.5 text-xs font-semibold text-ink-primary hover:border-ember/50 transition-colors"
                  >
                    Buka Portal /admin
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border border-[#EF4444]/35 bg-[#EF4444]/10 px-5 py-2.5 text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Keluar Mode Admin</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-ember/40 bg-ember/12 text-amber">
                  <Lock aria-hidden="true" className="h-5 w-5" />
                </div>

                <h3
                  id="admin-auth-title"
                  className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.03em] text-ink-primary"
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
                  <label
                    htmlFor="admin-passcode-input"
                    className="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted"
                  >
                    Passcode Admin
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="admin-passcode-input"
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (error) setError(null);
                      }}
                      autoFocus
                      placeholder="Masukkan passcode admin"
                      className={`w-full rounded-lg border bg-elevated pl-4 pr-16 py-3 text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-colors ${
                        error
                          ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25"
                          : "border-white/15 focus:border-ember focus:ring-2 focus:ring-ember/25"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode((prev) => !prev)}
                      aria-label={
                        showPasscode ? "Sembunyikan passcode" : "Tampilkan passcode"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded"
                    >
                      {showPasscode ? (
                        <>
                          <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
                          <span>HIDE</span>
                        </>
                      ) : (
                        <>
                          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
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
                  className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-ember px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-ember-glow disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  {loading && (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  )}
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
