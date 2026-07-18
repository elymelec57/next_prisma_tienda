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
                    set: data.sucursales ? [{ id: Number(data.sucursales) }] : []
                }
            }
        });
    }
}