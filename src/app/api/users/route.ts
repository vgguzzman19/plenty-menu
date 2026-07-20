import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUsers, createUser } from "@/lib/storage";
import { verifyToken, hashPassword } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

// Solo el admin gestiona usuarios. Nunca se expone el hash de la contraseña.
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const users = await getUsers();
  return NextResponse.json(users.map(({ id, username, role, active }) => ({ id, username, role, active })));
}

// Crea cuentas de empleado — la cuenta admin solo se crea una vez, desde /setup
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { username, password } = await req.json();
  if (!username || !password || password.length < 6) {
    return NextResponse.json({ error: "Usuario y contraseña (mín. 6 caracteres) son obligatorios" }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await createUser({ username, passwordHash, role: "employee" });
    return NextResponse.json({ id: user.id, username: user.username, role: user.role }, { status: 201 });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "23505") {
      return NextResponse.json({ error: "Ese nombre de usuario ya existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}
