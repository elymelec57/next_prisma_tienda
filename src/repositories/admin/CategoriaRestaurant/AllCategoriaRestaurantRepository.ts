import { prisma } from "@/libs/prisma";
import { IAllCategoriaRestaurant } from "@/interfaces/admin/CategoriaRestaurant/CategoriaRestaurantInterface";

export class AllCategoriaRestaurantRepository implements IAllCategoriaRestaurant {
    async all(): Promise<any[]> {
        return await prisma.categoriaRestaurant.findMany();
    }
}
