"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, Menu, ShieldCheck, X } from "lucide-react";
import { profile } from "@/data/profile";

const NAV_ITEMS = [
  { id: "hero", label: "BERANDA" },
  { id: "about", label: "TENTANG" },
  { id: "skills", label: "KEAHLIAN" },
  { id: "projects", label: "PROYEK" },
  { id: "contact", label: "KONTAK" },
] as const;

interface NavbarProps {
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export function Navbar({ isAdmin, onOpenAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((n) => n.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.3, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-16 bg-surface/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_12px_36px_-16px_rgba(0,0,0,0.9)]"
            : "h-[76px] bg-gradient-to-b from-void/85 via-void/40 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Logo Monogram */}
          <a
            href="#hero"
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-lg"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-ember/60 bg-surface font-serif text-lg font-bold text-ink-primary shadow-[0_0_16px_-4px_rgba(255,77,0,0.45)] transition-colors group-hover:border-ember group-hover:text-ember">
              {profile.monogram}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-xs bg-ember"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-[0.14em] text-ink-primary">
                {profile.shortName}
              </span>
              <span className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-ember">
                {profile.brandSub}
              </span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-7 lg:gap-9"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative py-2 font-serif text-[15px] font-semibold tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm ${
                    isActive
                      ? "text-ember"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-ember shadow-[0_0_10px_#FF4D00]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full border border-ember/45 bg-[#120C09]/90 px-5 py-2 font-serif text-[13px] font-semibold tracking-[0.16em] text-ink-primary transition-all hover:border-ember hover:bg-ember/10 hover:shadow-[0_0_20px_-4px_rgba(255,77,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <span>HUBUNGI SAYA</span>
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-ember shadow-[0_0_10px_#FF4D00] transition-transform group-hover:scale-125"
              />
            </a>

            <button
              type="button"
              onClick={onOpenAdmin}
              aria-label={isAdmin ? "Panel Mode Admin Aktif" : "Masuk Mode Admin (Ctrl+Shift+A)"}
              title={isAdmin ? "Mode Admin Aktif (Klik untuk kelola / keluar)" : "Mode Admin (Ctrl+Shift+A)"}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                isAdmin
                  ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#22C55E] shadow-[0_0_16px_-4px_rgba(34,197,94,0.5)]"
                  : "border-white/10 bg-surface/70 text-ink-muted hover:border-ember/50 hover:text-ember"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              aria-label="Mode Admin"
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                isAdmin
                  ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#22C55E]"
                  : "border-white/10 bg-surface/80 text-ink-muted"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-surface/85 text-ink-primary hover:border-ember/50 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-void/80 backdrop-blur-md md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-[min(82vw,320px)] flex-col border-l border-white/10 bg-surface/95 backdrop-blur-xl p-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <span className="font-display text-lg font-bold tracking-[0.14em] text-ink-primary">
                  NAVIGASI
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Tutup menu"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-ink-secondary hover:text-ink-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.25 }}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 font-serif text-base font-semibold tracking-[0.14em] transition-colors ${
                        isActive
                          ? "bg-ember/15 text-ember border border-ember/35"
                          : "text-ink-secondary hover:bg-elevated hover:text-ink-primary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-[11px] text-ink-muted">
                        0{idx + 1}
                      </span>
                    </motion.a>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/[0.08] flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-ember px-5 py-3 font-display text-sm font-bold tracking-[0.12em] text-white shadow-[0_0_24px_-4px_rgba(255,77,0,0.5)]"
                >
                  <span>HUBUNGI SAYA</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/12 bg-elevated px-5 py-2.5 text-xs font-medium text-ink-secondary hover:border-ember/50 hover:text-ink-primary"
                >
                  <Lock className="h-3.5 w-3.5 text-ember" />
                  <span>{isAdmin ? "Mode Admin Aktif" : "Masuk Mode Admin"}</span>
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
