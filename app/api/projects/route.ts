import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProject, readProjects } from "@/lib/projects-store";
import { projectInputSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const projects = await readProjects();

  const filtered =
    category && category !== "Semua"
      ? projects.filter((item) => item.category === category)
      : projects;

  return NextResponse.json(
    { projects: filtered },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: "Akses ditolak. Silakan masuk ke Mode Admin terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = projectInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Data proyek tidak valid.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const project = await createProject(parsed.data);
    return NextResponse.json({ project }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses payload proyek." },
      { status: 400 }
    );
  }
}
