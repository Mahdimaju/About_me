import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { readProjects } from "@/lib/projects-store";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Proyek | Mahdi Portfolio",
  robots: { index: false, follow: false },
};

async function AdminLoader() {
  await connection();
  const [projects, isAdmin] = await Promise.all([
    readProjects(),
    isAdminAuthenticated(),
  ]);
  return <AdminDashboard initialProjects={projects} initialIsAdmin={isAdmin} />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-void flex items-center justify-center font-mono text-xs text-ink-muted">
          Memuat Portal Admin...
        </div>
      }
    >
      <AdminLoader />
    </Suspense>
  );
}
