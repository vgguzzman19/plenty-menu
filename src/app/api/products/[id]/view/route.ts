import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { publish } from "@/lib/events";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ ok: false }, { status: 400 });

  await pool.query("SELECT increment_product_view($1)", [id]);

  const { rows } = await pool.query(
    "SELECT views FROM product_stats WHERE product_id = $1",
    [id]
  );
  const views = rows[0]?.views ?? 0;

  publish("view", { productId: id, views });

  return NextResponse.json({ ok: true });
}
