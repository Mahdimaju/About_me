# Design Specification Document (`design.md`)
## Website Portofolio Pribadi Interaktif — `About_me`

| Metadata | Detail |
| :--- | :--- |
| **Nama Proyek** | `About_me` — Personal Interactive 3D Portfolio |
| **Versi Dokumen** | `1.0.0` |
| **Tanggal** | 24 November 2026 |
| **Dokumen Acuan** | [`docs/PRD.md`](./PRD.md) & [`Reference/referensi.jpg`](../Reference/referensi.jpg) |
| **Arah Visual** | **Solar Eclipse Obsidian** — *Cinematic Dark UI*, Aksen Oranye Bara (*Molten Ember*), Elemen 3D WebGL & Distorsi Riak Air (*Liquid Obsidian*) |
| **Target Implementasi** | Next.js `16.4.6` (App Router), React `19.3.0`, Tailwind CSS `4.3.3`, Three.js / React Three Fiber, Motion |

---

## 1. Filosofi Visual & Adaptasi Referensi

### 1.1 Konsep Utama: *Solar Eclipse Obsidian*
Desain `About_me` mengadaptasi secara langsung atmosfer dramatis dari [`Reference/referensi.jpg`](../Reference/referensi.jpg) — latar hitam obsidian pekat yang diterangi cincin gerhana matahari menyala (*luminous solar eclipse ring*), partikel bara api, serta serpihan kristal gelap dengan tepi cahaya oranye — lalu memadukannya dengan kebutuhan fungsional pada [`docs/PRD.md`](./PRD.md): **elemen 3D interaktif**, **efek riak air berbasis gerakan kursor**, dan **manajemen proyek langsung dari web**.

Alih-alih menggunakan efek air berwarna biru generik yang bertabrakan dengan tema visual, efek **riak air (*water ripple / fluid distortion*)** dirancang menyerupai **permukaan obsidian cair (*liquid obsidian*)** yang memantulkan bias cahaya hangat (*amber/ember caustics*) saat disentuh kursor. Hasilnya adalah identitas visual yang kohesif, berkarakter sinematik, dan langsung menonjol di hadapan dosen penilai maupun *tech recruiter*.

### 1.2 Pemetaan Elemen `referensi.jpg` ke Kebutuhan `PRD.md`

| Elemen pada `Reference/referensi.jpg` | Adaptasi di `About_me` (Sesuai PRD) |
| :--- | :--- |
| **Latar hitam pekat + kabut nebula merah-oranye** | Kanvas dasar obsidian (`#050506`) dengan *radial ember glow* lembut + lapisan `WaterRippleCanvas` (GLSL *fluid distortion*) yang bereaksi terhadap gerakan dan klik kursor. |
| **Cincin cahaya gerhana (*Solar Eclipse Ring*) & serpihan kristal di belakang potret** | Diwujudkan sebagai objek **3D WebGL interaktif (`Hero3DScene`)** memakai React Three Fiber: cincin gerhana bercahaya (*emissive shader ring*) + serpihan kristal obsidian 3D mengambang (*floating faceted shards*) + partikel bara dengan *cursor parallax*. |
| **Potret siluet dengan *rim light* oranye di sisi kanan Hero** | Foto profil pemilik (`Reference/mahdi 1.jpeg` / `Mahdi 2.jpeg`) ditempatkan di sisi kanan Hero (dipotong/diblend halus dengan *warm rim-light vignette*) dan merespons riak air halus saat kursor melintas. |
| **Tipografi display padat besar putih + kata kunci terakhir oranye (`INSPIRE`)** | Headline Hero bertumpuk 3 baris dengan font *condensed uppercase* (`Oswald`), kata kunci pamungkas berwarna `#FF4D00` (mis. `MEMBANGUN / PENGALAMAN WEB / YANG INTERAKTIF`). |
| **Kontras font Serif elegan pada Navbar & intro (`HOME`, `HEY I AM...`)** | Navbar, sapaan *eyebrow*, dan aksen editorial menggunakan font serif halus (`Cormorant Garamond`), dipadukan dengan `Plus Jakarta Sans` untuk teks isi dan formulir agar keterbacaan tetap optimal. |
| **Navbar: Logo kiri, menu tengah dengan garis bawah oranye, tombol pill `LET'S TALK •` kanan** | Sticky *glassmorphism* navbar dengan logo monogram inisial di kiri, 5 menu utama (`Beranda`, `Tentang`, `Keahlian`, `Proyek`, `Kontak`) berindikator *scroll-spy* garis bawah `#FF4D00`, tombol pill `HUBUNGI SAYA •`, dan akses Admin diskret (ikon kunci / `Ctrl+Shift+A`). |
| **Tombol CTA kapsul oranye dengan lingkaran hitam kanan (`VIEW WORK`) + tombol ikon bulat (`WATCH SHOWREEL`)** | CTA primer **"LIHAT PROYEK"** berbentuk kapsul `#FF4D00` dengan *recessed orb* gelap di sisi kanan berisi panah dinamis; CTA sekunder **"HUBUNGI SAYA"** bergaya lingkaran garis tipis oranye + label *condensed*. |
| **Metrik singkat (`150+ PROJECT`, `80+ CLIENT`) & baris ikon putih bawah** | Diadaptasi secara jujur untuk profil mahasiswa IT: mis. `[X]+ PROYEK`, `[X]+ TECH STACK`, `SEMESTER 3`, diikuti baris ikon monokrom *tech stack* & sosial media (GitHub, LinkedIn, Next.js, Three.js, TypeScript) yang menyala oranye saat *hover*. |
| **Teks mikro vertikal di sisi kanan & kanan bawah (`CREATING IMPACT...`)** | *Decorative micro-rail* di sisi kanan layar desktop (titik bokeh oranye + teks vertikal `INTERACTIVE 3D PORTFOLIO` + *scroll indicator* menuju `#about`). |

---

## 2. Design System & Design Tokens

### 2.1 Palet Warna (*Obsidian & Solar Ember Palette*)

Semua kombinasi teks terhadap latar telah dirancang melampaui standar kontras **WCAG 2.1 AA (≥ 4.5:1 untuk teks normal, ≥ 3:1 untuk teks besar & komponen UI)**.

