import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createTableCall, getPendingTableCalls, getPendingCallForTable, getUserById } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";
import { isNearVenue } from "@/lib/venue";
import { checkTestPassword, clientIp } from "@/lib/testAccess";

// Público — cualquier cliente de la carta puede avisar que está listo para pedir,
// pero solo desde el local: el móvil manda su ubicación y aquí se vuelve a
// comprobar (no basta con la comprobación de la web, que se puede saltar).
// Si varias personas de la misma mesa avisan por separado, solo se crea un
// aviso: el resto recibe el mismo que ya está pendiente, sin duplicar en el
// panel del personal.
export async function POST(req: NextRequest) {
  const { tableNumber, lat, lng, accuracy, testPassword } = await req.json();
  const n = Number(tableNumber);
  if (!Number.isInteger(n) || n <= 0) {
    return NextResponse.json({ error: "Número de mesa inválido" }, { status: 400 });
  }

  // Modo prueba (contraseña de TEST_CALL_PASSWORD): se salta la ubicación
  const isTest = testPassword !== undefined && checkTestPassword(clientIp(req.headers), testPassword) === "ok";
  if (!isTest) {
    const reading = { lat: Number(lat), lng: Number(lng), accuracy: Number(accuracy) };
    if (!Number.isFinite(reading.lat) || !Number.isFinite(reading.lng)) {
      return NextResponse.json({ error: "Ubicación requerida", code: "location_required" }, { status: 400 });
    }
    if (!isNearVenue(reading)) {
      return NextResponse.json({ error: "Fuera del local", code: "too_far" }, { status: 403 });
    }
  }

  const existing = await getPendingCallForTable(n);
  if (existing) {
    return NextResponse.json(existing, { status: 200 });
  }

  try {
    const call = await createTableCall(n);
    publish("table_call", call);
    return NextResponse.json(call, { status: 201 });
  } catch (err) {
    // Condición de carrera: dos móviles de la misma mesa avisaron casi a la
    // vez y ambos pasaron la comprobación de arriba. El índice único de la
    // base de datos rechaza el segundo INSERT — lo tratamos igual que si lo
    // hubiéramos detectado antes.
    const code = (err as { code?: string })?.code;
    if (code === "23505") {
      const current = await getPendingCallForTable(n);
      if (current) return NextResponse.json(current, { status: 200 });
    }
    throw err;
  }
}

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || (payload.role !== "admin" && payload.role !== "employee")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  // Comprueba el estado actual en BD (no solo el JWT) para que deshabilitar
  // una cuenta de empleado tenga efecto inmediato, no solo en el próximo login
  const user = await getUserById(payload.userId);
  if (!user || !user.active) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json(await getPendingTableCalls());
}
