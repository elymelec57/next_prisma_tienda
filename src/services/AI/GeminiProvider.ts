import {
  AiImportContext,
  IAiProvider,
  NormalizedPlato,
} from "@/interfaces/AI/ImportPlatoAiInterface";
import { buildImportPrompt, parseJsonResult } from "./prompt";

// Proveedor para Google Gemini (API generateContent)
export class GeminiProvider implements IAiProvider {
  readonly name = "gemini";
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
    this.model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  }

  async generatePlatos(
    rows: Record<string, unknown>[],
    context: AiImportContext
  ): Promise<NormalizedPlato[]> {
    const { system, user } = buildImportPrompt(rows, context);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: system }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: user }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini error (${res.status}): ${err.slice(0, 500)}`);
    }

    const json = await res.json();
    const content: string = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error("El modelo no devolvio contenido");
    }

    return parseJsonResult<NormalizedPlato[]>(content);
  }
}