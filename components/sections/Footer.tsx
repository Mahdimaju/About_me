"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";

const QUICK_LINKS = [
  { href: "#hero", label: "BERANDA" },
  { href: "#about", label: "TENTANG" },
  { href: "#skills", label: "KEAHLIAN" },
  { href: "#projects", label: "PROYEK" },
  { href: "#contact", label: "KONTAK" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/[0.08] bg-void">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="text-center md:text-left font-mono text-xs text-ink-muted">
          &copy; 2026 {profile.fullName} | Solar Eclipse Obsidian Portfolio
          (Next.js 16 + Three.js)
        </p>

        <nav
          aria-label="Navigasi Footer"
          className="flex flex-wrap items-center justify-center gap-5"
        >
          {QUICK_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-serif text-xs font-semibold tracking-[0.12em] text-ink-muted hover:text-ember transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/admin"
            className="font-mono text-[11px] text-ink-muted hover:text-ember transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded-sm"
          >
            /admin
          </Link>
        </nav>

        <a
          href="#hero"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/12 bg-surface px-4 py-2 font-mono text-[11px] text-ink-secondary transition-colors hover:border-ember/50 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
        >
          <span>Kembali ke Atas</span>
          <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 text-ember" />
        </a>
      </div>
    </footer>
  );
}
