import { z } from "zod";
import { PROJECT_CATEGORIES } from "./types";

function isSafeExternalOrLocalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/images/") || trimmed.startsWith("/uploads/")) {
    return !trimmed.includes("..");
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeOptionalHttpUrl(value: string | undefined): boolean {
  if (!value || !value.trim()) return true;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const projectInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul proyek minimal 3 karakter.")
    .max(80, "Judul proyek maksimal 80 karakter."),
  summary: z
    .string()
    .trim()
    .min(10, "Ringkasan singkat minimal 10 karakter.")
    .max(160, "Ringkasan singkat maksimal 160 karakter."),
  description: z
    .string()
    .trim()
    .max(2500, "Deskripsi lengkap maksimal 2500 karakter.")
    .optional()
    .default(""),
  category: z.enum(PROJECT_CATEGORIES, {
    error: "Kategori proyek tidak valid.",
  }),
  techStack: z
    .array(z.string().trim().min(1).max(32))
    .min(1, "Tambahkan minimal 1 teknologi pada Tech Stack.")
    .max(12, "Maksimal 12 item Tech Stack."),
  thumbnailUrl: z
    .string()
    .trim()
    .refine(
      isSafeExternalOrLocalUrl,
      "URL thumbnail harus diawali http://, https://, atau path lokal yang valid."
    ),
  liveUrl: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      isSafeOptionalHttpUrl,
      "URL Live Demo harus diawali http:// atau https://."
    ),
  githubUrl: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      isSafeOptionalHttpUrl,
      "URL GitHub harus diawali http:// atau https://."
    ),
  featured: z.boolean().optional().default(false),
});

export const projectPatchSchema = projectInputSchema.partial();

export const adminPasscodeSchema = z.object({
  passcode: z.string().min(1, "Passcode admin wajib diisi.").max(128),
});

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(80, "Nama maksimal 80 karakter."),
  email: z
    .string()
    .trim()
    .email("Format alamat email tidak valid.")
    .max(120, "Alamat email terlalu panjang."),
  subject: z
    .string()
    .trim()
    .min(3, "Subjek minimal 3 karakter.")
    .max(120, "Subjek maksimal 120 karakter."),
  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal 10 karakter.")
    .max(2000, "Pesan maksimal 2000 karakter."),
});

export type ProjectInputValues = z.infer<typeof projectInputSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
