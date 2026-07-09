import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateProduct, deleteProduct } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";

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
  if (data.price !== undefined) data.price = Number(data.price);
  if (data.categoryId !== undefined) data.categoryId = Number(data.categoryId);
  const updated = await updateProduct(id, data);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  publish("product_update", updated);
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const id = parseInt(params.id);
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  publish("product_delete", { id });
  return NextResponse.json({ ok: true });
}
