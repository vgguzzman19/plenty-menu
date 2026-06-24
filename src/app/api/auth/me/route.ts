import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  return NextResponse.json({ userId: payload.userId, role: payload.role });
}
