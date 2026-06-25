import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { name, description } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }

  const input = description
    ? `Name: "${name}"\nDescription: "${description}"`
    : `Name: "${name}"`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are a translator for a brunch restaurant menu. Translate the following Spanish product info into English and French. Return ONLY a valid JSON object with exactly these keys: name_en, description_en, name_fr, description_fr. If there is no description, use an empty string for description fields. Keep translations natural and appetizing for a restaurant menu.\n\n${input}`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "No se pudo parsear la traducción" }, { status: 500 });
  }

  try {
    const translations = JSON.parse(jsonMatch[0]);
    return NextResponse.json(translations);
  } catch {
    return NextResponse.json({ error: "Error al procesar la traducción" }, { status: 500 });
  }
}
