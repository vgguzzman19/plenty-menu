import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { getUsers, createUser } from "@/lib/storage";
import { verifyToken, hashPassword } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

// Sin 0/O/1/l/I para que no se confundan al copiarla a mano
const PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generatePassword(length = 10): string {
  const bytes = randomBytes(length);
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += PASSWORD_CHARS[bytes[i] % PASSWORD_CHARS.length];
  }
  return pass;
}

// Solo el admin gestiona usuarios. Nunca se expone el hash de la contraseña.
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const users = await getUsers();
  return NextResponse.json(users.map(({ id, username, role, active }) => ({ id, username, role, active })));
}

// Crea cuentas de empleado — la cuenta admin solo se crea una vez, desde /setup.
// La contraseña se genera sola (nadie tiene que inventarse una) y se devuelve
// en texto plano solo esta vez, para que el admin la copie y se la pase al empleado.
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { username } = await req.json();
  if (!username) {
    return NextResponse.json({ error: "El usuario es obligatorio" }, { status: 400 });
  }

  try {
    const password = generatePassword();
    const passwordHash = await hashPassword(password);
    const user = await createUser({ username, passwordHash, role: "employee" });
    return NextResponse.json({ id: user.id, username: user.username, role: user.role, password }, { status: 201 });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "23505") {
      return NextResponse.json({ error: "Ese nombre de usuario ya existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}
