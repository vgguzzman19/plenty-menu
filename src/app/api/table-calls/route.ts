import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createTableCall, getPendingTableCalls } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";

// Público — cualquier cliente de la carta puede avisar que está listo para pedir
export async function POST(req: NextRequest) {
  const { tableNumber } = await req.json();
  const n = Number(tableNumber);
  if (!Number.isInteger(n) || n <= 0) {
    return NextResponse.json({ error: "Número de mesa inválido" }, { status: 400 });
  }
  const call = await createTableCall(n);
  publish("table_call", call);
  return NextResponse.json(call, { status: 201 });
}

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json(await getPendingTableCalls());
}
