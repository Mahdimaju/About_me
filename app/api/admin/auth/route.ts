import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  buildAdminCookieOptions,
  createSessionToken,
  isAdminAuthenticated,
  isSecureRequest,
  verifyPasscode,
} from "@/lib/auth";
import { adminPasscodeSchema } from "@/lib/validators";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminPasscodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Passcode tidak valid.",
        },
        { status: 400 }
      );
    }

    if (!verifyPasscode(parsed.data.passcode)) {
      return NextResponse.json(
        { error: "Passcode admin tidak valid. Periksa kembali ADMIN_PASSCODE." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set({
      ...buildAdminCookieOptions(request),
      value: token,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Permintaan autentikasi tidak valid." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(request),
    path: "/",
    maxAge: 0,
  });
  return response;
}
