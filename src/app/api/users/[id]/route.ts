import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserById, deleteUser } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const id = parseInt(params.id);

  // Solo se pueden borrar cuentas de empleado desde aquí, nunca la de admin
  const target = await getUserById(id);
  if (!target) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (target.role !== "employee") {
    return NextResponse.json({ error: "No se puede eliminar esta cuenta" }, { status: 403 });
  }

  const ok = await deleteUser(id);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
