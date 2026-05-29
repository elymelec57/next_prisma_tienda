import { prisma } from '@/libs/prisma';

export class PlatoRepository {
    async findAllByRestaurantId(restaurantId) {
        return await prisma.plato.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                precio: true,
                disponible: true,
                mainImageId: true,
                categoriaId: true,
                sucursales: true,
            },
            where: {
                restaurantId: restaurantId
            },
        });
    }

    async findById(id) {
        return await prisma.plato.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                contornos: true,
                sucursales: true
            }
        });
    }

    async create(data) {
        return await prisma.plato.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                disponible: true,
                restaurant: {
                    connect: {
                        id: data.restaurantId,
                    },
                },
                categoria: {
                    connect: {
                        id: data.categoriaId,
                    }
                },
                contornos: {
                    connect: data.contornos ? data.contornos.map(id => ({ id: Number(id) })) : []
                },
                sucursales: {
                    connect: data.sucursales ? data.sucursales.map(id => ({ id: Number(id) })) : []
                }
            },
            include: {
                restaurant: true,
                categoria: true,
            },
        });
    }

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
                    set: data.sucursales ? data.sucursales.map(id => ({ id: Number(id) })) : []
                }
            }
        });
    }

    async delete(id) {
        return await prisma.plato.delete({
            where: {
                id: Number(id)
            },
        });
    }

    async findImagesByIds(imageIds) {
        return await prisma.image.findMany({
            where: {
                id: {
                    in: imageIds,
                },
                modelType: 'plato',
            },
            select: {
                id: true,
                url: true,
            },
        });
    }

    async findImageById(id) {
        return await prisma.image.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                url: true
            }
        });
    }

    async deleteImage(id) {
        return await prisma.image.delete({
            where: {
                id: id
            }
        });
    }

    async findCategoriesByRestaurantId(restaurantId) {
        return await prisma.categoria.findMany({
            where: {
                platos: {
                    some: {
                        restaurantId: restaurantId
                    }
                }
            }
        });
    }
}
