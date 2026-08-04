import { IAiProvider } from "@/interfaces/AI/ImportPlatoAiInterface";
import { OpenAiCompatibleProvider } from "./OpenAiCompatibleProvider";
import { AnthropicProvider } from "./AnthropicProvider";
import { GeminiProvider } from "./GeminiProvider";

// Fábrica que selecciona el proveedor de IA según la variable AI_PROVIDER.
// Valores: "openai" (por defecto, compatible con cualquier modelo OpenAI-like),
// "anthropic", "gemini". Si no hay credenciales configure, devuelve null
// para que el proceso importador recurra a una importación directa sin IA.
export function createAiProvider(): IAiProvider | null {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "anthropic") {
    return process.env.ANTHROPIC_API_KEY ? new AnthropicProvider() : null;
  }

  if (provider === "gemini") {
    return process.env.GEMINI_API_KEY ? new GeminiProvider() : null;
  }

  // openai / openai-compatible
  return process.env.AI_API_KEY ? new OpenAiCompatibleProvider() : null;
}