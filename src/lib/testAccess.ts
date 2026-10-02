import { timingSafeEqual } from "crypto";

// Modo prueba del aviso al camarero: con una contraseña se puede avisar sin
// estar en el local (para probar el sistema desde fuera). La contraseña vive
// SOLO en la variable de entorno TEST_CALL_PASSWORD del servidor — el repo es
// público, así que nunca debe escribirse en el código. Sin la variable, el
// modo prueba queda desactivado.

const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const fails = new Map<string, { count: number; resetAt: number }>();

export type TestPasswordResult = "ok" | "bad" | "locked" | "disabled";

export function checkTestPassword(ip: string, password: unknown): TestPasswordResult {
  const expected = process.env.TEST_CALL_PASSWORD;
  if (!expected) return "disabled";

  const now = Date.now();
  const rec = fails.get(ip);
  if (rec && now > rec.resetAt) fails.delete(ip);
  if (rec && now <= rec.resetAt && rec.count >= MAX_FAILS) return "locked";

  const a = Buffer.from(typeof password === "string" ? password : "");
  const b = Buffer.from(expected);
  if (a.length === b.length && timingSafeEqual(a, b)) {
    fails.delete(ip);
    return "ok";
  }

  const r = fails.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
  r.count += 1;
  fails.set(ip, r);
  return "bad";
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() ?? headers.get("x-real-ip") ?? "unknown";
}
