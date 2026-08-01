import { prisma } from '@/libs/prisma';

export class UpdatePlatoRepository {
    async update(id, data) {
        return await prisma.plato.update({
            where: {
                id: Number(id)
            },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                categoriaId: data.categoriaId,
                contornos: {
                    set: data.contornos ? data.contornos.map(id => ({ id: Number(id) })) : []
                },
                sucursales: {
                    set: data.sucursales && data.sucursales !== 'main' ? [{ id: Number(data.sucursales) }] : []
                }
            }
        });
    }

    async updateWithImage(id: number, data: any) {
        return await prisma.plato.update({
            where: {
                id: Number(id)
            },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                categoriaId: data.categoriaId,
                contornos: {
                    set: data.contornos ? data.contornos.map(id => ({ id: Number(id) })) : []
                },
                sucursales: {
                    set: data.sucursales && data.sucursales !== 'main' ? [{ id: Number(data.sucursales) }] : []
                },
                mainImageId: data.mainImageId
            }
        });
    }

    async createImage(data) {
        return await prisma.image.create({
            data: {
                url: data.blob.pathname,
                modelId: String(data.id),
                modelType: data.model,
                altText: 'Imagen que pertenece al ' + data.model,
            },
        });
    }

    async updateImage(id: string, modelId: string) {
        return await prisma.image.update({
            where: { id },
            data: { modelId }
        });
    }

    async deleteImage(id: string) {
        return await prisma.image.delete({
            where: { id }
        });
    }
}