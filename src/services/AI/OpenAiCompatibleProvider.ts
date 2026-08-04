import {
  AiImportContext,
  IAiProvider,
  NormalizedPlato,
} from "@/interfaces/AI/ImportPlatoAiInterface";
import { buildImportPrompt, parseJsonResult } from "./prompt";

interface OpenAiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Compatible con cualquier endpoint OpenAI (/chat/completions):
// OpenAI, OpenRouter, DeepSeek, Groq, Ollama, LM Studio, vLLM, etc.
export class OpenAiCompatibleProvider implements IAiProvider {
  readonly name = "openai";
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    this.apiKey = process.env.AI_API_KEY || "";
    this.model = process.env.AI_MODEL || "gpt-4o-mini";
  }

  async generatePlatos(
    rows: Record<string, unknown>[],
    context: AiImportContext
  ): Promise<NormalizedPlato[]> {
    const { system, user } = buildImportPrompt(rows, context);

    const messages: OpenAiMessage[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.1,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI-compatible error (${res.status}): ${err.slice(0, 500)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("El modelo no devolvio contenido");
    }

    return parseJsonResult<NormalizedPlato[]>(content);
  }
}