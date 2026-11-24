import { Suspense } from "react";
import { connection } from "next/server";
import seedProjects from "@/data/projects.json";
import type { Project } from "@/lib/types";
import { readProjects } from "@/lib/projects-store";
import { isAdminAuthenticated } from "@/lib/auth";
import { PortfolioShell } from "@/components/PortfolioShell";

async function LivePortfolioLoader() {
  await connection();
  const [projects, isAdmin] = await Promise.all([
    readProjects(),
    isAdminAuthenticated(),
  ]);
  return <PortfolioShell initialProjects={projects} initialIsAdmin={isAdmin} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <PortfolioShell
          initialProjects={seedProjects as Project[]}
          initialIsAdmin={false}
        />
      }
    >
      <LivePortfolioLoader />
    </Suspense>
  );
}