| Token CSS | Hex / RGBA | Peran & Penggunaan | Kontras (vs `#050506` / `#0D0B0A`) |
| :--- | :--- | :--- | :--- |
| `--bg-void` | `#050506` | Latar belakang utama halaman (*page canvas*) | Base |
| `--bg-surface` | `#0D0B0A` | Permukaan kartu (*card*), modal, panel form | Surface |
| `--bg-elevated` | `#161210` | Permukaan *hover*, input field, *dropdown*, *badge* | Elevated |
| `--bg-glass` | `rgba(13, 11, 10, 0.74)` | Sticky Navbar, modal backdrop, toast (`backdrop-blur-xl`) | Glass |
| `--accent-primary` | `#FF4D00` | CTA utama, kata sorotan Hero, garis aktif navbar, ikon aktif | 5.6:1 (Large/UI) |
| `--accent-hover` | `#FF6A1A` | State *hover* tombol utama, *hover* tautan, glow cincin | 6.8:1 |
| `--accent-amber` | `#FFA23A` | Sorotan spekular riak air (*caustic*), bagian dalam cincin gerhana | 10.1:1 |
| `--accent-core` | `#FFE4A3` | Titik puncak cahaya *solar eclipse ring* & *spark* 3D | 15.9:1 |
| `--accent-crimson` | `#9E1F00` | Gradien kabut nebula latar (*ambient radial glow*) | Ambient only |
| `--text-primary` | `#F5F2EE` | Judul utama, teks penting, label tombol terang | **18.8:1** (AAA) |
| `--text-secondary` | `#B8ADA5` | Paragraf isi, ringkasan proyek, metadata | **9.1:1** (AAA) |
| `--text-muted` | `#877B73` | Caption sekunder, placeholder input, teks mikro dekoratif | **4.9:1** (AA) |
| `--text-on-accent` | `#090706` / `#FFFFFF` | Teks di atas tombol `#FF4D00`: gunakan `#090706` (teks kecil) atau `#FFFFFF` *bold uppercase ≥ 18px* | 5.6:1 / 3.4:1+ |
| `--border-subtle` | `rgba(255, 255, 255, 0.09)` | Garis tepi default kartu, input, pemisah (*divider*) | — |
| `--border-ember` | `rgba(255, 77, 0, 0.38)` | Garis tepi *hover* kartu, tombol pill `HUBUNGI SAYA`, *focus ring* | — |
| `--status-success` | `#22C55E` | Toast berhasil simpan proyek / salin email / kirim pesan | 8.7:1 |
| `--status-warning` | `#F59E0B` | Indikator proyek *Featured*, peringatan ukuran file | 9.5:1 |
| `--status-danger` | `#EF4444` | Tombol hapus proyek, validasi error form, `401 Unauthorized` | 5.2:1 |

> **Catatan Aksesibilitas Tombol Utama (`#FF4D00`)**: Pada `referensi.jpg`, tombol `VIEW WORK` memakai teks putih tebal besar (`uppercase`). Agar tetap lulus WCAG AA di semua ukuran, teks pada tombol primer `#FF4D00` wajib menggunakan font `Oswald` **Bold ≥ 16–18px (`tracking-wider`)** dengan *subtle text-shadow* atau kontras teks gelap `#080605` pada tombol berukuran kecil (`sm`).

### 2.2 Sistem Tipografi (`next/font/google`)

Mengikuti kontras editorial khas `referensi.jpg`, sistem tipografi menggunakan kombinasi terukur:

| Peran | Font Family | CSS Variable | Weight | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `Oswald` | `--font-display` | `500`, `600`, `700` | Headline Hero, judul section, angka statistik, label CTA kapsul, judul kartu proyek |
| **Editorial Serif** | `Cormorant Garamond` | `--font-serif` | `500`, `600`, `700` | Tautan Navbar, sapaan *eyebrow* (`HALO, SAYA...`), tombol pill `HUBUNGI SAYA`, kutipan bio |
| **UI & Body Sans** | `Plus Jakarta Sans` | `--font-sans` | `400`, `500`, `600`, `700` | Paragraf deskripsi, konten modal, formulir kontak & admin, *toast*, navigasi *mobile* |
| **Code / Tech Mono** | `JetBrains Mono` | `--font-mono` | `400`, `500` | *Badge* teknologi (`Next.js`, `GLSL`), kategori proyek, pintasan keyboard (`Ctrl+Shift+A`) |

#### Skala Tipografi Responsif (*Type Scale*)

| Level | Font | Desktop (`≥ 1280px`) | Mobile (`360px–767px`) | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display (`H1`)** | `Oswald` 700 Uppercase | `clamp(3.25rem, 6.2vw, 5.75rem)` (`52–92px`) | `2.75rem` (`44px`) | `0.94` | `-0.02em` |
| **Section Title (`H2`)** | `Oswald` 600 Uppercase | `clamp(2.25rem, 3.8vw, 3.5rem)` (`36–56px`) | `2rem` (`32px`) | `1.02` | `-0.01em` |
| **Card / Modal Title (`H3`)** | `Oswald` 600 | `1.5rem` (`24px`) | `1.25rem` (`20px`) | `1.15` | `0.01em` |
| **Nav & Eyebrow** | `Cormorant Garamond` 600 Uppercase | `0.9375rem` (`15px`) | `0.875rem` (`14px`) | `1.2` | `0.14em` |
| **Body Lead** | `Plus Jakarta Sans` 400 | `1.0625rem` (`17px`) | `0.9375rem` (`15px`) | `1.65` | `0` |
| **Body Default** | `Plus Jakarta Sans` 400 | `0.9375rem` (`15px`) | `0.875rem` (`14px`) | `1.6` | `0` |
| **Micro / Badge / Mono** | `JetBrains Mono` 500 | `0.75rem` (`12px`) | `0.6875rem` (`11px`) | `1.3` | `0.06em` |

### 2.3 Spacing, Border Radius & Efek Cahaya (*Elevation & Glow*)

