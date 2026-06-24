import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateCategory, deleteCategory } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const id = parseInt(params.id);
  const data = await req.json();
  const updated = await updateCategory(id, data);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const id = parseInt(params.id);
  const ok = await deleteCategory(id);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
