import {
  AiImportContext,
  IAiProvider,
  NormalizedPlato,
} from "@/interfaces/AI/ImportPlatoAiInterface";
import { buildImportPrompt, parseJsonResult } from "./prompt";

// Proveedor para Anthropic Claude (API Messages)
export class AnthropicProvider implements IAiProvider {
  readonly name = "anthropic";
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";
    this.model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
  }

  async generatePlatos(
    rows: Record<string, unknown>[],
    context: AiImportContext
  ): Promise<NormalizedPlato[]> {
    const { system, user } = buildImportPrompt(rows, context);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        temperature: 0.1,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic error (${res.status}): ${err.slice(0, 500)}`);
    }

    const json = await res.json();
    const content: string = json?.content?.[0]?.text;
    if (!content) {
      throw new Error("El modelo no devolvio contenido");
    }

    return parseJsonResult<NormalizedPlato[]>(content);
  }
}