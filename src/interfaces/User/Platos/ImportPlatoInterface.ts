import { NormalizedPlato } from "@/interfaces/AI/ImportPlatoAiInterface";

export interface RestaurantImportContext {
  restaurantId: number;
  planLimit: number;
  currentPlatos: number;
}

export interface IImportPlatoRepository {
  createJob(data: {
    restaurantId: number;
    userId: number;
    fileName: string;
    totalRows: number;
    data: unknown;
  }): Promise<any>;

  findJobById(id: string): Promise<any>;

  updateJob(id: string, data: Record<string, unknown>): Promise<any>;

  listJobsByRestaurant(restaurantId: number, limit?: number): Promise<any[]>;

  getRestaurantContext(userId: number): Promise<RestaurantImportContext>;

  listCategories(): Promise<{ id: number; nombre: string }[]>;

  resolveCategoryId(nombre: string): Promise<number>;

  createPlatos(
    platos: NormalizedPlato[],
    restaurantId: number,
    sucursalId?: number | null
  ): Promise<number>;
}