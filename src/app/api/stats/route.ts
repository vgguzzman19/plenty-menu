import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/lib/auth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }) } }
);

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data } = await supabase
    .from("product_stats")
    .select("product_id, views, last_viewed_at")
    .order("views", { ascending: false });

  return NextResponse.json(data ?? []);
}
