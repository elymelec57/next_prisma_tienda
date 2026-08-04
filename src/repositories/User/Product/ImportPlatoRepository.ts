import { prisma } from "@/libs/prisma";
import { IImportPlatoRepository, RestaurantImportContext } from "@/interfaces/User/Platos/ImportPlatoInterface";
import { NormalizedPlato } from "@/interfaces/AI/ImportPlatoAiInterface";

export class ImportPlatoRepository implements IImportPlatoRepository {
  async createJob(data: {
    restaurantId: number;
    userId: number;
    fileName: string;
    totalRows: number;
    data: unknown;
  }) {
    return await prisma.importJob.create({
      data: {
        restaurantId: data.restaurantId,
        userId: data.userId,
        fileName: data.fileName,
        totalRows: data.totalRows,
        data: data.data as object,
      },
    });
  }

  async findJobById(id: string) {
    return await prisma.importJob.findUnique({
      where: { id },
    });
  }

  async updateJob(id: string, data: Record<string, unknown>) {
    return await prisma.importJob.update({
      where: { id },
      data,
    });
  }

  async listJobsByRestaurant(restaurantId: number, limit = 10) {
    return await prisma.importJob.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        fileName: true,
        totalRows: true,
        successCount: true,
        errorCount: true,
        status: true,
        createdAt: true,
        finishedAt: true,
      },
    });
  }

  async getRestaurantContext(userId: number): Promise<RestaurantImportContext> {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: Number(userId) },
      select: {
        id: true,
        subscription: { include: { plan: true } },
        _count: { select: { platos: true } },
      },
    });

    if (!restaurant) {
      throw new Error('Restaurante no encontrado');
    }

    return {
      restaurantId: restaurant.id,
      planLimit: restaurant.subscription?.plan?.productLimit || 10,
      currentPlatos: restaurant._count.platos,
    };
  }

  async listCategories() {
    return await prisma.categoria.findMany({
      select: { id: true, nombre: true },
    });
  }

  async resolveCategoryId(nombre: string): Promise<number> {
    const clean = (nombre || '').trim();
    if (!clean) {
      throw new Error('Categoria vacia');
    }

    const existing = await prisma.categoria.findUnique({
      where: { nombre: clean },
      select: { id: true },
    });

    if (existing) {
      return existing.id;
    }

    const created = await prisma.categoria.create({
      data: { nombre: clean },
      select: { id: true },
    });

    return created.id;
  }

  async createPlatos(
    platos: NormalizedPlato[],
    restaurantId: number,
    sucursalId?: number | null
  ): Promise<number> {
    let created = 0;

    for (const plato of platos) {
      const categoriaId = await this.resolveCategoryId(plato.categoria || '');

      await prisma.plato.create({
        data: {
          nombre: plato.nombre,
          descripcion: plato.descripcion || '',
          precio: plato.precio,
          disponible: true,
          restaurant: { connect: { id: restaurantId } },
          categoria: { connect: { id: categoriaId } },
          ...(sucursalId
            ? { sucursales: { connect: [{ id: Number(sucursalId) }] } }
            : {}),
        },
      });

      created += 1;
    }

    return created;
  }
}