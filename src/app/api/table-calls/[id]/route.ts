import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { resolveTableCall, getUserById } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";

export async function PUT(_: NextRequest, { params }: { params: { id: string } }) {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || (payload.role !== "admin" && payload.role !== "employee")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user = await getUserById(payload.userId);
  if (!user || !user.active) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = parseInt(params.id);
  const updated = await resolveTableCall(id);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  publish("table_call_resolved", { id });
  return NextResponse.json(updated);
}
