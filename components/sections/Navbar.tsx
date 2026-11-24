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
      {/* Glass Dose #1: sticky navbar separates floating navigation from scrolling content */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-16 bg-surface/85 backdrop-blur-md border-b border-white/[0.09] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.85)]"
            : "h-[76px] bg-gradient-to-b from-void/85 via-void/35 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Logo Monogram */}
          <a
            href="#hero"
            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-ember/60 bg-surface font-serif text-lg font-bold text-ink-primary transition-colors group-hover:border-ember group-hover:text-ember">
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
              <span className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-ink-muted">
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
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-2 font-serif text-[15px] font-semibold tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm ${
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
                        damping: 34,
                      }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-ember"
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
              className="inline-flex items-center justify-center rounded-lg border border-ember/50 bg-surface px-4 py-2 font-serif text-[13px] font-semibold tracking-[0.14em] text-ink-primary transition-colors hover:border-ember hover:bg-ember/12 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              HUBUNGI SAYA
            </a>

            <button
              type="button"
              onClick={onOpenAdmin}
              aria-label={
                isAdmin
                  ? "Panel Mode Admin Aktif"
                  : "Masuk Mode Admin (Ctrl+Shift+A)"
              }
              title={
                isAdmin
                  ? "Mode Admin Aktif (Klik untuk kelola atau keluar)"
                  : "Mode Admin (Ctrl+Shift+A)"
              }
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                isAdmin
                  ? "border-[#22C55E]/55 bg-[#22C55E]/12 text-[#22C55E]"
                  : "border-white/12 bg-surface text-ink-muted hover:border-ember/50 hover:text-ink-primary"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Lock aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Mobile Controls (min 44x44px tap target per R-03) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              aria-label={isAdmin ? "Mode Admin Aktif" : "Masuk Mode Admin"}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                isAdmin
                  ? "border-[#22C55E]/55 bg-[#22C55E]/12 text-[#22C55E]"
                  : "border-white/12 bg-surface text-ink-muted"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Lock aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-surface text-ink-primary hover:border-ember/50 transition-colors"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer (matte solid surface, zero glass stack) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-void/85 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              aria-label="Menu Navigasi Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-[min(82vw,320px)] flex-col border-l border-white/12 bg-surface p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <span className="font-display text-lg font-bold tracking-[0.14em] text-ink-primary">
                  NAVIGASI
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Tutup menu navigasi"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 text-ink-secondary hover:text-ink-primary"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1.5">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileOpen(false)}
                      className={`flex min-h-[44px] items-center justify-between rounded-lg px-4 py-3 font-serif text-base font-semibold tracking-[0.12em] transition-colors ${
                        isActive
                          ? "bg-ember/15 text-ember border border-ember/35"
                          : "text-ink-secondary hover:bg-elevated hover:text-ink-primary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-[11px] text-ink-muted">
                        0{idx + 1}
                      </span>
                    </a>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/[0.08] flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-lg bg-ember px-5 py-3 font-display text-sm font-bold tracking-[0.12em] text-white transition-colors hover:bg-ember-glow"
                >
                  HUBUNGI SAYA
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/12 bg-elevated px-5 py-2.5 text-xs font-medium text-ink-secondary hover:border-ember/50 hover:text-ink-primary"
                >
                  <Lock aria-hidden="true" className="h-3.5 w-3.5 text-ember" />
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
