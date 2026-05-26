import { prisma } from "@/libs/prisma";
import { ICategoriaRestaurant, CategoriaRestaurant } from "@/interfaces/admin/CategoriaRestaurant/CategoriaRestaurantInterface";

export class CategoriaRestaurantRepository implements ICategoriaRestaurant {
    async create(data: CategoriaRestaurant) {
        return await prisma.categoriaRestaurant.create({
            data: {
                nombre: data.nombre
            }
        });
    }

    async update(id: number, data: CategoriaRestaurant) {
        return await prisma.categoriaRestaurant.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre
            }
        });
    }

    async delete(id: number) {
        return await prisma.categoriaRestaurant.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.categoriaRestaurant.findUnique({
            where: { id: Number(id) }
        });
    }
}
