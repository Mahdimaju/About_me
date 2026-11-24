export const PROJECT_CATEGORIES = [
  "Web App",
  "3D / Interaktif",
  "Tugas Kuliah",
  "UI/UX",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  thumbnailUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  thumbnailUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export type SkillLevel = "Dasar" | "Menengah" | "Mahir";

export interface SkillItem {
  name: string;
  level: SkillLevel;
  icon: string;
}

export interface SkillCategory {
  id: string;
  index: string;
  name: string;
  items: SkillItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export type ToastVariant = "success" | "info" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}
