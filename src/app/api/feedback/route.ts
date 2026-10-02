import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createFeedback, getRecentFeedback, getUserById } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";

const MAX_COMMENT_LEN = 500;

// Público — se envía al pedir la cuenta. No requiere estar en el local (ya se
// comprobó al pedir la cuenta) ni identificarse: es una opinión, no un aviso.
export async function POST(req: NextRequest) {
  const { tableNumber, rating, comment } = await req.json().catch(() => ({}));
  const n = Number(tableNumber);
  const r = Number(rating);
  if (!Number.isInteger(n) || n <= 0) {
    return NextResponse.json({ error: "Número de mesa inválido" }, { status: 400 });
  }
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return NextResponse.json({ error: "Valoración inválida" }, { status: 400 });
  }
  const trimmed = typeof comment === "string" ? comment.trim().slice(0, MAX_COMMENT_LEN) : null;

  const entry = await createFeedback(n, r, trimmed || null);
  publish("feedback_created", entry);
  return NextResponse.json(entry, { status: 201 });
}

// Admin/empleado — para ver las opiniones en el panel
export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || (payload.role !== "admin" && payload.role !== "employee")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user = await getUserById(payload.userId);
  if (!user || !user.active) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json(await getRecentFeedback());
}
