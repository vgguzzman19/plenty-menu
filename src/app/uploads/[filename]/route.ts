import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

// Sirve public/uploads leyendo el disco en cada request. Next.js (`next start`)
// cachea el listado de public/ al arrancar, así que los archivos subidos
// después del boot nunca se resuelven vía el static file server — esta ruta
// cubre ese hueco.
export async function GET(_req: NextRequest, { params }: { params: { filename: string } }) {
  const { filename } = params;
  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", filename);
  try {
    const buffer = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
}
