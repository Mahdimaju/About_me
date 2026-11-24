"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { skillCategories } from "@/data/skills";
import { ToastProvider, useToast } from "@/components/ui/ToastProvider";
import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { AdminAuthModal } from "@/components/projects/AdminAuthModal";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { DeleteConfirmModal } from "@/components/projects/DeleteConfirmModal";

interface PortfolioShellProps {
  initialProjects: Project[];
  initialIsAdmin: boolean;
}

function PortfolioInner({
  initialProjects,
  initialIsAdmin,
}: PortfolioShellProps) {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const totalSkills = useMemo(
    () => skillCategories.reduce((acc, cat) => acc + cat.items.length, 0),
    []
  );

  // Global keyboard shortcut: Ctrl+Shift+A to open Admin mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setAuthModalOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogoutAdmin = useCallback(async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      setIsAdmin(false);
      showToast({
        title: "Keluar dari Mode Admin",
        description: "Sesi admin telah ditutup dengan aman.",
        variant: "info",
      });
    }
  }, [showToast]);

  const handleSavedProject = useCallback((saved: Project, isEdit: boolean) => {
    setProjects((prev) => {
      const next = isEdit
        ? prev.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...prev];
      return next.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }, []);

  const handleDeletedProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
    setSelectedProject((prev) => (prev?.id === id ? null : prev));
  }, []);

  const openAddProject = () => {
    setEditingProject(null);
    setFormModalOpen(true);
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setFormModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-void text-ink-primary">
      <Navbar isAdmin={isAdmin} onOpenAdmin={() => setAuthModalOpen(true)} />

      <main className="flex-1">
        <HeroSection projectCount={projects.length} skillCount={totalSkills} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection
          projects={projects}
          isAdmin={isAdmin}
          onSelectProject={setSelectedProject}
          onAddProject={openAddProject}
          onEditProject={openEditProject}
          onDeleteProject={setDeletingProject}
          onLogoutAdmin={handleLogoutAdmin}
        />
        <ContactSection />
      </main>

      <Footer />

      {/* Overlays & Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <AdminAuthModal
        open={authModalOpen}
        isAdmin={isAdmin}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={() => setIsAdmin(true)}
        onLogout={handleLogoutAdmin}
        onAddProject={openAddProject}
      />

      <ProjectFormModal
        open={formModalOpen}
        editingProject={editingProject}
        onClose={() => {
          setFormModalOpen(false);
          setEditingProject(null);
        }}
        onSaved={handleSavedProject}
      />

      <DeleteConfirmModal
        project={deletingProject}
        onClose={() => setDeletingProject(null)}
        onDeleted={handleDeletedProject}
      />
    </div>
  );
}

export function PortfolioShell(props: PortfolioShellProps) {
  return (
    <ToastProvider>
      <PortfolioInner {...props} />
    </ToastProvider>
  );
}
