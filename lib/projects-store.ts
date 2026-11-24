import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { get as getBlob, put as putBlob } from "@vercel/blob";
import type { ContactMessage, Project, ProjectInput } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const BLOB_PROJECTS_PATH = "portfolio-data/projects.json";

let writeQueue = Promise.resolve();

function serializeWrite<T>(task: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(task, task);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function isBlobStorageEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
  );
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

async function readLocalSeedProjects(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function readProjects(): Promise<Project[]> {
  if (isBlobStorageEnabled()) {
    try {
      const result = await getBlob(BLOB_PROJECTS_PATH, {
        access: "public",
        useCache: false,
      });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        const parsed = JSON.parse(text) as Project[];
        if (Array.isArray(parsed)) {
          return sortProjects(parsed);
        }
      }
    } catch {
      // Fall back to bundled local seed on first boot before any write
    }
  }

  const local = await readLocalSeedProjects();
  return sortProjects(local);
}

async function persistProjects(projects: Project[]): Promise<void> {
  const payload = JSON.stringify(projects, null, 2);

  if (isBlobStorageEnabled()) {
    await putBlob(BLOB_PROJECTS_PATH, payload, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const tempPath = `${PROJECTS_FILE}.tmp`;
  await fs.writeFile(tempPath, payload, "utf-8");
  await fs.rename(tempPath, PROJECTS_FILE);
}

export async function createProject(input: ProjectInput): Promise<Project> {
  return serializeWrite(async () => {
    const projects = await readProjects();
    const now = new Date().toISOString();
    const slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 32);
    const id = `${slug || "project"}-${crypto.randomBytes(3).toString("hex")}`;

    const project: Project = {
      id,
      title: input.title,
      summary: input.summary,
      description: input.description || input.summary,
      category: input.category,
      techStack: input.techStack,
      thumbnailUrl: input.thumbnailUrl,
      liveUrl: input.liveUrl || undefined,
      githubUrl: input.githubUrl || undefined,
      featured: Boolean(input.featured),
      createdAt: now,
      updatedAt: now,
    };

    projects.unshift(project);
    await persistProjects(projects);
    return project;
  });
}

export async function updateProject(
  id: string,
  patch: Partial<ProjectInput>
): Promise<Project | null> {
  return serializeWrite(async () => {
    const projects = await readProjects();
    const index = projects.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const current = projects[index];
    const updated: Project = {
      ...current,
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.summary !== undefined ? { summary: patch.summary } : {}),
      ...(patch.description !== undefined
        ? { description: patch.description || current.summary }
        : {}),
      ...(patch.category !== undefined ? { category: patch.category } : {}),
      ...(patch.techStack !== undefined ? { techStack: patch.techStack } : {}),
      ...(patch.thumbnailUrl !== undefined
        ? { thumbnailUrl: patch.thumbnailUrl }
        : {}),
      ...(patch.liveUrl !== undefined
        ? { liveUrl: patch.liveUrl || undefined }
        : {}),
      ...(patch.githubUrl !== undefined
        ? { githubUrl: patch.githubUrl || undefined }
        : {}),
      ...(patch.featured !== undefined ? { featured: patch.featured } : {}),
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updated;
    await persistProjects(projects);
    return updated;
  });
}

export async function deleteProject(id: string): Promise<boolean> {
  return serializeWrite(async () => {
    const projects = await readProjects();
    const filtered = projects.filter((item) => item.id !== id);
    if (filtered.length === projects.length) return false;
    await persistProjects(filtered);
    return true;
  });
}

export async function saveContactMessage(
  entry: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  return serializeWrite(async () => {
    const record: ContactMessage = {
      id: `msg-${crypto.randomBytes(4).toString("hex")}`,
      ...entry,
      createdAt: new Date().toISOString(),
    };

    // Serverless filesystem on Vercel is read-only; log safely in production
    if (process.env.VERCEL) {
      console.info("[contact-message]", {
        id: record.id,
        subject: record.subject,
        createdAt: record.createdAt,
      });
      return record;
    }

    await fs.mkdir(DATA_DIR, { recursive: true });
    let messages: ContactMessage[] = [];
    try {
      const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) messages = parsed;
    } catch {
      messages = [];
    }

    messages.unshift(record);
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
    return record;
  });
}
