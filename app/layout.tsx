import type { Metadata, Viewport } from "next";
import {
  Oswald,
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahdi — Personal Interactive 3D Portfolio | Mahasiswa IT & Web Developer",
  description:
    "Website portofolio pribadi interaktif milik Mahdi (Mahasiswa S1 Teknologi Informasi Semester 3 & Web Developer). Memadukan 3D WebGL React Three Fiber, shader riak air obsidian cair, dan Next.js Full-Stack.",
  keywords: [
    "Mahdi",
    "Web Developer",
    "Mahasiswa IT",
    "Next.js 16",
    "Three.js",
    "React Three Fiber",
    "GLSL Water Ripple",
    "Portofolio 3D",
  ],
  authors: [{ name: "Mahdi" }],
  openGraph: {
    title: "Mahdi — Interactive 3D Web Developer Portfolio",
    description:
      "Membangun pengalaman web yang interaktif: 3D WebGL, efek riak air berbasis GLSL shader, dan rekayasa Next.js Full-Stack.",
    type: "website",
    locale: "id_ID",
    siteName: "About_me — Mahdi Portfolio",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${oswald.variable} ${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-ink-primary font-sans selection:bg-ember/35 selection:text-ink-primary">
        {children}
      </body>
    </html>
  );
}
