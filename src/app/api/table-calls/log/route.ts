import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRecentResolvedCalls, getUserById } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";

// Historial de avisos atendidos en las últimas 24h — ventana móvil, se
// "resetea" sola porque las entradas más antiguas dejan de entrar en el rango.
export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || (payload.role !== "admin" && payload.role !== "employee")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user = await getUserById(payload.userId);
  if (!user || !user.active) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json(await getRecentResolvedCalls());
}