- **Container Max-Width**: `1280px` (`max-w-7xl`) dengan padding horizontal `px-5 sm:px-8 lg:px-12`.
- **Section Vertical Rhythm**: `py-20 md:py-28 lg:py-32` agar tiap bagian memiliki ruang bernapas sinematik tanpa terasa sempit.
- **Border Radius**:
  - Kartu & Modal: `16px` (`rounded-2xl`)
  - Input & Tombol Sekunder / Thumbnail: `12px` (`rounded-xl`)
  - Tombol CTA Kapsul, Filter Pill, Badge Tech: `9999px` (`rounded-full`)
- **Glow & Shadow Presets**:
  - `--glow-ember-sm`: `0 0 20px -4px rgba(255, 77, 0, 0.45)` (tombol primer, dot aktif)
  - `--glow-ember-lg`: `0 0 80px -12px rgba(255, 77, 0, 0.35), 0 0 140px -20px rgba(158, 31, 0, 0.25)` (halo belakang 3D & modal unggulan)
  - `--shadow-card`: `0 20px 50px -20px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.06)`

### 2.4 Konfigurasi Token Tailwind CSS v4 (`app/globals.css`)

```css
@import "tailwindcss";

@theme inline {
  /* Colors */
  --color-void: #050506;
  --color-surface: #0D0B0A;
  --color-elevated: #161210;
  --color-ember: #FF4D00;
  --color-ember-glow: #FF6A1A;
  --color-amber: #FFA23A;
  --color-solar-core: #FFE4A3;
  --color-crimson: #9E1F00;
  --color-ink-primary: #F5F2EE;
  --color-ink-secondary: #B8ADA5;
  --color-ink-muted: #877B73;

  /* Fonts */
  --font-display: var(--font-oswald), sans-serif;
  --font-serif: var(--font-cormorant), Georgia, serif;
  --font-sans: var(--font-jakarta), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), monospace;
}
```

---

## 3. Arsitektur Layout & Responsivitas

### 3.1 Breakpoint Grid

| Breakpoint | Rentang Lebar | Kolom Grid | Perilaku Layout Utama |
| :--- | :--- | :--- | :--- |
| **Mobile** | `360px – 767px` | 4 kolom, gap `16px` | Navbar *hamburger drawer*; Hero bertumpuk vertikal (visual gerhana 3D ringkas di atas/belakang, teks & CTA di depan); Kartu proyek 1 kolom; Form admin 1 kolom (tab *Form / Preview*). |
| **Tablet** | `768px – 1279px` | 8 kolom, gap `20px` | Navbar horizontal ringkas; Hero 2 kolom (55% kiri / 45% kanan); Bento About 2 kolom; Proyek 2 kolom; Kontak 2 kolom. |
| **Desktop** | `≥ 1280px` | 12 kolom, gap `24px` | Layout penuh ala `referensi.jpg` dengan *right vertical micro-rail*; Proyek 3 kolom; Form admin *split-screen* (Form kiri + Live Preview kanan). |

