import { NextRequest, NextResponse } from "next/server";
import { checkTestPassword, clientIp } from "@/lib/testAccess";

// Comprueba la contraseña del modo prueba para que el móvil sepa si puede
// saltarse la comprobación de ubicación. El aviso en sí la vuelve a comprobar.
export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}));
  const result = checkTestPassword(clientIp(req.headers), password);
  if (result === "ok") return NextResponse.json({ ok: true });
  if (result === "locked") {
    return NextResponse.json({ error: "Demasiados intentos. Espera unos minutos.", code: "locked" }, { status: 429 });
  }
  if (result === "disabled") {
    return NextResponse.json({ error: "Modo prueba no configurado en el servidor.", code: "disabled" }, { status: 503 });
  }
  return NextResponse.json({ error: "Contraseña incorrecta", code: "bad" }, { status: 401 });
}
