import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getUserById } from "@/lib/storage";

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Comprueba el estado actual en BD: si deshabilitaron la cuenta, deja de valer
  // aunque el JWT siga siendo válido
  const user = await getUserById(payload.userId);
  if (!user || !user.active) return NextResponse.json({ error: "Cuenta deshabilitada" }, { status: 401 });

  return NextResponse.json({ userId: payload.userId, role: payload.role });
}
