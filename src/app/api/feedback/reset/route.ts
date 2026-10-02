import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { resetFeedback } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";

// Solo el admin puede borrar las opiniones recogidas.
export async function POST() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await resetFeedback();
  publish("feedback_reset", {});
  return NextResponse.json({ ok: true });
}
