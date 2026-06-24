import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCategories, createCategory } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET() {
  return NextResponse.json(await getCategories());
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { name, emoji, order } = await req.json();
  if (!name) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  const cat = await createCategory({ name, emoji: emoji || "🍽️", order: order ?? 0 });
  return NextResponse.json(cat, { status: 201 });
}
