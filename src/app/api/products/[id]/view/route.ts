import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ ok: false }, { status: 400 });

  await supabase.rpc("increment_product_view", { pid: id });

  // Obtener el nuevo contador
  const { data } = await supabase
    .from("product_stats")
    .select("views")
    .eq("product_id", id)
    .single();

  const views = data?.views ?? 0;

  // Broadcast instantáneo al admin via Supabase Realtime REST API
  fetch(`${process.env.SUPABASE_URL}/realtime/v1/api/broadcast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
    body: JSON.stringify({
      messages: [{
        topic: "realtime:admin-stats",
        event: "broadcast",
        payload: { type: "broadcast", event: "view", payload: { productId: id, views } },
      }],
    }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
