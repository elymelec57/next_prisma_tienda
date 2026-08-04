import { AiImportContext, NormalizedPlato } from "@/interfaces/AI/ImportPlatoAiInterface";

export function buildImportPrompt(
  rows: Record<string, unknown>[],
  context: AiImportContext
): { system: string; user: string } {
  const system = [
    'Eres un asistente que normaliza datos de un menu de restaurante a partir de un archivo de hojas de calculo.',
    'Debes interpretar las columnas (pueden estar en espanol o ingles) y extraer los platos.',
    'Responde SOLO con un arreglo JSON valido, sin texto adicional ni bloques de codigo.',
    'Formato de cada elemento:',
    '{"nombre": string, "descripcion": string, "precio": number, "categoria": string}',
    'Reglas:',
    '- "nombre" es obligatorio; si falta, descarta la fila.',
    '- "precio" es un numero; si la fila no tiene precio usalo en 0.',
    '- "categoria" solo puede ser el nombre exacto de una de las categorias existentes o "" si no hay coincidencia.',
    `- Categorias existentes: ${context.categories.map((c) => c.nombre).join(', ') || '(ninguna)'}.`,
    '- Descarta filas que sean encabezados o filas vacias.',
  ].join('\n');

  const user = `Datos de las filas en JSON:\n${JSON.stringify(rows)}\n\nDevuelve el arreglo JSON de platos normalizados.`;

  return { system, user };
}

export function parseJsonResult<T>(text: string): T {
  let cleaned = text.trim();

  // Quitar bloques de codigo markdown
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/i;
  const fenceMatch = cleaned.match(fenceRegex);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Recortar a partir del primer '[' o '{'
  const arrayStart = cleaned.indexOf('[');
  if (arrayStart === -1) {
    throw new Error('La respuesta del modelo no contiene un arreglo JSON');
  }

  const sliced = cleaned.slice(arrayStart);
  return JSON.parse(sliced) as T;
}