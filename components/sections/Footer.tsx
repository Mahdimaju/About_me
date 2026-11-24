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
    <footer className="relative mt-auto bg-void">
      {/* Thin ember-faded top divider */}
      <div
        aria-hidden="true"
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-ember/45 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="text-center md:text-left font-mono text-xs text-ink-muted">
          &copy; 2026 {profile.fullName} &mdash; Solar Eclipse Obsidian Portfolio
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
              className="font-serif text-xs font-semibold tracking-[0.14em] text-ink-muted hover:text-ember transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/admin"
            className="font-mono text-[11px] text-ink-muted/70 hover:text-ember transition-colors"
          >
            /admin
          </Link>
        </nav>

        <a
          href="#hero"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-surface px-4 py-2 font-mono text-[11px] text-ink-secondary transition-colors hover:border-ember/50 hover:text-ink-primary"
        >
          <span>Kembali ke Atas</span>
          <ArrowUp className="h-3.5 w-3.5 text-ember" />
        </a>
      </div>
    </footer>
  );
}
