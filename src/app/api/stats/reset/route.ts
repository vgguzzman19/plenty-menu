import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { publish } from "@/lib/events";

export async function POST() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await pool.query("DELETE FROM product_stats");

  publish("stats_reset", {});

  return NextResponse.json({ ok: true });
}
