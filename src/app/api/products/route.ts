import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProducts, createProduct } from "@/lib/storage";
import { verifyToken } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { name, description, price, categoryId, imageUrl, available, order, name_en, description_en, name_fr, description_fr } = await req.json();
  if (!name || price === undefined || !categoryId) {
    return NextResponse.json({ error: "Campos requeridos: nombre, precio, categoría" }, { status: 400 });
  }
  const product = await createProduct({
    name,
    description: description ?? "",
    name_en: name_en ?? undefined,
    description_en: description_en ?? undefined,
    name_fr: name_fr ?? undefined,
    description_fr: description_fr ?? undefined,
    price: Number(price),
    categoryId: Number(categoryId),
    imageUrl: imageUrl ?? "",
    available: available !== false,
    order: Number(order) || 0,
  });
  return NextResponse.json(product, { status: 201 });
}