### 3.2 Blueprint Struktur Halaman Utama (`app/page.tsx`)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [LOGO]        BERANDA   TENTANG   KEAHLIAN   PROYEK   KONTAK   [HUBUNGI •][🔒]│ ← Sticky Glass Navbar
├──────────────────────────────────────────────────────────────────────────────┤
│  HERO SECTION (min-h-[100svh]) — Background: WaterRippleCanvas + Nebula Glow │
│  ┌───────────────────────────────┐   ┌─────────────────────────────────┐  •  │
│  │ • HALO, SAYA [NAMA]           │   │      ╭─────────────────╮        │  │  │
│  │                               │   │    ╭─╯  3D SOLAR RING  ╰─╮      │  I  │
│  │ SAYA MEMBANGUN                │   │    │   + Rim-Lit Photo   │      │  N  │
│  │ PENGALAMAN WEB                │   │    │  + Floating Shards  │      │  T  │
│  │ YANG INTERAKTIF               │   │    ╰─╮   (R3F WebGL)   ╭─╯      │  E  │
│  │                               │   │      ╰─────────────────╯        │  R  │
│  │ Mahasiswa IT & Web Developer  │   │        ◈       ◇                │  A  │
│  │ [ LIHAT PROYEK  (●→) ]  (▶) HUBUNGI SAYA                            │  C  │
│  │ [ 8+ PROYEK ] [ 15+ TECH ] [ SEM 3 ]                                │  T  │
│  │ [GH] [IN] [Next] [3D] [TS]                          BUILDING IMPACT │  •  │
│  └───────────────────────────────┘   └─────────────────────────────────┘     │
├──────────────────────────────────────────────────────────────────────────────┤
│  02 / TENTANG SAYA (#about)                                                  │
│  ┌──────────────────────┐  ┌───────────────────────────────────────────────┐ │
│  │ Interactive Portrait │  │ Narasi Mahasiswa IT & Fokus Rekayasa Web      │ │
│  │ (Water Ripple +      │  ├──────────────────────┬────────────────────────┤ │
│  │  Eclipse Arc + Tilt) │  │ Bento: Fokus Bidang  │ Bento: Pendidikan      │ │
│  │                      │  ├──────────────────────┴────────────────────────┤ │
│  │                      │  │ Bento: Status (● Terbuka Magang & Kolaborasi) │ │
│  └──────────────────────┘  └───────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│  03 / KEAHLIAN (#skills)                                                     │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                    │
│  │ 01 Frontend             │  │ 02 3D & Animasi         │                    │
│  │ [Next.js] [React] [TS]  │  │ [Three.js] [R3F] [GLSL] │                    │
│  ├─────────────────────────┤  ├─────────────────────────┤                    │
│  │ 03 Backend & Database   │  │ 04 Tools & Workflow     │                    │
│  │ [Node.js] [REST] [SQL]  │  │ [Git] [Figma] [Vercel]  │                    │
│  └─────────────────────────┘  └─────────────────────────┘                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  04 / PROYEK UNGGULAN (#projects)                        [+ TAMBAH PROYEK]*  │
│  [Semua]  [Web App]  [3D / Interaktif]  [Tugas Kuliah]  [UI/UX]              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐             │
│  │ Ripple Thumb    │   │ Ripple Thumb    │   │ Ripple Thumb    │             │
│  │ (3D Hover Tilt) │   │ (3D Hover Tilt) │   │ (3D Hover Tilt) │             │
│  │ Judul & Ringkas │   │ Judul & Ringkas │   │ Judul & Ringkas │             │
│  │ [Tags] Demo/GH  │   │ [Tags] Demo/GH  │   │ [Tags] Demo/GH  │             │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘             │
├──────────────────────────────────────────────────────────────────────────────┤
│  05 / KONTAK (#contact)                                                      │
│  ┌────────────────────────┐   ┌────────────────────────────────────────────┐ │
│  │ Mari Berkolaborasi     │   │ Formulir Pesan (Zod Validated)             │ │
│  │ [Salin Email 📋]       │   │ [Nama]            [Email]                  │ │
│  │ [GH] [LinkedIn] [IG]   │   │ [Subjek]                                   │ │
│  │                        │   │ [Pesan...]                                 │ │
│  │                        │   │                    [ KIRIM PESAN  (●→) ]   │ │
│  └────────────────────────┘   └────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│  FOOTER — Monogram • Quick Links • Social Icons • © 2026 [Nama]              │
└──────────────────────────────────────────────────────────────────────────────┘
 * Tombol "+ TAMBAH PROYEK" & ikon Edit/Hapus pada kartu hanya tampil saat sesi Admin aktif.
```

---

## 4. Spesifikasi Desain per Bagian (*Section-by-Section*)

### 4.1 Sticky Glassmorphism Navbar (`Navbar.tsx`)
- **Tinggi**: `76px` (*initial transparent*) → menyusut halus ke `64px` dengan latar `--bg-glass`, `backdrop-blur-xl`, dan garis bawah halus `border-b border-white/[0.08]` saat `scrollY > 24px`.
- **Sisi Kiri**: Monogram geometris inisial pemilik (putih + aksen sudut `#FF4D00`, terinspirasi logo sudut kiri atas `referensi.jpg`) dengan teks kecil nama di sampingnya; klik mengarah ke `#hero`.
- **Tengah (Desktop)**: 5 tautan (`BERANDA`, `TENTANG`, `KEAHLIAN`, `PROYEK`, `KONTAK`) memakai `Cormorant Garamond` `15px` `tracking-[0.14em]`.
  - **Active State (*Scroll Spy*)**: Teks berubah ke `#FF4D00` disertai garis bawah tipis (`h-[2px] bg-ember shadow-[0_0_10px_#FF4D00]`) dengan transisi `layoutId` dari `motion`.
- **Sisi Kanan**:
  - Tombol pill **`HUBUNGI SAYA`** (`rounded-full bg-[#120C09]/90 border border-ember/45 px-5 py-2`) dengan titik oranye berpendar (`w-2 h-2 rounded-full bg-ember shadow-[0_0_10px_#FF4D00]`) di sisi kanan teks — replika langsung tombol `LET'S TALK •` pada `referensi.jpg`.
  - Tombol ikon Admin diskret (`Lock` / `ShieldCheck` saat login, `w-9 h-9 rounded-full border border-white/10 text-ink-muted hover:border-ember/50 hover:text-ember`) dengan `aria-label="Mode Admin"` dan tooltip pintasan `Ctrl+Shift+A`.
- **Mobile (`< 768px`)**: Tombol *hamburger* di kanan yang membuka *full-height obsidian glass drawer* dari kanan dengan *staggered links*, tombol `HUBUNGI SAYA`, dan akses Admin.

### 4.2 Hero Section (`HeroSection.tsx`) — *Above the Fold*
- **Tujuan UX**: Dalam `< 10 detik`, pengunjung langsung melihat nama, peran (*Mahasiswa IT & Web Developer*), keunggulan visual 3D + riak air, serta akses menuju Proyek dan Kontak.
- **Lapisan Visual (*Z-Index Stack*)**:
  1. `z-0`: Latar dasar `#050506` + *radial nebula gradient* hangat (`#9E1F00` / `#FF4D00` opacity rendah) di belakang kanan.
  2. `z-10`: **`WaterRippleCanvas`** (full-bleed WebGL shader) yang merespons setiap pergerakan dan klik kursor dengan gelombang riak air bercahaya *amber caustic*.
  3. `z-20`: **`Hero3DScene`** (React Three Fiber) menempatkan **Cincin Gerhana 3D (*Solar Eclipse Halo*)**, serpihan kristal obsidian 3D mengambang, dan partikel bara di sisi kanan (desktop) / belakang atas (mobile).
  4. `z-25`: **Potret Pemilik** dengan *rim-light masking* halus menyatu di depan bagian bawah cincin gerhana (seperti komposisi subjek + cincin di `referensi.jpg`), dilengkapi *pointer-events-none* pada masker tepi agar interaksi kursor pada kanvas tidak terputus.
  5. `z-30`: **Lapisan Konten & CTA** di sisi kiri (teks tajam 100% bebas distorsi shader) + **Right Vertical Micro-Rail** di tepi kanan desktop.
- **Detail Komponen Kiri Hero**:
  - **Eyebrow**: Titik bara berpendar (`w-2 h-2 rounded-full bg-ember`) + `HALO, SAYA` (`#B8ADA5`) + `[NAMA PANGGILAN]` (`#FF4D00`, `Cormorant Garamond` uppercase).
  - **Headline (`H1`)**: 3 baris *tight-stacked* `Oswald` Bold:
    - Baris 1: `SAYA MEMBANGUN` (`#F5F2EE`)
    - Baris 2: `PENGALAMAN WEB` (`#F5F2EE`)
    - Baris 3: `YANG ` (`#F5F2EE`) + `INTERAKTIF` (`#FF4D00` dengan *soft glow*).
  - **Subheadline**: 1–2 kalimat dalam `Plus Jakarta Sans` (`max-w-[46ch]`, `#B8ADA5`) menjelaskan peran sebagai Mahasiswa IT & Web Developer yang memadukan *creative coding* 3D dan rekayasa *full-stack*.
  - **Grup CTA**:
    - **Primary CTA (`LIHAT PROYEK`)**: Kapsul oranye solid (`bg-ember hover:bg-ember-glow rounded-full pl-6 pr-2 py-2 shadow-[--glow-ember-sm]`) dengan teks `Oswald` tebal di kiri dan **lingkaran hitam tersembunyi (*recessed dark orb*)** `w-9 h-9 rounded-full bg-[#090706]` di kanan berisi ikon `ArrowUpRight` yang bergeser diagonal saat *hover*.
    - **Secondary CTA (`HUBUNGI SAYA`)**: Ikon lingkaran berbingkai oranye (`w-10 h-10 rounded-full border border-ember/70 bg-ember/10`) + label `Oswald` uppercase putih; klik *smooth scroll* ke `#contact`.
  - **Mini Stats Strip**: 3 item horizontal kompak dengan ikon vektor tipis 1.5px (`FolderGit2`, `Cpu`, `GraduationCap`), angka besar `Oswald` (`6+`, `12+`, `SEM 3`), dan label mikro uppercase (`PROYEK`, `TEKNOLOGI`, `MAHASISWA IT`).
  - **Bottom Tech & Social Row**: Label kecil `TEKNOLOGI UTAMA & TAUTAN` diikuti 5–6 ikon garis putih minimalis (`GitHub`, `LinkedIn`, `Next.js`, `Three.js`, `TypeScript`, `Tailwind`) pada opacity `75%` yang menyala `#FF4D00` & sedikit naik (`-translate-y-0.5`) saat *hover*.
- **Scroll Indicator**: Garis tipis vertikal berpendar oranye di bawah *micro-rail* kanan dengan animasi *pulse* lembut mengajak pengunjung menggulir ke `#about`.

### 4.3 Tentang Saya (`AboutSection.tsx`)
- **Header Bagian**: Label nomor editorial `02 / TENTANG SAYA` (`Cormorant Garamond` `#FF4D00`) + judul `Oswald` (`MENGENAL LEBIH DEKAT`).
- **Grid 12 Kolom (Desktop)**:
  - **Kiri (5 kolom) — Bingkai Foto Interaktif**:
    - Kartu potret rasio `4:5` (`rounded-2xl overflow-hidden border border-white/10`) dengan aksen lengkung cincin oranye tipis di belakang sudut atas-kanan (pengulangan motif gerhana secara halus).
    - Menggunakan `WaterRippleCanvas` lokal + efek *3D tilt* halus saat *hover*, sehingga foto terasa hidup namun tetap elegan.
    - Badge mengambang di pojok bawah foto: `Mahasiswa IT • Semester 3` dalam kapsul *obsidian glass*.
  - **Kanan (7 kolom) — Narasi & Bento Highlight Cards**:
    - Narasi 2 paragraf ringkas tentang latar belakang studi, minat pada *Full-Stack Web* dan *Creative WebGL*, serta pendekatan dalam membangun produk yang cepat dan rapi.
    - **Bento Grid (2×2 / 3 kartu asimetris)** bergaya *obsidian surface* (`bg-surface border border-white/[0.08] rounded-2xl p-5`) dengan efek *cursor spotlight* oranye halus saat *hover*:
      1. **Fokus Bidang**: `Full-Stack & Creative Frontend` + ikon `Layers`.
      2. **Pendidikan**: `[Nama Universitas]` — `[Jurusan / Semester]` + ikon `GraduationCap`.
      3. **Status Ketersediaan** *(full-width card)*: Indikator titik hijau/oranye berdenyut (`animate-pulse`) + teks **`Terbuka untuk Magang, Proyek Freelance & Kolaborasi`** + tombol cepat unduh CV / menuju Kontak.

### 4.4 Keahlian / Tech Stack (`SkillsSection.tsx`)
- **Header Bagian**: `03 / KEAHLIAN` + judul `TECH STACK & ARSENAL`.
- **Layout**: Grid 2×2 (desktop) / 1 kolom (mobile) untuk 4 kategori sesuai PRD:
  1. **Frontend** (`Next.js`, `React`, `TypeScript`, `Tailwind CSS`, `HTML/CSS`)
  2. **3D & Animasi** (`Three.js`, `React Three Fiber`, `GLSL Shaders`, `Motion`)
  3. **Backend & Database** (`Node.js`, `REST API`, `SQLite / PostgreSQL`, `Prisma`)
  4. **Tools & Workflow** (`Git`, `GitHub`, `Figma`, `Vercel`, `VS Code`)
- **Anatomi Kartu Kategori**:
  - Permukaan `#0D0B0A` dengan garis tepi atas tipis berpendar halus saat *hover* (`hover:border-ember/40`), nomor indeks (`01`–`04`) dalam `JetBrains Mono` berwarna `#FF4D00`.
  - Di dalam kartu, setiap keahlian ditampilkan sebagai **Interactive Skill Chip** (`bg-elevated border border-white/[0.07] rounded-xl px-3.5 py-2.5`):
    - Ikon teknologi + nama teknologi (`Plus Jakarta Sans` medium).
    - Indikator tingkat kemahiran (`Dasar` / `Menengah` / `Mahir`) divisualisasikan sebagai **3 segmen batang mikro bara** (1, 2, atau 3 segmen menyala `#FF4D00`) + label *tooltip/subtext* yang jujur tanpa menggunakan persentase palsu.
    - *Micro-interaction*: saat *hover*, chip terangkat `2px`, bingkai menyala `#FF4D00/45`, dan ikon berubah ke aksen amber.

### 4.5 Proyek / Projects Showcase (`ProjectsSection.tsx`, `ProjectCard.tsx`, `ProjectModal.tsx`)
- **Header & Bar Filter**:
  - Kiri: `04 / PROYEK` + judul `KARYA & EKSPERIMEN`.
  - Kanan: Apabila Admin sudah terautentikasi, tampil tombol kapsul oranye **`+ TAMBAH PROYEK`** + indikator status *Admin Mode Aktif* (dan tombol *Keluar Admin*).
  - **Filter Kategori**: Deretan pill (`Semua`, `Web App`, `3D / Interaktif`, `Tugas Kuliah`, `UI/UX`). Pill aktif memakai latar `#FF4D00` dengan animasi pergeseran `motion` (`layoutId="activeProjectFilter"`).
- **Grid Kartu Proyek (`ProjectCard.tsx`)**:
  - Desktop: 3 kolom (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`), dengan kartu berstatus `featured: true` mendapat lencana kecil `★ UNGGULAN` berwarna amber (`#FFA23A`) dan *border glow* halus.
  - **Area Thumbnail (`aspect-[16/10]`)**:
    - Dilapisi efek **riak air halus (*water ripple on hover*)** (atau transisi *zoom + caustic sheen* pada mode *reduced-motion* / mobile) serta efek **3D perspective tilt** (`max ±6°`) mengikuti posisi kursor di kartu + efek kilau *radial spotlight* (`rgba(255, 77, 0, 0.14)`).
    - Sudut kiri atas: badge kategori (`bg-void/80 backdrop-blur-md border border-white/15 font-mono text-xs`).
    - Sudut kanan atas (khusus **Admin Mode**): dua tombol ikon cepat — **Edit (`Pencil`)** dan **Hapus (`Trash2`)** — dengan `stopPropagation()` agar tidak membuka modal detail.
  - **Area Konten Kartu**:
    - Judul (`Oswald` 22px, `#F5F2EE`, berubah ke `#FF6A1A` saat *hover*).
    - Ringkasan singkat (`line-clamp-2`, `#B8ADA5`).
    - Maksimal 4 *tech stack pills* (`JetBrains Mono` 11px) + `+N` jika lebih.
    - Baris aksi bawah: tautan **Live Demo** (`ExternalLink`) & **GitHub** (`Github`) + teks `Detail →` yang membuka `ProjectModal`.
- **Modal Detail Proyek (`ProjectModal.tsx`)**:
  - *Backdrop* gelap buram (`bg-void/85 backdrop-blur-lg`), kontainer modal maks. `820px` (`bg-surface border border-ember/25 rounded-2xl overflow-hidden`).
  - Bagian atas: gambar *preview* rasio `16:9` dengan *gradient fade* ke permukaan modal + tombol tutup `X` di sudut kanan atas (mendukung tombol `Escape`).
  - Bagian isi: kategori, status unggulan, tanggal dibuat, judul besar `Oswald`, deskripsi lengkap terstruktur, daftar seluruh *tech stack*, serta tombol aksi utama **Buka Live Demo** (kapsul `#FF4D00`) dan **Lihat Kode di GitHub** (outline putih/ember).
- **Empty State**: Jika filter tidak memiliki proyek, tampilkan kartu *obsidian* di tengah berisi ikon redup, pesan *"Belum ada proyek pada kategori ini"*, dan tombol reset filter ke `Semua` (atau tombol `+ Tambah Proyek` bila dalam Admin Mode).

### 4.6 Kontak & Footer (`ContactSection.tsx`)
- **Layout 2 Kolom (Desktop: 5 kolom kiri / 7 kolom kanan)**:
  - **Kolom Kiri — Info & Akses Cepat**:
    - Eyebrow `05 / KONTAK` + judul besar `MARI BANGUN SESUATU` dengan kata `SESUATU` berwarna `#FF4D00`.
    - Kartu **Salin Email Cepat**: menampilkan alamat email dalam `JetBrains Mono`, tombol **`Salin Email`** yang berubah seketika menjadi **`Tersalin ✓`** (`#22C55E`) selama 2 detik + memicu *toast* `"Email berhasil disalin!"`.
    - Grid ikon sosial media (`GitHub`, `LinkedIn`, `Instagram`, `Email`) bergaya ubin gelap dengan bingkai tipis yang berpendar oranye saat *hover*.
  - **Kolom Kanan — Formulir Pesan (`POST /api/contact`)**:
    - Dibungkus kartu `bg-surface border border-white/[0.08] rounded-2xl p-6 md:p-8`.
    - Field: `Nama` & `Email` (2 kolom sejajar di desktop), `Subjek`, dan `Pesan` (`textarea` 4 baris).
    - Styling input: `bg-elevated border border-white/10 rounded-xl px-4 py-3 text-ink-primary placeholder:text-ink-muted focus:border-ember focus:ring-2 focus:ring-ember/25 outline-none`.
    - Pesan validasi `zod` muncul tepat di bawah *field* bermasalah dalam warna `#EF4444` (`13px`).
    - Tombol kirim menggunakan gaya kapsul oranye khas Hero (`KIRIM PESAN` + *recessed orb* ikon `Send` / *spinner* saat `isSubmitting`).
- **Footer**:
  - Garis pemisah tipis dengan gradien oranye pudar di tengah (`via-ember/40`).
  - Satu baris rapi (desktop) / bertumpuk terpusat (mobile): Monogram + hak cipta `© 2026 [Nama Lengkap]`, tautan cepat 5 bagian, dan tombol *"Kembali ke Atas ↑"*.

---

## 5. Desain Mode Admin & In-Web Project Manager (`FR-06`)

Agar fitur tambah, edit, dan hapus proyek langsung dari web tetap terasa menyatu dengan estetika *Solar Eclipse Obsidian* (bukan seperti panel admin generik terpisah), seluruh komponen manajemen proyek memakai sistem token yang sama.

### 5.1 Alur Autentikasi Admin (*Passcode Modal* & `/admin`)
- **Pemicu**: Klik ikon kunci di Navbar, akses langsung `/admin`, atau pintasan keyboard `Ctrl+Shift+A`.
- **Tampilan Modal Login**:
  - Lebar maks. `420px`, kartu *obsidian glass* dengan ikon gembok berpendar `#FF4D00` di bagian atas.
  - Input *passcode* bertipe `password` dengan tombol *show/hide*, pesan error jelas jika salah (`401`), dan tombol submit `MASUK MODE ADMIN`.
  - Setelah sukses (`POST /api/admin/auth` mengembalikan *HTTP-only cookie*), tampil *floating admin bar* tipis atau tombol `+ Tambah Proyek` di `#projects` beserta tombol `Keluar Admin`.

### 5.2 Formulir Tambah / Edit Proyek (`ProjectFormModal.tsx`) — *Live Split Preview*
- **Desktop (`≥ 1024px`)**: Modal lebar (`max-w-5xl`) terbagi menjadi **2 panel sejajar**:
  - **Panel Kiri (58%, *scrollable form*)**:
    1. **Judul Proyek** *(wajib, counter `0/80` karakter)*.
    2. **Kategori** *(dropdown styled gelap: `Web App`, `3D / Interaktif`, `Tugas Kuliah`, `UI/UX`)* & **Toggle Proyek Unggulan (`Featured`)**.
    3. **Ringkasan Singkat** *(wajib, counter `0/160` karakter)*.
    4. **Deskripsi Lengkap** *(textarea multi-baris untuk tampilan Modal Detail)*.
    5. **Tech Stack** *(multi-tag input: ketik lalu tekan `Enter` atau koma untuk membentuk chip yang bisa dihapus dengan klik `×`)*.
    6. **Thumbnail Proyek** *(tab ganda: **Input URL Gambar** atau **Unggah File** area *drag-and-drop* maks. 2 MB JPG/PNG/WebP dengan validasi ukuran & preview langsung)*.
    7. **Tautan Opsional**: `URL Live Demo` & `URL Repository GitHub` (validasi protokol `http://` / `https://`).
  - **Panel Kanan (42%, *sticky live preview*)**:
    - Header kecil: `PRATINJAU KARTU LANGSUNG` dengan titik status berkedip oranye.
    - Merender komponen **`ProjectCard` sungguhan** secara *real-time* mengikuti setiap ketikan di formulir, di atas latar grid gelap halus.
    - Di bawah pratinjau: tombol **Batal** (`ghost`) dan **Simpan Proyek** / **Perbarui Proyek** (kapsul oranye `#FF4D00` dengan *loading spinner*).
- **Mobile (`< 1024px`)**: Menggunakan *segmented tab switcher* di atas modal (`[ Edit Form | Pratinjau Kartu ]`) agar form tetap nyaman diisi di layar kecil.

### 5.3 Dialog Konfirmasi Hapus & Sistem Notifikasi (*Toast*)
- **Confirm Delete Dialog**: Modal ringkas `max-w-md`, ikon peringatan `#EF4444`, menampilkan judul proyek yang akan dihapus, tombol `Batal` (default focus untuk keamanan), dan tombol `Ya, Hapus Proyek` (`bg-red-600 hover:bg-red-500`).
- **Toast Notification**: Posisi pojok kanan bawah (`bottom-5 right-5 z-50`), gaya `bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl`, dilengkapi garis aksen vertikal 3px di kiri (`#22C55E` sukses, `#EF4444` gagal, `#FF4D00` info) dan otomatis hilang dalam `3.5 detik`.

---

## 6. Spesifikasi Interaksi 3D WebGL, Efek Riak Air & Motion

### 6.1 `Hero3DScene.tsx` — Solar Eclipse & Obsidian Shards (Three.js / R3F)
- **Komposisi Geometri 3D**:
  1. **Solar Eclipse Halo Ring**: Geometri `TorusGeometry` tipis atau *shader plane* melingkar dengan *custom GLSL glow shader* bergradasi `#FFE4A3` (inti) → `#FF6A1A` (korona tengah) → `#9E1F00` (aura luar) yang berdenyut organik sangat lambat (*breathing pulse* 0.4 Hz).
  2. **Floating Obsidian Shards**: 6–10 objek polihedral berfaset (*icosahedron / octahedron* terdistorsi) dengan material gelap reflektif (`roughness: 0.25`, `metalness: 0.75`, warna `#141010`) yang disinari *pointLight* oranye (`#FF4D00`) dan *rim directionalLight* amber (`#FFA23A`) sehingga tepiannya berkilau persis seperti pecahan kristal kanan-bawah di `referensi.jpg`.
  3. **Ember Dust Particles**: `Points` ringan (`120–180` partikel di desktop, `50` di tablet) yang melayang perlahan ke atas dengan kedipan redup hangat.
- **Interaksi Kursor**:
  - Posisi pointer ternormalisasi (`-1` hingga `1`) menggerakkan kamera/grup objek dengan interpolasi *smooth lerp* (`damp factor: 0.06`), rotasi maks. `±8°` agar terasa berdimensi tanpa membuat pusing.
- **Batas Performa**:
  - Dimuat via `next/dynamic(..., { ssr: false })` dengan *CSS fallback gradient eclipse* instan selama bundle 3D dimuat (menjaga LCP `< 2.5s` dan CLS `0`).
  - `dpr={[1, 1.5]}` (maksimal `2`), `frameloop` dijeda otomatis saat tab tidak aktif (*Page Visibility API*) atau saat Hero sudah keluar jauh dari *viewport* (*IntersectionObserver*).

### 6.2 `WaterRippleCanvas.tsx` — *Liquid Obsidian Water Ripple Shader*
- **Perilaku Visual**:
  - Saat kursor bergerak di atas kanvas Hero atau gambar proyek/profil, shader memicu gelombang riak melingkar yang menjalar keluar dengan redaman eksponensial (*exponential damping*, durasi hidup tiap riak `~1.1–1.4 detik`).
  - Saat `pointerdown` (klik), dilepaskan impuls gelombang dengan amplitudo `1.6×` lebih kuat.
  - **Refraksi & Kilau Air (*Amber Caustics*)**: *Fragment shader* menggeser koordinat UV latar/gambar sebesar gradien normal gelombang (`displacementStrength: 0.018–0.028`) sekaligus menambahkan sedikit sorotan spekular hangat (`#FFA23A` / `#FF4D00`, intensitas `0.12–0.22`) pada puncak riak agar terasa seperti cairan obsidian yang memantulkan cahaya gerhana.
- **Implementasi Efisien**:
  - Menggunakan *multi-ripple uniform ring buffer* (mis. array 12–16 titik riak `(x, y, startTime, strength)`) atau *ping-pong FBO wave solver* beresolusi `256×256` sehingga beban GPU sangat rendah dan stabil di **60 FPS**.
- **Aturan Keterbacaan**:
  - Shader **hanya** diterapkan pada kanvas latar belakang Hero, bingkai foto profil, dan *thumbnail* proyek — **tidak pernah** membungkus elemen teks utama, tombol, atau input formulir.

### 6.3 Standar Animasi UI (`motion`)
- **Kurva Easing Standar**: `cubic-bezier(0.22, 1, 0.36, 1)` (*expo-out* halus dan sinematik).
- **Durasi**:
  - *Micro-interaction* (hover tombol, pill, chip): `180ms – 240ms`.
  - *Scroll reveal* section (`whileInView`, `viewport={{ once: true, amount: 0.2 }}`): `500ms – 650ms`, pergeseran vertikal ringan `y: 24 → 0` + `opacity: 0 → 1`.
  - Transisi modal & drawer: `260ms – 320ms` (`scale: 0.96 → 1`, `opacity: 0 → 1`).
- **Properti Aman GPU**: Hanya menganimasikan `transform`, `opacity`, dan *shader uniforms*.

### 6.4 Matriks Fallback & Aksesibilitas (`prefers-reduced-motion`)

| Kondisi Perangkat / Preferensi | Hero 3D (`Hero3DScene`) | Efek Riak Air (`WaterRippleCanvas`) | Animasi UI (`motion`) |
| :--- | :--- | :--- | :--- |
| **Desktop Modern (WebGL Aktif)** | Penuh (Eclipse Ring + Shards + Ember + Cursor Parallax 60fps) | Penuh (Gerak mouse + impuls klik + *amber caustics*) | Penuh (*stagger*, *scroll reveal*, 3D card tilt) |
| **Mobile / Tablet Berdaya Rendah** | Ringan (Eclipse Ring + partikel terbatas, atau *CSS radiant eclipse ring* jika GPU rendah) | Hanya riak ringan saat *tap*, nonaktif saat *scroll* agar tidak menahan guliran | *Fade* + translasi singkat tanpa 3D *hover tilt* |
| **`prefers-reduced-motion: reduce`** | Dihentikan (tampil *static high-res eclipse visual* / frame diam) | **Dinonaktifkan total** (gambar & latar tampil statis jernih) | Hanya *opacity fade* singkat (`150ms`), tanpa pergeseran/rotasi |
| **Tanpa Dukungan WebGL** | *Graceful fallback* ke CSS *radial solar eclipse* & SVG shards | *Graceful fallback* ke gambar `next/image` dengan hover *scale* halus | Tetap berjalan normal |

---

## 7. Inventaris Komponen & State UI

Setiap komponen interaktif wajib mengimplementasikan seluruh state berikut secara konsisten:

| Komponen | Default | Hover | Focus-Visible (`Keyboard`) | Loading / Active | Disabled / Error |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Capsule CTA** | `bg-ember` + orb `#090706` + panah | `bg-ember-glow`, `--glow-ember-sm`, panah geser `2px` | `ring-2 ring-amber ring-offset-2 ring-offset-void` | Spinner putih di dalam orb | `opacity-50 cursor-not-allowed` |
| **Secondary Outline CTA** | `border-white/15 bg-surface/60` | `border-ember/60 text-ember-glow` | `ring-2 ring-ember/70` | `scale-[0.98]` | `opacity-45` |
| **Nav Link** | `text-ink-secondary` | `text-ink-primary` | `outline-1 outline-ember rounded` | `text-ember` + underline `#FF4D00` | — |
| **Project Card** | `bg-surface border-white/[0.08]` | `border-ember/40`, 3D tilt, spotlight, ripple | `ring-2 ring-ember` | Skeleton *shimmer* obsidian saat *initial fetch* | Fallback gambar lokal jika URL rusak |
| **Form Input / Textarea** | `bg-elevated border-white/10` | `border-white/20` | `border-ember ring-2 ring-ember/25` | — | `border-red-500` + pesan error `zod` di bawah |

---

## 8. Pemetaan Aset Visual (`Reference/` → `public/images/`)

Berdasarkan berkas yang sudah tersedia di direktori proyek:
- [`Reference/referensi.jpg`](../Reference/referensi.jpg): Acuan *moodboard*, palet warna, komposisi Hero, tipografi, dan gaya tombol (tetap disimpan sebagai dokumen referensi, tidak perlu di-*bundle* ke klien).
- [`Reference/mahdi 1.jpeg`](../Reference/mahdi%201.jpeg) & [`Reference/Mahdi 2.jpeg`](../Reference/Mahdi%202.jpeg): Kandidat foto profil pemilik untuk disalin, dioptimasi (WebP, maks. ~1200px), dan ditempatkan di `public/images/profile-hero.webp` (untuk Hero) dan `public/images/profile-about.webp` (untuk bingkai interaktif di `#about`).
- **Thumbnail Proyek Awal (`public/images/projects/`)**: Siapkan 3–4 gambar *placeholder* bertema gelap (rasio `16:10`, WebP) untuk *seed data* `data/projects.json`, serta direktori `public/uploads/` (pengembangan lokal) bagi thumbnail yang diunggah lewat Admin UI.

---

## 9. Checklist Verifikasi Desain Sebelum Implementasi Selesai

- [ ] **Kesetiaan Referensi**: Nuansa *Obsidian + Solar Eclipse Orange (`#FF4D00`)*, kontras font `Oswald` × `Cormorant Garamond`, tombol kapsul *recessed orb*, tombol pill `HUBUNGI SAYA •`, dan komposisi cincin gerhana terasa autentik seperti `referensi.jpg`.
- [ ] **Kejelasan *Above the Fold***: Nama, peran, 3D + riak air, dan CTA `LIHAT PROYEK` terlihat utuh pada layar `1366×768` dan `1440×900` tanpa harus menggulir.
- [ ] **Kontras & Keterbacaan**: Tidak ada teks yang terdistorsi oleh shader air; seluruh rasio kontras teks ≥ `4.5:1` (WCAG 2.1 AA).
- [ ] **Responsivitas Penuh**: Tidak ada *horizontal overflow* pada lebar `360px`, `768px`, dan `1440px`; *tap target* di mobile minimal `44×44px`.
- [ ] **Konsistensi Admin UI**: Modal login passcode, `ProjectFormModal` dengan *live preview*, dialog konfirmasi hapus, dan *toast* seluruhnya mengikuti tema *Solar Eclipse Obsidian*.
- [ ] **Performa & Fallback**: `prefers-reduced-motion` dan *fallback* non-WebGL teruji; Lighthouse Desktop memenuhi target PRD (`Performance ≥ 85–90`, `Accessibility ≥ 95`).
