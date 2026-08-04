import * as XLSX from 'xlsx';
import {
  AiImportContext,
  IAiProvider,
  NormalizedPlato,
} from "@/interfaces/AI/ImportPlatoAiInterface";
import { IImportPlatoRepository } from "@/interfaces/User/Platos/ImportPlatoInterface";

interface StartImportOptions {
  userId: number;
  fileName: string;
  fileBuffer: Buffer;
  sucursalId?: number | null;
}

export class ImportPlatoService {
  constructor(
    private repository: IImportPlatoRepository,
    private aiProvider: IAiProvider | null
  ) { }

  // Interpreta las filas del Excel como objetos [{ columna: valor }]
  private parseRows(fileBuffer: Buffer, fileName: string): Record<string, unknown>[] {
    const wb = XLSX.read(fileBuffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    if (!ws) {
      throw new Error('El archivo no contiene hojas');
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: null,
      raw: true,
    });

    // El parque decimal puede venir como string ("1.500,00") o con separadores.
    const normalized = rows.map((row) => {
      const cleaned: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        cleaned[key] = typeof value === 'string' ? value.trim() : value;
      }
      return cleaned;
    });

    return normalized;
  }

  private toNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  // Mapeo directo (fallback cuando no hay IA o esta falla): detecta columnas comunes
  private mapRowsDirectly(rows: Record<string, unknown>[]): NormalizedPlato[] {
    const result: NormalizedPlato[] = [];

    for (const row of rows) {
      const keys = Object.keys(row);
      const lower = (k: string) => k.toLowerCase();

      const nameKey = keys.find((k) => ['nombre', 'name', 'plato', 'producto', 'item'].includes(lower(k)));
      const priceKey = keys.find((k) => ['precio', 'price', 'costo', 'cost', 'valor'].includes(lower(k)));
      const descKey = keys.find((k) => ['descripcion', 'descripcion', 'description', 'desc'].includes(lower(k)));
      const catKey = keys.find((k) => ['categoria', 'category', 'tipo'].includes(lower(k)));

      const nombre = row[nameKey] ? String(row[nameKey]).trim() : '';

      if (!nombre) continue;

      result.push({
        nombre,
        precio: this.toNumber(row[priceKey]),
        descripcion: row[descKey] ? String(row[descKey]) : undefined,
        categoria: row[catKey] ? String(row[catKey]) : undefined,
      });
    }

    return result;
  }

  private async normalizePlatos(
    rows: Record<string, unknown>[]
  ): Promise<NormalizedPlato[]> {
    const categories = await this.repository.listCategories();
    const context: AiImportContext = { categories };

    if (this.aiProvider) {
      try {
        const normalized = await this.aiProvider.generatePlatos(rows, context);
        if (Array.isArray(normalized) && normalized.length > 0) {
          return this.sanitize(normalized);
        }
      } catch (error) {
        // Si la IA falla, caemos al mapeo directo
        console.error('[ImportPlatoService] IA fallo, usando mapeo directo:', error);
      }
    }

    return this.sanitize(this.mapRowsDirectly(rows));
  }

  private sanitize(platos: NormalizedPlato[]): NormalizedPlato[] {
    return platos.filter((p) => p && p.nombre && String(p.nombre).trim().length > 0);
  }

  async startImport({ userId, fileName, fileBuffer, sucursalId }: StartImportOptions) {
    const context = await this.repository.getRestaurantContext(userId);
    const rows = this.parseRows(fileBuffer, fileName);

    if (rows.length === 0) {
      throw new Error('El archivo no contiene filas validas');
    }

    const job = await this.repository.createJob({
      restaurantId: context.restaurantId,
      userId,
      fileName,
      totalRows: rows.length,
      data: rows,
    });

    // Procesamiento en segundo plano (fire-and-forget). El endpoint responde
    // de inmediato con el jobId y el cliente hace polling del estado.
    this.processJob(job.id, sucursalId).catch((error) => {
      console.error('[ImportPlatoService] Fallo al procesar job', job.id, error);
      this.repository.updateJob(job.id, {
        status: 'FAILED',
        errors: [{ message: error.message }],
        finishedAt: new Date().toISOString(),
      }).catch(() => { });
    });

    return job;
  }

  private async processJob(jobId: string, sucursalId?: number | null) {
    const job = await this.repository.findJobById(jobId);
    if (!job) return;

    await this.repository.updateJob(jobId, {
      status: 'PROCESSING',
      successCount: 0,
      errorCount: 0,
    });

    const rows = (job.data as Record<string, unknown>[]) || [];
    const context = await this.repository.getRestaurantContext(job.userId);

    try {
      const platos = await this.normalizePlatos(rows);

      // Respetar el límite del plan
      const remaining = Math.max(0, context.planLimit - context.currentPlatos);
      const toCreate = platos.slice(0, remaining);
      const skipped = platos.length - toCreate.length;

      const created = await this.repository.createPlatos(toCreate, context.restaurantId, sucursalId);

      await this.repository.updateJob(jobId, {
        status: 'COMPLETED',
        successCount: created,
        errorCount: skipped,
        errors: skipped > 0
          ? [{ message: `${skipped} platos omitidos por limite del plan (${context.planLimit})` }]
          : [],
        finishedAt: new Date().toISOString(),
      });
    } catch (error) {
      await this.repository.updateJob(jobId, {
        status: 'FAILED',
        errors: [{ message: error.message }],
        finishedAt: new Date().toISOString(),
      });
    }
  }

  async getJob(jobId: string) {
    const job = await this.repository.findJobById(jobId);
    if (!job) {
      throw new Error('Job no encontrado');
    }
    return job;
  }

  async listJobs(restaurantId: number, limit?: number) {
    return await this.repository.listJobsByRestaurant(restaurantId, limit);
  }
}