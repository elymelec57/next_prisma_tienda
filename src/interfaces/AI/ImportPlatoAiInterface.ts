export interface NormalizedPlato {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
}

export interface AiImportContext {
  categories: { id: number; nombre: string }[];
}

export interface IAiProvider {
  readonly name: string;
  generatePlatos(
    rows: Record<string, unknown>[],
    context: AiImportContext
  ): Promise<NormalizedPlato[]>;
}