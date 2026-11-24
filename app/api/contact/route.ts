import { NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/projects-store";
import { contactFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Formulir belum lengkap.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const saved = await saveContactMessage(parsed.data);
    return NextResponse.json(
      {
        success: true,
        id: saved.id,
        message: "Pesan Anda berhasil dikirim! Saya akan membalas secepatnya.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
