"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Info, X, AlertCircle } from "lucide-react";
import type { ToastItem, ToastVariant } from "@/lib/types";

interface ToastContextValue {
  showToast: (opts: {
    title: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

const ACCENT_MAP: Record<
  ToastVariant,
  { bar: string; iconBg: string; titleColor: string }
> = {
  success: {
    bar: "bg-[#22C55E]",
    iconBg: "text-[#22C55E]",
    titleColor: "text-ink-primary",
  },
  info: {
    bar: "bg-ember",
    iconBg: "text-ember",
    titleColor: "text-ink-primary",
  },
  error: {
    bar: "bg-[#EF4444]",
    iconBg: "text-[#EF4444]",
    titleColor: "text-ink-primary",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "info",
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      window.setTimeout(() => {
        dismiss(id);
      }, 3800);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifikasi"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-[min(92vw,380px)] pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const style = ACCENT_MAP[toast.variant];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto relative overflow-hidden rounded-xl bg-surface border border-white/12 shadow-2xl pl-4 pr-3 py-3.5 flex items-start gap-3"
              >
                {/* Left stripe carries explicit semantic state: success / info / error */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`}
                />
                <span className={`mt-0.5 shrink-0 ${style.iconBg}`}>
                  {toast.variant === "success" && (
                    <Check aria-hidden="true" className="w-4 h-4" />
                  )}
                  {toast.variant === "info" && (
                    <Info aria-hidden="true" className="w-4 h-4" />
                  )}
                  {toast.variant === "error" && (
                    <AlertCircle aria-hidden="true" className="w-4 h-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold leading-snug ${style.titleColor}`}>
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="mt-0.5 text-xs text-ink-secondary leading-relaxed">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Tutup notifikasi"
                  className="shrink-0 rounded-md p-1.5 text-ink-muted hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                >
                  <X aria-hidden="true" className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
