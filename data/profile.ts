import type { BrandIconName } from "@/components/ui/BrandIcons";

export interface SocialLink {
  label: string;
  icon: BrandIconName;
  handle: string;
  href: string;
}

export interface HeroBrandBadge {
  icon: BrandIconName;
  title: string;
  href: string;
  group: "social" | "tech";
  external?: boolean;
  accent?: boolean;
}

export const profile = {
  fullName: "Mahdi",
  shortName: "MAHDI",
  monogram: "M",
  brandSub: "PORTFOLIO.3D",
  role: "Mahasiswa IT & Web Developer",
  university: "S1 Teknologi Informasi, Universitas Sari Mulia",
  semester: "Semester 3",
  semesterShort: "SEM 3",
  focusArea: "Full-Stack & Creative Frontend",
  focusTools: "Next.js App Router, Three.js, GLSL Shaders",
  educationSub: "Semester 3, Fokus Rekayasa Perangkat Lunak Web",
  availability: "Terbuka untuk Magang, Proyek Freelance & Kolaborasi Riset Web",
  heroEyebrowPrefix: "HALO, SAYA",
  heroHeadlineLine1: "SAYA MEMBANGUN",
  heroHeadlineLine2: "PENGALAMAN WEB",
  heroHeadlineLine3Prefix: "YANG",
  heroHeadlineHighlight: "INTERAKTIF",
  heroDescription:
    "Mahasiswa IT & Web Developer yang memadukan creative coding 3D WebGL, efek riak air interaktif, dan rekayasa full-stack modern.",
  aboutQuote:
    "Mengubah ide kompleks menjadi antarmuka web yang terasa hidup, memadukan estetika sinematik 3D dan arsitektur kode yang rapi.",
  aboutParagraphs: [
    "Saya Mahdi, mahasiswa S1 Teknologi Informasi Semester 3 di Universitas Sari Mulia yang memiliki ketertarikan mendalam pada pengembangan Full-Stack Web dan Creative Frontend. Saya senang mengeksplorasi batas visual browser modern melalui Next.js, Three.js, React Three Fiber, dan custom GLSL shaders.",
    "Setiap proyek saya bangun dengan standar rekayasa modern: performa 60 FPS, aksesibilitas WCAG AA, arsitektur TypeScript yang ketat, serta sistem manajemen konten mandiri yang mudah dikembangkan.",
  ],
  heroImage: "/images/hero-mahdi.png",
  aboutImage: "/images/about-mahdi.png",
  email: "mahdi.dev@email.com",
  socials: [
    {
      label: "GitHub",
      icon: "github",
      handle: "github.com/Mahdimaju",
      href: "https://github.com/Mahdimaju",
    },
    {
      label: "LinkedIn",
      icon: "linkedin",
      handle: "linkedin.com/in/mahdi",
      href: "https://linkedin.com/in/mahdi",
    },
    {
      label: "Instagram",
      icon: "instagram",
      handle: "@mahdi.code",
      href: "https://instagram.com/mahdi.code",
    },
    {
      label: "TikTok",
      icon: "tiktok",
      handle: "@mahdi.code",
      href: "https://tiktok.com/@mahdi.code",
    },
  ] satisfies SocialLink[],
  heroBadges: [
    {
      icon: "github",
      title: "GitHub (Mahdimaju)",
      href: "https://github.com/Mahdimaju",
      group: "social",
      external: true,
    },
    {
      icon: "linkedin",
      title: "LinkedIn",
      href: "https://linkedin.com/in/mahdi",
      group: "social",
      external: true,
    },
    {
      icon: "instagram",
      title: "Instagram",
      href: "https://instagram.com/mahdi.code",
      group: "social",
      external: true,
    },
    {
      icon: "tiktok",
      title: "TikTok",
      href: "https://tiktok.com/@mahdi.code",
      group: "social",
      external: true,
    },
    {
      icon: "nextjs",
      title: "Next.js 16",
      href: "#skills",
      group: "tech",
      accent: true,
    },
    {
      icon: "threejs",
      title: "Three.js & WebGL",
      href: "#skills",
      group: "tech",
    },
    {
      icon: "typescript",
      title: "TypeScript 5",
      href: "#skills",
      group: "tech",
    },
    {
      icon: "tailwindcss",
      title: "Tailwind CSS v4",
      href: "#skills",
      group: "tech",
    },
  ] satisfies HeroBrandBadge[],
};
