import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { resetResolvedCalls } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";

// Solo el admin puede borrar el historial — un empleado nunca debe poder
// limpiar el registro de quién ha atendido qué.
export async function POST() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await resetResolvedCalls();
  publish("table_calls_log_reset", {});
  return NextResponse.json({ ok: true });
}
