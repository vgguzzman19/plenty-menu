import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/lib/storage";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const users = await getUsers();
  return NextResponse.json({ needsSetup: users.length === 0 });
}

export async function POST(req: NextRequest) {
  const users = await getUsers();
  if (users.length > 0) {
    return NextResponse.json({ error: "El sistema ya está configurado" }, { status: 403 });
  }

  const { username, password } = await req.json();
  if (!username || !password || password.length < 6) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await createUser({ username, passwordHash, role: "admin" });

  return NextResponse.json({ ok: true });
}
