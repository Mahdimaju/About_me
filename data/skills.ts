import type { SkillCategory } from "@/lib/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    index: "01",
    name: "FRONTEND ENGINEERING",
    items: [
      { name: "Next.js 16", level: "Mahir", icon: "nextjs" },
      { name: "React 19", level: "Mahir", icon: "react" },
      { name: "TypeScript", level: "Mahir", icon: "ts" },
      { name: "Tailwind CSS v4", level: "Mahir", icon: "tailwind" },
      { name: "HTML5 & CSS3", level: "Mahir", icon: "html" },
    ],
  },
  {
    id: "webgl",
    index: "02",
    name: "3D WEBGL & ANIMASI",
    items: [
      { name: "Three.js", level: "Menengah", icon: "three" },
      { name: "React Three Fiber", level: "Menengah", icon: "r3f" },
      { name: "GLSL Shaders", level: "Menengah", icon: "glsl" },
      { name: "Motion (Framer)", level: "Mahir", icon: "motion" },
    ],
  },
  {
    id: "backend",
    index: "03",
    name: "BACKEND & DATABASE",
    items: [
      { name: "Node.js", level: "Menengah", icon: "node" },
      { name: "REST API & Zod", level: "Mahir", icon: "api" },
      { name: "SQLite / PostgreSQL", level: "Menengah", icon: "db" },
      { name: "Prisma ORM", level: "Dasar", icon: "prisma" },
    ],
  },
  {
    id: "tools",
    index: "04",
    name: "TOOLS & WORKFLOW",
    items: [
      { name: "Git & GitHub", level: "Mahir", icon: "git" },
      { name: "Figma", level: "Menengah", icon: "figma" },
      { name: "Vercel Deploy", level: "Mahir", icon: "vercel" },
      { name: "VS Code", level: "Mahir", icon: "vscode" },
      { name: "Linux / CLI", level: "Dasar", icon: "terminal" },
    ],
  },
];
