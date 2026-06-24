import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/storage";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, role: user.role });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
