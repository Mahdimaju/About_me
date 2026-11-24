import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteProject, updateProject } from "@/lib/projects-store";
import { projectPatchSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/projects/[id]">
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: "Akses ditolak. Diperlukan sesi Admin aktif." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = projectPatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Data pembaruan tidak valid.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const updated = await updateProject(id, parsed.data);
    if (!updated) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ project: updated });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui data proyek." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/projects/[id]">
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: "Akses ditolak. Diperlukan sesi Admin aktif." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const removed = await deleteProject(id);
  if (!removed) {
    return NextResponse.json(
      { error: "Proyek tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ deleted: true, id });
}
