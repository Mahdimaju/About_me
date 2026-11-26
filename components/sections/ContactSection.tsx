"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { profile } from "@/data/profile";
import { contactFormSchema } from "@/lib/validators";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { useToast } from "@/components/ui/ToastProvider";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

type FieldErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;

export function ContactSection() {
  const { showToast } = useToast();
  const reducedMotion = usePrefersReducedMotion();

  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      showToast({
        title: "Email berhasil disalin ke clipboard",
        description: `${profile.email} siap ditempel di aplikasi email Anda.`,
        variant: "info",
      });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      showToast({
        title: "Gagal menyalin email otomatis",
        description: `Silakan salin manual: ${profile.email}`,
        variant: "error",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactFormSchema.safeParse({
      name,
      email,
      subject,
      message,
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast({
          title: "Gagal mengirim pesan",
          description: data.error || "Periksa kembali isian formulir Anda.",
          variant: "error",
        });
        return;
      }

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      showToast({
        title: "Pesan berhasil dikirim!",
        description: data.message || "Terima kasih telah menghubungi saya.",
        variant: "success",
      });
    } catch {
      showToast({
        title: "Terjadi kesalahan jaringan",
        description: "Tidak dapat terhubung ke server. Coba lagi nanti.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const revealProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="contact"
      className="relative border-t border-white/[0.07] pt-16 pb-24 md:pt-24 md:pb-32 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column (5 cols): Quick Contact & Socials */}
          <motion.div {...revealProps} className="lg:col-span-5">
            <p className="font-serif text-sm font-semibold uppercase tracking-[0.14em] text-ember">
              05 / KONTAK
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold uppercase leading-[0.98] tracking-[-0.01em] text-ink-primary">
              HUBUNGI <span className="text-ember">SAYA</span> LANGSUNG
            </h2>
            <p className="mt-4 text-[15px] leading-[1.68] text-ink-secondary">
              Punya ide proyek web, peluang magang IT, atau kolaborasi riset?
              Kirim pesan melalui formulir atau salin alamat email di bawah ini.
            </p>

            {/* One-Click Copy Email Box */}
            <div className="mt-7 rounded-xl border border-white/[0.09] bg-surface p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                  EMAIL LANGSUNG
                </span>
                <span className="mt-1 block truncate font-mono text-sm font-medium text-ink-primary">
                  {profile.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                  copied
                    ? "border-[#22C55E]/50 bg-[#22C55E]/15 text-[#22C55E]"
                    : "border-ember/45 bg-elevated text-ink-primary hover:border-ember hover:bg-ember/15"
                }`}
              >
                {copied ? (
                  <>
                    <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy aria-hidden="true" className="h-3.5 w-3.5 text-ember" />
                    <span>Salin Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Social & Mail Links */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[46px] items-center gap-3 rounded-lg border border-white/[0.09] bg-surface px-4 py-3 transition-colors hover:border-ember/50 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                >
                  <BrandIcon
                    name={item.icon}
                    className="h-4 w-4 shrink-0 text-ink-secondary group-hover:text-ember transition-colors"
                  />
                  <span className="truncate text-xs text-ink-secondary group-hover:text-ink-primary transition-colors">
                    {item.handle}
                  </span>
                </a>
              ))}

              <a
                href={`mailto:${profile.email}`}
                className="group sm:col-span-2 flex min-h-[46px] items-center justify-between gap-2 rounded-lg border border-white/[0.09] bg-surface px-4 py-3 transition-colors hover:border-ember/50 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <span className="inline-flex items-center gap-2.5 text-xs text-ink-secondary group-hover:text-ink-primary transition-colors">
                  <Mail aria-hidden="true" className="h-4 w-4 text-ember" />
                  <span>Buka Aplikasi Email</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-ink-muted group-hover:text-ember"
                />
              </a>
            </div>
          </motion.div>

          {/* Right Column (7 cols): Validated Contact Form (grounded flat surface, honest placeholders) */}
          <motion.div {...revealProps} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-white/[0.09] bg-surface p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                  >
                    NAMA LENGKAP <span className="text-ember">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Nama lengkap Anda"
                    aria-invalid={Boolean(errors.name)}
                    className={`mt-2 w-full rounded-lg border bg-elevated px-4 py-3 text-sm text-ink-primary placeholder:text-ink-muted/75 outline-none transition-colors ${
                      errors.name
                        ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25"
                        : "border-white/12 focus:border-ember focus:ring-2 focus:ring-ember/25"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-[#EF4444]">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                  >
                    ALAMAT EMAIL <span className="text-ember">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="nama@email.com"
                    aria-invalid={Boolean(errors.email)}
                    className={`mt-2 w-full rounded-lg border bg-elevated px-4 py-3 text-sm text-ink-primary placeholder:text-ink-muted/75 outline-none transition-colors ${
                      errors.email
                        ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25"
                        : "border-white/12 focus:border-ember focus:ring-2 focus:ring-ember/25"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-[#EF4444]">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-subject"
                  className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  SUBJEK <span className="text-ember">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject)
                      setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  placeholder="Topik pesan Anda"
                  aria-invalid={Boolean(errors.subject)}
                  className={`mt-2 w-full rounded-lg border bg-elevated px-4 py-3 text-sm text-ink-primary placeholder:text-ink-muted/75 outline-none transition-colors ${
                    errors.subject
                      ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25"
                      : "border-white/12 focus:border-ember focus:ring-2 focus:ring-ember/25"
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-[#EF4444]">{errors.subject}</p>
                )}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  PESAN <span className="text-ember">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message)
                      setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Tuliskan pesan Anda di sini..."
                  aria-invalid={Boolean(errors.message)}
                  className={`mt-2 w-full resize-none rounded-lg border bg-elevated px-4 py-3 text-sm text-ink-primary placeholder:text-ink-muted/75 outline-none transition-colors ${
                    errors.message
                      ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25"
                      : "border-white/12 focus:border-ember focus:ring-2 focus:ring-ember/25"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-[#EF4444]">{errors.message}</p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-ink-muted">
                  Validasi skema Zod aktif pada sisi klien dan server.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2.5 rounded-lg bg-ember px-6 py-2.5 font-display text-base font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-ember-glow active:scale-[0.98] disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  {submitting ? (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send aria-hidden="true" className="h-4 w-4" />
                  )}
                  <span>{submitting ? "MENGIRIM..." : "KIRIM PESAN"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
