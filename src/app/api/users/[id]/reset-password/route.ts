import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserById, setUserPassword } from "@/lib/storage";
import { verifyToken, hashPassword, generatePassword } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

// Genera una contraseña nueva para una cuenta de empleado y la devuelve en
// texto plano una única vez. Las contraseñas se guardan hasheadas — no hay
// forma de "consultar" la anterior, solo de sustituirla por una nueva.
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const id = parseInt(params.id);

  const target = await getUserById(id);
  if (!target) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (target.role !== "employee") {
    return NextResponse.json({ error: "No se puede modificar esta cuenta" }, { status: 403 });
  }

  const password = generatePassword();
  const passwordHash = await hashPassword(password);
  const updated = await setUserPassword(id, passwordHash);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json({ id: updated.id, username: updated.username, password });
}
