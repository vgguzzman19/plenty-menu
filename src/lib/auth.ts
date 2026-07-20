import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || "plenty-fallback-secret-dev"
  );

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Sin 0/O/1/l/I para que no se confundan al copiarla a mano
const PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generatePassword(length = 10): string {
  const bytes = randomBytes(length);
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += PASSWORD_CHARS[bytes[i] % PASSWORD_CHARS.length];
  }
  return pass;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: {
  userId: number;
  role: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(
  token: string
): Promise<{ userId: number; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { userId: number; role: string };
  } catch {
    return null;
  }
}
