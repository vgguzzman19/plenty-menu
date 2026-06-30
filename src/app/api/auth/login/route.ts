import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/storage";
import { verifyPassword, signToken } from "@/lib/auth";

// Dummy hash so bcrypt always runs, even for unknown users (prevents timing enumeration)
const DUMMY_HASH = "$2b$10$dummyhashfornonexistentuserthatwillneverevermatches123";

// In-memory rate limiter — sufficient for a single-admin restaurant app
const attempts = new Map<string, { count: number; resetAt: number; lockedUntil?: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS  = 15 * 60 * 1000;  // 15 min window
const LOCKOUT_MS = 30 * 60 * 1000;  // 30 min lockout after MAX_ATTEMPTS
const MIN_RESPONSE_MS = 800;         // minimum response time, slows down automated tools

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();

  // Check lockout / rate limit
  const record = attempts.get(ip);
  if (record) {
    if (record.lockedUntil && now < record.lockedUntil) {
      const waitMin = Math.ceil((record.lockedUntil - now) / 60_000);
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Espera ${waitMin} minutos.` },
        { status: 429 }
      );
    }
    if (now > record.resetAt) {
      attempts.delete(ip);
    }
  }

  const body = await req.json();
  const { username, password } = body ?? {};

  if (!username || !password) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const start = Date.now();

  const user = await getUserByUsername(username);
  // Always run bcrypt — even for unknown users — to prevent timing-based enumeration
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  // Enforce minimum response time regardless of outcome
  const elapsed = Date.now() - start;
  if (elapsed < MIN_RESPONSE_MS) {
    await new Promise((r) => setTimeout(r, MIN_RESPONSE_MS - elapsed));
  }

  if (!user || !valid) {
    // Register failed attempt
    const rec = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
    rec.count += 1;
    if (rec.count >= MAX_ATTEMPTS) {
      rec.lockedUntil = now + LOCKOUT_MS;
    }
    attempts.set(ip, rec);

    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  // Success: clear failed attempts for this IP
  attempts.delete(ip);

  const token = await signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
