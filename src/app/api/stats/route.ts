import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { rows } = await pool.query(
    "SELECT product_id, views, last_viewed_at FROM product_stats ORDER BY views DESC"
  );

  return NextResponse.json(rows);
}
