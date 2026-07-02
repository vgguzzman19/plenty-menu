import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/lib/auth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await supabase.from("product_stats").delete().gte("product_id", 0);

  // Notifica a todas las cartas abiertas para que limpien su caché de vistas
  fetch(`${process.env.SUPABASE_URL}/realtime/v1/api/broadcast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
    body: JSON.stringify({
      messages: [{
        topic: "realtime:menu-realtime",
        event: "broadcast",
        payload: { type: "broadcast", event: "stats_reset", payload: {} },
      }],
    }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
